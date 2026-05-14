type TransactionObject = {
  hash: string;
  amount: number;
  sender: string;
  token: string;
};

type FailedTransaction = {
  hash: string;
  error: string;
};

type ProcessedTransactionsResult = {
  success: TransactionObject[];
  failed: FailedTransaction[];
};

async function fetchTransaction(
  hash: string
): Promise<TransactionObject> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (hash === "0xaaa" || hash === "0xccc") {
        resolve({
          hash,
          amount: Math.floor(Math.random() * 1000),
          sender: "0xAlice",
          token: "USDC",
        });
      } else {
        reject(new Error("Transaction not found"));
      }
    }, 2000);
  });
}

async function processTransactions(): Promise<ProcessedTransactionsResult> {
  const hashes = ["0xaaa", "0xbbb", "0xccc"];

  // Start all async operations concurrently
  const results = await Promise.allSettled(
    hashes.map(fetchTransaction)
  );

  const success: TransactionObject[] = [];
  const failed: FailedTransaction[] = [];

  results.forEach((result, index) => {
    const currentHash = hashes[index];

    if (result.status === "fulfilled") {
      success.push(result.value);
    } else {
      failed.push({
        hash: currentHash,
        error: result.reason.message,
      });
    }
  });

  return {
    success,
    failed,
  };
}

async function main() {
  try {
    const processedResults = await processTransactions();

    console.log("\n=== SUCCESSFUL TRANSACTIONS ===");
    console.log(processedResults.success);

    console.log("\n=== FAILED TRANSACTIONS ===");
    console.log(processedResults.failed);
  } catch (error) {
    console.error("Unexpected system error:", error);
  }
}

main();