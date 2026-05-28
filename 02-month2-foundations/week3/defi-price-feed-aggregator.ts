const _priceCallCount: Record<string, number> = {};

function mockFetchPrice(url: string, token: string): Promise<number> {
  const key = `${url}-${token}`;
  _priceCallCount[key] = (_priceCallCount[key] ?? 0) + 1;
  const count = _priceCallCount[key];

  const sources: Record<
    string,
    { basePrice: number; failEvery: number; delay: number }
  > = {
    "https://chainlink.example.com": {
      basePrice: 3187.42,
      failEvery: 99,
      delay: 150,
    },
    "https://band.example.com": { basePrice: 3190.0, failEvery: 2, delay: 200 },
    "https://pyth.example.com": {
      basePrice: 3185.5,
      failEvery: 99,
      delay: 100,
    },
    "https://dead.example.com": { basePrice: 0, failEvery: 1, delay: 50 },
    "https://slow.example.com": {
      basePrice: 3188.0,
      failEvery: 99,
      delay: 2500,
    },
  };
  const cfg = sources[url];
  if (!cfg) return Promise.reject(new Error(`Unknown source: ${url}`));

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (count % cfg.failEvery === 0 || cfg.failEvery === 1) {
        reject(new Error(`Price feed error: ${url} temporarily unavailable`));
      } else {
        resolve(cfg.basePrice + (Math.random() - 0.5) * 2);
      }
    }, cfg.delay);
  });
}

type CircuitState = "closed" | "open" | "half-open";

type PriceFeedConfig = {
  sources: Array<{ name: string; url: string }>;
  timeoutMs: number;
  minSources: number;
};

type SourceReport = {
  name: string;
  price: number | null;
  status: "success" | "timeout" | "error" | "circuit_open";
  latencyMs: number | null;
  attempts: number;
};

type PriceReport = {
  token: string;
  medianPrice: number | null;
  sources: SourceReport[];
  successCount: number;
  skippedCount: number;
  confidence: "high" | "medium" | "low" | "insufficient";
  fetchedAt: number;
};

class PriceFeedAggregator {
  private sources: Array<{ name: string; url: string }>;
  private timeoutMs: number;
  private minSources: number;
  private circuitState: Map<
    string,
    { state: CircuitState; failureCount: number; openedAt: number }
  >;

  constructor(config: PriceFeedConfig) {
    this.sources = config.sources;
    this.timeoutMs = config.timeoutMs;
    this.minSources = config.minSources;
    this.circuitState = new Map();
    for (const src of config.sources) {
      this.circuitState.set(src.name, {
        state: "closed",
        failureCount: 0,
        openedAt: 0,
      });
    }
  }

  async getPrice(token: string): Promise<PriceReport> {
    const reports: SourceReport[] = [];
    let skippedCount = 0;

    const checkSource = async (source: { name: string; url: string }) => {
      const cs = this.circuitState.get(source.name)!;
      if (cs.state === "open") {
        if (Date.now() - cs.openedAt >= 10000) {
          cs.state = "half-open";
        } else {
          skippedCount++;
          reports.push({
            name: source.name,
            price: null,
            status: "circuit_open",
            latencyMs: null,
            attempts: 0,
          });
          return;
        }
      }

      let attempt = 1;
      let success = false;
      let price: number | null = null;
      let status: "success" | "timeout" | "error" = "error";
      let latencyMs: number | null = null;

      const start = Date.now();
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), this.timeoutMs),
        );
        price = await Promise.race([
          mockFetchPrice(source.url, token),
          timeoutPromise,
        ]);
        success = true;
        status = "success";
        latencyMs = Date.now() - start;
      } catch (err: any) {
        latencyMs = Date.now() - start;
        status = err.message === "Timeout" ? "timeout" : "error";
      }

      if (!success) {
        attempt = 2;
        await new Promise((resolve) => setTimeout(resolve, 500));
        const start2 = Date.now();
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), this.timeoutMs),
          );
          price = await Promise.race([
            mockFetchPrice(source.url, token),
            timeoutPromise,
          ]);
          success = true;
          status = "success";
          latencyMs = Date.now() - start2;
        } catch (err: any) {
          latencyMs = Date.now() - start2;
          status = err.message === "Timeout" ? "timeout" : "error";
        }
      }

      if (success) {
        cs.failureCount = 0;
        cs.state = "closed";
      } else {
        cs.failureCount++;
        if (cs.state === "half-open") {
          cs.state = "open";
          cs.openedAt = Date.now();
        } else if (cs.failureCount >= 3) {
          cs.state = "open";
          cs.openedAt = Date.now();
        }
      }

      reports.push({
        name: source.name,
        price,
        status: success ? "success" : status,
        latencyMs,
        attempts: attempt,
      });
    };

    await Promise.all(this.sources.map(checkSource));

    const prices = reports
      .filter((r) => r.price !== null)
      .map((r) => r.price as number);

    let medianPrice: number | null = null;
    if (prices.length > 0) {
      const sorted = prices.slice().sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      medianPrice =
        sorted.length % 2 === 1
          ? sorted[mid]
          : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    const successCount = prices.length;
    const allClosedSucceeded = reports
      .filter((r) => r.status !== "circuit_open")
      .every((r) => r.status === "success");

    let confidence: "high" | "medium" | "low" | "insufficient" = "insufficient";
    if (successCount >= this.minSources) {
      if (
        successCount === reports.length - skippedCount &&
        allClosedSucceeded
      ) {
        confidence = "high";
      } else if (successCount === this.minSources) {
        confidence = "low";
      } else {
        confidence = "medium";
      }
    }

    return {
      token,
      medianPrice,
      sources: reports,
      successCount,
      skippedCount,
      confidence,
      fetchedAt: Date.now(),
    };
  }

  getCircuitStatus(): Record<string, CircuitState> {
    const status: Record<string, CircuitState> = {};
    for (const [name, cs] of this.circuitState) {
      status[name] = cs.state;
    }
    return status;
  }
}

async function testSunday() {
  console.log(
    "\n=== SUNDAY: DeFi Price Feed Aggregator with Circuit Breaker ===",
  );

  const aggregator = new PriceFeedAggregator({
    sources: [
      { name: "chainlink", url: "https://chainlink.example.com" },
      { name: "band", url: "https://band.example.com" },
      { name: "pyth", url: "https://pyth.example.com" },
      { name: "dead", url: "https://dead.example.com" },
      { name: "slow", url: "https://slow.example.com" },
    ],
    timeoutMs: 500,
    minSources: 2,
  });

  console.log("\n--- Call 1 ---");
  const p1 = await aggregator.getPrice("ETH");
  console.log(
    "Price report:",
    JSON.stringify(
      {
        medianPrice: p1.medianPrice,
        successCount: p1.successCount,
        skippedCount: p1.skippedCount,
        confidence: p1.confidence,
        sources: p1.sources.map((s) => ({
          name: s.name,
          status: s.status,
          attempts: s.attempts,
        })),
      },
      null,
      2,
    ),
  );

  console.log("\n--- Call 2 ---");
  const p2 = await aggregator.getPrice("ETH");
  console.log("Circuit status:", aggregator.getCircuitStatus());
  console.log("Skipped (circuit open):", p2.skippedCount);

  for (let i = 0; i < 3; i++) {
    await aggregator.getPrice("ETH");
  }
  console.log("\n--- After 5 calls total ---");
  const circuitStatus = aggregator.getCircuitStatus();
  console.log("Circuit status:", circuitStatus);
  console.log("Expected: 'dead' should be 'open' after 3 consecutive failures");
}

testSunday();
