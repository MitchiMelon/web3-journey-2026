/**
 * ============================================================
 * ASYNC FOUNDATION CHALLENGES — 10 Steps
 * "Bridge" set before the 7 Medium Weekly Challenges
 * ============================================================
 * PURPOSE:
 * You struggled with the medium challenges because they
 * combined 3-4 async concepts at once. This set introduces
 * ONE concept at a time, then slowly combines them.
 * Complete all 10 here → medium challenges will feel doable.
 *
 * CONCEPT PROGRESSION:
 * #1  — What is a Promise? Create one manually
 * #2  — async/await basics — consume a Promise
 * #3  — try/catch — handle errors in async code
 * #4  — Multiple awaits — sequential execution
 * #5  — Promise.all — concurrent execution
 * #6  — Promise.allSettled — concurrent with failures
 * #7  — Timeout pattern — Promise.race
 * #8  — Retry logic — loops + async
 * #9  — Async + data transformation — HOF inside async
 * #10 — Combined: retry + timeout + data — bridge to medium
 *
 * RULES:
 * 1. Write pseudocode FIRST before touching the function body
 * 2. AI only to explain error messages — never to write code
 * 3. Run: npx ts-node async-foundations.ts
 * 4. Each challenge has its own test — run and verify
 * ============================================================
 */

// ============================================================
// CHALLENGE 1 — EASY (2/10)
// "Create Your First Promise"
// ============================================================
//
// CONCEPT: What a Promise IS and how to create one manually.
// Before you can use async/await, you need to understand
// what you are actually awaiting.
//
// REAL-WORLD CONTEXT:
// Every mock function in your weekly challenges returns a
// Promise manually constructed with new Promise(). This is
// how those mock functions work internally.
//
// PROBLEM:
// Create a function `fetchWalletBalance` that takes a wallet
// address (string) and returns a Promise. The Promise should:
// - Resolve with a number (the balance) after 300ms
// - Use these hardcoded balances:
//   "0xAlice" → 1500
//   "0xBob"   → 800
//   "0xCarol" → 2200
// - Reject with Error("Wallet not found") for any other address
//
// INPUT:  walletAddress: string
// OUTPUT: Promise<number>
//
// PSEUDOCODE SPACE:
//
//
//

function fetchWalletBalance(walletAddress: string): Promise<number> {
  // YOUR CODE HERE
  return new Promise((resolve, reject) => {

  })
}

// TEST 1:
async function runTest1() {
  console.log("\n=== CHALLENGE 1: Create Your First Promise ===")

  // Test known wallet
  fetchWalletBalance("0xAlice").then((balance) => {
    console.log("Alice balance:", balance)
    console.log(balance === 1500 ? "✅ PASS" : "❌ FAIL — expected 1500")
  })

  fetchWalletBalance("0xBob").then((balance) => {
    console.log("Bob balance:", balance)
    console.log(balance === 800 ? "✅ PASS" : "❌ FAIL — expected 800")
  })

  // Test unknown wallet
  fetchWalletBalance("0xUnknown").catch((error) => {
    console.log("Unknown wallet error:", error.message)
    console.log(error.message === "Wallet not found" ? "✅ PASS" : "❌ FAIL")
  })

  // Wait for all to complete
  await new Promise(r => setTimeout(r, 500))
}


// ============================================================
// CHALLENGE 2 — EASY (2.5/10)
// "Consume a Promise with async/await"
// ============================================================
//
// CONCEPT: async/await syntax — the cleaner way to consume
// a Promise without .then() chains.
//
// REAL-WORLD CONTEXT:
// Every function in your weekly challenges uses async/await
// to call mock functions. This builds that exact habit.
//
// PROBLEM:
// Write an async function `getBalanceSummary` that:
// 1. Awaits fetchWalletBalance for "0xAlice"
// 2. Awaits fetchWalletBalance for "0xBob"
// 3. Returns an object with both balances and their total
//
// Use the fetchWalletBalance function from Challenge 1.
// Do NOT use .then() — use async/await only.
//
// INPUT:  none
// OUTPUT: Promise<{ alice: number, bob: number, total: number }>
//
// PSEUDOCODE SPACE:
//
//
//

