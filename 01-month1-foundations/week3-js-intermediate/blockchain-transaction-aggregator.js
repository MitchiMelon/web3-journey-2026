const transactions = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 500 },
  { id: 2, from: "0xBob", to: "0xCharlie", amount: 1000 },
  { id: 3, from: "0xAlice", to: "0xBob", amount: 200 },
  { id: 4, from: "0xCharlie", to: "0xAlice", amount: 300 }
];


function aggregateTransactionsByWallet(transactions) {
  const allAddresses = [
  ...transactions.map(tx => tx.from),
  ...transactions.map(tx => tx.to),  
  ];


  const uniqueWallets = [...new Set(allAddresses)];


  return uniqueWallets.reduce((result, wallet) => {
    const sent = transactions.filter(tx => tx.from === wallet);
    const received = transactions.filter(tx => tx.to === wallet);


    const totalSent = sent.reduce((sum, tx) => sum + tx.amount, 0);
    const totalReceived = received.reduce((sum, tx) => sum + tx.amount, 0);


    result[wallet] = {
      totalSent,
      totalReceived,
      netBalance: totalReceived - totalSent,
      transactionCount: sent.length + received.length
    };
    return result;
  }, {});
}


// Test 1: Basic aggregation
console.log("--- Test 1: Basic aggregation ---");
const result1 = aggregateTransactionsByWallet(transactions);
console.log(result1);
console.log("Expected: 0xAlice sent 700, received 300, net -400, 3 transactions");
console.log("");


// Test 2: Empty transactions
console.log("--- Test 2: Empty transactions ---");
const result2 = aggregateTransactionsByWallet([]);
console.log(result2);
console.log("Expected: Empty object {}");
console.log("");


// Test 3: Single wallet
console.log("--- Test 3: Single wallet (one-way transfer) ---");
const singleWalletTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100 }
];
const result3 = aggregateTransactionsByWallet(singleWalletTx);
console.log(result3);
console.log("Expected: Alice sent 100 (0 received), Bob received 100 (0 sent)");
console.log("");


// Test 4: Multiple transactions same wallets
console.log("--- Test 4: Multiple transactions between same wallets ---");
const multiTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100 },
  { id: 2, from: "0xAlice", to: "0xBob", amount: 200 },
  { id: 3, from: "0xBob", to: "0xAlice", amount: 50 }
];
const result4 = aggregateTransactionsByWallet(multiTx);
console.log(result4);
console.log("Expected: Alice sent 300, received 50, Bob sent 50, received 300");
console.log("");


// Test 5: Circular transactions
console.log("--- Test 5: Circular transactions ---");
const circularTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100 },
  { id: 2, from: "0xBob", to: "0xCharlie", amount: 100 },
  { id: 3, from: "0xCharlie", to: "0xAlice", amount: 100 }
];
const result5 = aggregateTransactionsByWallet(circularTx);
console.log(result5);
console.log("Expected: Each wallet sent 100, received 100, net balance 0");
console.log("");


// Test 6: Large amounts (wei simulation)
console.log("--- Test 6: Large amounts ---");
const largeTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 1000000000000000000 }, // 1 ETH
  { id: 2, from: "0xBob", to: "0xAlice", amount: 500000000000000000 }   // 0.5 ETH
];
const result6 = aggregateTransactionsByWallet(largeTx);
console.log(result6);
console.log("Expected: Handles large numbers correctly");
console.log("");


// Test 7: Verify transaction counts
console.log("--- Test 7: Transaction count accuracy ---");
const countTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100 },
  { id: 2, from: "0xAlice", to: "0xCharlie", amount: 100 },
  { id: 3, from: "0xBob", to: "0xAlice", amount: 100 }
];
const result7 = aggregateTransactionsByWallet(countTx);
console.log(result7);
console.log("Expected: Alice 3 transactions, Bob 2, Charlie 1");
console.log("");