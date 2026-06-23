// 1. The pipe function
function pipe<T>(...fns: Array<(input: T) => T>): (input: T) => T {
  return (input: T) => {
    return fns.reduce((acc, fn) => fn(acc), input);
  };
}

// 2. Define transformation steps
type TxData = {
  hash: string;
  amount: number;
  sender: string;
  token: string;
  fee?: number;
  formattedAmount?: string;
  senderShort?: string;
};

const addFee = (tx: TxData): TxData => ({
  ...tx,
  fee: tx.amount * 0.003,
});

const formatAmount = (tx: TxData): TxData => ({
  ...tx,
  formattedAmount: `${tx.amount.toFixed(2)} ${tx.token}`,
});

const shortenSender = (tx: TxData): TxData => ({
  ...tx,
  senderShort: `${tx.sender.slice(0, 6)}...${tx.sender.slice(-4)}`,
});

// 3. Build the pipeline
const processTx = pipe(addFee, formatAmount, shortenSender);

// 4. Test data
const raw: TxData = {
  hash: "0xabc",
  amount: 1000,
  sender: "0xAlice1234567890",
  token: "USDC",
};

// 5. Test calls
const processed = processTx(raw);
console.log("Single TX:", processed);

const txList: TxData[] = [
  { hash: "0x1", amount: 500, sender: "0xBob1234567890", token: "ETH" },
  { hash: "0x2", amount: 2000, sender: "0xCarol9876543210", token: "DAI" },
];
const processedAll = txList.map(processTx);
console.log("All TXs:", processedAll);
