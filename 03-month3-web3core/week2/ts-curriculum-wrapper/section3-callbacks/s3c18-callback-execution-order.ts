function applyFee(
  amount: number,
  feeCalculator: (amount: number) => number,
): number {
  console.log("1. applyFee called");
  const fee = feeCalculator(amount);
  console.log("3. fee calculated:", fee);
  return amount - fee;
}

console.log("A. Before applyFee");

let result = applyFee(1000, (amount) => {
  console.log("feeCalculator running, amount:", amount);
  return 5;
});

result = applyFee(1000, (amount) => {
  console.log("feeCalculator running, amount:", amount);
  return amount * 0.02;
});

result = applyFee(1000, (amount) => {
  console.log("feeCalculator running, amount:", amount);
  if (amount < 500) {
    return amount * 0.01;
  } else {
    return amount * 0.02;
  }
});

console.log("B. After applyFee, result:", result);
