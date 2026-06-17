function simulateRPCCall<T>(
  operation: string,
  result: T,
  shouldFail: boolean,
  callback: (error: Error | null, data: T | null) => void,
): void {
  setTimeout(() => {
    if (shouldFail) {
      callback(new Error(`${operation} failed`), null);
    } else {
      console.log(`${operation} completed`);
      callback(null, result);
    }
  }, 200);
}

// Step 1: Wrap simulateRPCCall in a Promise
function getBlockNumberAsync(): Promise<number> {
  return new Promise((resolve, reject) => {
    simulateRPCCall("getBlockNumber", 19000000, false, (err, data) => {
      if (err) reject(err);
      else resolve(data!);
    });
  });
}

function getTransactionAsync(
  blockNumber: number,
): Promise<{ hash: string; amount: number }> {
  return new Promise((resolve, reject) => {
    simulateRPCCall(
      "getTransaction",
      { hash: "0xabc", amount: 500 },
      false,
      (err, tx) => {
        if (err) reject(err);
        else resolve(tx!);
      },
    );
  });
}

function getReceiptAsync(
  txHash: string,
): Promise<{ success: boolean; gasUsed: number }> {
  return new Promise((resolve, reject) => {
    simulateRPCCall(
      "getReceipt",
      { success: true, gasUsed: 21000 },
      false,
      (err, receipt) => {
        if (err) reject(err);
        else resolve(receipt!);
      },
    );
  });
}

// Step 2: Chain with .then()
getBlockNumberAsync()
  .then((blockNumber) => getTransactionAsync(blockNumber))
  .then((tx) => getReceiptAsync(tx.hash))
  .then((receipt) => console.log("Done:", receipt))
  .catch((err) => console.log("Failed:", err.message));

// Step 3: Rewrite with async/await
async function runChain(): Promise<void> {
  try {
    const blockNumber = await getBlockNumberAsync();
    const tx = await getTransactionAsync(blockNumber);
    const receipt = await getReceiptAsync(tx.hash);
    console.log("Done:", receipt);
  } catch (err: any) {
    console.log("Failed:", err.message);
  }
}
