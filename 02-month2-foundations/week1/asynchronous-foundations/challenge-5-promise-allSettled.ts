import { fetchWalletBalance } from "./challenge-1-basic-promise";

async function fetchAllBalances(addresses: string[]): Promise<{
  successful: Array<{ address: string; balance: number }>;
  failed: Array<{ address: string; error: string }>;
  successCount: number;
  failCount: number;
}> {
  const promises = addresses.map((address) => fetchWalletBalance(address));
  const results = await Promise.allSettled(promises);

  const successful: Array<{ address: string; balance: number }> = [];
  const failed: Array<{ address: string; error: string }> = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successful.push({ address: addresses[index], balance: result.value });
    } else {
      failed.push({ address: addresses[index], error: result.reason.message });
    }
  });

  return {
    successful,
    failed,
    successCount: successful.length,
    failCount: failed.length,
  };
}

// TEST 5:
async function runTest5() {
  console.log("\n=== CHALLENGE 5: Promise.allSettled ===");
  const result = await fetchAllBalances([
    "0xAlice",
    "0xBob",
    "0xUnknown1",
    "0xCarol",
    "0xUnknown2",
  ]);
  console.log("Result:", JSON.stringify(result, null, 2));
  console.log(
    result.successCount === 3
      ? "✅ successCount PASS"
      : `❌ successCount FAIL — got ${result.successCount}, expected 3`,
  );
  console.log(
    result.failCount === 2
      ? "✅ failCount PASS"
      : `❌ failCount FAIL — got ${result.failCount}, expected 2`,
  );
  console.log(
    result.successful.every((s) => typeof s.balance === "number")
      ? "✅ balances are numbers PASS"
      : "❌ FAIL",
  );
  console.log(
    result.failed.every((f) => typeof f.error === "string")
      ? "✅ errors are strings PASS"
      : "❌ FAIL",
  );
}
