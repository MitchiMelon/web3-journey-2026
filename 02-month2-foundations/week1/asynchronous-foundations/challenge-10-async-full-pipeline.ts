import { fetchWalletBalance } from "./challenge-1-basic-promise";
import { fetchAllBalances } from "./challenge-5-promise-allSettled";

// MOCK:
let _networkReadyCount = 0;
function waitForNetworkReady(): Promise<boolean> {
  _networkReadyCount++;
  return new Promise((resolve) => {
    setTimeout(() => {
      // Returns true after 3 calls
      resolve(_networkReadyCount >= 3);
    }, 100);
  });
}

type WalletReport = {
  addresses: string[];
  balances: Array<{
    address: string;
    balance: number | null;
    source: "first_attempt" | "retry" | "failed";
  }>;
  totalBalance: number;
  successCount: number;
  failCount: number;
  networkReady: boolean;
  networkWarning?: string;
  reportGeneratedAt: number;
};

async function fetchWalletReport(addresses: string[]): Promise<WalletReport> {
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  // Step 1 — First attempt with 400ms timeout
  const promises = addresses.map(async (address) => {
    const timeout = new Promise<number>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 400),
    );
    return Promise.race([fetchWalletBalance(address), timeout]);
  });
  const results = await Promise.allSettled(promises);

  const balances: WalletReport["balances"] = [];
  const failedAddresses: string[] = [];

  results.forEach((result, index) => {
    const address = addresses[index];
    if (result.status === "fulfilled") {
      balances.push({
        address,
        balance: result.value,
        source: "first_attempt",
      });
    } else {
      balances.push({ address, balance: null, source: "first_attempt" });
      failedAddresses.push(address);
    }
  });

  // Step 2 — Retry failed addresses once after 200ms
  await sleep(200);
  for (const address of failedAddresses) {
    try {
      const balance = await fetchWalletBalance(address);
      const entry = balances.find((b) => b.address === address);
      if (entry) {
        entry.balance = balance;
        entry.source = "retry";
      }
    } catch {
      const entry = balances.find((b) => b.address === address);
      if (entry) {
        entry.source = "failed"; // balance stays null
      }
    }
  }

  // Step 3 — Poll network readiness
  let networkReady = false;
  let networkWarning: string | undefined;
  const pollStart = Date.now();
  const pollIntervalMs = 200;
  const pollTimeoutMs = 2000;

  while (true) {
    const ready = await waitForNetworkReady();
    if (ready) {
      networkReady = true;
      break;
    }
    if (Date.now() - pollStart >= pollTimeoutMs) {
      networkReady = false;
      networkWarning = `Network did not become ready within ${pollTimeoutMs}ms`;
      break;
    }
    await sleep(pollIntervalMs);
  }

  // Step 4 — Build report
  const successBalances = balances.filter((b) => b.balance !== null);
  const totalBalance = successBalances.reduce(
    (sum, b) => sum + (b.balance as number),
    0,
  );
  const successCount = successBalances.length;
  const failCount = balances.length - successCount;

  return {
    addresses,
    balances,
    totalBalance,
    successCount,
    failCount,
    networkReady,
    networkWarning,
    reportGeneratedAt: Date.now(),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TEST 10:
export async function runTest10() {
  console.log("\n=== CHALLENGE 10: Full Pipeline ===");
  _networkReadyCount = 0;

  const report = await fetchWalletReport([
    "0xAlice",
    "0xBob",
    "0xCarol",
    "0xUnknown",
  ]);
  console.log("Report:", JSON.stringify(report, null, 2));

  console.log(
    report.addresses.length === 4 ? "✅ addresses PASS" : "❌ addresses FAIL",
  );
  console.log(
    report.balances.length === 4
      ? "✅ balances length PASS"
      : "❌ balances FAIL",
  );
  console.log(
    report.totalBalance === 4500
      ? "✅ totalBalance PASS"
      : `❌ totalBalance FAIL — got ${report.totalBalance}`,
  );
  console.log(
    report.successCount === 3
      ? "✅ successCount PASS"
      : `❌ successCount FAIL — got ${report.successCount}`,
  );
  console.log(
    report.failCount === 1
      ? "✅ failCount PASS"
      : `❌ failCount FAIL — got ${report.failCount}`,
  );
  console.log(
    typeof report.networkReady === "boolean"
      ? "✅ networkReady PASS"
      : "❌ networkReady FAIL",
  );
  console.log(
    report.reportGeneratedAt > 0 ? "✅ timestamp PASS" : "❌ timestamp FAIL",
  );

  // Verify source tracking
  const unknownEntry = report.balances.find((b) => b.address === "0xUnknown");
  console.log(
    unknownEntry?.source === "failed"
      ? "✅ failed source PASS"
      : "❌ failed source FAIL",
  );

  const aliceEntry = report.balances.find((b) => b.address === "0xAlice");
  console.log(
    aliceEntry?.source === "first_attempt"
      ? "✅ first_attempt source PASS"
      : "❌ first_attempt source FAIL",
  );
}

runTest10();
