# Async Blockchain Challenges

## 10 Easy · 7 Medium · 5 Hard

### TypeScript · Blockchain / Web3 / DeFi Industry

---

> **RULES**
>
> 1. Write your own pseudocode FIRST — even if wrong
> 2. AI only to explain error messages — never to write code
> 3. Each challenge is self-contained — mock functions included
> 4. Run: `npx ts-node <filename>.ts`
> 5. Commit every solution before moving to the next

---

## DIFFICULTY OVERVIEW

| Level      | Range      | Who should solve it        |
| ---------- | ---------- | -------------------------- |
| Easy 1–10  | 1.0 → 4.0  | Junior engineer first days |
| Medium 1–7 | 4.5 → 7.0  | Mid-level engineer         |
| Hard 1–5   | 7.5 → 10.0 | Senior / Staff engineer    |

---

---

# 🟢 EASY CHALLENGES

---

## 🟢 EASY #1 — Wrap a Callback in a Promise

**Difficulty: 1.0/10**

**Real-world scenario:**
Legacy blockchain SDKs (like older versions of Web3.js) use callback-style functions instead of Promises. Before you can use `async/await`, you must wrap them in a Promise. Every Web3 backend engineer encounters this when integrating old infrastructure with modern Node.js code.

**Problem statement:**
The function `legacyGetBalance` uses Node.js-style callbacks — it takes `(error, result)` as its last argument. Wrap it in a Promise so it can be used with `async/await`.

Write a function `getBalanceAsync(address: string): Promise<number>` that wraps `legacyGetBalance` and resolves with the balance or rejects with the error.

**Input:**

```typescript
address: string; // wallet address e.g. "0xAlice"
```

**Output:**

```typescript
Promise<number>; // resolves with balance, rejects with Error
```

**Constraints:**

- Must use `new Promise()`
- Must not use `.then()` in the implementation
- Use the mock below — do not modify it

**Mock:**

```typescript
function legacyGetBalance(
  address: string,
  callback: (error: Error | null, balance: number | null) => void,
): void {
  setTimeout(() => {
    if (address === "0xAlice") callback(null, 1500);
    else if (address === "0xBob") callback(null, 800);
    else callback(new Error("Address not found"), null);
  }, 200);
}
```

**Example:**

```
Input:  "0xAlice"
Output: 1500

Input:  "0xUnknown"
Output: throws Error("Address not found")
```

**Acceptance criteria:**

- [ ] Returns a Promise
- [ ] Resolves with correct balance for known addresses
- [ ] Rejects with the error for unknown addresses
- [ ] No `any` types

**Why this challenge?**
Your `challenge-1-basic-promise.ts` creates Promises manually. This challenge applies that same skill to a real-world pattern — wrapping legacy callbacks — which you will encounter in Month 2 when integrating older RPC libraries.

---

## 🟢 EASY #2 — Async Identity Validator

**Difficulty: 1.5/10**

**Real-world scenario:**
Before submitting a transaction, backends validate that wallet addresses are properly formatted. An invalid address sent to an RPC node returns a cryptic error. Catching it early with an async validator saves debugging time and protects your backend from bad input.

**Problem statement:**
Write an async function `validateWalletAddress(address: string): Promise<ValidationResult>` that checks if a wallet address is valid using the async mock validator below. Return a structured result with the validation outcome.

**Input:**

```typescript
address: string;
```

**Output:**

```typescript
type ValidationResult = {
  address: string;
  isValid: boolean;
  reason: string; // "valid" | "too short" | "missing 0x prefix" | "invalid characters"
  checkedAt: number; // Date.now()
};
```

**Constraints:**

- Must use `async/await`
- Must handle the case where the mock throws
- Use mock below

**Mock:**

```typescript
function mockValidateAddress(address: string): Promise<{
  valid: boolean;
  reason: string;
}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!address.startsWith("0x"))
        resolve({ valid: false, reason: "missing 0x prefix" });
      else if (address.length < 10)
        resolve({ valid: false, reason: "too short" });
      else if (!/^0x[0-9a-fA-F]+$/.test(address))
        resolve({ valid: false, reason: "invalid characters" });
      else resolve({ valid: true, reason: "valid" });
    }, 100);
  });
}
```

**Example:**

```
Input:  "0xAlice123"
Output: { address: "0xAlice123", isValid: true, reason: "valid", checkedAt: <timestamp> }

Input:  "Alice"
Output: { address: "Alice", isValid: false, reason: "missing 0x prefix", checkedAt: <timestamp> }
```

**Acceptance criteria:**

- [ ] Returns correct ValidationResult shape
- [ ] `checkedAt` is a valid timestamp
- [ ] Handles mock errors gracefully
- [ ] No `any` types

**Why this challenge?**
Your `type-safe-transaction-validator.ts` validates synchronously. This builds the async version — the pattern your Month 2 Express routes use before inserting data into the database.

---

## 🟢 EASY #3 — Sequential Balance Fetcher

**Difficulty: 2.0/10**

**Real-world scenario:**
Some blockchain operations must happen in sequence — for example, fetching the balance of each wallet in a user's contact list to display them one by one as they load. Your `challenge-4-sequential-concurrent.ts` already demonstrates this concept. This challenge solidifies it with a real-world output format.

**Problem statement:**
Write an async function `fetchBalancesInOrder(addresses: string[]): Promise<BalanceEntry[]>` that fetches each wallet's balance **one at a time** (sequential, not concurrent) and returns them in the same order as the input array. Each fetch should await the previous one before starting.

**Input:**

```typescript
addresses: string[]
```

**Output:**

```typescript
type BalanceEntry = {
  address: string;
  balance: number | null;
  status: "success" | "error";
  fetchedAt: number;
};

Promise<BalanceEntry[]>;
```

**Constraints:**

- Must be sequential — use `for...of` with `await` inside
- Failed fetches should NOT stop the loop — capture the error and continue
- Order of results must match order of input
- Use mock below

**Mock:**

```typescript
function mockFetchBalance(address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const balances: Record<string, number> = {
        "0xAlice": 1500,
        "0xBob": 800,
        "0xCarol": 2200,
        "0xDiana": 450,
      };
      if (balances[address] !== undefined) resolve(balances[address]);
      else reject(new Error(`${address}: not found`));
    }, 150);
  });
}
```

**Example:**

```
Input:  ["0xAlice", "0xUnknown", "0xBob"]
Output: [
  { address: "0xAlice",   balance: 1500, status: "success", fetchedAt: <ts> },
  { address: "0xUnknown", balance: null, status: "error",   fetchedAt: <ts> },
  { address: "0xBob",     balance: 800,  status: "success", fetchedAt: <ts> },
]
```

**Hint:** A `for...of` loop with `await` inside is sequential. `Promise.all` is concurrent. Do not confuse them.

**Acceptance criteria:**

- [ ] Results in same order as input
- [ ] Failed fetches included with status "error" and balance null
- [ ] Sequential — not concurrent
- [ ] No `any` types

**Why this challenge?**
Your `sequential-block-processor.ts` processes blocks one at a time. This challenge builds the same habit but for wallet data — the same pattern your portfolio tracker uses in Month 2.

---

## 🟢 EASY #4 — Async Token Symbol Resolver

**Difficulty: 2.5/10**

**Real-world scenario:**
Smart contracts store token addresses (e.g. `0xA0b8...`) not human-readable names. When displaying data to users, backends resolve these addresses to symbols (USDC, ETH, LINK). Your `token-watchlist-manager.js` tracks symbols — this builds the async resolver that populates it.

**Problem statement:**
Write an async function `resolveTokenSymbols(tokenAddresses: string[]): Promise<ResolvedToken[]>` that fetches the symbol for each token address concurrently and returns a resolved list. Unknown addresses should be resolved to symbol `"UNKNOWN"` without throwing.

**Input:**

```typescript
tokenAddresses: string[]
```

**Output:**

```typescript
type ResolvedToken = {
  address: string;
  symbol: string; // "UNKNOWN" if not found
  decimals: number; // 0 if not found
  resolved: boolean;
};

Promise<ResolvedToken[]>;
```

**Constraints:**

