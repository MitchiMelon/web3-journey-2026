const rawEvents = [
  {
    hash: "0x1",
    token: "USDC",
    amount: 1500,
    sender: "0xAlice",
    status: "success",
  },
  {
    hash: "0x2",
    token: "ETH",
    amount: 2.5,
    sender: "0xBob",
    status: "success",
  },
  {
    hash: "0x3",
    token: "USDC",
    amount: 500,
    sender: "0xAlice",
    status: "failed",
  },
  {
    hash: "0x4",
    token: "USDC",
    amount: 3000,
    sender: "0xCarol",
    status: "success",
  },
  {
    hash: "0x5",
    token: "USDC",
    amount: 200,
    sender: "0xEve",
    status: "success",
  },
];

const authorized = ["0xAlice", "0xBob", "0xCarol"];

// Pipeline 1: Total USDC from authorized senders with success status
const totalUSDC = rawEvents
  .filter((tx) => tx.token === "USDC") // only USDC
  .filter((tx) => tx.status === "success") // only success
  .filter((tx) => authorized.includes(tx.sender)) // only authorized senders
  .map((tx) => tx.amount) // extract amount
  .reduce((acc, amount) => acc + amount, 0); // sum
// Expected: 4500 (1500 + 3000)
console.log(totalUSDC);

// Pipeline 2: Summary objects for large successful transactions
const largeSummaries = rawEvents
  .filter((tx) => tx.amount > 1000 && tx.status === "success")
  .map((tx) => ({
    hash: tx.hash,
    displayAmount: `${tx.amount} ${tx.token}`,
    isWhale: tx.amount > 2000,
  }));
// Expected: 2 objects — 0x2 (ETH 2.5) and 0x4 (USDC 3000)
console.log(largeSummaries);

// Pipeline 3: Count by token for successful transactions
const countByToken = rawEvents
  .filter((tx) => tx.status === "success")
  .reduce<
    Record<string, number>
  >((acc, tx) => {
    acc[tx.token] = (acc[tx.token] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
// Expected: { USDC: 3, ETH: 1 }
console.log(countByToken);
