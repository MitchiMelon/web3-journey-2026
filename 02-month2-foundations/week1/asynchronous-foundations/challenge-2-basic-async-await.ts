import { fetchWalletBalance } from "./challenge-1-basic-promise";

async function getBalanceSummary(): Promise<{
  alice: number;
  bob: number;
  total: number;
}> {
  const aliceBalance = await fetchWalletBalance("0xAlice");
  const bobBalance = await fetchWalletBalance("0xBob");
  return {
    alice: aliceBalance,
    bob: bobBalance,
    total: aliceBalance + bobBalance,
  };
}

// TEST 2:
export async function runTest2() {
  console.log("\n=== CHALLENGE 2: async/await Basics ===");
  const summary = await getBalanceSummary();
  console.log("Summary:", summary);
  console.log(summary.alice === 1500 ? "✅ alice PASS" : "❌ alice FAIL");
  console.log(summary.bob === 800 ? "✅ bob PASS" : "❌ bob FAIL");
  console.log(
    summary.total === 2300 ? "✅ total PASS" : "❌ total FAIL — expected 2300",
  );
}
runTest2();
