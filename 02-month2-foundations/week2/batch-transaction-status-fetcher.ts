let _txCallCounts: Record<string, number> = {};

function mockGetTxStatus(
  hash: string,
): Promise<{ status: "pending" | "confirmed" | "failed"; timestamp?: number }> {
  const outcomes: Record<
    string,
    { status: "pending" | "confirmed" | "failed"; failTimes: number }
  > = {
    "0xaaa": { status: "confirmed", failTimes: 0 },
    "0xbbb": { status: "pending", failTimes: 0 },
    "0xccc": { status: "confirmed", failTimes: 2 },
    "0xddd": { status: "failed", failTimes: 0 },
    "0xeee": { status: "confirmed", failTimes: 99 },
  };
  const cfg = outcomes[hash] ?? { status: "confirmed", failTimes: 0 };
  _txCallCounts[hash] = (_txCallCounts[hash] ?? 0) + 1;
  const callCount = _txCallCounts[hash];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (callCount <= cfg.failTimes) {
        reject(new Error(`RPC error: temporary failure for ${hash}`));
      } else {
        resolve({
          status: cfg.status,
          timestamp: cfg.status === "confirmed" ? Date.now() : undefined,
        });
      }
    }, 80);
  });
}

type StatusQuery = {
  hashes: string[];
  maxRetries: number;
  retryDelayMs: number;
};

type TxStatus = "pending" | "confirmed" | "failed";

type TxResult = {
  hash: string;
  status: TxStatus | "error";
  attempts: number;
  confirmedAt?: number;
  error?: string;
};

type StatusReport = {
  total: number;
  confirmed: number;
  pending: number;
  failed: number;
  errors: number;
  results: TxResult[];
  fetchedAt: number;
};

async function fetchTransactionStatuses(
  query: StatusQuery,
): Promise<StatusReport> {
  const { hashes, maxRetries, retryDelayMs } = query;
  const results: TxResult[] = hashes.map((hash) => ({
    hash,
    status: "error",
    attempts: 0,
    error: undefined,
    confirmedAt: undefined,
  }));
  let retryHashes = [...hashes];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (retryHashes.length === 0) break;
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
    const currentBatch = [...retryHashes];
    const settled = await Promise.allSettled(
      currentBatch.map((h) => mockGetTxStatus(h)),
    );
    retryHashes = [];
    settled.forEach((result, index) => {
      const hash = currentBatch[index];
      const entry = results.find((r) => r.hash === hash)!;
      if (result.status === "fulfilled") {
        entry.status = result.value.status;
        entry.attempts = attempt;
        if (result.value.timestamp) {
          entry.confirmedAt = result.value.timestamp;
        }
      } else {
        if (attempt < maxRetries) {
          retryHashes.push(hash);
        } else {
          entry.status = "error";
          entry.attempts = maxRetries;
          entry.error = result.reason.message;
        }
      }
    });
  }

  const confirmed = results.filter((r) => r.status === "confirmed").length;
  const pending = results.filter((r) => r.status === "pending").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const errors = results.filter((r) => r.status === "error").length;

  return {
    total: hashes.length,
    confirmed,
    pending,
    failed,
    errors,
    results,
    fetchedAt: Date.now(),
  };
}

async function testTuesday() {
  console.log("\n=== TUESDAY: Batch Transaction Status Fetcher with Retry ===");
  _txCallCounts = {};
  const report = await fetchTransactionStatuses({
    hashes: ["0xaaa", "0xbbb", "0xccc", "0xddd", "0xeee"],
    maxRetries: 3,
    retryDelayMs: 100,
  });
  console.log("Report:", JSON.stringify(report, null, 2));
  console.log(
    "Expected: 0xaaa=confirmed(1), 0xbbb=pending(1), 0xccc=confirmed(3), 0xddd=failed(1), 0xeee=error(3)",
  );
}

testTuesday();
