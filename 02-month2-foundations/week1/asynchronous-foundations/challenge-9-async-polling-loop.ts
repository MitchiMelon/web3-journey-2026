// MOCK — simulates a transaction confirming after a few polls:
let _txPollCount: Record<string, number> = {};
function checkTxStatus(
  hash: string,
): Promise<"pending" | "confirmed" | "failed"> {
  _txPollCount[hash] = (_txPollCount[hash] ?? 0) + 1;
  const count = _txPollCount[hash];
  return new Promise((resolve) => {
    setTimeout(() => {
      if (hash === "0xfail") resolve(count >= 3 ? "failed" : "pending");
      else resolve(count >= 4 ? "confirmed" : "pending");
    }, 80);
  });
}

async function waitForTransaction(
  hash: string,
  pollIntervalMs: number,
  timeoutMs: number,
): Promise<{
  hash: string;
  status: string;
  pollCount: number;
  elapsedMs: number;
}> {
  const startTime = Date.now();
  let pollCount = 0;
  while (true) {
    const checkConfirmation = await checkTxStatus(hash);
    pollCount++;
    if (checkConfirmation !== "pending") {
      return {
        hash,
        status: checkConfirmation,
        pollCount,
        elapsedMs: Date.now() - startTime,
      };
    }
    if (Date.now() - startTime >= timeoutMs) {
      throw new Error(`Polling timeout: ${hash}`);
    }
    await sleep(pollIntervalMs);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TEST 9:
async function runTest9() {
  console.log("\n=== CHALLENGE 9: Async Polling Loop ===");
  _txPollCount = {};

  // Test 1: Confirms after 4 polls
  const receipt = await waitForTransaction("0xabc", 150, 3000);
  console.log("Receipt:", receipt);
  console.log(
    receipt.status === "confirmed"
      ? "✅ status PASS"
      : `❌ status FAIL — got ${receipt.status}`,
  );
  console.log(
    receipt.pollCount === 4
      ? "✅ pollCount PASS"
      : `❌ pollCount FAIL — got ${receipt.pollCount}, expected 4`,
  );

  // Test 2: Fails after 3 polls
  _txPollCount = {};
  const failReceipt = await waitForTransaction("0xfail", 150, 3000);
  console.log("Fail receipt:", failReceipt);
  console.log(
    failReceipt.status === "failed"
      ? "✅ failed status PASS"
      : `❌ FAIL — got ${failReceipt.status}`,
  );

  // Test 3: Timeout fires
  _txPollCount = {};
  try {
    await waitForTransaction("0xtimeout", 200, 300);
    console.log("❌ Should have timed out");
  } catch (e) {
    console.log("Timeout:", (e as Error).message);
    console.log(
      (e as Error).message.includes("0xtimeout")
        ? "✅ timeout PASS"
        : "❌ FAIL",
    );
  }
}

runTest9();
