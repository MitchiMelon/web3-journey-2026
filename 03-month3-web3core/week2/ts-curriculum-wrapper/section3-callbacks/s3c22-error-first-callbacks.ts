type EFCallback<T> = (error: Error | null, result: T | null) => void;

// Function 1: fetches a wallet
function fetchWallet(
  address: string,
  callback: EFCallback<{ address: string; balance: number }>,
): void {
  // If address doesn't start with "0x" → callback(new Error("Invalid address"), null)
  // Otherwise → callback(null, { address, balance: 1500 })
  if (!address.startsWith("0x")) {
    callback(new Error("Invalid address"), null);
  } else {
    callback(null, { address, balance: 1500 });
  }
}

// Function 2: validates sufficient balance
function validateBalance(
  wallet: { address: string; balance: number },
  requiredAmount: number,
  callback: EFCallback<{ address: string; balance: number; approved: boolean }>,
): void {
  // If balance < requiredAmount → callback(new Error("Insufficient balance"), null)
  // Otherwise → callback(null, { ...wallet, approved: true })
  if (wallet.balance < requiredAmount) {
    callback(new Error("Insufficient balance"), null);
  } else {
    callback(null, { ...wallet, approved: true });
  }
}

// Function 3: submits the transaction
function submitTransaction(
  approvedWallet: { address: string; balance: number; approved: boolean },
  amount: number,
  callback: EFCallback<{ txHash: string; success: boolean }>,
): void {
  // Always succeeds → callback(null, { txHash: "0x" + Date.now(), success: true })
  callback(null, { txHash: "0x" + Date.now(), success: true });
}

// --- Final callback and chain ---
const finalCallback: EFCallback<{ txHash: string; success: boolean }> = (
  err,
  result,
) => {
  if (err) {
    console.error("Transaction failed:", err.message);
  } else {
    console.log("Transaction succeeded:", result);
  }
};

// Chain: fetch → validate → submit, propagating errors
fetchWallet("0xAlice", (err, wallet) => {
  if (err) return finalCallback(err, null); // propagate error
  validateBalance(wallet!, 1000, (err, validated) => {
    if (err) return finalCallback(err, null); // propagate error
    submitTransaction(validated!, 1000, finalCallback); // final step
  });
});