async function getBalanceSummary(): Promise<{
  alice: number
  bob: number
  total: number
}> {
  // YOUR CODE HERE
}

// TEST 2:
async function runTest2() {
  console.log("\n=== CHALLENGE 2: async/await Basics ===")
  const summary = await getBalanceSummary()
  console.log("Summary:", summary)
  console.log(summary.alice === 1500 ? "✅ alice PASS" : "❌ alice FAIL")
  console.log(summary.bob === 800 ? "✅ bob PASS" : "❌ bob FAIL")
  console.log(summary.total === 2300 ? "✅ total PASS" : "❌ total FAIL — expected 2300")
}


// ============================================================
// CHALLENGE 3 — EASY (3/10)
// "Handle Errors with try/catch"
// ============================================================
//
// CONCEPT: try/catch inside async functions — the correct
// way to handle Promise rejections.
//
// REAL-WORLD CONTEXT:
// Every RPC call can fail. Your checkRPCHealth challenge
// used try/catch inside each node check. This builds
// the exact pattern you used there.
//
// PROBLEM:
// Write an async function `safeGetBalance` that:
// 1. Tries to fetch the balance for any wallet address
// 2. If successful — returns { success: true, balance: number, address: string }
// 3. If it fails — does NOT crash. Returns:
//    { success: false, balance: null, address: string, error: string }
//
// Use fetchWalletBalance from Challenge 1.
//
// INPUT:  address: string
// OUTPUT: Promise<{ success: boolean, balance: number | null,
//                   address: string, error?: string }>
//
// PSEUDOCODE SPACE:
//
//
//

async function safeGetBalance(address: string): Promise<{
  success: boolean
  balance: number | null
  address: string
  error?: string
}> {
  // YOUR CODE HERE
}

// TEST 3:
async function runTest3() {
  console.log("\n=== CHALLENGE 3: try/catch Error Handling ===")

  const good = await safeGetBalance("0xAlice")
  console.log("Good result:", good)
  console.log(good.success === true ? "✅ success PASS" : "❌ success FAIL")
  console.log(good.balance === 1500 ? "✅ balance PASS" : "❌ balance FAIL")

  const bad = await safeGetBalance("0xUnknown")
  console.log("Bad result:", bad)
  console.log(bad.success === false ? "✅ success PASS" : "❌ success FAIL")
  console.log(bad.balance === null ? "✅ balance null PASS" : "❌ balance null FAIL")
  console.log(typeof bad.error === "string" ? "✅ error string PASS" : "❌ error string FAIL")
}


// ============================================================
// CHALLENGE 4 — EASY (3.5/10)
// "Sequential vs Concurrent — Feel the Difference"
// ============================================================
//
// CONCEPT: The difference between awaiting sequentially
// (one after another) vs concurrently (all at once).
// This is the most important timing concept in async code.
//
// REAL-WORLD CONTEXT:
// Your Wednesday medium challenge processes blocks
// SEQUENTIALLY. Your Monday medium challenge queries
// CONCURRENTLY. If you mix these up your backend is either
// slow or produces wrong results.
//
// PROBLEM:
// Write TWO functions:
//
// 1. `fetchBalancesSequential(addresses: string[])`:
//    Fetch each balance ONE AT A TIME (await each before next)
//    Returns array of results in same order as input
//
// 2. `fetchBalancesConcurrent(addresses: string[])`:
//    Fetch ALL balances AT THE SAME TIME
//    Returns array of results in same order as input
//
// Both return: Promise<Array<{ address: string, balance: number | null }>>
// Both use safeGetBalance from Challenge 3.
//
// Then measure and print the time difference.
//
// PSEUDOCODE SPACE:
//
//
//

async function fetchBalancesSequential(
  addresses: string[]
): Promise<Array<{ address: string; balance: number | null }>> {
  // YOUR CODE HERE — use a for...of loop with await inside
}

async function fetchBalancesConcurrent(
  addresses: string[]
): Promise<Array<{ address: string; balance: number | null }>> {
  // YOUR CODE HERE — use Promise.all with .map
}