- Fetch all tokens CONCURRENTLY — use `Promise.allSettled`
- Unknown tokens resolve to symbol "UNKNOWN", decimals 0, resolved false
- Do NOT throw for unknown tokens
- Use mock below

**Mock:**

```typescript
function mockGetTokenInfo(
  address: string,
): Promise<{ symbol: string; decimals: number }> {
  const tokens: Record<string, { symbol: string; decimals: number }> = {
    "0xUSDC": { symbol: "USDC", decimals: 6 },
    "0xETH": { symbol: "WETH", decimals: 18 },
    "0xLINK": { symbol: "LINK", decimals: 18 },
    "0xDAI": { symbol: "DAI", decimals: 18 },
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (tokens[address]) resolve(tokens[address]);
      else reject(new Error(`Token ${address} not found`));
    }, 100);
  });
}
```

**Example:**

```
Input:  ["0xUSDC", "0xBAD", "0xLINK"]
Output: [
  { address: "0xUSDC", symbol: "USDC", decimals: 6,  resolved: true  },
  { address: "0xBAD",  symbol: "UNKNOWN", decimals: 0, resolved: false },
  { address: "0xLINK", symbol: "LINK", decimals: 18, resolved: true  },
]
```

**Acceptance criteria:**

- [ ] All tokens fetched concurrently
- [ ] Unknown tokens resolved to UNKNOWN — not thrown
- [ ] Order matches input
- [ ] No `any` types

**Why this challenge?**
Your `concurrent-wallet-balance-aggregator.ts` fetches balances concurrently. This applies the same pattern to token metadata — which your Whale Watcher needs to display human-readable token names.

---

## 🟢 EASY #5 — Async Gas Price Fetcher with Default

**Difficulty: 2.5/10**

**Real-world scenario:**
Before submitting a transaction, your backend fetches the current gas price from an RPC node. If the RPC is unavailable, it falls back to a safe default rather than blocking the entire operation. Your `gas-price-sorter-and-stats.js` processes gas data — this fetches it async with a fallback.

**Problem statement:**
Write an async function `fetchGasPriceWithDefault(defaultGwei: number): Promise<GasResult>` that attempts to fetch the current gas price. If the fetch fails for any reason, return the default value instead of throwing.

**Input:**

```typescript
defaultGwei: number; // fallback gas price in Gwei
```

**Output:**

```typescript
type GasResult = {
  gasPriceGwei: number;
  source: "rpc" | "default"; // where the price came from
  fetchedAt: number;
};
```

**Constraints:**

- Must not throw under any circumstances
- If fetch succeeds — source is "rpc"
- If fetch fails — source is "default", gasPriceGwei is defaultGwei
- Use mock below

**Mock:**

```typescript
let _gasFetchCount = 0;
function mockFetchGasPrice(): Promise<number> {
  _gasFetchCount++;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Fails every other call
      if (_gasFetchCount % 2 === 0) reject(new Error("RPC unavailable"));
      else resolve(22.5 + Math.random() * 5);
    }, 100);
  });
}
```

**Example:**

```
Call 1 (succeeds): { gasPriceGwei: 24.3, source: "rpc",     fetchedAt: <ts> }
Call 2 (fails):    { gasPriceGwei: 20,   source: "default",  fetchedAt: <ts> }
```

**Acceptance criteria:**

- [ ] Never throws
- [ ] Correct source field
- [ ] fetchedAt is valid timestamp
- [ ] No `any` types

**Why this challenge?**
Your `live-gas-price-monitor.js` monitors gas. This builds the safe async fetcher underneath it — the try/catch + default pattern used in every production gas price service.

---

## 🟢 EASY #6 — Concurrent Transaction Validator

**Difficulty: 3.0/10**

**Real-world scenario:**
When a batch of transactions arrives at your backend, you validate them all concurrently before saving any to the database. Invalid transactions are flagged and rejected — valid ones proceed. Your `blockchain-transaction-validator-queue.ts` queues transactions — this builds the concurrent validation layer.

**Problem statement:**
Write an async function `validateTransactionBatch(transactions: RawTx[]): Promise<ValidationReport>` that validates all transactions concurrently and returns a report separating valid from invalid ones.

**Input:**

```typescript
type RawTx = {
  hash: string
  from: string
  to: string
  amount: number
  token: string
}

transactions: RawTx[]
```

**Output:**

```typescript
type TxValidationResult = {
  hash: string;
  valid: boolean;
  errors: string[]; // e.g. ["amount must be > 0", "invalid from address"]
};

type ValidationReport = {
  total: number;
  valid: number;
  invalid: number;
  results: TxValidationResult[];
};
```

**Constraints:**

- Validate all transactions CONCURRENTLY
- A transaction is invalid if any of these are true:
  - `amount <= 0`
  - `from` does not start with "0x"
  - `to` does not start with "0x"
  - `hash` does not start with "0x"
- Collect ALL errors per transaction — not just the first one
- Use mock validator below

**Mock:**

```typescript
function mockValidateTx(tx: RawTx): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const errors: string[] = [];
      if (tx.amount <= 0) errors.push("amount must be > 0");
      if (!tx.from.startsWith("0x")) errors.push("invalid from address");
      if (!tx.to.startsWith("0x")) errors.push("invalid to address");
      if (!tx.hash.startsWith("0x")) errors.push("invalid hash");
      resolve(errors);
    }, 80);
  });
}
```

**Example:**

```
Input: [
  { hash: "0xaaa", from: "0xAlice", to: "0xBob", amount: 500, token: "USDC" },
  { hash: "badhash", from: "0xAlice", to: "0xBob", amount: -1, token: "ETH" },
]

Output: {
  total: 2, valid: 1, invalid: 1,
  results: [
    { hash: "0xaaa",    valid: true,  errors: [] },
    { hash: "badhash",  valid: false, errors: ["invalid hash", "amount must be > 0"] },
  ]
}
```

**Acceptance criteria:**

- [ ] All validations run concurrently
- [ ] All errors collected per transaction
- [ ] Correct counts in report
- [ ] No `any` types

**Why this challenge?**
Your Express POST route currently saves any data without validation. This challenge builds the validation layer you will add before the Drizzle insert — a production requirement for every backend that accepts transaction data.

---

## 🟢 EASY #7 — Async Block Explorer Lookup

**Difficulty: 3.0/10**

**Real-world scenario:**
Block explorers (Etherscan, Basescan) expose REST APIs to look up transaction details. Backend services query these to enrich stored data — adding block number, confirmations, and timestamps after a transaction is submitted. Your `mock-blockchain-api-fetcher.ts` simulates this pattern.

**Problem statement:**
Write an async function `lookupTransactionDetails(hashes: string[]): Promise<LookupReport>` that looks up details for multiple transaction hashes concurrently. Some hashes may not be found — handle gracefully.

**Input:**

```typescript
hashes: string[]
```

**Output:**

```typescript
type TxDetails = {
  hash: string;
  blockNumber: number;
  confirmations: number;
  timestamp: number;
  status: "success" | "failed";
};

type LookupReport = {
  found: TxDetails[];
  notFound: string[]; // hashes that returned 404
  totalQueried: number;
};
```

**Constraints:**

- Fetch all concurrently
- Not-found hashes go into `notFound` array — do not throw
- Use mock below

**Mock:**

```typescript
function mockLookupTx(hash: string): Promise<TxDetails> {
  const knownTxs: Record<string, TxDetails> = {
    "0xaaa": {
      hash: "0xaaa",
      blockNumber: 19000001,
      confirmations: 12,
      timestamp: 1714000001,
      status: "success",
    },
    "0xbbb": {
      hash: "0xbbb",
      blockNumber: 19000002,
      confirmations: 6,
      timestamp: 1714000002,
      status: "success",
    },
    "0xccc": {
      hash: "0xccc",
      blockNumber: 19000003,
      confirmations: 1,
      timestamp: 1714000003,
      status: "failed",
    },
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (knownTxs[hash]) resolve(knownTxs[hash]);
      else reject(new Error(`404: ${hash} not found`));
    }, 100);
  });
}
```

**Example:**

```
Input:  ["0xaaa", "0xbbb", "0xunknown"]
Output: {
  found: [
    { hash: "0xaaa", blockNumber: 19000001, confirmations: 12, ... },
    { hash: "0xbbb", blockNumber: 19000002, confirmations: 6,  ... },
  ],
  notFound: ["0xunknown"],
  totalQueried: 3
}
```

