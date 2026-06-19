const transactions = [
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
    token: "DAI",
    amount: 800,
    sender: "0xAlice",
    status: "success",
  },
  {
    hash: "0x6",
    token: "USDC",
    amount: 2000,
    sender: "0xAlice",
    status: "pending",
  },
];

// Filter 1: Only successful USDC transactions
const successfulUSDC = transactions.filter(
  (tx) => tx.token === "USDC" && tx.status === "success",
);
console.log(successfulUSDC);

// Filter 2: Only from 0xAlice AND status is success
const aliceSuccess = transactions.filter(
  (tx) => tx.sender === "0xAlice" && tx.status === "success",
);
console.log(aliceSuccess);

// Filter 3: Only amounts above 1000
const largeOnly = transactions.filter((tx) => tx.amount > 1000);
console.log(largeOnly);

// Filter 4: Chain — successful USDC above 1000, return only hashes
const successfulLargeUSDCHashes: string[] = transactions
  .filter((tx) => tx.token === "USDC")
  .filter((tx) => tx.status === "success")
  .map((tx) => tx.hash);
console.log(successfulLargeUSDCHashes);
