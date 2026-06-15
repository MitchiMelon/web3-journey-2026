type RawTx = {
  hash: string;
  amount: number;
  sender: string;
};

type ProcessedTx = {
  hash: string;
  amount: number;
  sender: string;
  processedAt: number;
  isValid: boolean;
};

function processTransaction(
  tx: RawTx,
  callback: (error: Error | null, result: ProcessedTx | null) => void,
): void {
  if (tx.hash.startsWith("0x") && tx.amount > 0 && tx.sender.startsWith("0x")) {
    callback(null, { ...tx, processedAt: Date.now(), isValid: true });
  } else {
    callback(new Error("Invalid transaction"), null);
  }
}

processTransaction(
  { hash: "0xabc", amount: 500, sender: "0xAlice" },
  (error, result) => {
    if (error) {
      console.log("Error:", error.message);
    } else {
      console.log("Processed:", result);
    }
  },
);
