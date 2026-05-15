type SuccessfulTokenBalance = {
  token: string;
  balance: number;
};

type FailedTokenFetch = {
  token: string;
  error: string;
};

type FinalPortfolioResult = {
  successfulBalances: SuccessfulTokenBalance[];
  failedFetches: FailedTokenFetch[];
};

async function fetchTokenBalance(
  token: string,
  balance: number
): Promise<SuccessfulTokenBalance> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (balance >= 0) {
        resolve({ token, balance });
      } else {
        reject(new Error(`Failed to fetch balance for token: ${token}`));
      }
    }, 1000);
  });
}

async function fetchWalletPortfolio(): Promise<FinalPortfolioResult> {
  const successfulBalances: SuccessfulTokenBalance[] = [];
  const failedFetches: FailedTokenFetch[] = [];

  const tokens = [
    { token: "ETH", balance: 1.5 },
    { token: "BTC", balance: 0.5 },
    { token: "XRP", balance: -10 },
  ];

  try {
    const results = await Promise.allSettled(
      tokens.map((tokenData) =>
        fetchTokenBalance(tokenData.token, tokenData.balance)
      )
    );

    results.forEach((result, index) => {
      const currentToken = tokens[index];

      if (result.status === "fulfilled") {
        successfulBalances.push(result.value);
      } else {
        failedFetches.push({
          token: currentToken.token,
          error: result.reason.message,
        });
      }
    });

    return {
      successfulBalances,
      failedFetches,
    };
  } catch (error) {
    throw new Error("Unexpected portfolio processing error");
  }
}

async function main() {
  const portfolio = await fetchWalletPortfolio();

  console.log("\n=== SUCCESSFUL BALANCES ===");
  console.log(portfolio.successfulBalances);

  console.log("\n=== FAILED FETCHES ===");
  console.log(portfolio.failedFetches);
}

main();