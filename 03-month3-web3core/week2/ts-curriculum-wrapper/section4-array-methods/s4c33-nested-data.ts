type BlockData = {
  blockNumber: number;
  miner: string;
  transactions: Array<{
    hash: string;
    token: string;
    amount: number;
    sender: string;
    gasUsed: number;
  }>;
};

const blocks: BlockData[] = [
  {
    blockNumber: 100,
    miner: "0xMiner1",
    transactions: [
      {
        hash: "0x1",
        token: "USDC",
        amount: 500,
        sender: "0xAlice",
        gasUsed: 21000,
      },
      {
        hash: "0x2",
        token: "ETH",
        amount: 1500,
        sender: "0xBob",
        gasUsed: 65000,
      },
    ],
  },
  {
    blockNumber: 101,
    miner: "0xMiner2",
    transactions: [
      {
        hash: "0x3",
        token: "USDC",
        amount: 800,
        sender: "0xAlice",
        gasUsed: 21000,
      },
      {
        hash: "0x4",
        token: "DAI",
        amount: 300,
        sender: "0xCarol",
        gasUsed: 45000,
      },
      {
        hash: "0x5",
        token: "USDC",
        amount: 2000,
        sender: "0xDiana",
        gasUsed: 21000,
      },
    ],
  },
];

// 1. Flat list of all transactions across all blocks
const allTxs = blocks.flatMap((tx) => tx.transactions);
console.log(allTxs);

// 2. Total gas used across ALL transactions in ALL blocks
const totalGas = blocks
  .flatMap((block) => block.transactions)
  .map((tx) => tx.gasUsed)
  .reduce((sum, gas) => sum + gas, 0);
console.log(totalGas);

// 3. All USDC transactions from all blocks, sorted by amount descending
const allUSDC = blocks
  .flatMap((block) => block.transactions)
  .filter((tx) => tx.token === "USDC")
  .sort((a, b) => b.amount - a.amount);
console.log(allUSDC);

// 4. Per-block summary
type BlockSummary = {
  blockNumber: number;
  txCount: number;
  totalVolume: number;
  uniqueSenders: number;
};
const summaries: BlockSummary[] = blocks.map((block) => ({
  blockNumber: block.blockNumber,
  txCount: block.transactions.length,
  totalVolume: block.transactions.reduce((sum, tx) => sum + tx.amount, 0),
  uniqueSenders: new Set(block.transactions.map((tx) => tx.sender)).size,
}));
console.log(summaries);
