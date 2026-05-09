interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  gasPrice: number;
  blockNumber: number;
  status: "success" | "failed";
}

// Mock blockchain API (DO NOT MODIFY)
async function fetchFromBlockchainAPI(txHash: string): Promise<Transaction> {
  // Simulates API calls that sometimes fail
  const randomFailure = Math.random() > 0.6; // 40% success rate
  
  if (randomFailure) {
    const errors = [
      new Error("Rate limit exceeded"),
      new Error("Connection timeout"),
      new Error("Server error: 502 Bad Gateway"),
      new Error("Network unreachable")
    ];
    throw errors[Math.floor(Math.random() * errors.length)];
  }

  return {
    hash: txHash,
    from: "0xAlice",
    to: "0xBob",
    value: 1000000000000000000,
    gasPrice: 20000000000,
    blockNumber: 18500000,
    status: "success"
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTransactionWithRetry(
  txHash: string,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<Transaction> {
  let attempt = 0;
  let currentDelay = initialDelayMs;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const result = await fetchFromBlockchainAPI(txHash);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`Attempt ${attempt}/${maxRetries} failed at ${new Date().toISOString()} — ${message}`);
      if (attempt === maxRetries) {
        throw new Error(`Failed to fetch transaction ${txHash} after ${attempt} attempts`);
      }
      await sleep(currentDelay);
      currentDelay *= 2;
    }
  }
  throw new Error("Unreachable");
}

async function testMediumChallenge() {
  console.log("\n=== MEDIUM CHALLENGE: Retry Logic Test ===\n");

  // Test 1: Successful fetch (may need retries)
  console.log("--- Test 1: Fetch with automatic retry ---");
  try {
    const tx = await fetchTransactionWithRetry("0xabc123");
    console.log("✅ Transaction fetched:", tx.hash);
  } catch (error: any) {
    console.log("❌ Failed:", error.message);
  }

  // Test 2: Custom max retries
  console.log("\n--- Test 2: Custom max retries (5 attempts) ---");
  try {
    const tx = await fetchTransactionWithRetry("0xdef456", 5, 500);
    console.log("✅ Transaction fetched:", tx.hash);
  } catch (error: any) {
    console.log("❌ Failed:", error.message);
  }

  // Test 3: Very limited retries
  console.log("\n--- Test 3: Limited retries (1 attempt) ---");
  try {
    const tx = await fetchTransactionWithRetry("0xghi789", 1, 100);
    console.log("✅ Transaction fetched:", tx.hash);
  } catch (error: any) {
    console.log("❌ Failed (expected):", error.message);
  }

  // Test 4: Verify timing (exponential backoff)
  console.log("\n--- Test 4: Exponential backoff timing ---");
  const startTime = Date.now();
  try {
    await fetchTransactionWithRetry("0xjkl012", 3, 100);
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.log(`⏱️  Total time: ${elapsed}ms`);
    console.log("Expected: ~700ms (100 + 200 + 400)");
  }
}

testMediumChallenge();