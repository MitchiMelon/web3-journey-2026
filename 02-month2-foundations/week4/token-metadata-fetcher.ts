function mockGetTokenMetadata(address: string): Promise<{
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}> {
  const tokens: Record<string, any> = {
    "0xUSDC": {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      totalSupply: BigInt("50000000000000000"),
    },
    "0xETH": {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      totalSupply: BigInt("3000000000000000000000000"),
    },
    "0xLINK": {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      totalSupply: BigInt("1000000000000000000000000000"),
    },
    "0xDAI": {
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      totalSupply: BigInt("5000000000000000000000000000"),
    },
    "0xBAD": null,
    "0xSLOW": {
      name: "Slow Token",
      symbol: "SLOW",
      decimals: 18,
      totalSupply: BigInt("100"),
    },
  };
  const data = tokens[address];
  const delay = address === "0xSLOW" ? 3000 : 100;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data) reject(new Error(`Token ${address}: not found`));
      else resolve(data);
    }, delay);
  });
}

type MetadataBatchConfig = {
  tokenAddresses: string[];
  maxConcurrent: number;
  timeoutMs: number;
};

type TokenMetadata = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
};

type MetadataResult = {
  address: string;
  metadata: TokenMetadata | null;
  status: "success" | "error" | "timeout";
  error?: string;
  fetchTimeMs: number;
};

type MetadataBatchResult = {
  total: number;
  successful: number;
  failed: number;
  results: MetadataResult[];
  batchesProcessed: number;
  totalTimeMs: number;
};

async function fetchTokenMetadataBatch(
  config: MetadataBatchConfig,
): Promise<MetadataBatchResult> {
  const { tokenAddresses, maxConcurrent, timeoutMs } = config;
  const results: MetadataResult[] = [];
  const startTime = Date.now();
  let batchesProcessed = 0;

  for (let i = 0; i < tokenAddresses.length; i += maxConcurrent) {
    batchesProcessed++;
    const batch = tokenAddresses.slice(i, i + maxConcurrent);
    const promises = batch.map(async (address) => {
      const fetchStart = Date.now();
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs),
        );
        const metadata = await Promise.race([
          mockGetTokenMetadata(address),
          timeoutPromise,
        ]);
        const fetchTimeMs = Date.now() - fetchStart;
        results.push({
          address,
          metadata,
          status: "success",
          fetchTimeMs,
        });
      } catch (error: any) {
        const fetchTimeMs = Date.now() - fetchStart;
        const isTimeout = error.message === "Timeout";
        results.push({
          address,
          metadata: null,
          status: isTimeout ? "timeout" : "error",
          error: error.message,
          fetchTimeMs,
        });
      }
    });
    await Promise.all(promises);
  }

  const successful = results.filter((r) => r.status === "success").length;
  const failed = results.length - successful;
  const totalTimeMs = Date.now() - startTime;

  return {
    total: tokenAddresses.length,
    successful,
    failed,
    results,
    batchesProcessed,
    totalTimeMs,
  };
}

async function testThursday() {
  console.log("\n=== THURSDAY: Rate-Limited Token Metadata Fetcher ===");
  const result = await fetchTokenMetadataBatch({
    tokenAddresses: ["0xUSDC", "0xETH", "0xLINK", "0xDAI", "0xBAD", "0xSLOW"],
    maxConcurrent: 2,
    timeoutMs: 500,
  });
  console.log(
    "Result:",
    JSON.stringify(
      {
        ...result,
        results: result.results.map((r) => ({
          address: r.address,
          status: r.status,
          symbol: r.metadata?.symbol ?? null,
        })),
      },
      null,
      2,
    ),
  );
  console.log("Expected: 4 successful, 2 failed, 3 batches");
}

testThursday();