**Acceptance criteria:**

- [ ] Concurrent fetching
- [ ] Not-found hashes captured without throwing
- [ ] Correct totalQueried count
- [ ] No `any` types

**Why this challenge?**
Your `rpc-fallback-fetcher.ts` fetches with fallback. This builds the lookup pattern your backend needs when enriching stored transactions with on-chain data after submission.

---

## 🟢 EASY #8 — Async Wallet Nonce Fetcher

**Difficulty: 3.5/10**

**Real-world scenario:**
Every Ethereum transaction requires a nonce — a sequential number that prevents replay attacks. Your backend must fetch the current nonce for a wallet before constructing a transaction. If the nonce fetch fails, the transaction cannot be built. This is one of the first things a Gasless Relayer does in Month 6.

**Problem statement:**
Write an async function `fetchWalletNonces(addresses: string[]): Promise<NonceReport>` that fetches the current nonce for multiple wallets concurrently. Return a report with nonces for successful fetches and errors for failed ones.

**Input:**

```typescript
addresses: string[]
```

**Output:**

```typescript
type NonceEntry = {
  address: string;
  nonce: number | null;
  status: "success" | "error";
  error?: string;
};

type NonceReport = {
  entries: NonceEntry[];
  successCount: number;
  errorCount: number;
  highestNonce: number | null; // max nonce across successful entries
};
```

**Constraints:**

- Fetch all concurrently
- Failed fetches included with status "error" — not thrown
- `highestNonce` is null if all fetches failed
- Use mock below

**Mock:**

```typescript
function mockGetNonce(address: string): Promise<number> {
  const nonces: Record<string, number> = {
    "0xAlice": 42,
    "0xBob": 7,
    "0xCarol": 156,
    "0xDiana": 3,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (nonces[address] !== undefined) resolve(nonces[address]);
      else reject(new Error(`${address}: account not found`));
    }, 100);
  });
}
```

**Example:**

```
Input:  ["0xAlice", "0xCarol", "0xUnknown"]
Output: {
  entries: [
    { address: "0xAlice",   nonce: 42,  status: "success" },
    { address: "0xCarol",   nonce: 156, status: "success" },
    { address: "0xUnknown", nonce: null, status: "error", error: "..." },
  ],
  successCount: 2,
  errorCount: 1,
  highestNonce: 156
}
```

**Acceptance criteria:**

- [ ] Concurrent fetching
- [ ] highestNonce correctly computed
- [ ] Failed entries captured without throwing
- [ ] No `any` types

**Why this challenge?**
Nonce management is critical in your Month 6 Gasless Relayer. Understanding how to fetch and track nonces concurrently is the foundation of the `TransactionQueue` hard challenge you worked on earlier.

---

## 🟢 EASY #9 — Async Event Log Enricher

**Difficulty: 3.5/10**

**Real-world scenario:**
Raw blockchain event logs contain addresses and amounts but not human-readable names or USD values. Your backend enriches them by fetching token metadata and prices asynchronously after receiving raw events. Your `event-log-processor.js` processes raw logs statically — this enriches them with live data.

**Problem statement:**
Write an async function `enrichEventLogs(logs: RawEventLog[]): Promise<EnrichedLog[]>` that enriches each log with token symbol and USD value concurrently. Use `Promise.allSettled` — if enrichment fails for a log, return the raw data with `enriched: false`.

**Input:**

```typescript
type RawEventLog = {
  txHash: string
  tokenAddress: string
  amount: number       // raw amount (already decimal-adjusted)
  from: string
  to: string
  blockNumber: number
}

logs: RawEventLog[]
```

**Output:**

```typescript
type EnrichedLog = RawEventLog & {
  tokenSymbol: string | null;
  usdValue: number | null;
  enriched: boolean;
};

Promise<EnrichedLog[]>;
```

**Constraints:**

- Enrich all logs concurrently
- If enrichment fails — return raw log with enriched: false, tokenSymbol: null, usdValue: null
- Use mocks below

**Mocks:**

```typescript
function mockGetSymbol(tokenAddress: string): Promise<string> {
  const symbols: Record<string, string> = {
    "0xUSDC": "USDC",
    "0xETH": "WETH",
    "0xLINK": "LINK",
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (symbols[tokenAddress]) resolve(symbols[tokenAddress]);
      else reject(new Error("Symbol not found"));
    }, 80);
  });
}

function mockGetPrice(symbol: string): Promise<number> {
  const prices: Record<string, number> = {
    USDC: 1.0,
    WETH: 3187.42,
    LINK: 18.5,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (prices[symbol]) resolve(prices[symbol]);
      else reject(new Error("Price not found"));
    }, 80);
  });
}
```

**Example:**

```
Input: [
  { txHash: "0x1", tokenAddress: "0xUSDC", amount: 500, from: "0xA", to: "0xB", blockNumber: 100 },
  { txHash: "0x2", tokenAddress: "0xBAD",  amount: 100, from: "0xC", to: "0xD", blockNumber: 101 },
]

Output: [
  { ...log1, tokenSymbol: "USDC", usdValue: 500, enriched: true },
  { ...log2, tokenSymbol: null,   usdValue: null, enriched: false },
]
```

**Acceptance criteria:**

- [ ] All logs enriched concurrently
- [ ] Failed enrichments return raw data with enriched: false
- [ ] usdValue = amount \* price
- [ ] No `any` types

**Why this challenge?**
Your `event-log-processor.js` processes static data. This challenge builds the async enrichment layer your Whale Watcher uses to display human-readable USD values alongside raw Transfer events.

---

## 🟢 EASY #10 — Async RPC Latency Tester

**Difficulty: 4.0/10**

**Real-world scenario:**
Before routing traffic to an RPC node, infrastructure teams measure its latency from multiple geographic regions. The fastest node gets priority. Your `async-rpc-health-checker.ts` checks health — this builds the latency measurement component that feeds into it.

**Problem statement:**
Write an async function `measureRPCLatencies(urls: string[]): Promise<LatencyReport>` that pings each RPC node concurrently, measures response time, and returns a sorted latency report. All pings must complete within `5000ms` — nodes exceeding this are marked as timed out.

**Input:**

```typescript
urls: string[]
```

**Output:**

```typescript
type LatencyEntry = {
  url: string;
  latencyMs: number | null; // null if timed out
  status: "fast" | "acceptable" | "slow" | "timeout";
  // fast: < 500ms | acceptable: 500–1500ms | slow: > 1500ms | timeout: > 5000ms
};

type LatencyReport = {
  entries: LatencyEntry[]; // sorted by latencyMs ascending (nulls last)
  fastestUrl: string | null;
  averageLatencyMs: number | null; // average of non-timeout entries only
  timeoutCount: number;
};
```

**Constraints:**

- All pings concurrent
- Per-node timeout: 5000ms — use Promise.race
- Sort by latency ascending, nulls last
- averageLatencyMs: null if all timed out
- Use mock below

**Mock:**

```typescript
function mockPingRPC(url: string): Promise<void> {
  const latencies: Record<string, number> = {
    "https://rpc-us.example.com": 120,
    "https://rpc-eu.example.com": 380,
    "https://rpc-ap.example.com": 890,
    "https://rpc-slow.example.com": 2200,
    "https://rpc-dead.example.com": 99999,
  };
  const delay = latencies[url] ?? 200;
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (delay > 6000) reject(new Error("Connection refused"));
        else resolve();
      },
      Math.min(delay, 6000),
    );
  });
}
```

**Example:**

```
Input:  ["https://rpc-us.example.com", "https://rpc-ap.example.com", "https://rpc-dead.example.com"]
Output: {
  entries: [
    { url: "rpc-us",   latencyMs: 120,  status: "fast"       },
    { url: "rpc-ap",   latencyMs: 890,  status: "acceptable" },
    { url: "rpc-dead", latencyMs: null, status: "timeout"    },
  ],
  fastestUrl: "https://rpc-us.example.com",
  averageLatencyMs: 505,
  timeoutCount: 1
}
```

**Hint:** Time each ping by recording `Date.now()` before and after the awaited ping call.

