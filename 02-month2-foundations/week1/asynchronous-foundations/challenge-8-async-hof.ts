import { fetchAllBalances } from "./challenge-5-promise-allSettled";

type PortfolioStats = {
  totalBalance: number;
  averageBalance: number;
  richestWallet: string | null;
  walletsAbove1000: string[];
  fetchedCount: number;
  failedCount: number;
};

async function getPortfolioStats(addresses: string[]): Promise<PortfolioStats> {
  const { successful, successCount, failCount } =
    await fetchAllBalances(addresses);
  const totalBalance = successful.reduce((acc, curr) => {
    return acc + curr.balance;
  }, 0);
  const averageBalance =
    successful.length > 0
      ? Math.round((totalBalance / successful.length) * 100) / 100
      : 0;
  const richestWallet = successful.reduce<{
    address: string | null;
    balance: number;
  }>(
    (best, current) => {
      if (current.balance > best.balance) {
        return { address: current.address, balance: current.balance };
      } else {
        return best;
      }
    },
    { address: null as string | null, balance: -Infinity },
  ).address;
  const walletsAbove1000 = successful
    .filter((value) => value.balance > 1000)
    .map((wallet) => wallet.address);

  return {
    totalBalance,
    averageBalance,
    richestWallet,
    walletsAbove1000,
    fetchedCount: successCount,
    failedCount: failCount,
  };
}

// TEST 8:
async function runTest8() {
  console.log("\n=== CHALLENGE 8: Async + HOF ===");
  const stats = await getPortfolioStats([
    "0xAlice", // 1500
    "0xBob", // 800
    "0xCarol", // 2200
    "0xUnknown", // fails
  ]);
  console.log("Stats:", JSON.stringify(stats, null, 2));
  console.log(
    stats.totalBalance === 4500
      ? "✅ totalBalance PASS"
      : `❌ totalBalance FAIL — got ${stats.totalBalance}, expected 4500`,
  );
  console.log(
    stats.averageBalance === 1500
      ? "✅ averageBalance PASS"
      : `❌ averageBalance FAIL — got ${stats.averageBalance}, expected 1500`,
  );
  console.log(
    stats.richestWallet === "0xCarol"
      ? "✅ richestWallet PASS"
      : `❌ richestWallet FAIL — expected 0xCarol`,
  );
  console.log(
    stats.walletsAbove1000.length === 2
      ? "✅ walletsAbove1000 PASS"
      : `❌ walletsAbove1000 FAIL — expected 2`,
  );
  console.log(
    stats.fetchedCount === 3
      ? "✅ fetchedCount PASS"
      : `❌ fetchedCount FAIL — expected 3`,
  );
  console.log(
    stats.failedCount === 1
      ? "✅ failedCount PASS"
      : `❌ failedCount FAIL — expected 1`,
  );
}

runTest8();
