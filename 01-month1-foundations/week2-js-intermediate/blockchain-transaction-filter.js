const transactions = [
  { 
    id: 1, 
    from: "0xAlice", 
    to: "0xBob", 
    amount: 500, 
    date: "2026-04-20", 
    status: "confirmed" 
  },
  { 
    id: 2, 
    from: "0xBob", 
    to: "0xCharlie", 
    amount: 1000, 
    date: "2026-04-19", 
    status: "pending" 
  },
  { 
    id: 3, 
    from: "0xAlice", 
    to: "0xDiana", 
    amount: 200, 
    date: "2026-04-20", 
    status: "confirmed" 
  },
  { 
    id: 4, 
    from: "0xDiana", 
    to: "0xAlice", 
    amount: 5000, 
    date: "2026-04-18", 
    status: "failed" 
  }
];


function createTransactionFilter(filterCallback) {
  return (transactionsArray) => transactionsArray.filter(filterCallback);
}


// Test 1: Confirmed transactions from Alice
console.log("--- Test 1: Confirmed transactions from Alice ---");
const filterAliceConfirmed = createTransactionFilter(
  (tx) => tx.from === "0xAlice" && tx.status === "confirmed"
);
const result1 = filterAliceConfirmed(transactions);
console.log(result1);
console.log("Expected: 2 transactions (IDs 1 and 3)");


// Test 2: High-value transactions (>= 1000)
console.log("\n--- Test 2: High-value transactions ---");
const filterHighValue = createTransactionFilter((tx) => tx.amount >= 1000);
console.log(filterHighValue(transactions));
console.log("Expected: 1 transaction (ID 2)");


// Test 3: Pending transactions
console.log("\n--- Test 3: Pending transactions ---");
const filterPending = createTransactionFilter((tx) => tx.status === "pending");
console.log(filterPending(transactions));
console.log("Expected: 1 transaction (ID 2)");


// Test 4: Transactions to Charlie
console.log("\n--- Test 4: Transactions to Charlie ---");
console.log(createTransactionFilter((tx) => tx.to === "0xCharlie")(transactions));
console.log("Expected: 1 transaction (ID 2)");


// Test 5: Failed transactions from Diana
console.log("\n--- Test 5: Failed from Diana ---");
const filterDianaFailed = createTransactionFilter(
  (tx) => tx.from === "0xDiana" && tx.status === "failed"
);
console.log(filterDianaFailed(transactions));
console.log("Expected: 1 transaction (ID 4)");


// Test 6: No matches
console.log("\n--- Test 6: No matches ---");
const filterNone = createTransactionFilter(
  (tx) => tx.status === "confirmed" && tx.amount > 10000
);
console.log(filterNone(transactions));
console.log("Expected: Empty array []");