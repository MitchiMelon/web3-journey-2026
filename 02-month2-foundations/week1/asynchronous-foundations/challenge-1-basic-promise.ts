export function fetchWalletBalance(walletAddress: string): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (walletAddress === "0xAlice") {
        resolve(1500);
      } else if (walletAddress === "0xBob") {
        resolve(800);
      } else if (walletAddress === "0xCarol") {
        resolve(2200);
      } else {
        reject(new Error("Wallet not found"));
      }
    }, 300);
  });
}

// TEST 1:
async function runTest1() {
  console.log("\n=== CHALLENGE 1: Create Your First Promise ===");

  // Test known wallet
  fetchWalletBalance("0xAlice").then((balance) => {
    console.log("Alice balance:", balance);
    console.log(balance === 1500 ? "✅ PASS" : "❌ FAIL — expected 1500");
  });

  fetchWalletBalance("0xBob").then((balance) => {
    console.log("Bob balance:", balance);
    console.log(balance === 800 ? "✅ PASS" : "❌ FAIL — expected 800");
  });

  // Test unknown wallet
  fetchWalletBalance("0xUnknown").catch((error) => {
    console.log("Unknown wallet error:", error.message);
    console.log(error.message === "Wallet not found" ? "✅ PASS" : "❌ FAIL");
  });

  // Wait for all to complete
  await new Promise((r) => setTimeout(r, 500));
}
runTest1();
