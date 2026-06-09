function formatBalance(weiAmount: number, symbol: string): string {
  const etherValue = weiAmount / 1e18;
  const valueFixed = etherValue.toFixed(4);
  return `${valueFixed} ${symbol}`;
}

console.log(formatBalance(1250000000000000000, "ETH"));
console.log(formatBalance(500000000000000000, "WETH"));