// TEST 4:
async function runTest4() {
  console.log("\n=== CHALLENGE 4: Sequential vs Concurrent ===")
  const addresses = ["0xAlice", "0xBob", "0xCarol", "0xUnknown"]

  const t1 = Date.now()
  const sequential = await fetchBalancesSequential(addresses)
  const seqTime = Date.now() - t1

  const t2 = Date.now()
  const concurrent = await fetchBalancesConcurrent(addresses)
  const conTime = Date.now() - t2

  console.log("Sequential results:", sequential)
  console.log("Concurrent results:", concurrent)
  console.log(`Sequential time: ${seqTime}ms`)
  console.log(`Concurrent time: ${conTime}ms`)
  console.log(seqTime > conTime ? "✅ Concurrent was faster PASS" : "❌ Concurrent should be faster FAIL")
  console.log(sequential.length === 4 ? "✅ length PASS" : "❌ length FAIL")
  console.log(concurrent.length === 4 ? "✅ concurrent length PASS" : "❌ concurrent length FAIL")

  // Both should return same data
  const sameData = sequential.every((s, i) =>
    s.address === concurrent[i].address && s.balance === concurrent[i].balance
  )
  console.log(sameData ? "✅ Same data PASS" : "❌ Same data FAIL")
}


// ============================================================
// CHALLENGE 5 — EASY-MEDIUM (4/10)
// "Promise.allSettled — Handle Mixed Results"
// ============================================================
//
// CONCEPT: Promise.allSettled — unlike Promise.all which
// crashes if any promise rejects, allSettled waits for
// ALL promises and tells you which succeeded and which failed.
//
// REAL-WORLD CONTEXT:
// Your Tuesday medium challenge uses this pattern to fetch
// transaction statuses — some hashes succeed, some fail.
// allSettled lets you process all results without crashing.
//
// PROBLEM:
// Write an async function `fetchAllBalances` that:
// 1. Takes an array of wallet addresses
// 2. Fetches ALL balances concurrently using Promise.allSettled
// 3. Returns a structured report:
//
// OUTPUT:
// {
//   successful: Array<{ address: string, balance: number }>
//   failed: Array<{ address: string, error: string }>
//   successCount: number
//   failCount: number
// }
//
// PSEUDOCODE SPACE:
//
//
//

async function fetchAllBalances(addresses: string[]): Promise<{
  successful: Array<{ address: string; balance: number }>
  failed: Array<{ address: string; error: string }>
  successCount: number
  failCount: number
}> {
  // YOUR CODE HERE
  // Hint: Promise.allSettled returns objects with
  // { status: "fulfilled", value: ... }
  // OR { status: "rejected", reason: ... }
}

// TEST 5:
async function runTest5() {
  console.log("\n=== CHALLENGE 5: Promise.allSettled ===")
  const result = await fetchAllBalances([
    "0xAlice",
    "0xBob",
    "0xUnknown1",
    "0xCarol",
    "0xUnknown2"
  ])
  console.log("Result:", JSON.stringify(result, null, 2))
  console.log(result.successCount === 3 ? "✅ successCount PASS" : `❌ successCount FAIL — got ${result.successCount}, expected 3`)
  console.log(result.failCount === 2 ? "✅ failCount PASS" : `❌ failCount FAIL — got ${result.failCount}, expected 2`)
  console.log(result.successful.every(s => typeof s.balance === "number") ? "✅ balances are numbers PASS" : "❌ FAIL")
  console.log(result.failed.every(f => typeof f.error === "string") ? "✅ errors are strings PASS" : "❌ FAIL")
}


// ============================================================
// CHALLENGE 6 — EASY-MEDIUM (4.5/10)
// "Promise.race — First to Respond Wins"
// ============================================================
//
// CONCEPT: Promise.race — returns the result of whichever
// promise settles first (resolves OR rejects).
// Combined with a timeout promise — this is how you impose
// a deadline on any async operation.
//
// REAL-WORLD CONTEXT:
// Your Monday medium challenge used this exact pattern —
// racing each RPC call against a timeout promise.
// This is how production backends prevent hanging forever
// on a slow RPC node.
//
// PROBLEM:
// Write an async function `fetchWithTimeout` that:
// 1. Takes a walletAddress (string) and timeoutMs (number)
// 2. Races fetchWalletBalance against a timeout Promise
// 3. If balance fetches before timeout → return the balance
// 4. If timeout fires first → throw Error("Timeout: <address>")
//
// Then write `fetchBalanceWithFallback` that:
// 1. Tries fetchWithTimeout with 200ms timeout
// 2. If it times out → tries again with 1000ms timeout
// 3. If that also times out → returns null
//
// HINT: A timeout Promise looks like:
// new Promise((_, reject) =>
//   setTimeout(() => reject(new Error("Timeout")), ms)
// )
//
// PSEUDOCODE SPACE:
//
//
//

