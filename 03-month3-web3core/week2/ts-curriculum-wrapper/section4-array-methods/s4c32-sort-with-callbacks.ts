const transactions = [
  { hash: "0xa", amount: 1500, gasPrice: 25, block: 1003 },
  { hash: "0xb", amount: 500, gasPrice: 45, block: 1001 },
  { hash: "0xc", amount: 3000, gasPrice: 15, block: 1002 },
  { hash: "0xd", amount: 800, gasPrice: 35, block: 1001 },
  { hash: "0xe", amount: 1500, gasPrice: 30, block: 1004 },
];

// 1. Sort by amount ascending
const byAmountAsc = [...transactions].sort((a, b) => a.amount - b.amount);

// 2. Sort by amount descending
const byAmountDesc = [...transactions].sort((a, b) => b.amount - a.amount);

// 3. Sort by block descending, then gasPrice ascending (multi-criteria)
const byBlockThenGas = [...transactions].sort((a, b) => {
  if (b.block !== a.block) {
    return b.block - a.block;
  }
  return a.gasPrice - b.gasPrice;
});

// 4. Sort by hash alphabetically
const byHash = [...transactions].sort((a, b) => a.hash.localeCompare(b.hash));

// 5. Sort: largest amount first, if tie then lowest gasPrice first
const byAmountThenGas = [...transactions].sort((a, b) => {
  if (b.amount !== a.amount) {
    return b.amount - a.amount;
  }
  return a.gasPrice - b.gasPrice;
});

console.log(byAmountAsc);
console.log(byAmountDesc);
console.log(byBlockThenGas);
console.log(byHash);
console.log(byAmountThenGas);
