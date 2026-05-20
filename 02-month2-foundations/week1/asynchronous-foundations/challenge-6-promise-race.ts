function fetchWalletBalanceSlow(address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (address === "0xAlice") resolve(1500);
      else reject(new Error("Wallet not found"));
    }, 500);
  });
}

async function fetchWithTimeout(
  address: string,
  timeoutMs: number,
): Promise<number> {
  const timeoutPromise = new Promise<number>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout: " + address)), timeoutMs);
  });
  const fetchPromise = fetchWalletBalanceSlow(address);
  return await Promise.race([fetchPromise, timeoutPromise]);
}

async function fetchBalanceWithFallback(
  address: string,
): Promise<number | null> {
  try {
    const fetch200ms = await fetchWithTimeout(address, 200);
    return fetch200ms;
  } catch (error) {
    try {
      const fetch1000ms = await fetchWithTimeout(address, 1000);
      return fetch1000ms;
    } catch (retryError) {
      return null;
    }
  }
}

// TEST 6:
export async function runTest6() {
  console.log("\n=== CHALLENGE 6: Promise.race + Timeout ===");

  // Test 1: Fast fetch — should succeed before 1000ms timeout
  try {
    const balance = await fetchWithTimeout("0xAlice", 1000);
    console.log("Fast timeout result:", balance);
    console.log(balance === 1500 ? "✅ PASS" : "❌ FAIL");
  } catch (e) {
    console.log("❌ Should not have thrown:", (e as Error).message);
  }

  // Test 2: Slow fetch — 200ms timeout should fire
  try {
    await fetchWithTimeout("0xAlice", 200); // fetchWalletBalanceSlow takes 500ms
    console.log("❌ Should have timed out");
  } catch (e) {
    console.log("Timeout error:", (e as Error).message);
    console.log(
      (e as Error).message.includes("Timeout") ? "✅ timeout PASS" : "❌ FAIL",
    );
  }

  // Test 3: Fallback — 200ms fails, 1000ms succeeds
  const result = await fetchBalanceWithFallback("0xAlice");
  console.log("Fallback result:", result);
  console.log(result === 1500 ? "✅ fallback PASS" : "❌ fallback FAIL");
}

runTest6();
