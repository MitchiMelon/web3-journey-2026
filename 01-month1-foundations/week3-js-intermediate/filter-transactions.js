const transactions = [
  { hash: "0xaaa", amount: 500,  token: "USDC", status: "success", timestamp: 1710000001 },
  { hash: "0xbbb", amount: 0,    token: "ETH",  status: "success", timestamp: 1710000002 },
  { hash: "0xccc", amount: 1200, token: "ETH",  status: "failed",  timestamp: 1710000003 },
  { hash: "0xddd", amount: 75,   token: "USDC", status: "success", timestamp: 1710000004 },
  { hash: "0xeee", amount: 990,  token: "DAI",  status: "failed",  timestamp: 1710000005 },
  { hash: "0xfff", amount: 300,  token: "DAI",  status: "success", timestamp: 1710000006 },
]


function cleanTransactions(txList) {
  const validTransactions = txList.filter(tx => tx.status == "success" && tx.amount > 0);
  const cleaned = validTransactions.map(tx => {
    return {hash: tx.hash, amount: tx.amount, token: tx.token}
  })
  return cleaned;
}


console.log(cleanTransactions(transactions));
