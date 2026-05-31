function mockPriceFetch(url: string): Promise<number> {
  const prices: Record<string, { price: number; delay: number }> = {
    "https://coingecko.example.com/eth": { price: 3187.42, delay: 200 },
    "https://binance.example.com/eth": { price: 3190.15, delay: 150 },
    "https://uniswap.example.com/eth": { price: 3185.0, delay: 800 },
    "https://slow.example.com/eth": { price: 3200.0, delay: 3000 },
    "https://dead.example.com/eth": { price: 0, delay: 0 },
  };
  const config = prices[url];
  return new Promise((resolve, reject) => {
    if (!config || config.price === 0) {
      setTimeout(() => reject(new Error("Price feed unavailable")), 50);
      return;
    }
    setTimeout(() => resolve(config.price), config.delay);
  });
}

type PriceSource = {
  name: string;
  url: string;
  weight: number;
};

type AggregatorConfig = {
  token: string;
  sources: PriceSource[];
  timeoutMs: number;
  minSources: number;
};

type SourceResult = {
  name: string;
  price: number | null;
  latencyMs: number | null;
  status: "success" | "timeout" | "error";
  error?: string;
};

type AggregationResult = {
  token: string;
  medianPrice: number | null;
  averagePrice: number | null;
  successfulSources: number;
  failedSources: number;
  sources: SourceResult[];
  confidence: "high" | "medium" | "low" | "insufficient";
  aggregatedAt: number;
};

async function aggregatePrices(
  config: AggregatorConfig,
): Promise<AggregationResult> {
  const { token, sources, timeoutMs, minSources } = config;

  const sourceResults = await Promise.all(
    sources.map(async (source) => {
      const start = Date.now();
      try {
        const price = await Promise.race([
          mockPriceFetch(source.url),
          new Promise<number>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeoutMs),
          ),
        ]);
        return {
          name: source.name,
          price,
          latencyMs: Date.now() - start,
          status: "success" as const,
        };
      } catch (err: any) {
        const isTimeout = err.message === "Timeout";
        return {
          name: source.name,
          price: null,
          latencyMs: Date.now() - start,
          status: (isTimeout ? "timeout" : "error") as "timeout" | "error",
          error: isTimeout ? undefined : err.message,
        };
      }
    }),
  );

  const successful = sourceResults.filter((r) => r.status === "success");
  const successfulPrices = successful.map((r) => r.price as number);
  const failedCount = sourceResults.length - successful.length;

  let medianPrice: number | null = null;
  let averagePrice: number | null = null;

  if (successful.length >= minSources) {
    const sorted = successfulPrices.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianPrice =
      sorted.length % 2 === 1
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    averagePrice =
      successfulPrices.reduce((a, b) => a + b, 0) / successful.length;
  }

  let confidence: AggregationResult["confidence"] = "insufficient";
  if (successful.length >= minSources) {
    if (successful.length === sources.length) {
      confidence = "high";
    } else if (successful.length === minSources) {
      confidence = "low";
    } else {
      confidence = "medium";
    }
  }

  return {
    token,
    medianPrice,
    averagePrice,
    successfulSources: successful.length,
    failedSources: failedCount,
    sources: sourceResults,
    confidence,
    aggregatedAt: Date.now(),
  };
}

async function test() {
  console.log("=== Price Aggregator Test ===\n");

  const config: AggregatorConfig = {
    token: "ETH",
    sources: [
      {
        name: "CoinGecko",
        url: "https://coingecko.example.com/eth",
        weight: 8,
      },
      { name: "Binance", url: "https://binance.example.com/eth", weight: 9 },
      { name: "Uniswap", url: "https://uniswap.example.com/eth", weight: 7 },
      { name: "SlowNode", url: "https://slow.example.com/eth", weight: 5 },
      { name: "DeadNode", url: "https://dead.example.com/eth", weight: 1 },
    ],
    timeoutMs: 1000,
    minSources: 2,
  };

  const result = await aggregatePrices(config);
  console.log(JSON.stringify(result, null, 2));

  console.log("\n--- Assertions ---");
  console.log("Token ETH:", result.token === "ETH" ? "PASS" : "FAIL");
  console.log(
    "Median around 3187:",
    result.medianPrice !== null &&
      result.medianPrice > 3180 &&
      result.medianPrice < 3200
      ? "PASS"
      : "FAIL",
  );
  console.log(
    "Successful >= 3:",
    result.successfulSources >= 3 ? "PASS" : "FAIL",
  );
  console.log(
    "Confidence medium:",
    result.confidence === "medium" ? "PASS" : "FAIL",
  );
  console.log(
    "DeadNode failed:",
    result.sources.find((s) => s.name === "DeadNode")?.status === "error"
      ? "PASS"
      : "FAIL",
  );
  console.log(
    "SlowNode timeout:",
    result.sources.find((s) => s.name === "SlowNode")?.status === "timeout"
      ? "PASS"
      : "FAIL",
  );
}

test();
