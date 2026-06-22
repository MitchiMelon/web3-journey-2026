type Tx = { hash: string; amount: number; token: string };
const txs: Tx[] = [
  { hash: "0xaaa", amount: 500, token: "USDC" },
  { hash: "0xbbb", amount: 1500, token: "ETH" },
  { hash: "0xccc", amount: 800, token: "USDC" },
  { hash: "0xddd", amount: 2000, token: "DAI" },
  { hash: "0xeee", amount: 1200, token: "USDC" },
];

function select<T>(items: T[], predicate: (item: T) => boolean): T[] {
  const filteredResult: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) filteredResult.push(items[i]);
  }
  return filteredResult;
}

function locate<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) return items[i];
  }
  return undefined;
}

function createFilter<T>(predicate: (item: T) => boolean): (items: T[]) => T[] {
  return (items: T[]) => select(items, predicate);
}

const isUSDC = createFilter<Tx>((tx) => tx.token === "USDC");
const isLarge = createFilter<Tx>((tx) => tx.amount > 1000);

console.log(
  "select (USDC):",
  select(txs, (tx) => tx.token === "USDC"),
);
console.log(
  "locate (first large):",
  locate(txs, (tx) => tx.amount > 1000),
);
console.log("createFilter (USDC):", isUSDC(txs));
console.log("createFilter (large):", isLarge(txs));
console.log("Composed (large USDC):", isUSDC(isLarge(txs)));
