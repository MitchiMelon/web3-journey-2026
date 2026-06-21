function transform<TInput, TOutput>(
  items: TInput[],
  transformFn: (item: TInput, index: number) => TOutput,
): TOutput[] {
  // Your implementation — do not use .map() inside
  const transformedResult: TOutput[] = [];
  for (let i = 0; i < items.length; i++) {
    transformedResult.push(transformFn(items[i], i));
  }
  return transformedResult;
}

// Test with these:
type Tx = { hash: string; amount: number; token: string };

const txs: Tx[] = [
  { hash: "0xaaa", amount: 500, token: "USDC" },
  { hash: "0xbbb", amount: 1500, token: "ETH" },
];

// Test 1: transform to display strings
const displays = transform(txs, (tx) => `${tx.hash}: ${tx.amount} ${tx.token}`);

// Test 2: transform to amounts only
const amounts = transform(txs, (tx) => tx.amount);

// Test 3: transform with index
const indexed = transform(txs, (tx, i) => ({ position: i + 1, ...tx }));

// Then prove it works identically to .map():
console.log(displays);
console.log(txs.map((tx) => `${tx.hash}: ${tx.amount} ${tx.token}`));
// Both should match exactly
