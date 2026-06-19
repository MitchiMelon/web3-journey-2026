type RPCTransaction = {
  hash: string;
  from: string;
  to: string;
  value: string; // hex string e.g. "0x1a2b"
  gas: string; // hex string
  blockNumber: string; // hex string
};

type DBTransaction = {
  txHash: string;
  sender: string;
  recipient: string;
  amountWei: bigint;
  gasLimit: number;
  block: number;
  createdAt: number; // Date.now()
};

const rpcTransactions: RPCTransaction[] = [
  {
    hash: "0xaaa",
    from: "0xAlice",
    to: "0xBob",
    value: "0xde0b6b3a7640000",
    gas: "0x5208",
    blockNumber: "0x1234",
  },
  {
    hash: "0xbbb",
    from: "0xBob",
    to: "0xCarol",
    value: "0x1bc16d674ec80000",
    gas: "0x7530",
    blockNumber: "0x1235",
  },
];

// Transform using map:
const dbTransactions: DBTransaction[] = rpcTransactions.map((tx) => ({
  txHash: tx.hash,
  sender: tx.from,
  recipient: tx.to,
  amountWei: BigInt(tx.value),
  gasLimit: Number(tx.gas),
  block: Number(tx.blockNumber),
  createdAt: Date.now(),
}));
console.log(dbTransactions);

// Also write a map that extracts just the hashes:
const hashes: string[] = rpcTransactions.map((tx) => tx.hash);
console.log(hashes);

// Also write a map that checks if each transaction is large (> 1 ETH):
const isLarge: boolean[] = rpcTransactions.map(
  (tx) => BigInt(tx.value) > 1_000_000_000_000_000_000n,
);
console.log(isLarge);
