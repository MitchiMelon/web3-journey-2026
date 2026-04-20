/**
 * MEDIUM: Blockchain Transaction Simulator
 * 
 * You're simulating a simple blockchain ledger system.
 * Users can have multiple transactions (sends and receives).
 * 
 * Tasks:
 * 1. Calculate final balance for each user (sum all transactions)
 * 2. Find the user with the highest balance
 * 3. Get all transactions for a specific user
 * 4. Validate transactions (sender must have enough balance, amount > 0)
 * 5. Create a summary of total sent and received per user
 */

// TODO: Create these functions:
// 1. function calculateFinalBalance(user, initialBalances, transactions) { ... }
// 2. function getUserWithHighestBalance(initialBalances, transactions) { ... }
// 3. function getTransactionsForUser(user, transactions) { ... }
// 4. function validateTransaction(transaction, initialBalances, transactions) { ... }
// 5. function generateTransactionSummary(initialBalances, transactions) { ... }

// Example output for summary:
// {
//   Alice: { totalSent: 95, totalReceived: 100, finalBalance: 505 },
//   Bob: { totalSent: 85, totalReceived: 65, finalBalance: 280 },
//   ...
// }

const transactions = [
  { id: 1, from: "Alice", to: "Bob", amount: 50, date: "2026-04-19" },
  { id: 2, from: "Bob", to: "Charlie", amount: 30, date: "2026-04-19" },
  { id: 3, from: "Alice", to: "Charlie", amount: 20, date: "2026-04-19" },
  { id: 4, from: "Diana", to: "Alice", amount: 100, date: "2026-04-19" },
  { id: 5, from: "Charlie", to: "Bob", amount: 15, date: "2026-04-19" },
  { id: 6, from: "Alice", to: "Diana", amount: 25, date: "2026-04-20" },
  { id: 7, from: "Bob", to: "Diana", amount: 40, date: "2026-04-20" },
];

// Starting balances
const initialBalances = {
  Alice: 500,
  Bob: 300,
  Charlie: 200,
  Diana: 400
};

function calculateFinalBalance(user, initialBalances, transactions) {
  let balance = initialBalances[user] ?? 0;
  for (let tx of transactions) {
    if (tx.from == user) {
      balance -= tx.amount;
    } else if (tx.to == user) {
      balance += tx.amount;
    }
  }
  return balance;
}

function getUserWithHighestBalance(initialBalances, transactions) {
  let users = new Set();
  for (let tx of transactions) {
    users.add(tx.from);
    users.add(tx.to);
  } 
  for (let tx in initialBalances) {
    users.add(tx);
  }
  let maxUser = null;
  let maxBalance = -Infinity;
  for (let userName of users) {
    let bal = calculateFinalBalance(userName, initialBalances, transactions);
    if (bal > maxBalance) {
      maxBalance = bal;
      maxUser = userName;
    }
  }
  return maxUser;
}

function getTransactionsForUser(user, transactions) {
  let result = [];
  for (let tx of transactions) {
    if (tx.from == user || tx.to == user) {
      result.push(tx);
    }
  }
  return result;
}

function validateTransaction(transaction, initialBalances, transactions) {
  if (transaction.amount <= 0) {
    return false;
  }
  let sender = transaction.from;
  let senderBalance = calculateFinalBalance(sender, initialBalances, transactions);
  return senderBalance >= transaction.amount;
}

function generateTransactionSummary(initialBalances, transactions) {
  let summary = {};
  let users = new Set();                     
  
  for (let tx of transactions) {
    users.add(tx.from);
    users.add(tx.to);
  }
  for (let user in initialBalances) {
    users.add(user);
  }
  
  for (let user of users) {
    summary[user] = {
      totalSent: 0,
      totalReceived: 0,
      finalBalance: 0
    };
  }
  for (let tx of transactions) {
    summary[tx.from].totalSent += tx.amount;
    summary[tx.to].totalReceived += tx.amount;
  }
  
  for (let user of users) {
    let init = initialBalances[user] ?? 0;
    summary[user].finalBalance = init + summary[user].totalReceived - summary[user].totalSent;
  }
  
  return summary;
}

console.log(calculateFinalBalance("Alice", initialBalances, transactions));
console.log(getUserWithHighestBalance(initialBalances, transactions));
console.log(generateTransactionSummary(initialBalances, transactions));