**Acceptance criteria:**

- [ ] All pings concurrent with per-node timeout
- [ ] Correct status classification
- [ ] Sorted ascending, nulls last
- [ ] averageLatencyMs excludes timeouts
- [ ] No `any` types

**Why this challenge?**
This is a direct extension of your `async-rpc-health-checker.ts`. Latency measurement is the next layer of production RPC management — every serious Web3 backend routes requests to the fastest available node.

---

---

# 🟡 MEDIUM CHALLENGES

---

## 🟡 MEDIUM #1 — Multi-Source Token Price Aggregator

**Difficulty: 4.5/10**

**Real-world scenario:**
DeFi protocols aggregate prices from multiple oracles (Chainlink, Band, Pyth) to prevent manipulation. If one source returns an outlier, the median filters it out. Your `async-token-price-aggregator.ts` already implements a basic version — this challenge adds timeout handling, source weighting metadata, and a confidence score.

**Problem statement:**
Build an async function `aggregateTokenPrice(token: string, sources: PriceSource[], config: AggregatorConfig): Promise<AggregationResult>` that fetches prices concurrently from all sources, applies per-source timeouts, and returns the median price with a confidence score.

**Input:**

```typescript
type PriceSource = {
  name: string
  url: string
}

type AggregatorConfig = {
  timeoutMs: number
  minSources: number    // minimum successful sources for valid price
}

token: string
sources: PriceSource[]
config: AggregatorConfig
```

**Output:**

```typescript
type SourceResult = {
  name: string;
  price: number | null;
  status: "success" | "timeout" | "error";
  latencyMs: number | null;
};

type AggregationResult = {
  token: string;
  medianPrice: number | null;
  confidence: "high" | "medium" | "low" | "insufficient";
  sources: SourceResult[];
  successCount: number;
  aggregatedAt: number;
};
```

**Constraints:**

- All sources fetched concurrently
- Per-source timeout via Promise.race
- Median: sort prices, take middle (average of two for even count)
- Confidence: high = all succeeded, medium = most succeeded, low = exactly minSources, insufficient = below minSources
- Use mock below

**Mock:**

```typescript
function mockFetchPrice(url: string, token: string): Promise<number> {
  const data: Record<string, { price: number; delay: number; fails: boolean }> =
    {
      "https://chainlink.example.com": {
        price: 3187.42,
        delay: 150,
        fails: false,
      },
      "https://band.example.com": { price: 3190.0, delay: 200, fails: false },
      "https://pyth.example.com": { price: 3185.5, delay: 100, fails: false },
      "https://slow.example.com": { price: 3200.0, delay: 3000, fails: false },
      "https://dead.example.com": { price: 0, delay: 50, fails: true },
    };
  const cfg = data[url] ?? { price: 3188.0, delay: 100, fails: false };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cfg.fails) reject(new Error("Feed unavailable"));
      else resolve(cfg.price);
    }, cfg.delay);
  });
}
```

**Example:**

```
Input: token "ETH", 3 sources (chainlink, band, pyth), timeout 500ms, minSources 2
Output: {
  token: "ETH",
  medianPrice: 3187.42,
  confidence: "high",
  successCount: 3,
  ...
}
```

**Acceptance criteria:**

- [ ] Per-source timeout correctly implemented
- [ ] Correct median calculation
- [ ] Correct confidence level
- [ ] latencyMs measured per source
- [ ] No `any` types

**Why this challenge?**
Your `defi-price-feed-aggregator.ts` implements a full circuit breaker. This is the core of that system — the price aggregation logic that every DeFi protocol backend depends on.

---

## 🟡 MEDIUM #2 — Async Transaction Queue with Sequential Nonces

**Difficulty: 5.0/10**

**Real-world scenario:**
Ethereum transactions require sequential nonces. If your backend submits nonce 5 before nonce 4 confirms, nonce 5 gets stuck forever. Production backends maintain a queue that processes transactions one at a time in order. Your `blockchain-transaction-validator-queue.ts` validates — this challenge adds the sequential processing and nonce tracking.

**Problem statement:**
Build a `TransactionQueue` class that accepts transactions, assigns sequential nonces, processes them one at a time, and exposes a status report. Transactions submitted while the queue is processing should be held and processed in order.

**Input:**

```typescript
type QueuedTx = {
  id: string;
  from: string;
  to: string;
  value: number;
};

class TransactionQueue {
  constructor(senderAddress: string);
  enqueue(tx: QueuedTx): void;
  async processAll(): Promise<void>;
  getReport(): QueueReport;
}

type TxRecord = QueuedTx & {
  nonce: number;
  status: "pending" | "confirmed" | "failed";
  attempts: number;
  txHash?: string;
};

type QueueReport = {
  senderAddress: string;
  totalQueued: number;
  confirmed: number;
  failed: number;
  currentNonce: number;
  transactions: TxRecord[];
};
```

**Constraints:**

- Transactions processed strictly sequentially — await each before next
- Nonces start at 0 and increment by 1 per transaction
- Failed transactions: retry once after 500ms before marking failed
- `enqueue()` is synchronous — can be called before or during processing
- Use mock below

**Mock:**

```typescript
function mockSubmitTx(tx: QueuedTx & { nonce: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (tx.id === "tx-bad") reject(new Error("Insufficient gas"));
      else resolve(`0x${tx.nonce.toString(16).padStart(64, "0")}`);
    }, 150);
  });
}
```

**Example:**

```
enqueue({ id: "tx-1", ... })
enqueue({ id: "tx-bad", ... })
enqueue({ id: "tx-2", ... })
await processAll()

getReport() →
{
  totalQueued: 3, confirmed: 2, failed: 1,
  transactions: [
    { id: "tx-1",   nonce: 0, status: "confirmed", attempts: 1 },
    { id: "tx-bad", nonce: 1, status: "failed",    attempts: 2 },
    { id: "tx-2",   nonce: 2, status: "confirmed", attempts: 1 },
  ]
}
```

**Acceptance criteria:**

- [ ] Sequential processing — never concurrent
- [ ] Nonces strictly sequential
- [ ] One retry on failure before marking failed
- [ ] getReport() accurate at any point
- [ ] No `any` types

**Why this challenge?**
This is the core of your Month 6 Gasless Relayer. Understanding sequential nonce management is non-negotiable for any engineer building transaction submission infrastructure.

---

## 🟡 MEDIUM #3 — Async Wallet Portfolio Fetcher with Concurrency Limit

**Difficulty: 5.3/10**

**Real-world scenario:**
Portfolio trackers fetch token balances for dozens of tokens per wallet. Sending all requests simultaneously triggers Alchemy's rate limiter (300 requests/second on free tier). Production backends batch requests — process N at a time, wait for the batch, then process the next N. Your `async-wallet-portfolio-fetcher.ts` implements the basic version — this adds the rate limit enforcement.

**Problem statement:**
Build an async function `fetchPortfolioWithLimit(wallet: string, tokens: TokenConfig[], maxConcurrent: number): Promise<PortfolioResult>` that fetches balances for all tokens but never exceeds `maxConcurrent` simultaneous requests.

**Input:**

```typescript
type TokenConfig = {
  address: string
  symbol: string
  decimals: number
}

wallet: string
tokens: TokenConfig[]
maxConcurrent: number
```

**Output:**

```typescript
type TokenBalance = {
  address: string;
  symbol: string;
  rawBalance: bigint;
  formattedBalance: string; // rawBalance / 10^decimals, 4 decimal places
  fetchStatus: "success" | "error";
  error?: string;
};

type PortfolioResult = {
  wallet: string;
  tokens: TokenBalance[];
  successCount: number;
  errorCount: number;
  totalUSDValue: number; // use 0 for tokens with no price data
  fetchedAt: number;
};
```

**Constraints:**

- NEVER exceed maxConcurrent simultaneous requests
- Process one batch at a time (not sliding window)
- Failed tokens included with fetchStatus "error"
- formattedBalance must handle BigInt correctly
- Use mocks below

**Mocks:**

