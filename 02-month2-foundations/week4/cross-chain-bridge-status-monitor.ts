type BridgeTransaction = {
  id: string;
  sourceChain: "ethereum" | "arbitrum" | "base" | "optimism";
  destChain: "ethereum" | "arbitrum" | "base" | "optimism";
  sourceTxHash: string;
  amount: number;
  token: string;
  initiatedAt: number;
  timeoutMs: number;
};

type MonitorConfig = {
  transactions: BridgeTransaction[];
  pollIntervalMs: number;
  maxWaitMs: number;
};

type BridgeStatus =
  | "pending"
  | "source_confirmed"
  | "completed"
  | "failed"
  | "timeout";

type BridgeTxStatus = {
  id: string;
  sourceChain: string;
  destChain: string;
  sourceTxHash: string;
  amount: number;
  token: string;
  initiatedAt: number;
  timeoutMs: number;
  status: BridgeStatus;
  sourceConfirmedAt?: number;
  destTxHash?: string;
  completedAt?: number;
  error?: string;
  elapsedMs: number;
};

type BridgeMonitorReport = {
  totalTransactions: number;
  completed: number;
  failed: number;
  timedOut: number;
  averageCompletionMs: number | null;
  transactions: BridgeTxStatus[];
};

function mockGetSourceStatus(txHash: string): Promise<"pending" | "confirmed"> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.3 ? "confirmed" : "pending");
    }, 100);
  });
}

function mockGetDestStatus(sourceTxHash: string): Promise<{
  status: "pending" | "completed" | "failed";
  destTxHash?: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const r = Math.random();
      if (r > 0.6)
        resolve({
          status: "completed",
          destTxHash: `0x${Math.random().toString(16).slice(2)}`,
        });
      else if (r > 0.1) resolve({ status: "pending" });
      else resolve({ status: "failed" });
    }, 150);
  });
}

async function monitorBridgeTransactions(
  config: MonitorConfig,
): Promise<BridgeMonitorReport> {
  let activeTransactions: BridgeTxStatus[] = config.transactions.map((tx) => ({
    ...tx,
    status: "pending",
    elapsedMs: 0,
  }));
  const sessionStart = Date.now();
  const allTransactions = activeTransactions.slice();

  while (activeTransactions.length > 0) {
    const updated = await Promise.all(
      activeTransactions.map(async (tx) => {
        const [sourceStatus, destResult] = await Promise.all([
          mockGetSourceStatus(tx.sourceTxHash),
          mockGetDestStatus(tx.sourceTxHash),
        ]);
        let newStatus = tx.status;
        let sourceConfirmedAt = tx.sourceConfirmedAt;
        let destTxHash = tx.destTxHash;
        let completedAt = tx.completedAt;
        let error = tx.error;

        if (sourceStatus === "confirmed" && tx.status === "pending") {
          newStatus = "source_confirmed";
          sourceConfirmedAt = Date.now();
        }

        if (destResult.status === "completed") {
          newStatus = "completed";
          completedAt = Date.now();
          destTxHash = destResult.destTxHash;
        } else if (destResult.status === "failed") {
          newStatus = "failed";
          error = "Destination chain reported failure";
        }

        return {
          ...tx,
          status: newStatus,
          elapsedMs: Date.now() - sessionStart,
          sourceConfirmedAt,
          destTxHash,
          completedAt,
          error,
        };
      }),
    );

    for (const updatedTx of updated) {
      const allTx = allTransactions.find((a) => a.id === updatedTx.id);
      if (allTx) Object.assign(allTx, updatedTx);
    }

    activeTransactions = updated.filter(
      (tx) =>
        tx.status !== "completed" &&
        tx.status !== "failed" &&
        tx.status !== "timeout",
    );

    for (const tx of activeTransactions) {
      if (Date.now() - sessionStart > tx.timeoutMs) {
        const allTx = allTransactions.find((a) => a.id === tx.id);
        if (allTx) allTx.status = "timeout";
      }
    }

    activeTransactions = activeTransactions.filter(
      (tx) => Date.now() - sessionStart <= tx.timeoutMs,
    );

    if (Date.now() - sessionStart >= config.maxWaitMs) {
      for (const tx of activeTransactions) {
        const allTx = allTransactions.find((a) => a.id === tx.id);
        if (allTx) allTx.status = "timeout";
      }
      activeTransactions = [];
    }

    if (activeTransactions.length > 0) {
      await new Promise((r) => setTimeout(r, config.pollIntervalMs));
    }
  }

  const completed = allTransactions.filter(
    (tx) => tx.status === "completed",
  ).length;
  const failed = allTransactions.filter((tx) => tx.status === "failed").length;
  const timedOut = allTransactions.filter(
    (tx) => tx.status === "timeout",
  ).length;
  const completedTxs = allTransactions.filter(
    (tx) => tx.status === "completed" && tx.completedAt && tx.initiatedAt,
  );
  const averageCompletionMs =
    completedTxs.length > 0
      ? completedTxs.reduce(
          (sum, tx) => sum + ((tx.completedAt as number) - tx.initiatedAt),
          0,
        ) / completedTxs.length
      : null;

  return {
    totalTransactions: allTransactions.length,
    completed,
    failed,
    timedOut,
    averageCompletionMs,
    transactions: allTransactions,
  };
}

async function test() {
  const config: MonitorConfig = {
    transactions: [
      {
        id: "tx1",
        sourceChain: "ethereum",
        destChain: "arbitrum",
        sourceTxHash: "0xabc",
        amount: 500,
        token: "USDC",
        initiatedAt: Date.now(),
        timeoutMs: 5000,
      },
      {
        id: "tx2",
        sourceChain: "ethereum",
        destChain: "base",
        sourceTxHash: "0xdef",
        amount: 200,
        token: "ETH",
        initiatedAt: Date.now(),
        timeoutMs: 3000,
      },
      {
        id: "tx3",
        sourceChain: "arbitrum",
        destChain: "optimism",
        sourceTxHash: "0xghi",
        amount: 1000,
        token: "DAI",
        initiatedAt: Date.now(),
        timeoutMs: 8000,
      },
    ],
    pollIntervalMs: 500,
    maxWaitMs: 10000,
  };

  const report = await monitorBridgeTransactions(config);
  console.log(
    "Report:",
    JSON.stringify(
      report,
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2,
    ),
  );
  console.log("Completed:", report.completed);
  console.log("Failed:", report.failed);
  console.log("Timed out:", report.timedOut);
}

test();