// Slow version for testing (takes 500ms)
function fetchWalletBalanceSlow(address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (address === "0xAlice") resolve(1500)
      else reject(new Error("Wallet not found"))
    }, 500)
  })
}

async function fetchWithTimeout(
  address: string,
  timeoutMs: number
): Promise<number> {
  // YOUR CODE HERE
}

async function fetchBalanceWithFallback(
  address: string
): Promise<number | null> {
  // YOUR CODE HERE
  // Try 200ms first, then 1000ms, then return null
}

// TEST 6:
async function runTest6() {
  console.log("\n=== CHALLENGE 6: Promise.race + Timeout ===")

  // Test 1: Fast fetch — should succeed before 1000ms timeout
  try {
    const balance = await fetchWithTimeout("0xAlice", 1000)
    console.log("Fast timeout result:", balance)
    console.log(balance === 1500 ? "✅ PASS" : "❌ FAIL")
  } catch (e) {
    console.log("❌ Should not have thrown:", (e as Error).message)
  }

  // Test 2: Slow fetch — 200ms timeout should fire
  try {
    await fetchWithTimeout("0xAlice", 200)  // fetchWalletBalanceSlow takes 500ms
    console.log("❌ Should have timed out")
  } catch (e) {
    console.log("Timeout error:", (e as Error).message)
    console.log((e as Error).message.includes("Timeout") ? "✅ timeout PASS" : "❌ FAIL")
  }

  // Test 3: Fallback — 200ms fails, 1000ms succeeds
  const result = await fetchBalanceWithFallback("0xAlice")
  console.log("Fallback result:", result)
  console.log(result === 1500 ? "✅ fallback PASS" : "❌ fallback FAIL")
}


// ============================================================
// CHALLENGE 7 — MEDIUM (5/10)
// "Retry Logic — Loop Until Success"
// ============================================================
//
// CONCEPT: Retry loops — retry a failing async operation
// up to N times with a delay between attempts.
// This is the most common pattern in production Web3 code.
//
// REAL-WORLD CONTEXT:
// Your Tuesday medium challenge retries failed transaction
// status fetches. Every viem RPC call in Month 2 can fail
// transiently — you need to retry automatically.
//
// PROBLEM:
// Write an async function `fetchWithRetry` that:
// 1. Calls `unstableWalletFetch(address)` (mock below)
// 2. If it throws — waits `delayMs` then tries again
// 3. Retries up to `maxAttempts` times total (including first)
// 4. Returns the balance if any attempt succeeds
// 5. Throws the last error if all attempts fail
// 6. Tracks and returns attempt count
//
// OUTPUT: Promise<{ balance: number, attempts: number }>
//
// MOCK — simulates an unstable RPC node:
let _unstableCallCount = 0
function unstableWalletFetch(address: string): Promise<number> {
  _unstableCallCount++
  const count = _unstableCallCount
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Fails first 2 times, succeeds on 3rd
      if (count <= 2) reject(new Error(`RPC error attempt ${count}`))
      else resolve(1500)
    }, 80)
  })
}

async function fetchWithRetry(
  address: string,
  maxAttempts: number,
  delayMs: number
): Promise<{ balance: number; attempts: number }> {
  // YOUR CODE HERE
  // Use a loop — NOT recursion
  // Track attempt count
}

// Helper — sleep function you can use:
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// TEST 7:
async function runTest7() {
  console.log("\n=== CHALLENGE 7: Retry Logic ===")
  _unstableCallCount = 0

  // Test 1: Succeeds on 3rd attempt
  const result = await fetchWithRetry("0xAlice", 3, 100)
  console.log("Result:", result)
  console.log(result.balance === 1500 ? "✅ balance PASS" : "❌ balance FAIL")
  console.log(result.attempts === 3 ? "✅ attempts PASS" : `❌ attempts FAIL — got ${result.attempts}, expected 3`)

  // Test 2: Fails all attempts
  _unstableCallCount = 0
  try {
    await fetchWithRetry("0xAlice", 2, 50)
    console.log("❌ Should have thrown")
  } catch (e) {
    console.log("All failed:", (e as Error).message)
    console.log("✅ correctly threw after max attempts")
  }
}