```typescript
function mockGetTokenBalance(
  wallet: string,
  tokenAddress: string,
): Promise<bigint> {
  const balances: Record<string, bigint> = {
    "0xUSDC": BigInt("1500000000"),
    "0xETH": BigInt("2500000000000000000"),
    "0xLINK": BigInt("250000000000000000000"),
    "0xBAD": BigInt(0),
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (tokenAddress === "0xBAD") reject(new Error("Token error"));
      else resolve(balances[tokenAddress] ?? BigInt(0));
    }, 100);
  });
}
```

**Example:**

```
Input: wallet "0xAlice", 4 tokens, maxConcurrent: 2
→ Batch 1: [USDC, ETH] processed together
→ Batch 2: [LINK, BAD] processed together (BAD fails)

Output: {
  wallet: "0xAlice",
  tokens: [...4 results...],
  successCount: 3,
  errorCount: 1,
  ...
}
```

**Hint:** Slice your token array into chunks of `maxConcurrent`. Use `Promise.allSettled()` on each chunk. Loop through chunks sequentially.

**Acceptance criteria:**

- [ ] maxConcurrent never exceeded
- [ ] Batches processed sequentially
- [ ] Failed tokens included not skipped
- [ ] Correct formattedBalance with BigInt
- [ ] No `any` types

**Why this challenge?**
Your `concurrent-wallet-balance-aggregator.ts` fetches without limits. This adds the rate limit pattern that every production Alchemy integration requires to avoid 429 errors.

---

## 🟡 MEDIUM #4 — Async Block Event Subscription with Retry

**Difficulty: 5.7/10**

**Real-world scenario:**
Your Whale Watcher backend subscribes to live blockchain events and processes them as they arrive. When the RPC subscription drops (network blip, rate limit), your service must reconnect automatically without losing events or duplicating them. Your `event-subscription-manager.ts` manages subscriptions — this builds the resilient reconnection logic underneath it.

**Problem statement:**
Build an `EventSubscription` class that polls for new events at regular intervals, automatically retries on failure with exponential backoff, and tracks all received events without duplicates. The subscription should run until explicitly stopped.

**Input:**

```typescript
type SubscriptionConfig = {
  contractAddress: string;
  eventName: string;
  pollIntervalMs: number;
  maxRetries: number; // retries before giving up on a single poll
  onEvent: (events: ChainEvent[]) => void;
  onError?: (error: Error) => void;
};

type ChainEvent = {
  txHash: string;
  blockNumber: number;
  args: Record<string, string | number>;
  timestamp: number;
};

class EventSubscription {
  constructor(config: SubscriptionConfig);
  start(): void;
  stop(): void;
  getStats(): SubscriptionStats;
}

type SubscriptionStats = {
  isRunning: boolean;
  totalEvents: number;
  uniqueEvents: number; // deduplicated by txHash
  pollCount: number;
  errorCount: number;
  retryCount: number;
};
```

**Constraints:**

- Poll at `pollIntervalMs` intervals
- On poll failure: retry up to `maxRetries` with exponential backoff (500ms, 1000ms, 2000ms...)
- Deduplicate events by `txHash` — never call `onEvent` with the same hash twice
- `stop()` must cleanly cancel polling
- Use mock below

**Mock:**

```typescript
let _pollCount = 0;
function mockPollEvents(
  contract: string,
  event: string,
): Promise<ChainEvent[]> {
  _pollCount++;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (_pollCount % 4 === 0) reject(new Error("RPC rate limited"));
      else
        resolve([
          {
            txHash: `0x${_pollCount.toString(16).padStart(8, "0")}`,
            blockNumber: 19000000 + _pollCount,
            args: { from: "0xAlice", amount: _pollCount * 100 },
            timestamp: Date.now(),
          },
        ]);
    }, 80);
  });
}
```

**Example:**

```
subscription.start()
// 5 polls happen: polls 1,2,3 succeed, poll 4 fails then retries, poll 5 succeeds
subscription.stop()

getStats() → {
  isRunning: false,
  totalEvents: 4,    // events received (before dedup)
  uniqueEvents: 4,   // after dedup by txHash
  pollCount: 5,
  errorCount: 1,
  retryCount: 1
}
```

**Acceptance criteria:**

- [ ] Polling runs at correct interval
- [ ] Exponential backoff on failure
- [ ] Deduplication by txHash
- [ ] stop() cleanly terminates
- [ ] Stats tracked accurately
- [ ] No `any` types

**Why this challenge?**
This is the core of your Month 5 Whale Watcher event listener. Without retry and deduplication, a production event subscription misses events or processes transfers multiple times — both cause data corruption.

---

## 🟡 MEDIUM #5 — Async Multi-RPC Request with Fallback Chain

**Difficulty: 6.0/10**

**Real-world scenario:**
Production Web3 backends maintain a prioritized list of RPC endpoints. The primary (Alchemy) gets the first request. If it fails, the secondary (Infura) is tried. If that fails, the tertiary (public node) is used as last resort. This fallback chain prevents a single RPC failure from taking down your service. Your `rpc-fallback-fetcher.ts` implements the basic pattern — this adds priority ordering, timeout per node, and detailed fallback tracking.

**Problem statement:**
Build an async function `fetchWithFallbackChain<T>(request: RPCRequest<T>, nodes: RPCNode[]): Promise<FallbackResult<T>>` that tries each RPC node in priority order until one succeeds, with per-node timeouts.

**Input:**

```typescript
type RPCNode = {
  name: string
  url: string
  priority: number      // lower = higher priority (1 = primary)
  timeoutMs: number
}

type RPCRequest<T> = {
  method: string
  params: unknown[]
  parser: (raw: unknown) => T   // converts raw RPC response to typed result
}

nodes: RPCNode[]                 // try in priority order
request: RPCRequest<T>
```

**Output:**

```typescript
type NodeAttempt = {
  nodeName: string;
  attempted: boolean;
  succeeded: boolean;
  latencyMs: number | null;
  error?: string;
};

type FallbackResult<T> = {
  result: T | null;
  usedNode: string | null;
  attempts: NodeAttempt[];
  totalLatencyMs: number;
  succeeded: boolean;
};
```

**Constraints:**

- Nodes must be tried in priority order (sort by priority ascending first)
- Per-node timeout via Promise.race
- Stop trying once one succeeds — do NOT try all nodes
- If ALL nodes fail — result is null, succeeded false
- Nodes not yet attempted have `attempted: false`

**Mock:**

```typescript
function mockRPCCall(
  url: string,
  method: string,
  params: unknown[],
): Promise<unknown> {
  const responses: Record<
    string,
    { result: unknown; delay: number; fails: boolean }
  > = {
    "https://primary.example.com": {
      result: { balance: "2500000000000000000" },
      delay: 150,
      fails: false,
    },
    "https://secondary.example.com": {
      result: { balance: "2500000000000000000" },
      delay: 300,
      fails: false,
    },
    "https://tertiary.example.com": {
      result: { balance: "2500000000000000000" },
      delay: 800,
      fails: false,
    },
    "https://dead.example.com": { result: null, delay: 50, fails: true },
  };
  const cfg = responses[url] ?? { result: null, delay: 100, fails: false };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cfg.fails) reject(new Error(`${url}: connection refused`));
      else resolve(cfg.result);
    }, cfg.delay);
  });
}
```

**Example:**

```
Primary fails → try secondary → secondary succeeds → return

Result: {
  result: <parsed data>,
  usedNode: "secondary",
  succeeded: true,
  attempts: [
    { nodeName: "primary",   attempted: true, succeeded: false, error: "..." },
    { nodeName: "secondary", attempted: true, succeeded: true  },
    { nodeName: "tertiary",  attempted: false, succeeded: false },
  ]
}
```

**Acceptance criteria:**

- [ ] Nodes tried in priority order
- [ ] Stops after first success
- [ ] Per-node timeout applied
- [ ] Unattempted nodes marked attempted: false
- [ ] Generic type T preserved through parser
- [ ] No `any` types

**Why this challenge?**
This is the fallback architecture every production Web3 backend uses. Alchemy goes down — Infura kicks in. Infura is slow — public node covers. Without this, a single RPC failure takes down your service.

---

## 🟡 MEDIUM #6 — Async DeFi Liquidation Scanner

**Difficulty: 6.5/10**

