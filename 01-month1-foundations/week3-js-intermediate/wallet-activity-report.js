const transactions = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 500, date: "2026-04-20" },
  { id: 2, from: "0xBob", to: "0xCharlie", amount: 1000, date: "2026-04-19" },
  { id: 3, from: "0xAlice", to: "0xBob", amount: 200, date: "2026-04-18" },
  { id: 4, from: "0xCharlie", to: "0xAlice", amount: 300, date: "2026-04-21" },
  { id: 5, from: "0xAlice", to: "0xDiana", amount: 100, date: "2026-04-20" }
];


function generateWalletActivityReport(transactions) {
  
  const allFrom = transactions.map(tx => tx.from);
  const allTo = transactions.map(tx => tx.to);                
  const uniqueWallets = [...new Set([...allFrom, ...allTo])]; 


  const reportArray = uniqueWallets.map(wallet => {
    const txsForWallet = transactions.filter(
      tx => tx.from === wallet || tx.to === wallet
    );
    const txCount = txsForWallet.length;


    let activityLevel;
    if (txCount >= 3) {
      activityLevel = "High";
    } else if (txCount === 2) {   
      activityLevel = "Medium";
    } else {
      activityLevel = "Low";
    }


    const dates = txsForWallet.map(tx => tx.date);
    const lastTransactionDate = dates.reduce((max, date) =>
      date > max ? date : max
    );


    const sentTo = transactions
      .filter(tx => tx.from === wallet)
      .map(tx => tx.to);
    const receivedFrom = transactions
      .filter(tx => tx.to === wallet)
      .map(tx => tx.from);
    const allPartners = [...sentTo, ...receivedFrom];
    const uniquePartners = [...new Set(allPartners)];


    const hasSent = transactions.some(tx => tx.from === wallet);
    const hasReceived = transactions.some(tx => tx.to === wallet);
    const riskFlag = hasSent && hasReceived;


    return {
      wallet,
      activityLevel,
      lastTransactionDate,
      uniquePartners,
      riskFlag
    };
  });


  const priority = { High: 3, Medium: 2, Low: 1 };
  const sortedReport = reportArray.sort(
    (a, b) => priority[b.activityLevel] - priority[a.activityLevel]
  );


  return sortedReport;
}


// Test 1: Basic report generation
console.log("--- Test 1: Basic report generation ---");
const result1 = generateWalletActivityReport(transactions);
console.log(result1);
console.log("Expected: 4 wallets (Alice high, Bob medium, Charlie medium, Diana low)");
console.log("");


// Test 2: Empty transactions
console.log("--- Test 2: Empty transactions ---");
const result2 = generateWalletActivityReport([]);
console.log(result2);
console.log("Expected: Empty array []");
console.log("");


// Test 3: Single wallet (one-way)
console.log("--- Test 3: Single wallet (one-way transfer) ---");
const singleWalletTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100, date: "2026-04-20" }
];
const result3 = generateWalletActivityReport(singleWalletTx);
console.log(result3);
console.log("Expected: Alice (Low, riskFlag false), Bob (Low, riskFlag false)");
console.log("");


// Test 4: High activity wallet
console.log("--- Test 4: High activity wallet ---");
const highActivityTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100, date: "2026-04-20" },
  { id: 2, from: "0xAlice", to: "0xCharlie", amount: 100, date: "2026-04-21" },
  { id: 3, from: "0xAlice", to: "0xDiana", amount: 100, date: "2026-04-22" }
];
const result4 = generateWalletActivityReport(highActivityTx);
console.log(result4);
console.log("Expected: Alice (High activity, 3 transactions)");
console.log("");


// Test 5: Risk flag detection
console.log("--- Test 5: Risk flag detection (both sender and receiver) ---");
const riskTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100, date: "2026-04-20" },
  { id: 2, from: "0xBob", to: "0xAlice", amount: 100, date: "2026-04-21" }
];
const result5 = generateWalletActivityReport(riskTx);
console.log(result5);
console.log("Expected: Both Alice and Bob have riskFlag = true");
console.log("");


// Test 6: Unique partners
console.log("--- Test 6: Unique partners (no duplicates) ---");
const partnersTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100, date: "2026-04-20" },
  { id: 2, from: "0xAlice", to: "0xBob", amount: 200, date: "2026-04-21" },
  { id: 3, from: "0xBob", to: "0xAlice", amount: 50, date: "2026-04-22" }
];
const result6 = generateWalletActivityReport(partnersTx);
console.log(result6);
console.log("Expected: Alice and Bob each have 1 unique partner (each other), no duplicates");
console.log("");


// Test 7: Last transaction date accuracy
console.log("--- Test 7: Last transaction date accuracy ---");
const dateTx = [
  { id: 1, from: "0xAlice", to: "0xBob", amount: 100, date: "2026-04-18" },
  { id: 2, from: "0xAlice", to: "0xCharlie", amount: 100, date: "2026-04-22" },
  { id: 3, from: "0xBob", to: "0xAlice", amount: 100, date: "2026-04-20" }
];
const result7 = generateWalletActivityReport(dateTx);
console.log(result7);
console.log("Expected: Alice last transaction 2026-04-22, Bob 2026-04-20");
console.log("");


// Test 8: Sorting by activity level
console.log("--- Test 8: Report sorted by activity level ---");
const sortTx = [
  { id: 1, from: "0xDiana", to: "0xAlice", amount: 100, date: "2026-04-20" },
  { id: 2, from: "0xAlice", to: "0xBob", amount: 100, date: "2026-04-20" },
  { id: 3, from: "0xAlice", to: "0xCharlie", amount: 100, date: "2026-04-20" },
  { id: 4, from: "0xAlice", to: "0xDiana", amount: 100, date: "2026-04-20" }
];
const result8 = generateWalletActivityReport(sortTx);
console.log(result8);
console.log("Expected: First entry is High activity (Alice), then Medium/Low wallets");
console.log("");