// ============================================================
// CHALLENGE 8 — MEDIUM (5.5/10)
// "Async + HOF — Transform Data After Fetching"
// ============================================================
//
// CONCEPT: Using higher-order functions (map, filter, reduce)
// to process data AFTER async operations complete.
// Async fetches the raw data. HOFs clean and shape it.
//
// REAL-WORLD CONTEXT:
// Your Wednesday medium challenge fetches blocks then
// uses HOFs to build state (totalVolume, uniqueAddresses).
// This is the pattern: fetch async → process with HOF.
//
// PROBLEM:
// Write an async function `getPortfolioStats` that:
// 1. Fetches balances for ALL addresses concurrently
//    (use fetchAllBalances from Challenge 5)
// 2. From the successful results, calculates:
//    - totalBalance: sum of all balances
//    - averageBalance: mean of all balances (rounded to 2dp)
//    - richestWallet: address with highest balance
//    - walletsAbove1000: array of addresses with balance > 1000
// 3. Returns the stats object
//
// INPUT:  addresses: string[]
// OUTPUT: Promise<PortfolioStats>
//
// type PortfolioStats = {
//   totalBalance: number
//   averageBalance: number
//   richestWallet: string | null
//   walletsAbove1000: string[]
//   fetchedCount: number
//   failedCount: number
// }
//
// PSEUDOCODE SPACE:
//
//
//

type PortfolioStats = {
  totalBalance: number
  averageBalance: number
  richestWallet: string | null
  walletsAbove1000: string[]
  fetchedCount: number
  failedCount: number
}

async function getPortfolioStats(addresses: string[]): Promise<PortfolioStats> {
  // YOUR CODE HERE
  // Step 1: use fetchAllBalances (Challenge 5)
  // Step 2: use reduce for totalBalance
  // Step 3: use filter for walletsAbove1000
  // Step 4: sort or reduce for richestWallet
}

// TEST 8:
async function runTest8() {
  console.log("\n=== CHALLENGE 8: Async + HOF ===")
  const stats = await getPortfolioStats([
    "0xAlice",    // 1500
    "0xBob",      // 800
    "0xCarol",    // 2200
    "0xUnknown",  // fails
  ])
  console.log("Stats:", JSON.stringify(stats, null, 2))
  console.log(stats.totalBalance === 4500 ? "✅ totalBalance PASS" : `❌ totalBalance FAIL — got ${stats.totalBalance}, expected 4500`)
  console.log(stats.averageBalance === 1500 ? "✅ averageBalance PASS" : `❌ averageBalance FAIL — got ${stats.averageBalance}, expected 1500`)
  console.log(stats.richestWallet === "0xCarol" ? "✅ richestWallet PASS" : `❌ richestWallet FAIL — expected 0xCarol`)
  console.log(stats.walletsAbove1000.length === 2 ? "✅ walletsAbove1000 PASS" : `❌ walletsAbove1000 FAIL — expected 2`)
  console.log(stats.fetchedCount === 3 ? "✅ fetchedCount PASS" : `❌ fetchedCount FAIL — expected 3`)
  console.log(stats.failedCount === 1 ? "✅ failedCount PASS" : `❌ failedCount FAIL — expected 1`)
}


