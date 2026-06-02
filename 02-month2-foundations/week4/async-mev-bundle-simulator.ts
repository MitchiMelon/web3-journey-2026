type BundleTransaction = {
  id: string;
  type: "swap" | "liquidation" | "arbitrage" | "transfer";
  from: string;
  to: string;
  value: number;
  gasLimit: number;
  dependsOnPreviousOutput?: boolean;
};

type BundleConfig = {
  blockNumber: number;
  maxGasPerBundle: number;
  transactions: BundleTransaction[];
  minerTip: number;
};

type TransactionSimResult = {
  id: string;
  type: string;
  gasUsed: number;
  profit: number;
  reverted: boolean;
  revertReason?: string;
  output: number;
};

type BundleSimulationResult = {
  blockNumber: number;
  status: "success" | "partial_revert" | "full_revert" | "gas_exceeded";
  transactions: TransactionSimResult[];
  totalGasUsed: number;
  totalProfit: number;
  netProfit: number;
  worthSubmitting: boolean;
  simulatedAt: number;
};

function mockSimulateTransaction(
  tx: BundleTransaction,
  inputValue?: number,
): Promise<{
  gasUsed: number;
  profit: number;
  output: number;
  reverted: boolean;
  revertReason?: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const gasUsed = Math.floor(tx.gasLimit * (0.5 + Math.random() * 0.4));
      const reverted = Math.random() < 0.15;
      resolve({
        gasUsed,
        reverted,
        revertReason: reverted ? "Slippage tolerance exceeded" : undefined,
        profit: reverted ? 0 : Math.floor(Math.random() * 50000) - 10000,
        output: inputValue
          ? inputValue * (0.98 + Math.random() * 0.04)
          : tx.value,
      });
    }, 100);
  });
}

async function simulateMEVBundle(
  config: BundleConfig,
): Promise<BundleSimulationResult> {
  const { blockNumber, maxGasPerBundle, transactions, minerTip } = config;
  const results: TransactionSimResult[] = [];
  let totalGasUsed = 0;
  let totalProfit = 0;
  let previousOutput: number | undefined = undefined;
  let status: BundleSimulationResult["status"] = "success";

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    const inputValue = tx.dependsOnPreviousOutput ? previousOutput : undefined;
    const simResult = await mockSimulateTransaction(tx, inputValue);

    totalGasUsed += simResult.gasUsed;
    totalProfit += simResult.profit;
    previousOutput = simResult.output;

    results.push({
      id: tx.id,
      type: tx.type,
      gasUsed: simResult.gasUsed,
      profit: simResult.profit,
      reverted: simResult.reverted,
      revertReason: simResult.revertReason,
      output: simResult.output,
    });

    if (totalGasUsed > maxGasPerBundle) {
      status = "gas_exceeded";
      break;
    }

    if (simResult.reverted) {
      const nextTx = transactions[i + 1];
      if (nextTx && nextTx.dependsOnPreviousOutput) {
        status = "full_revert";
        break;
      } else {
        if (status === "success") {
          status = "partial_revert";
        }
      }
    }
  }

  const netProfit = totalProfit - minerTip;
  const worthSubmitting = netProfit > 0 && status === "success";

  return {
    blockNumber,
    status,
    transactions: results,
    totalGasUsed,
    totalProfit,
    netProfit,
    worthSubmitting,
    simulatedAt: Date.now(),
  };
}

async function test() {
  const config: BundleConfig = {
    blockNumber: 19000000,
    maxGasPerBundle: 500000,
    transactions: [
      {
        id: "tx1",
        type: "swap",
        from: "0xAlice",
        to: "0xUniswap",
        value: 1000000,
        gasLimit: 150000,
      },
      {
        id: "tx2",
        type: "liquidation",
        from: "0xBob",
        to: "0xAave",
        value: 0,
        gasLimit: 200000,
        dependsOnPreviousOutput: true,
      },
      {
        id: "tx3",
        type: "arbitrage",
        from: "0xCarol",
        to: "0xCurve",
        value: 0,
        gasLimit: 180000,
        dependsOnPreviousOutput: true,
      },
      {
        id: "tx4",
        type: "transfer",
        from: "0xAlice",
        to: "0xDiana",
        value: 500,
        gasLimit: 21000,
      },
    ],
    minerTip: 5000,
  };

  const result = await simulateMEVBundle(config);
  console.log(JSON.stringify(result, null, 2));
  console.log("Status:", result.status);
  console.log("Net profit:", result.netProfit);
  console.log("Worth submitting:", result.worthSubmitting);
}

test();
