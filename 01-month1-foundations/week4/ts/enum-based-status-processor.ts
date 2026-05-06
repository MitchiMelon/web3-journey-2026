enum TransactionStatus {
  Pending,
  Confirmed,
  Failed
}

function processConfirmed(
  transactions: { id: number; status: TransactionStatus }[],
  callback: (tx: { id: number; status: TransactionStatus }) => void
): void {
  for (const tx of transactions) {
    if (tx.status === TransactionStatus.Confirmed) {
      callback(tx);
    }
  }
}

const txList = [
  { id: 1, status: TransactionStatus.Pending },
  { id: 2, status: TransactionStatus.Confirmed },
  { id: 3, status: TransactionStatus.Confirmed },
  { id: 4, status: TransactionStatus.Failed }
];

function logTx(tx: { id: number; status: TransactionStatus }): void {
  console.log(`Confirmed tx #${tx.id}`);
}

processConfirmed(txList, logTx);