**Real-world scenario:**
Liquidation bots scan lending protocols (Aave, Compound) to find undercollateralized positions and liquidate them for profit. The scanner must fetch current prices, calculate health factors, sort by profitability, and trigger liquidations for eligible positions — all within a tight time window before other bots compete. Your `defi-price-feed-aggregator.ts` fetches prices — this uses those prices to find and rank liquidation opportunities.

**Problem statement:**
Build an async function `scanLiquidationOpportunities(positions: Position[], priceFeeds: string[]): Promise<LiquidationScanReport>` that fetches current token prices, calculates health factors for all positions concurrently, and returns ranked liquidation opportunities.

**Input:**

```typescript
type Position = {
  id: string
  borrower: string
  collateralToken: string
  collateralAmount: number
  debtToken: string
  debtAmount: number
}

positions: Position[]
priceFeeds: string[]    // URLs to fetch prices from
```

**Output:**

```typescript
type LiquidationOpportunity = {
  positionId: string;
  borrower: string;
  healthFactor: number; // collateralValueUSD / debtValueUSD
  collateralValueUSD: number;
  debtValueUSD: number;
  liquidationBonusUSD: number; // debtValueUSD * 0.05
  status: "liquidatable" | "at_risk" | "safe";
  // liquidatable: healthFactor < 1.0
  // at_risk: 1.0 <= healthFactor <= 1.2
  // safe: > 1.2
};

type LiquidationScanReport = {
  scannedAt: number;
  totalPositions: number;
  liquidatable: LiquidationOpportunity[]; // sorted by liquidationBonusUSD desc
  atRisk: LiquidationOpportunity[]; // sorted by healthFactor asc
  safe: LiquidationOpportunity[];
  pricesUsed: Record<string, number>; // token → price in USD
};
```

**Constraints:**

- Fetch all prices concurrently first
- Then calculate all health factors concurrently
- If a token price is unavailable — skip that position (do not crash)
- Sort liquidatable by bonus descending
- Use mocks below

**Mocks:**

```typescript
function mockGetPrice(feedUrl: string, token: string): Promise<number> {
  const prices: Record<string, number> = {
    ETH: 3200,
    BTC: 67000,
    USDC: 1,
    LINK: 18,
    DAI: 0.999,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (prices[token]) resolve(prices[token]);
      else reject(new Error(`No price for ${token}`));
    }, 100);
  });
}
```

**Example:**

```
Position: Bob has 1 ETH collateral ($3200), $3500 USDC debt
healthFactor = 3200 / 3500 = 0.914 → liquidatable
liquidationBonusUSD = 3500 * 0.05 = $175

Position: Alice has 10 ETH collateral ($32000), $25000 USDC debt
healthFactor = 32000 / 25000 = 1.28 → safe
```

**Acceptance criteria:**

- [ ] Prices fetched concurrently
- [ ] Health factors calculated correctly
- [ ] Correct status assignment
- [ ] liquidatable sorted by bonus descending
- [ ] Missing price positions skipped gracefully
- [ ] No `any` types

**Why this challenge?**
This directly extends your async foundations into real DeFi infrastructure. Liquidation scanning is production work at Aave and Compound. Every concept from your foundation challenges appears here simultaneously.

---

## 🟡 MEDIUM #7 — Async On-Chain Data Cache with TTL

**Difficulty: 7.0/10**

**Real-world scenario:**
Web3 backends read the same on-chain data thousands of times per minute — ETH price, token supplies, contract state. Hitting the RPC for every read causes rate limiting and latency. A TTL cache serves cached data and only fetches fresh data when the cache expires. Your `async-block-confirmation-poller.ts` polls repeatedly — this adds a cache layer to avoid redundant fetches.

**Problem statement:**
Build an `AsyncTTLCache<T>` class that caches async fetch results for a configurable TTL. Concurrent requests for the same key while it is being fetched must reuse the in-flight request — not start a new one (request deduplication). Expired entries must be refetched on next access.

**Input:**

```typescript
type CacheConfig = {
  ttlMs: number; // how long entries stay valid
  maxSize: number; // max entries (evict oldest on overflow)
};

class AsyncTTLCache<T> {
  constructor(config: CacheConfig, fetcher: (key: string) => Promise<T>);
  async get(key: string): Promise<CacheResult<T>>;
  invalidate(key: string): void;
  getStats(): CacheStats;
}

type CacheResult<T> = {
  value: T;
  fromCache: boolean;
  age: number; // ms since fetched
  key: string;
};

type CacheStats = {
  size: number;
  hits: number;
  misses: number;
  deduplicatedRequests: number; // concurrent requests served from in-flight fetch
  evictions: number;
};
```

**Constraints:**

- `get()`: if fresh entry exists → serve from cache (hit)
- `get()`: if expired or missing → fetch fresh (miss)
- Request deduplication: if 3 concurrent `get("ETH")` arrive while fetching → only 1 fetch, all 3 get same result
- LRU eviction when maxSize exceeded
- `invalidate()` forces next `get()` to fetch fresh
- No `any` types

**Example:**

```
cache = new AsyncTTLCache({ ttlMs: 5000, maxSize: 10 }, fetchPrice)

t=0:    get("ETH") → miss → fetch → { value: 3187, fromCache: false }
t=100:  get("ETH") → hit  → { value: 3187, fromCache: true, age: 100 }
t=6000: get("ETH") → miss (expired) → fetch fresh

// Concurrent deduplication:
Promise.all([get("BTC"), get("BTC"), get("BTC")])
→ only 1 fetch triggered, all 3 get same value
stats.deduplicatedRequests === 2
```

**Acceptance criteria:**

- [ ] Fresh/expired correctly determined
- [ ] Request deduplication — concurrent = 1 fetch
- [ ] LRU eviction at maxSize
- [ ] invalidate() forces refetch
- [ ] All stats tracked correctly
- [ ] No `any` types

**Why this challenge?**
Every production Web3 backend caches on-chain data. Request deduplication is the hardest caching pattern and directly applies to your Month 5 backend service that reads contract state repeatedly under concurrent load.

---

---

# 🔴 HARD CHALLENGES

---

## 🔴 HARD #1 — Async Transaction Submission Engine with Nonce Manager

**Difficulty: 7.5/10**

**Real-world scenario:**
Your Month 6 Gasless Relayer submits transactions on behalf of users. Under load, multiple UserOperations arrive simultaneously — but Ethereum requires sequential nonces. A production submission engine maintains a nonce lock, queues concurrent submissions, processes them in order, and recovers from nonce gaps caused by failed transactions. This is real infrastructure at Gelato, OpenZeppelin Defender, and Biconomy.

**Problem statement:**
Build a `TransactionSubmissionEngine` class that accepts concurrent transaction requests, manages nonces atomically (no two transactions get the same nonce), processes them sequentially, and handles nonce recovery after failures.

**Input:**

```typescript
type SubmissionRequest = {
  id: string;
  from: string;
  to: string;
  value: number;
  data?: string;
  priority: "normal" | "high"; // high priority jumps the queue
};

type SubmissionResult = {
  id: string;
  nonce: number;
  txHash: string | null;
  status: "submitted" | "failed" | "replaced";
  attempts: number;
  queueTimeMs: number; // time spent waiting in queue
  submissionTimeMs: number; // time spent submitting
};

class TransactionSubmissionEngine {
  constructor(senderAddress: string, startNonce: number);
  async submit(request: SubmissionRequest): Promise<SubmissionResult>;
  async submitBatch(requests: SubmissionRequest[]): Promise<SubmissionResult[]>;
  getQueueStatus(): QueueStatus;
}

type QueueStatus = {
  queueLength: number;
  currentNonce: number;
  processing: boolean;
  totalSubmitted: number;
  totalFailed: number;
};
```

**Constraints:**

- `submit()` is called concurrently by multiple callers — no nonce collisions allowed
- High priority requests jump ahead of normal priority in queue
- Retry failed submissions once with 1s delay before marking failed
- `submitBatch()` submits all requests and waits for all results
- Nonce increments only after successful submission — failed tx does not consume nonce
- Use mock below

**Mock:**

```typescript
function mockSubmitTransaction(tx: {
  from: string;
  to: string;
  value: number;
  nonce: number;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (tx.value < 0) reject(new Error("Invalid value"));
        else if (Math.random() < 0.15) reject(new Error("Gas price too low"));
        else resolve(`0x${tx.nonce.toString(16).padStart(64, "0")}`);
      },
      200 + Math.random() * 200,
    );
  });
}
```

