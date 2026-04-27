const rawLogs = [
  { hash: "0x111", amount: 500,  token: "USDC" },
  { hash: "0x222", amount: 1000, token: "ETH"  },
  { hash: "0x111", amount: 500,  token: "USDC" }, // duplicate
  { hash: "0x333", amount: 75,   token: "DAI"  },
  { hash: "0x222", amount: 1000, token: "ETH"  }, // duplicate
  { hash: "0x444", amount: 300,  token: "USDC" },
  { hash: "0x333", amount: 75,   token: "DAI"  }, // duplicate
]


function deduplicateLogs(logs) {
  const seen = new Set();

  const cleanLogs = logs.filter(tx => {
    const key = tx.hash + "|" + tx.amount;
    if (!seen.has(key)) {
      seen.add(key);
      return true;
    }
    return false;
  });

  const removed = logs.length - cleanLogs.length;
  console.log(`Removed ${removed} duplicate(s)`);
  return cleanLogs;
}

console.log(deduplicateLogs(rawLogs))
