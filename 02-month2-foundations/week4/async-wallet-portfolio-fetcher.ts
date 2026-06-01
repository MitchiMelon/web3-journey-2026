type TokenQuery = {
  tokenAddress: string;
  tokenSymbol: string;
  decimals: number;
};

type PortfolioConfig = {
  walletAddress: string;
  tokens: TokenQuery[];
  maxConcurrent: number;
  chainId: number;
};

type TokenBalance = {
  tokenAddress: string;
  tokenSymbol: string;
  rawBalance: bigint;
  formattedBalance: string;
  usdValue: number | null;
  fetchStatus: "success" | "error";
  error?: string;
};

type PortfolioResult = {
  walletAddress: string;
  chainId: number;
  tokens: TokenBalance[];
  totalUSDValue: number;
  fetchedAt: number;
  successCount: number;
  errorCount: number;
};

function mockGetBalance(wallet: string, token: string): Promise<bigint> {
  const balances: Record<string, bigint> = {
    "0xUSDC": BigInt("1500000000"),
    "0xETH": BigInt("2500000000000000000"),
    "0xLINK": BigInt("250000000000000000000"),
    "0xDAI": BigInt("800000000000000000000"),
    "0xBAD": BigInt(0),
  };
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (token === "0xBAD") reject(new Error("Token not found"));
        else resolve(balances[token] ?? BigInt(0));
      },
      100 + Math.random() * 200,
    );
  });
}

function mockGetTokenPrice(symbol: string): Promise<number> {
  const prices: Record<string, number> = {
    USDC: 1.0,
    ETH: 3187.42,
    LINK: 18.5,
    DAI: 0.999,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (prices[symbol]) resolve(prices[symbol]);
      else reject(new Error("Price not available"));
    }, 50);
  });
}

async function fetchWalletPortfolio(
  config: PortfolioConfig,
): Promise<PortfolioResult> {
  const { walletAddress, tokens, maxConcurrent, chainId } = config;
  const results: TokenBalance[] = [];

  for (let i = 0; i < tokens.length; i += maxConcurrent) {
    const batch = tokens.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(async (token) => {
      try {
        const [rawBalance, price] = await Promise.all([
          mockGetBalance(walletAddress, token.tokenAddress),
          mockGetTokenPrice(token.tokenSymbol),
        ]);
        const divisor = BigInt(10) ** BigInt(token.decimals);
        const wholePart = rawBalance / divisor;
        const remainder = rawBalance % divisor;
        const remainderStr = remainder
          .toString()
          .padStart(token.decimals, "0")
          .slice(0, 4);
        const formattedBalance = `${wholePart}.${remainderStr}`;
        const usdValue =
          price !== null
            ? Number(wholePart) * price +
              (Number(remainder) / Number(divisor)) * price
            : null;
        return {
          tokenAddress: token.tokenAddress,
          tokenSymbol: token.tokenSymbol,
          rawBalance,
          formattedBalance,
          usdValue,
          fetchStatus: "success" as const,
        };
      } catch (err: any) {
        return {
          tokenAddress: token.tokenAddress,
          tokenSymbol: token.tokenSymbol,
          rawBalance: BigInt(0),
          formattedBalance: "0.0000",
          usdValue: null,
          fetchStatus: "error" as const,
          error: err.message,
        };
      }
    });
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  const totalUSDValue = results
    .filter((r) => r.usdValue !== null)
    .reduce((sum, r) => sum + (r.usdValue as number), 0);

  const successCount = results.filter(
    (r) => r.fetchStatus === "success",
  ).length;
  const errorCount = results.length - successCount;

  return {
    walletAddress,
    chainId,
    tokens: results,
    totalUSDValue,
    fetchedAt: Date.now(),
    successCount,
    errorCount,
  };
}

async function test() {
  console.log("=== Wallet Portfolio Fetcher Test ===\n");

  const config: PortfolioConfig = {
    walletAddress: "0xAlice",
    tokens: [
      { tokenAddress: "0xUSDC", tokenSymbol: "USDC", decimals: 6 },
      { tokenAddress: "0xETH", tokenSymbol: "ETH", decimals: 18 },
      { tokenAddress: "0xLINK", tokenSymbol: "LINK", decimals: 18 },
      { tokenAddress: "0xDAI", tokenSymbol: "DAI", decimals: 18 },
      { tokenAddress: "0xBAD", tokenSymbol: "BAD", decimals: 18 },
    ],
    maxConcurrent: 2,
    chainId: 1,
  };

  const result = await fetchWalletPortfolio(config);

  // Safe logging: convert BigInt fields to strings for display
  console.log({
    ...result,
    tokens: result.tokens.map((t) => ({
      ...t,
      rawBalance: t.rawBalance.toString(),
    })),
  });

  console.log("\n--- Assertions ---");
  console.log(
    "Wallet address:",
    result.walletAddress === "0xAlice" ? "PASS" : "FAIL",
  );
  console.log("5 tokens:", result.tokens.length === 5 ? "PASS" : "FAIL");
  console.log("Success count 4:", result.successCount === 4 ? "PASS" : "FAIL");
  console.log("Error count 1:", result.errorCount === 1 ? "PASS" : "FAIL");
  console.log("Total USD > 0:", result.totalUSDValue > 0 ? "PASS" : "FAIL");
  console.log(
    "BAD token error:",
    result.tokens.find((t) => t.tokenSymbol === "BAD")?.fetchStatus === "error"
      ? "PASS"
      : "FAIL",
  );
}

test();
