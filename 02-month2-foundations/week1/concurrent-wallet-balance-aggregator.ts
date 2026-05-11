interface AggregatedBalance {
  totalBalance: number;
  successCount: number;
  failureCount: number;
  failedWallets: string[];
  timestamp: number;
}

async function fetchWalletBalance(walletAddress: string): Promise<number> {
  if (Math.random() > 0.5) {
    throw new Error(`Failed to fetch balance for ${walletAddress}`);
  }
  return Math.floor(Math.random() * 100) * 1000000000000000000;
}

async function aggregateWalletBalances(
  walletAddresses: string[]
): Promise<AggregatedBalance> {
  // 1. Start all balance fetches concurrently
  const promises = walletAddresses.map(address => fetchWalletBalance(address));

  // 2. Wait for all promises to settle (resolve or reject)
  const results = await Promise.allSettled(promises);

  // 3. Aggregate results without race conditions
  let totalBalance = 0;
  let successCount = 0;
  let failureCount = 0;
  const failedWallets: string[] = [];

  for (let i = 0; i < walletAddresses.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      totalBalance += result.value;    // result.value is the balance number
      successCount++;
    } else {
      failureCount++;
      failedWallets.push(walletAddresses[i]);
    }
  }

  const timestamp = Date.now();

  return {
    totalBalance,
    successCount,
    failureCount,
    failedWallets,
    timestamp
  };
}

async function testHardChallenge1() {
  console.log("\n=== HARD #1: Concurrent Aggregation Test ===\n");

  // Test 1: Multiple wallets
  console.log("--- Test 1: Aggregate 5 wallets ---");
  const wallets1 = [
    "0xAlice",
    "0xBob",
    "0xCharlie",
    "0xDiana",
    "0xEve"
  ];
  const result1 = await aggregateWalletBalances(wallets1);
  console.log("✅ Aggregation complete:");
  console.log(`   Total balance: ${result1.totalBalance}`);
  console.log(`   Success: ${result1.successCount}/${wallets1.length}`);
  console.log(`   Failed wallets: ${result1.failedWallets.join(", ") || "None"}`);

  // Test 2: Single wallet
  console.log("\n--- Test 2: Single wallet ---");
  const result2 = await aggregateWalletBalances(["0xSingleWallet"]);
  console.log(`✅ Result: ${result2.successCount} success, ${result2.failureCount} failure`);

  // Test 3: Empty list
  console.log("\n--- Test 3: Empty wallet list ---");
  const result3 = await aggregateWalletBalances([]);
  console.log(`✅ Result: totalBalance = ${result3.totalBalance}, successCount = ${result3.successCount}`);

  // Test 4: Timing (should be fast due to concurrency)
  console.log("\n--- Test 4: Performance (concurrent vs sequential) ---");
  const testWallets = Array.from({ length: 10 }, (_, i) => `0xWallet${i}`);
  const startTime = Date.now();
  await aggregateWalletBalances(testWallets);
  const elapsed = Date.now() - startTime;
  console.log(`⏱️  10 wallets fetched in ~${elapsed}ms`);
  console.log("Expected: ~1-2 seconds (concurrent)");
  console.log("NOT expected: 10+ seconds (sequential)");
}

testHardChallenge1();