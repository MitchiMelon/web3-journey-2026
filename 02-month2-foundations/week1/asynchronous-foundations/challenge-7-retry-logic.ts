// MOCK — simulates an unstable RPC node:
let _unstableCallCount = 0;
function unstableWalletFetch(address: string): Promise<number> {
  _unstableCallCount++;
  const count = _unstableCallCount;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Fails first 2 times, succeeds on 3rd
      if (count <= 2) reject(new Error(`RPC error attempt ${count}`));
      else resolve(1500);
    }, 80);
  });
}

async function fetchWithRetry(
  address: string,
  maxAttempts: number,
  delayMs: number,
): Promise<{ balance: number; attempts: number }> {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt++;
    try {
      const balance = await unstableWalletFetch(address);
      return { balance, attempts: attempt };
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(delayMs);
    }
  }
  throw new Error("Unreachable: fetchWithRetry loop did not return or throw");
}

// Helper — sleep function you can use:
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TEST 7:
export async function runTest7() {
  console.log("\n=== CHALLENGE 7: Retry Logic ===");
  _unstableCallCount = 0;

  // Test 1: Succeeds on 3rd attempt
  const result = await fetchWithRetry("0xAlice", 3, 100);
  console.log("Result:", result);
  console.log(result.balance === 1500 ? "✅ balance PASS" : "❌ balance FAIL");
  console.log(
    result.attempts === 3
      ? "✅ attempts PASS"
      : `❌ attempts FAIL — got ${result.attempts}, expected 3`,
  );

  // Test 2: Fails all attempts
  _unstableCallCount = 0;
  try {
    await fetchWithRetry("0xAlice", 2, 50);
    console.log("❌ Should have thrown");
  } catch (e) {
    console.log("All failed:", (e as Error).message);
    console.log("✅ correctly threw after max attempts");
  }
}

runTest7();
