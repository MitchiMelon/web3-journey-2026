let _mockBlock = 19000000;
let _mockBlockStartTime = Date.now();

function mockGetCurrentBlock(): Promise<number> {
  const elapsed = Date.now() - _mockBlockStartTime;
  _mockBlock = 19000000 + Math.floor(elapsed / 400);
  return new Promise((resolve) => {
    setTimeout(() => resolve(_mockBlock), 50);
  });
}

type ConfirmationConfig = {
  txHash: string;
  submittedAtBlock: number;
  requiredConfirmations: number;
  pollIntervalMs: number;
  timeoutMs: number;
};

type ConfirmationReceipt = {
  txHash: string;
  submittedAtBlock: number;
  confirmedAtBlock: number;
  confirmations: number;
  timeToConfirmMs: number;
  pollCount: number;
};

async function waitForConfirmations(
  config: ConfirmationConfig,
): Promise<ConfirmationReceipt> {
  const {
    txHash,
    submittedAtBlock,
    requiredConfirmations,
    pollIntervalMs,
    timeoutMs,
  } = config;
  const startTime = Date.now();
  let pollCount = 0;

  while (true) {
    const currentBlock = await mockGetCurrentBlock();
    pollCount++;
    const confirmations = currentBlock - submittedAtBlock;

    if (confirmations >= requiredConfirmations) {
      return {
        txHash,
        submittedAtBlock,
        confirmedAtBlock: currentBlock,
        confirmations,
        timeToConfirmMs: Date.now() - startTime,
        pollCount,
      };
    }

    if (Date.now() - startTime >= timeoutMs) {
      throw new Error(`Confirmation timeout: ${txHash}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

async function testFriday() {
  console.log("\n=== FRIDAY: Block Confirmation Poller ===");
  _mockBlockStartTime = Date.now();

  try {
    const receipt = await waitForConfirmations({
      txHash: "0xabc123",
      submittedAtBlock: 19000000,
      requiredConfirmations: 3,
      pollIntervalMs: 300,
      timeoutMs: 5000,
    });
    console.log("Confirmed:", receipt);
    console.log("Expected: confirmations >= 3, pollCount >= 3");
  } catch (e) {
    console.error("Unexpected error:", (e as Error).message);
  }

  try {
    await waitForConfirmations({
      txHash: "0xwillTimeout",
      submittedAtBlock: 19999999,
      requiredConfirmations: 100,
      pollIntervalMs: 200,
      timeoutMs: 800,
    });
  } catch (e) {
    console.log("Timeout test:", (e as Error).message);
    console.log("Expected: 'Confirmation timeout: 0xwillTimeout'");
  }
}

testFriday();
