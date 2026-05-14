interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

function fetchTransaction(hash: string): Promise<Transaction> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (hash === "0xinvalid") {
        reject(new Error("Transaction not found"));
      } else {
        resolve({
          hash,
          from: "0xFrom",
          to: "0xTo",
          amount: 100,
          timestamp: Date.now()
        });
      }
    }, 2000);
  });
}

function fetchLatestBlock(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
    }, 1000);
  });
}

async function main() {
  console.log("Fetching latest block...");
  const blockNumber = await fetchLatestBlock();
  console.log("Latest block number:", blockNumber);

  console.log("\nFetching valid transaction...");
  try {
    const tx = await fetchTransaction("0xabc123");
    console.log("Transaction:", tx);
  } catch (error) {
    console.error("Error fetching transaction:", (error as Error).message);
  }

  console.log("\nFetching invalid transaction...");
  try {
    const tx = await fetchTransaction("0xinvalid");
    console.log("Transaction:", tx);
  } catch (error) {
    console.error("Error fetching transaction:", (error as Error).message);
  }
}

main();