const eventLogs = [
  { sender: "0xAlice", token: "USDC", amount: 500,  hash: "0xa1" },
  { sender: "0xBob",   token: "ETH",  amount: 2,    hash: "0xb1" },
  { sender: "0xAlice", token: "USDC", amount: 1200, hash: "0xa2" },
  { sender: "0xCarol", token: "USDC", amount: 80,   hash: "0xc1" },
  { sender: "0xBob",   token: "USDC", amount: 950,  hash: "0xb2" },
  { sender: "0xAlice", token: "USDC", amount: 300,  hash: "0xa3" },
  { sender: "0xCarol", token: "USDC", amount: 450,  hash: "0xc2" },
  { sender: "0xBob",   token: "USDC", amount: 50,   hash: "0xb3" },
]


function processEventLogs(logs, minAmount, targetToken) {
  const filtered = logs
    .filter(tx => tx.token === targetToken)
    .filter(tx => tx.amount >= minAmount);
  
  const grouped = filtered.reduce((map, log) => {
    if (!map.has(log.sender)) {
      map.set(log.sender, []);
    }
    map.get(log.sender).push(log);
    return map;
  }, new Map());
  
  const summary = Array.from(grouped.entries()).map(([sender, logs]) => {
    const total = logs.reduce((sum, log) => sum + log.amount, 0);
    const count = logs.length;
    return {
      sender: sender,
      totalAmount: total,
      txCount: count
    }
  })


  const sortedSummary = summary.sort((a, b) => b.totalAmount - a.totalAmount);
  return sortedSummary;
}


console.log(processEventLogs(eventLogs, 100, "USDC"))
