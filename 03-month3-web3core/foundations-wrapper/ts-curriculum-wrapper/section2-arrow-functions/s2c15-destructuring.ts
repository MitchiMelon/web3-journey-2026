type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  gasPrice: bigint;
  blockNumber: number;
  status: "success" | "failed" | "pending";
};

const summarizeTx = ({ hash, from, to, value }: Transaction): string => {
  return `${hash} ${from}→${to} ${Number(value) / 1e18} ETH`;
};

const sampleTx1: Transaction = {
  hash: "0xabc123",
  from: "0xAlice",
  to: "0xBob",
  value: 1_500_000_000_000_000_000n, // 1.5 ETH
  gasPrice: 30_000_000_000n, // 30 gwei
  blockNumber: 19_000_000,
  status: "success",
};
console.log(summarizeTx(sampleTx1));
// "0xabc123 0xAlice→0xBob 1.5 ETH"

const calculateTotalCost = ({ value, gasPrice }: Transaction): bigint =>
  value + gasPrice * 21000n;

console.log(calculateTotalCost(sampleTx1));
// Expected: 1500630000000000000n  (1.5e18 + 30e9 * 21000 = 1_500_000_000_000_000_000 + 630_000_000_000_000)

const sampleTx2: Transaction = {
  hash: "0xdef",
  from: "0xCarol",
  to: "0xDave",
  value: 100_000_000_000_000_000n, // 0.1 ETH
  gasPrice: 20_000_000_000n, // 20 gwei
  blockNumber: 1,
  status: "pending",
};

console.log(calculateTotalCost(sampleTx2));
// Expected: 100420000000000000n  (0.1e18 + 20e9 * 21000 = 100_000_000_000_000_000 + 420_000_000_000_000)

const isFromSender = ({ from }: Transaction, expectedSender: string): boolean =>
  expectedSender === from;

console.log(isFromSender(sampleTx1, "0xAlice")); // true
console.log(isFromSender(sampleTx1, "0xBob")); // false

const buildExplorerUrl = ({ hash, blockNumber }: Transaction): string =>
  `https://etherscan.io/${blockNumber}/${hash}`;

console.log(buildExplorerUrl(sampleTx1));
// Expected: "https://etherscan.io/tx/0xabc123"

const getHashSafe = ({ hash = "0x000" }: Partial<Transaction>): string => hash;

console.log(getHashSafe(sampleTx1));
// Expected: "0xabc123"
console.log(getHashSafe({}));
// Expected: "0x000"   (no hash provided → use default)
console.log(getHashSafe({ from: "0xAlice", to: "0xBob" }));
// Expected: "0x000"   (hash missing, default kicks in)
console.log(getHashSafe({ hash: "0xcustom" }));
// Expected: "0xcustom"
