import { runTest1 } from "./challenge-1-basic-promise";
import { runTest2 } from "./challenge-2-basic-async-await";
import { runTest3 } from "./challenge-3-basic-try-catch";
import { runTest4 } from "./challenge-4-sequential-concurrent";
import { runTest5 } from "./challenge-5-promise-allSettled";
import { runTest6 } from "./challenge-6-promise-race";
import { runTest7 } from "./challenge-7-retry-logic";
import { runTest8 } from "./challenge-8-async-hof";
import { runTest9 } from "./challenge-9-async-polling-loop";
import { runTest10 } from "./challenge-10-async-full-pipeline";

async function runAll() {
  console.log("=".repeat(55));
  console.log("  ASYNC FOUNDATIONS — 10 Challenges");
  console.log("  Build up to Weekly Medium Challenges");
  console.log("=".repeat(55));

  const challenges = [
    { name: "Challenge 1: Basic Promise", fn: runTest1 },
    { name: "Challenge 2: async/await", fn: runTest2 },
    { name: "Challenge 3: try/catch", fn: runTest3 },
    { name: "Challenge 4: Sequential vs Concurrent", fn: runTest4 },
    { name: "Challenge 5: Promise.allSettled", fn: runTest5 },
    { name: "Challenge 6: Promise.race + Timeout", fn: runTest6 },
    { name: "Challenge 7: Retry Logic", fn: runTest7 },
    { name: "Challenge 8: Async + HOF", fn: runTest8 },
    { name: "Challenge 9: Async Polling Loop", fn: runTest9 },
    { name: "Challenge 10: Full Pipeline", fn: runTest10 },
  ];

  for (const challenge of challenges) {
    try {
      await challenge.fn();
      console.log(`✅ ${challenge.name} passed\n`);
    } catch (error) {
      console.error(`❌ ${challenge.name} failed:`, error);
    }
  }

  console.log("=".repeat(55));
  console.log("  All 10 challenges complete.");
  console.log("  If #10 passes → start the 7 Medium challenges.");
  console.log("=".repeat(55));
}

runAll().catch(console.error);
