const transactions = [
  { hash: "0xaaa", amount: 500, token: "USDC", sender: "0xAlice" },
  { hash: "0xbbb", amount: 1500, token: "ETH", sender: "0xBob" },
  { hash: "0xccc", amount: 200, token: "USDC", sender: "0xCarol" },
  { hash: "0xddd", amount: 2000, token: "DAI", sender: "0xDiana" },
];

// Task 1: Log each as "[hash]: [sender] sent [amount] [token]"
transactions.forEach((tx) =>
  console.log(`${tx.hash}: ${tx.sender} sent ${tx.amount} ${tx.token}`),
);

// Task 2: Count transactions above 1000
let largeCount = 0;
transactions.forEach((tx) => {
  if (tx.amount > 1000) largeCount++;
});
console.log("Large transactions:", largeCount); // Expected: 2

// Task 3: Build a lookup by hash
const lookup: Record<string, (typeof transactions)[0]> = {};
transactions.forEach((user) => {
  lookup[user.hash] = user;
});
console.log(lookup["0xbbb"]); // Expected: { hash: "0xbbb", ... }