**Acceptance criteria:**

- [ ] No nonce collisions under concurrent load
- [ ] High priority requests processed before normal
- [ ] Failed tx does not consume nonce
- [ ] submitBatch returns all results after all complete
- [ ] QueueStatus accurate in real time
- [ ] No `any` types

**Why this challenge?**
This is the production version of your Medium #2 queue. The addition of priority ordering, concurrent submit() calls, and nonce recovery makes this the actual architecture used in your Month 6 Gasless Relayer.

---

## 🔴 HARD #2 — Async Blockchain Event Indexer with Gap Detection

**Difficulty: 8.0/10**

**Real-world scenario:**
Production event indexers (The Graph, Ponder) must never miss a block. When the indexer restarts after a crash, it must detect which blocks were already processed, identify any gaps caused by the crash, backfill those gaps, and resume from where it left off. Your `sequential-block-processor.ts` processes blocks in sequence — this challenge adds persistent checkpointing and gap recovery.

**Problem statement:**
Build an `EventIndexer` class that processes contract events block by block, saves checkpoints after each batch, detects gaps on restart, and backfills them before resuming. The indexer must handle RPC failures with retry logic.

**Input:**

```typescript
type IndexerConfig = {
  contractAddress: string;
  startBlock: number;
  batchSize: number;
  maxRetries: number;
  onEvents: (
    events: IndexedEvent[],
    fromBlock: number,
    toBlock: number,
  ) => Promise<void>;
};

type IndexedEvent = {
  txHash: string;
  blockNumber: number;
  eventType: string;
  args: Record<string, unknown>;
};

class EventIndexer {
  constructor(config: IndexerConfig);
  async start(): Promise<void>;
  stop(): void;
  loadCheckpoint(checkpoint: IndexerCheckpoint): void;
  getCheckpoint(): IndexerCheckpoint;
  getStats(): IndexerStats;
}

type IndexerCheckpoint = {
  lastProcessedBlock: number;
  totalEventsIndexed: number;
  savedAt: number;
};

type IndexerStats = {
  blocksProcessed: number;
  eventsIndexed: number;
  gapsDetected: number;
  gapsFilled: number;
  retries: number;
  isRunning: boolean;
};
```

**Constraints:**

- Process blocks in ascending order, `batchSize` blocks per fetch
- Save checkpoint after each successful batch
- On restart with existing checkpoint: detect gap between checkpoint and current tip, backfill gap first
- Retry failed batch fetches up to `maxRetries` with 2s delay
- After max retries — stop indexer and preserve checkpoint
- `onEvents` callback is awaited before moving to next batch

**Acceptance criteria:**

- [ ] Blocks processed in strict ascending order
- [ ] Checkpoint saved after each batch
- [ ] Gap detection correct on restart
- [ ] Backfill completes before resuming forward indexing
- [ ] Retry with correct delay
- [ ] onEvents awaited before next batch
- [ ] No `any` types

**Why this challenge?**
This is exactly what The Graph does internally. When you deploy your subgraph in Month 5, understanding the indexing engine helps you debug sync issues, missed events, and stale data — the most common subgraph problems in production.

---

## 🔴 HARD #3 — Async MEV Bundle Simulator with State Dependency Graph

**Difficulty: 8.5/10**

**Real-world scenario:**
MEV searchers construct bundles of interdependent transactions — a flash loan must execute before an arbitrage, and the arbitrage output must feed the repayment. Simulating this bundle requires resolving execution order from a dependency graph, threading state between steps, and detecting circular dependencies before they are submitted to Flashbots. Your `mev-bot-transaction-classifier.ts` classifies MEV patterns — this simulates their execution.

**Problem statement:**
Build an async function `simulateMEVBundle(bundle: MEVBundle): Promise<BundleSimulation>` that resolves the dependency order of bundle steps using topological sort, simulates each step passing output to dependent steps, and returns full execution trace.

**Input:**

```typescript
type BundleStep = {
  id: string;
  type: "flashloan" | "swap" | "liquidation" | "repay" | "transfer";
  dependsOn: string[]; // IDs of steps that must complete first
  inputAmount?: number; // fixed input (if no dependency output)
  gasLimit: number;
};

type MEVBundle = {
  blockTarget: number;
  steps: BundleStep[];
  minProfitWei: number; // reject bundle if net profit below this
};
```

**Output:**

```typescript
type StepResult = {
  stepId: string;
  executionOrder: number; // 1-indexed position in execution sequence
  inputAmount: number;
  outputAmount: number;
  gasUsed: number;
  profit: number;
  status: "success" | "reverted";
  revertReason?: string;
};

type BundleSimulation = {
  blockTarget: number;
  executionOrder: string[]; // step IDs in execution order
  steps: StepResult[];
  totalGasUsed: number;
  totalProfit: number;
  netProfit: number; // totalProfit - gasCostWei
  worthSubmitting: boolean; // netProfit >= minProfitWei
  cycleDetected: boolean;
  simulatedAt: number;
};
```

**Constraints:**

- Detect circular dependencies BEFORE simulation — set cycleDetected true, return early
- Topological sort to determine execution order
- Independent steps may execute concurrently
- Dependent steps receive previous step's `outputAmount` as their `inputAmount`
- If any step reverts AND subsequent steps depend on it — those steps are skipped
- Use mock below

**Mock:**

```typescript
function mockSimulateStep(
  step: BundleStep,
  inputAmount: number,
): Promise<{
  outputAmount: number;
  gasUsed: number;
  profit: number;
  reverted: boolean;
  revertReason?: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reverted = step.id === "step-revert";
      resolve({
        outputAmount: reverted
          ? 0
          : inputAmount * (0.98 + Math.random() * 0.04),
        gasUsed: Math.floor(step.gasLimit * 0.7),
        profit: reverted ? 0 : Math.floor(Math.random() * 50000),
        reverted,
        revertReason: reverted ? "Insufficient output amount" : undefined,
      });
    }, 100);
  });
}
```

**Acceptance criteria:**

- [ ] Cycle detection returns early with cycleDetected true
- [ ] Correct topological sort
- [ ] Independent steps run concurrently
- [ ] Dependent steps receive correct inputAmount from dependency
- [ ] Reverted step skips dependents
- [ ] worthSubmitting correctly calculated
- [ ] No `any` types

**Why this challenge?**
Dependency graph resolution is used in Foundry's test execution, The Graph's indexing pipeline, and multi-step DeFi protocol interactions. This challenge directly prepares you for Month 6 multi-contract capstone work.

---

## 🔴 HARD #4 — Async Cross-Chain Bridge Monitor with State Machine

**Difficulty: 9.0/10**

**Real-world scenario:**
Cross-chain bridge transactions have multiple states across two chains: initiated on source, relayed by bridge, finalized on destination. Each state transition has a timeout — if the bridge does not relay within 30 minutes, the transaction is considered stuck. Your backend at a bridge protocol must track hundreds of in-flight transactions simultaneously, detect stuck ones, and trigger alerts or automatic retries. This is real production work at Across Protocol and LayerZero.

**Problem statement:**
Build a `BridgeMonitor` class that tracks cross-chain transactions through a defined state machine, detects state transition timeouts, attempts automatic retry for stuck transactions, and maintains a real-time dashboard of all monitored transactions.

**Input:**

```typescript
type BridgeTx = {
  id: string;
  sourceChain: string;
  destChain: string;
  sourceTxHash: string;
  amount: number;
  token: string;
  initiatedAt: number;
};

type BridgeState =
  | "initiated"
  | "source_confirmed"
  | "relayed"
  | "dest_confirmed"
  | "completed"
  | "stuck"
  | "failed";

type StateTimeouts = {
  source_confirmed: number; // ms after initiated
  relayed: number; // ms after source_confirmed
  dest_confirmed: number; // ms after relayed
};

class BridgeMonitor {
  constructor(timeouts: StateTimeouts, pollIntervalMs: number);
  addTransaction(tx: BridgeTx): void;
  async start(): Promise<void>;
  stop(): void;
  getTransaction(id: string): BridgeTxStatus | null;
  getDashboard(): MonitorDashboard;
}

type BridgeTxStatus = {
  tx: BridgeTx;
  currentState: BridgeState;
  stateHistory: Array<{ state: BridgeState; enteredAt: number }>;
  isStuck: boolean;
  retryCount: number;
  estimatedCompletionMs: number | null;
};

type MonitorDashboard = {
  total: number;
  byState: Record<BridgeState, number>;
  stuck: BridgeTxStatus[];
  completed: number;
  averageCompletionMs: number | null;
};
```

