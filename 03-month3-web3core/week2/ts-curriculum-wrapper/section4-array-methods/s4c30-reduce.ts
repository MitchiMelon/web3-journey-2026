const transactions = [
  { hash: "0x1", token: "USDC", amount: 500, sender: "0xAlice" },
  { hash: "0x2", token: "ETH", amount: 1500, sender: "0xBob" },
  { hash: "0x3", token: "USDC", amount: 800, sender: "0xAlice" },
  { hash: "0x4", token: "DAI", amount: 300, sender: "0xCarol" },
  { hash: "0x5", token: "ETH", amount: 2000, sender: "0xBob" },
];

// 1. Total volume (number)
const totalVolume: number = transactions.reduce(
  (acc, tx) => acc + tx.amount,
  0,
);
// Expected: 5100

// 2. Volume by token (object)
const volumeByToken: Record<string, number> = transactions.reduce(
  (acc, tx) => {
    acc[tx.token] = (acc[tx.token] || 0) + tx.amount;
    return acc;
  },
  {} as Record<string, number>,
);
// Expected: { USDC: 1300, ETH: 3500, DAI: 300 }

// 3. Volume by sender (object)
const volumeBySender: Record<string, number> = transactions.reduce(
  (acc, tx) => {
    acc[tx.sender] = (acc[tx.sender] || 0) + tx.amount;
    return acc;
  },
  {} as Record<string, number>,
);
// Expected: { "0xAlice": 1300, "0xBob": 3500, "0xCarol": 300 }

// 4. Largest transaction per token (object)
const maxByToken: Record<string, number> = transactions.reduce(
  (acc, tx) => {
    acc[tx.token] = Math.max(acc[tx.token] || 0, tx.amount);
    return acc;
  },
  {} as Record<string, number>,
);
// Expected: { USDC: 800, ETH: 2000, DAI: 300 }

const compiledMethod = {
  totalVolume,
  volumeByToken,
  volumeBySender,
  maxByToken,
};

console.log(compiledMethod);
