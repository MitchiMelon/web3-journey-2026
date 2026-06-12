// Define these as typed const arrow functions:

// 1. A validator — type: (address: string) => boolean
const isValidAddress: (address: string) => boolean = (address) => {
  if (address.startsWith("0x")) return true;
  return false;
};

// 2. A formatter — type: (amount: number, symbol: string) => string
const formatTokenAmount: (amount: number, symbol: string) => string = (
  amount,
  symbol,
) => {
  return `${amount} ${symbol}`;
};

// 3. A classifier — type: (gasPriceGwei: number) => "low" | "medium" | "high"
// low: < 20, medium: 20-50, high: > 50
const classifyGasPrice: (gasPriceGwei: number) => "low" | "medium" | "high" = (
  gasPriceGwei,
) => {
  if (gasPriceGwei < 20) return "low";
  if (gasPriceGwei <= 50) return "medium";
  return "high";
};

// 4. A calculator — type: (principal: bigint, ratePercent: number) => bigint
// Returns principal + (principal * rate / 100n) — simple interest
const calculateInterest: (principal: bigint, ratePercent: number) => bigint = (
  principal,
  ratePercent,
) => {
  return principal + (principal * BigInt(ratePercent)) / 100n;
};

// 5. A logger — type: (event: string, data: Record<string, unknown>) => void
// Logs: [ISO timestamp] EVENT: data as JSON
const logBlockchainEvent: (
  event: string,
  data: Record<string, unknown>,
) => void = (event, data) => {
  const currentTimestamp = new Date().toISOString();
  const stringfyData = JSON.stringify(data);
  console.log(`${currentTimestamp} EVENT: ${stringfyData}`);
};

// 1. Validator
console.log(isValidAddress("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12")); // true
console.log(isValidAddress("0xshort")); // false
console.log(isValidAddress("123456789012345678901234567890123456789012")); // false (no 0x)

// 2. Formatter
console.log(formatTokenAmount(1500, "ETH")); // "1500 ETH"

// 3. Classifier
console.log(classifyGasPrice(15)); // "low"
console.log(classifyGasPrice(30)); // "medium"
console.log(classifyGasPrice(80)); // "high"

// 4. Calculator (integer rate)
console.log(calculateInterest(1000n, 5)); // 1050n (1000 + 50)

// 5. Logger
logBlockchainEvent("Transfer", { from: "0xA", to: "0xB", amount: 100 });
// logs: [ISO timestamp] EVENT: {"from":"0xA","to":"0xB","amount":100}
