import { fetchWalletBalance } from "./challenge-1-basic-promise";

export async function safeGetBalance(address: string): Promise<{
  success: boolean;
  balance: number | null;
  address: string;
  error?: string;
}> {
  try {
    const balance = await fetchWalletBalance(address);
    return {
      success: true,
      balance,
      address,
    };
  } catch (error) {
    return {
      success: false,
      balance: null,
      address,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// TEST 3:
async function runTest3() {
  console.log("\n=== CHALLENGE 3: try/catch Error Handling ===");

  const good = await safeGetBalance("0xAlice");
  console.log("Good result:", good);
  console.log(good.success === true ? "✅ success PASS" : "❌ success FAIL");
  console.log(good.balance === 1500 ? "✅ balance PASS" : "❌ balance FAIL");

  const bad = await safeGetBalance("0xUnknown");
  console.log("Bad result:", bad);
  console.log(bad.success === false ? "✅ success PASS" : "❌ success FAIL");
  console.log(
    bad.balance === null ? "✅ balance null PASS" : "❌ balance null FAIL",
  );
  console.log(
    typeof bad.error === "string"
      ? "✅ error string PASS"
      : "❌ error string FAIL",
  );
}

runTest3;