**Constraints:**

- Poll all transaction states concurrently every `pollIntervalMs`
- State transitions only advance (no going backward)
- If time in current state exceeds timeout — mark as "stuck"
- Stuck transactions: retry polling 3 times before marking "failed"
- State history records every transition with timestamp
- `getDashboard()` is synchronous — reads current state
- Use mock below

**Mock:**

```typescript
function mockGetBridgeTxState(sourceTxHash: string): Promise<{
  state: "source_confirmed" | "relayed" | "dest_confirmed" | "completed";
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const elapsed = Date.now() - (mockGetBridgeTxState as any)[sourceTxHash];
      if (elapsed > 2000) resolve({ state: "completed" });
      else if (elapsed > 1200) resolve({ state: "dest_confirmed" });
      else if (elapsed > 600) resolve({ state: "relayed" });
      else resolve({ state: "source_confirmed" });
      (mockGetBridgeTxState as any)[sourceTxHash] ??= Date.now();
    }, 100);
  });
}
```

**Acceptance criteria:**

- [ ] All transactions polled concurrently
- [ ] State machine only advances — no backward transitions
- [ ] Timeout detection correct per state
- [ ] 3 retries before marking failed
- [ ] Complete state history maintained
- [ ] getDashboard() real-time accurate
- [ ] No `any` types

**Why this challenge?**
Cross-chain monitoring is real production work. Understanding state machines for asynchronous multi-step processes is the architectural foundation of every bridge, settlement system, and multi-chain protocol you will build in your career.

---

## 🔴 HARD #5 — Async DeFi Liquidation Engine with Circuit Breaker and Priority Queue

**Difficulty: 10.0/10**

**Real-world scenario:**
During market crashes, hundreds of positions become liquidatable simultaneously. A production liquidation engine must prioritize the most profitable positions, execute up to N liquidations concurrently (nonce management), implement circuit breakers to stop if the market is moving too fast (price volatility check), recover from partial failures, and produce an auditable execution report. This is the exact system running at Aave, Compound, and every major liquidation bot operation.

**Problem statement:**
Build an async `LiquidationEngine` class that is the complete production system: price fetching with circuit breaker, position scanning, priority queue sorting, concurrent execution with nonce management, failure recovery, and a full audit report.

**Input:**

```typescript
type EngineConfig = {
  liquidatorAddress: string;
  maxConcurrent: number;
  minProfitUSD: number;
  circuitBreaker: {
    maxPriceVolatilityPercent: number; // halt if price moved > X% since scan start
    maxFailureRate: number; // halt if > X% of liquidations failing
    cooldownMs: number; // wait before retrying after circuit open
  };
};

type LiquidatablePosition = {
  id: string;
  borrower: string;
  collateralToken: string;
  collateralAmountUSD: number;
  debtToken: string;
  debtAmountUSD: number;
  healthFactor: number;
  liquidationBonusUSD: number;
};

class LiquidationEngine {
  constructor(config: EngineConfig);
  async executeLiquidations(
    positions: LiquidatablePosition[],
  ): Promise<ExecutionReport>;
  getCircuitBreakerStatus(): "closed" | "open" | "half-open";
}

type ExecutionReport = {
  startedAt: number;
  completedAt: number;
  totalPositions: number;
  attempted: number;
  successful: number;
  failed: number;
  skipped: number; // below minProfitUSD
  circuitBreakerTripped: boolean;
  circuitBreakerReason?: string;
  totalProfitUSD: number;
  totalGasCostUSD: number;
  netProfitUSD: number;
  results: Array<{
    positionId: string;
    status: "success" | "failed" | "skipped" | "circuit_halted";
    profitUSD: number | null;
    txHash: string | null;
    error?: string;
    executedAt: number;
  }>;
};
```

**Constraints:**

- Sort positions by `liquidationBonusUSD` descending before execution
- Skip positions where `liquidationBonusUSD < minProfitUSD`
- Execute up to `maxConcurrent` liquidations simultaneously (sliding window — not batches)
- Circuit breaker checks:
  1. Price volatility: re-fetch prices mid-execution — if moved > threshold → open circuit
  2. Failure rate: if > maxFailureRate of attempted liquidations fail → open circuit
- On circuit open: mark remaining positions as "circuit_halted", stop execution
- Circuit enters "half-open" after cooldownMs — test with one liquidation
- If half-open succeeds → closed. If fails → open again.
- Use mocks below

**Mocks:**

```typescript
function mockLiquidate(position: LiquidatablePosition): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (position.id === "pos-fail")
          reject(new Error("Liquidation reverted"));
        else resolve(`0x${position.id.padEnd(64, "0")}`);
      },
      300 + Math.random() * 200,
    );
  });
}

function mockGetCurrentPrice(token: string): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulates slight price movement
      resolve(3200 * (0.98 + Math.random() * 0.04));
    }, 50);
  });
}
```

**Acceptance criteria:**

- [ ] Positions sorted by bonus descending
- [ ] Sliding window concurrency — maxConcurrent active at all times
- [ ] Price volatility circuit breaker correctly triggers
- [ ] Failure rate circuit breaker correctly triggers
- [ ] Half-open state correctly tested with single liquidation
- [ ] circuit_halted positions correctly identified
- [ ] Complete audit report with all fields accurate
- [ ] No `any` types

**Why this challenge?**
This is the capstone of everything. It combines every async pattern from this entire challenge set: concurrent execution, circuit breakers, priority queues, sliding windows, state management, and auditable reporting. Completing this correctly means you are ready for Month 5–6 protocol engineering work.

---

## END OF CHALLENGE SET

---

## PROGRESSION SUMMARY

| #   | Challenge                            | Difficulty | Core Concept                       |
| --- | ------------------------------------ | ---------- | ---------------------------------- |
| E1  | Wrap Callback in Promise             | 1.0        | new Promise()                      |
| E2  | Async Identity Validator             | 1.5        | async/await basics                 |
| E3  | Sequential Balance Fetcher           | 2.0        | for...of + await                   |
| E4  | Async Token Symbol Resolver          | 2.5        | Promise.allSettled                 |
| E5  | Gas Price with Default               | 2.5        | try/catch fallback                 |
| E6  | Concurrent Tx Validator              | 3.0        | concurrent + collect all errors    |
| E7  | Block Explorer Lookup                | 3.0        | concurrent + not-found handling    |
| E8  | Wallet Nonce Fetcher                 | 3.5        | concurrent + aggregation           |
| E9  | Event Log Enricher                   | 3.5        | allSettled + data transformation   |
| E10 | RPC Latency Tester                   | 4.0        | race + timeout + sort              |
| M1  | Token Price Aggregator               | 4.5        | timeout + median + confidence      |
| M2  | Transaction Queue + Nonces           | 5.0        | sequential + retry + state         |
| M3  | Portfolio + Concurrency Limit        | 5.3        | batching + BigInt                  |
| M4  | Event Subscription + Retry           | 5.7        | polling + backoff + dedup          |
| M5  | Multi-RPC Fallback Chain             | 6.0        | priority + fallback + generics     |
| M6  | Liquidation Scanner                  | 6.5        | concurrent prices + health factors |
| M7  | TTL Cache + Deduplication            | 7.0        | caching + in-flight dedup + LRU    |
| H1  | Submission Engine + Nonces           | 7.5        | priority queue + atomic nonces     |
| H2  | Event Indexer + Gaps                 | 8.0        | checkpointing + gap detection      |
| H3  | MEV Bundle + DAG                     | 8.5        | topological sort + state threading |
| H4  | Bridge Monitor + State Machine       | 9.0        | state machine + timeouts + retries |
| H5  | Liquidation Engine + Circuit Breaker | 10.0       | everything combined                |
