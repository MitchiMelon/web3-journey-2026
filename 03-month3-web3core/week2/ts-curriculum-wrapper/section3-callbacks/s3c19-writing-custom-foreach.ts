type Transaction = {
  hash: string;
  amount: number;
  token: string;
  sender: string;
};

// Implement this:
function blockchainForEach(
  transactions: Transaction[],
  callback: (
    transaction: Transaction,
    index: number,
    all: Transaction[],
  ) => void,
): void {
  // Your implementation — must call callback for each transaction
  // with (transaction, index, fullArray)
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    callback(transaction, i, transactions);
  }
}

const txList: Transaction[] = [
  { hash: "0xaaa", amount: 500, token: "ETH", sender: "0xAlice" },
  { hash: "0xbbb", amount: 1500, token: "USDC", sender: "0xBob" },
  { hash: "0xccc", amount: 2000, token: "DAI", sender: "0xCharlie" },
];

console.log("--- Callback 1: log each hash ---");
blockchainForEach(txList, (tx, i) => {
  console.log(`${i + 1}. ${tx.hash}`);
});

console.log("--- Callback 2: log sender and amount ---");
blockchainForEach(txList, (tx) => {
  console.log(`${tx.sender}: ${tx.amount} ${tx.token}`);
});

console.log("--- Callback 3: log only large txs ---");
blockchainForEach(txList, (tx, i, all) => {
  if (tx.amount > 1000) {
    console.log(`Large tx at index ${i} of ${all.length}: ${tx.hash}`);
  }
});
