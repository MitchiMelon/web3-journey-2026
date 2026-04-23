const wallets = [
  { address: "0x123", balance: 2.5 },
  { address: "0x456", balance: 0.8 },
  { address: "0x789", balance: 5.0 }
];


function filterWallets(wallets, callback) {
  const filtered = [];
  for (const wallet of wallets) {
    if (callback(wallet)) {
      filtered.push(wallet);
    }
  }
  return filtered;
}


const result1 = filterWallets(wallets, wallet => wallet.balance >= 2.0);
console.log("Test 1 (balance >= 2.0):", result1);


const result2 = filterWallets([], wallet => wallet.balance >= 2.0);
console.log("Test 2 (empty array):", result2);


const result3 = filterWallets(wallets, wallet => wallet.address.startsWith("0x7"));
console.log("Test 3 (address starts with 0x7):", result3);


const result4 = filterWallets(wallets, wallet => wallet.balance > 100);
console.log("Test 4 (no matches):", result4);