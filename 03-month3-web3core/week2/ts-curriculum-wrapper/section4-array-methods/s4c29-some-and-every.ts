const batch = [
  {
    hash: "0x1",
    sender: "0xAlice",
    amount: 500,
    token: "USDC",
    flagged: false,
  },
  { hash: "0x2", sender: "0xBob", amount: 1500, token: "ETH", flagged: false },
  { hash: "0x3", sender: "0xAlice", amount: 200, token: "DAI", flagged: true },
  {
    hash: "0x4",
    sender: "0xCarol",
    amount: 3000,
    token: "USDC",
    flagged: false,
  },
];

const authorizedSenders = ["0xAlice", "0xBob", "0xCarol"];

// 1. Are ALL transactions from authorized senders?
const allAuthorized: boolean = batch.every((tx) =>
  authorizedSenders.includes(tx.sender),
);

// 2. Is ANY transaction flagged?
const hasFlaggedTx: boolean = batch.some((tx) => tx.flagged === true);

// 3. Are ALL amounts under 2000?
const allUnder2000: boolean = batch.every((tx) => tx.amount < 2000);

// 4. Does ANY transaction involve more than 2500?
const hasLargeAmount: boolean = batch.some((tx) => tx.amount > 2500);

// 5. Are ALL transactions for the same token?
const allSameToken: boolean = batch.every((tx) => tx.token === batch[0].token);

// Build a batch validation report:
type BatchValidation = {
  isValid: boolean; // true if allAuthorized AND !hasFlaggedTx
  allAuthorized: boolean;
  hasFlaggedTx: boolean;
  allUnder2000: boolean;
  hasLargeAmount: boolean;
  allSameToken: boolean;
};

const batchValidation = {
  isValid: allAuthorized && !hasFlaggedTx,
  allAuthorized,
  hasFlaggedTx,
  allUnder2000,
  hasLargeAmount,
  allSameToken,
};

console.log(batchValidation);
