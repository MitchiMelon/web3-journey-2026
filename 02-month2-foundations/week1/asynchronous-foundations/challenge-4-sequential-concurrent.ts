import { safeGetBalance } from "./challenge-3-basic-try-catch";

async function fetchBalancesSequential(
  addresses: string[],
): Promise<Array<{ address: string; balance: number | null }>> {
  const results: Array<{ address: string; balance: number | null }> = [];
  for (const address of addresses) {
    const { balance } = await safeGetBalance(address);
    results.push({ address, balance });
  }
  return results;
}

async function fetchBalancesConcurrent(
  addresses: string[],
): Promise<Array<{ address: string; balance: number | null }>> {
  const promises = addresses.map(async (address) => {
    const { balance } = await safeGetBalance(address);
    return { address, balance };
  });
  return Promise.all(promises);
}

// TEST 4:
async function runTest4() {
  console.log("\n=== CHALLENGE 4: Sequential vs Concurrent ===");
  const addresses = ["0xAlice", "0xBob", "0xCarol", "0xUnknown"];

  const t1 = Date.now();
  const sequential = await fetchBalancesSequential(addresses);
  const seqTime = Date.now() - t1;

  const t2 = Date.now();
  const concurrent = await fetchBalancesConcurrent(addresses);
  const conTime = Date.now() - t2;

  console.log("Sequential results:", sequential);
  console.log("Concurrent results:", concurrent);
  console.log(`Sequential time: ${seqTime}ms`);
  console.log(`Concurrent time: ${conTime}ms`);
  console.log(
    seqTime > conTime
      ? "✅ Concurrent was faster PASS"
      : "❌ Concurrent should be faster FAIL",
  );
  console.log(sequential.length === 4 ? "✅ length PASS" : "❌ length FAIL");
  console.log(
    concurrent.length === 4
      ? "✅ concurrent length PASS"
      : "❌ concurrent length FAIL",
  );

  const sameData = sequential.every(
    (s, i) =>
      s.address === concurrent[i].address &&
      s.balance === concurrent[i].balance,
  );
  console.log(sameData ? "✅ Same data PASS" : "❌ Same data FAIL");
}

runTest4();
