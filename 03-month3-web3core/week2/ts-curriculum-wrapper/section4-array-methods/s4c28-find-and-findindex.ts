const transactions = [
  { hash: "0xaaa", amount: 500, token: "USDC", sender: "0xAlice", block: 100 },
  { hash: "0xbbb", amount: 1500, token: "ETH", sender: "0xBob", block: 101 },
  { hash: "0xccc", amount: 200, token: "USDC", sender: "0xCarol", block: 100 },
  { hash: "0xddd", amount: 2000, token: "DAI", sender: "0xDiana", block: 102 },
];

// 1. Find transaction by hash (returns transaction or undefined)
function findByHash(hash: string) {
  return transactions.find((tx: (typeof transactions)[0]) => tx.hash === hash);
}

// 2. Find first transaction above 1000 from any sender
function findFirstLarge() {
  return transactions.find((tx: (typeof transactions)[0]) => tx.amount > 1000);
}

// 3. Find index of a transaction by hash (-1 if not found)
function findIndexByHash(hash: string): number {
  return transactions.findIndex(
    (tx: (typeof transactions)[0]) => tx.hash === hash,
  );
}

// 4. Safe find — returns a default if not found
function safeFindByHash(hash: string): (typeof transactions)[0] {
  // Returns the found transaction OR a default object if not found
  // Default: { hash: "0x000", amount: 0, token: "UNKNOWN", sender: "0x000", block: 0 }
  const defaultTx: (typeof transactions)[0] = {
    hash: "0x000",
    amount: 0,
    token: "UNKNOWN",
    sender: "0x000",
    block: 0,
  };
  return (
    transactions.find((tx: (typeof transactions)[0]) => tx.hash === hash) || defaultTx
  );
}

// Test each:
console.log(findByHash("0xbbb")); // { hash: "0xbbb", ... }
console.log(findByHash("0xzzz")); // undefined
console.log(findFirstLarge()); // { hash: "0xbbb", ... }
console.log(findIndexByHash("0xccc")); // 2
console.log(findIndexByHash("0xzzz")); // -1
console.log(safeFindByHash("0xzzz")); // default object
