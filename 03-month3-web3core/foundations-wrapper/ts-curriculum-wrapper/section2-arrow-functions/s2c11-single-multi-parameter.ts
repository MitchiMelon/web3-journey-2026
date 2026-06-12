// Write as arrow functions:

// 1. Single param — extracts hash from a transaction
// Takes: tx: { hash: string; amount: number }
// Returns: string (the hash)

const singleParam = (tx: { hash: string; amount: number }): string => tx.hash;

console.log(singleParam({ hash: "0xabc123", amount: 100 })); // "0xabc123"
console.log(singleParam({ hash: "0xdef456", amount: 250 })); // "0xdef456"

// 2. No params — returns current timestamp
// Returns: number

const noParam = (): number => Date.now();

console.log(noParam()); // e.g., 1718001234567
console.log(noParam()); // a slightly larger number

// 3. Two params — calculates fee
// Takes: amount: number, feePercent: number
// Returns: number (amount * feePercent / 100, rounded to 2dp)

const twoParams = (amount: number, feePercent: number): number =>
  Number(((amount * feePercent) / 100).toFixed(2));

console.log(twoParams(500, 2.5)); // expected: 12.5
console.log(twoParams(1000, 0.5)); // expected: 5
console.log(twoParams(333, 3.33)); // expected: 11.09 (or similar, check rounding)

// 4. Three params — builds a transfer event description
// Takes: from: string, to: string, amount: number
// Returns: string — e.g. "Transfer: 0xAlice → 0xBob (500 tokens)"

const threeParams = (from: string, to: string, amount: number): string =>
  `Transfer: ${from} -> ${to} (${amount} tokens)`;

console.log(threeParams("0xAlice", "0xBob", 500)); // "Transfer: 0xAlice -> 0xBob (500 tokens)"
console.log(threeParams("0xCarol", "0xDave", 1200)); // "Transfer: 0xCarol -> 0xDave (1200 tokens)"

// 5. Single param — checks if address is valid
// Takes: address: string
// Returns: boolean (starts with "0x" and length === 42)

const isValidAddress = (address: string): boolean =>
  address.startsWith("0x") && address.length === 42;

console.log(isValidAddress("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12")); // true (length 42)
console.log(isValidAddress("0xshort")); // false (too short)
console.log(isValidAddress("0x123456789012345678901234567890123456789012")); // false (length > 42)
console.log(isValidAddress("1234567890123456789012345678901234567890123")); // false (no 0x prefix)