// ============================================================
// CHALLENGE 9 — MEDIUM (6/10)
// "Async Polling Loop — Wait Until Condition is True"
// ============================================================
//
// CONCEPT: Polling — repeatedly checking an async condition
// at intervals until it returns true, then stopping.
// This is how confirmation trackers and status monitors work.
//
// REAL-WORLD CONTEXT:
// Your Friday medium challenge polls the current block
// number until N confirmations are reached. This challenge
// teaches the simpler version of that exact loop.
//
// PROBLEM:
// A transaction starts as "pending" and eventually becomes
// "confirmed" or "failed". Write an async function
// `waitForTransaction` that:
// 1. Polls `checkTxStatus(hash)` every `pollIntervalMs`
// 2. Keeps polling while status is "pending"
// 3. Stops and returns when status is "confirmed" or "failed"
// 4. Throws Error("Polling timeout: <hash>") if `timeoutMs` reached
// 5. Returns a receipt with final status and poll count
//
// OUTPUT: Promise<{ hash: string, status: string, pollCount: number, elapsedMs: number }>
//
// MOCK — simulates a transaction confirming after a few polls:
let _txPollCount: Record<string, number> = {}
function checkTxStatus(hash: string): Promise<"pending" | "confirmed" | "failed"> {
  _txPollCount[hash] = (_txPollCount[hash] ?? 0) + 1
  const count = _txPollCount[hash]
  return new Promise(resolve => {
    setTimeout(() => {
      if (hash === "0xfail") resolve(count >= 3 ? "failed" : "pending")
      else resolve(count >= 4 ? "confirmed" : "pending")
    }, 80)
  })
}

async function waitForTransaction(
  hash: string,
  pollIntervalMs: number,
  timeoutMs: number
): Promise<{ hash: string; status: string; pollCount: number; elapsedMs: number }> {
  // YOUR CODE HERE
  // while loop + await sleep(pollIntervalMs)
  // check elapsed time against timeoutMs
  // return receipt when terminal status reached
}

// TEST 9:
async function runTest9() {
  console.log("\n=== CHALLENGE 9: Async Polling Loop ===")
  _txPollCount = {}

  // Test 1: Confirms after 4 polls
  const receipt = await waitForTransaction("0xabc", 150, 3000)
  console.log("Receipt:", receipt)
  console.log(receipt.status === "confirmed" ? "✅ status PASS" : `❌ status FAIL — got ${receipt.status}`)
  console.log(receipt.pollCount === 4 ? "✅ pollCount PASS" : `❌ pollCount FAIL — got ${receipt.pollCount}, expected 4`)

  // Test 2: Fails after 3 polls
  _txPollCount = {}
  const failReceipt = await waitForTransaction("0xfail", 150, 3000)
  console.log("Fail receipt:", failReceipt)
  console.log(failReceipt.status === "failed" ? "✅ failed status PASS" : `❌ FAIL — got ${failReceipt.status}`)

  // Test 3: Timeout fires
  _txPollCount = {}
  try {
    await waitForTransaction("0xtimeout", 200, 300)
    console.log("❌ Should have timed out")
  } catch (e) {
    console.log("Timeout:", (e as Error).message)
    console.log((e as Error).message.includes("0xtimeout") ? "✅ timeout PASS" : "❌ FAIL")
  }
}


// ============================================================
// CHALLENGE 10 — MEDIUM (6.5/10)
// "Full Pipeline — Retry + Timeout + Polling + HOF"
// ============================================================
//
// CONCEPT: Combining everything from challenges 1–9 into
// one real pipeline. This is the bridge to your medium
// weekly challenges — which all combine 3–4 concepts.
//
// REAL-WORLD CONTEXT:
// This is almost exactly what your Monday medium challenge
// (Multi-RPC Token Balance Checker) does — query multiple
// sources with timeout, pick the best result, transform
// the data. If you can solve this, you can solve that.
//
// PROBLEM:
// Build an async function `fetchWalletReport` that:
//
// Step 1 — Fetch balances for a list of addresses
//   Use fetchAllBalances (Challenge 5) to get all balances
//   concurrently. Each fetch has a 400ms timeout — if it
//   exceeds that, treat it as failed (not crashed).
//
// Step 2 — For failed addresses, retry ONCE after 200ms
//   Only retry addresses that failed. Do not retry addresses
//   that succeeded the first time.
//
// Step 3 — Poll for a "network confirmation"
//   After fetching all balances, call `waitForNetworkReady()`
//   (mock below). Poll it every 200ms until it returns true
//   or 2000ms timeout. If timeout — include a warning in report.
//
// Step 4 — Build and return a final report
//
// OUTPUT:
// type WalletReport = {
//   addresses: string[]
//   balances: Array<{ address: string; balance: number | null; source: "first_attempt" | "retry" | "failed" }>
//   totalBalance: number
//   successCount: number
//   failCount: number
//   networkReady: boolean
//   networkWarning?: string
//   reportGeneratedAt: number
// }
//
// MOCK:
let _networkReadyCount = 0
function waitForNetworkReady(): Promise<boolean> {
  _networkReadyCount++
  return new Promise(resolve => {
    setTimeout(() => {
      // Returns true after 3 calls
      resolve(_networkReadyCount >= 3)
    }, 100)
  })
}

