function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string,
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// --- Test calls ---
let callCount = 0;

const expensiveCalc = (tokenAddress: string, blockNumber: number): number => {
  callCount++;
  return tokenAddress.length + blockNumber; // simulate expensive work
};

const memoizedCalc = memoize(expensiveCalc);

console.log(memoizedCalc("0xUSDC", 100)); // computed, callCount: 1
console.log(memoizedCalc("0xUSDC", 100)); // cached,   callCount: 1
console.log(memoizedCalc("0xETH", 100)); // computed, callCount: 2
console.log(memoizedCalc("0xUSDC", 100)); // cached,   callCount: 2

// With custom key:
const memoizedByToken = memoize(
  expensiveCalc,
  (token, _block) => token, // cache by token only, ignore block
);

console.log(memoizedByToken("0xUSDC", 100)); // computed (first time for this token)
console.log(memoizedByToken("0xUSDC", 999)); // cached (same token, even though block differs)
