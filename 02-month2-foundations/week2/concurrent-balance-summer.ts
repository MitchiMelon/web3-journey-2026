function fetchBalance(address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 200) + 100;
    setTimeout(() => {
      if (address.startsWith("0x")) {
        resolve(address.length * 100);
      } else {
        reject(new Error(`Invalid address: ${address}`));
      }
    }, delay);
  });
}

async function sumBalances(addresses: string[]): Promise<number> {
  const promises = addresses.map((addr) => fetchBalance(addr));
  const balances = await Promise.all(promises);
  return balances.reduce((total, b) => total + b, 0);
}

function runTests() {
  const testAddresses = ["0xAlice", "0xBob", "0xCarol"];
  const expected = testAddresses.reduce(
    (sum, addr) => sum + addr.length * 100,
    0,
  );

  sumBalances(testAddresses)
    .then((total) => {
      console.log(`Total balance: ${total}`);
      if (total === expected) {
        console.log("✅ Sum of balances is correct");
      } else {
        console.log(`❌ Expected ${expected}, got ${total}`);
      }
      return sumBalances(["bad"]);
    })
    .then(() => {
      console.log("❌ Should have rejected for invalid address");
    })
    .catch((err) => {
      // This catch handles the expected rejection from the bad address test
      if (err.message && err.message.includes("Invalid address")) {
        console.log("✅ Correctly rejected invalid address");
      } else {
        console.log("❌ Test failed:", err.message);
      }
    });
}

runTests();