type WalletReport = {
  addresses: string[]
  balances: Array<{
    address: string
    balance: number | null
    source: "first_attempt" | "retry" | "failed"
  }>
  totalBalance: number
  successCount: number
  failCount: number
  networkReady: boolean
  networkWarning?: string
  reportGeneratedAt: number
}

async function fetchWalletReport(addresses: string[]): Promise<WalletReport> {
  // YOUR CODE HERE
  // Step 1: fetchAllBalances concurrently with timeout
  // Step 2: retry failed ones once after 200ms
  // Step 3: poll waitForNetworkReady until true or timeout
  // Step 4: build and return report
}

// TEST 10:
async function runTest10() {
  console.log("\n=== CHALLENGE 10: Full Pipeline ===")
  _networkReadyCount = 0

  const report = await fetchWalletReport([
    "0xAlice",
    "0xBob",
    "0xCarol",
    "0xUnknown",
  ])
  console.log("Report:", JSON.stringify(report, null, 2))

  console.log(report.addresses.length === 4 ? "✅ addresses PASS" : "❌ addresses FAIL")
  console.log(report.balances.length === 4 ? "✅ balances length PASS" : "❌ balances FAIL")
  console.log(report.totalBalance === 4500 ? "✅ totalBalance PASS" : `❌ totalBalance FAIL — got ${report.totalBalance}`)
  console.log(report.successCount === 3 ? "✅ successCount PASS" : `❌ successCount FAIL — got ${report.successCount}`)
  console.log(report.failCount === 1 ? "✅ failCount PASS" : `❌ failCount FAIL — got ${report.failCount}`)
  console.log(typeof report.networkReady === "boolean" ? "✅ networkReady PASS" : "❌ networkReady FAIL")
  console.log(report.reportGeneratedAt > 0 ? "✅ timestamp PASS" : "❌ timestamp FAIL")

  // Verify source tracking
  const unknownEntry = report.balances.find(b => b.address === "0xUnknown")
  console.log(unknownEntry?.source === "failed" ? "✅ failed source PASS" : "❌ failed source FAIL")

  const aliceEntry = report.balances.find(b => b.address === "0xAlice")
  console.log(aliceEntry?.source === "first_attempt" ? "✅ first_attempt source PASS" : "❌ first_attempt source FAIL")
}


// ============================================================
// MASTER RUNNER
// ============================================================

async function runAll() {
  console.log("=".repeat(55))
  console.log("  ASYNC FOUNDATIONS — 10 Challenges")
  console.log("  Build up to Weekly Medium Challenges")
  console.log("=".repeat(55))
  console.log("  Comment out challenges you haven't done yet")
  console.log("=".repeat(55))

  await runTest1()
  await runTest2()
  await runTest3()
  await runTest4()
  await runTest5()
  await runTest6()
  await runTest7()
  await runTest8()
  await runTest9()
  await runTest10()

  console.log("\n" + "=".repeat(55))
  console.log("  All 10 complete.")
  console.log("  If #10 passes → start the 7 Medium challenges.")
  console.log("=".repeat(55))
}

runAll().catch(console.error)


// ============================================================
// SELF-CHECK — answer after all 10:
//
// 1. What is the difference between Promise.all and
//    Promise.allSettled? When would you use each?
//
// 2. Why does Promise.race return the first to SETTLE
//    (not just resolve)? How did you work around this
//    in Challenge 6 to get the first SUCCESS?
//
// 3. In Challenge 7, why was a loop better than recursion
//    for retry logic?
//
// 4. In Challenge 9, what happens if you forget to increment
//    pollCount before sleeping? What bug does that cause?
//
// 5. In Challenge 10, why did you retry only failed addresses
//    and not all addresses again?
//
// Answer all 5 without notes → you are ready for the
// 7 Medium weekly challenges without AI assistance.
// ============================================================