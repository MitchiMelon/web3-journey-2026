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

// Using simulateRPCCall, chain these three operations:
// 1. Get current block number → returns 19000000
// 2. Get transaction at that block → returns { hash: "0xabc", amount: 500 }
// 3. Get receipt for that transaction → returns { success: true, gasUsed: 21000 }
// If any fails → log "Operation failed: [error message]" and stop

// Write this as nested callbacks first (callback hell):
simulateRPCCall("getBlockNumber", 19000000, false, (err, blockNumber) => {
  // ... nest the next two calls inside here
  if (err) {
    console.log(`Operation failed: ${err.message}`);
    return;
  }
  console.log("Got block number:", blockNumber);

  simulateRPCCall(
    "getTransaction",
    { hash: "0xabc", amount: 500 },
    false,
    (err, tx) => {
      if (err) {
        console.log(`Operation failed: ${err.message}`);
        return;
      }
      console.log("Got transaction:", tx);

      simulateRPCCall(
        "getReceipt",
        { success: true, gasUsed: 21000 },
        false,
        (err, receipt) => {
          if (err) {
            console.log(`Operation failed: ${err.message}`);
            return;
          }
          console.log("Got receipt:", receipt);
        },
      );
    },
  );
});
