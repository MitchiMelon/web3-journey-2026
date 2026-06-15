# Functions → Callbacks → Arrow Functions → HOF

## Complete TypeScript Curriculum for Web3 Backend Engineers

### 45 Challenges · 6 Sections · 2–4 Weeks

---

> **WHY THIS CURRICULUM EXISTS**
>
> Async code is not hard. What makes async feel hard is not understanding
> how functions are passed around as values. Once you can read and write
> callbacks and higher-order functions fluently, async/await becomes
> obvious — because it is just callbacks with nicer syntax.
>
> This curriculum fixes the root problem, not the symptom.

---

> **RULES**
>
> 1. TypeScript only — no JavaScript
> 2. Write pseudocode first before touching the function body
> 3. No AI for code — AI only to explain error messages
> 4. Run each challenge: `npx ts-node challenge-X.ts`
> 5. Commit every solution before moving to the next

---

## PROGRESSION MAP

```
SECTION 1 — Function Fundamentals       (Ch 1–8)   Difficulty 1–2.5
SECTION 2 — Arrow Functions             (Ch 9–16)  Difficulty 2–4
SECTION 3 — Callbacks                   (Ch 17–24) Difficulty 3–5
SECTION 4 — Array Methods               (Ch 25–33) Difficulty 3–5.5
SECTION 5 — Higher-Order Functions      (Ch 34–40) Difficulty 5–7
SECTION 6 — Real-World Web3 Reading     (Ch 41–45) Difficulty 6–8
CAPSTONE   — Final Assessment           (Ch 46–50) Difficulty 7–9
```

---

---

# SECTION 1 — Function Fundamentals

> **Goal:** Understand that functions are named blocks of reusable logic.
> Master declarations, expressions, parameters, return values, and void functions.
> Every concept here is the building block for everything that follows.

---

## Challenge 1 — Wallet Balance Formatter

**Difficulty: 1/10**

**Concepts:**

- Function declaration
- Parameters
- Return values
- Basic TypeScript types

**Real-world scenario:**
Every blockchain explorer displays wallet balances in a human-readable format. Raw balances come from the chain as large integers. A formatting function converts them for display. This is one of the first utility functions in any Web3 frontend or backend.

**Problem statement:**
Write a function `formatBalance` that takes a raw balance in wei (as a number) and a token symbol (as a string), and returns a formatted string showing the balance in ETH (divided by 10^18) with 4 decimal places, followed by the symbol.

**Input:**

```typescript
weiAmount: number;
symbol: string;
```

**Output:**

```typescript
string; // e.g. "1.2500 ETH"
```

**Example:**

```
Input:  weiAmount: 1250000000000000000, symbol: "ETH"
Output: "1.2500 ETH"

Input:  weiAmount: 500000000000000000, symbol: "WETH"
Output: "0.5000 WETH"
```

**Acceptance Criteria:**

- [ ] Uses a function declaration (not arrow function yet)
- [ ] Correctly divides by 10^18
- [ ] Exactly 4 decimal places
- [ ] Appends symbol with a space

**Hints:**
Use `toFixed(4)` for decimal formatting.

**Why this challenge matters:**
Every viem response returns balances as `bigint`. This formatter pattern is used everywhere in Web3 backends to display data to users or write it to databases.

---

## Challenge 2 — RPC Endpoint Validator

**Difficulty: 1.2/10**

**Concepts:**

- Function declaration
- Multiple parameters
- Boolean return values
- String methods

**Real-world scenario:**
Before your backend connects to an RPC node, it validates the endpoint URL format. An invalid URL causes cryptic connection errors downstream. A simple validator catches the problem early and gives a clear error message.

**Problem statement:**
Write a function `isValidRPCEndpoint` that takes a URL string and returns `true` if it is a valid RPC endpoint, `false` otherwise.

A valid RPC endpoint must:

- Start with `https://` or `wss://`
- Not be empty
- Contain at least one dot after the protocol
- Not contain spaces

**Input:**

```typescript
url: string;
```

**Output:**

```typescript
boolean;
```

**Example:**

```
Input:  "https://eth-mainnet.g.alchemy.com/v2/key"
Output: true

Input:  "http://insecure-rpc.com"
Output: false  (must use https or wss)

Input:  "not a url"
Output: false
```

**Acceptance Criteria:**

- [ ] Returns true only for https:// or wss:// prefixed URLs
- [ ] Returns false for empty strings
- [ ] Returns false for URLs with spaces
- [ ] Uses a named function declaration

**Why this challenge matters:**
Input validation functions are the first line of defense in any backend. Your Express routes validate input before touching the database — this pattern starts here.

---

## Challenge 3 — Transaction Status Descriptor

**Difficulty: 1.5/10**

**Concepts:**

- Function declaration
- Parameters with union types
- Return values
- Switch or if/else logic

**Real-world scenario:**
Blockchain transactions have numeric status codes (0 = failed, 1 = success, 2 = pending). Your backend converts these codes into human-readable descriptions before sending them to a frontend or storing them in a database.

**Problem statement:**
Write a function `describeTxStatus` that takes a numeric status code and returns a descriptive object with a label and color code.

**Input:**

```typescript
statusCode: 0 | 1 | 2;
```

**Output:**

```typescript
type StatusDescription = {
  label: string;
  color: string;
  actionRequired: boolean;
};
```

**Example:**

```
Input:  0
Output: { label: "Failed", color: "#FF4444", actionRequired: true }

Input:  1
Output: { label: "Confirmed", color: "#44FF44", actionRequired: false }

Input:  2
Output: { label: "Pending", color: "#FFAA00", actionRequired: false }
```

**Acceptance Criteria:**

- [ ] Returns correct label for each status code
- [ ] Returns correct color hex code
- [ ] `actionRequired` is true only for failed transactions
- [ ] TypeScript union type used for parameter

**Why this challenge matters:**
Functions that transform one data shape into another (status code → description object) are the most common utility functions in any backend. You will write dozens of these in Month 2–5.

---

## Challenge 4 — Gas Price Analyzer

**Difficulty: 1.8/10**

**Concepts:**

- Function declaration
- Multiple parameters
- Object return type
- Basic arithmetic

**Real-world scenario:**
Before submitting a transaction, your backend analyzes the current gas price and determines whether it is safe to submit or whether to wait for lower fees. This analysis function is called before every transaction submission.

**Problem statement:**
Write a function `analyzeGasPrice` that takes current gas price in Gwei and a max acceptable gas price in Gwei, and returns an analysis object.

**Input:**

```typescript
currentGwei: number;
maxAcceptableGwei: number;
```

**Output:**

```typescript
type GasAnalysis = {
  currentGwei: number;
  maxAcceptableGwei: number;
  isSafe: boolean;
  recommendation: string; // "submit" | "wait" | "urgent"
  percentOfMax: number; // currentGwei / maxAcceptableGwei * 100, rounded to 1dp
};
```

**Example:**

```
Input:  currentGwei: 25, maxAcceptableGwei: 50
Output: {
  currentGwei: 25,
  maxAcceptableGwei: 50,
  isSafe: true,
  recommendation: "submit",
  percentOfMax: 50.0
}

Input:  currentGwei: 95, maxAcceptableGwei: 50
Output: {
  ...
  isSafe: false,
  recommendation: "wait",
  percentOfMax: 190.0
}
```

**Rules for recommendation:**

- `percentOfMax <= 60` → "submit"
- `percentOfMax <= 100` → "urgent"
- `percentOfMax > 100` → "wait"

**Acceptance Criteria:**

- [ ] isSafe is true when currentGwei <= maxAcceptableGwei
- [ ] recommendation follows the rules above
- [ ] percentOfMax rounded to 1 decimal place
- [ ] Returns complete GasAnalysis object

**Why this challenge matters:**
Analysis functions that take raw data and return structured decisions are the core of any backend service. Your Gasless Relayer in Month 6 makes exactly this kind of decision before every UserOperation submission.

---

## Challenge 5 — Wallet Address Masker

**Difficulty: 2/10**

**Concepts:**

- Function declaration
- String manipulation
- Optional parameters with defaults
- Return type annotation

**Real-world scenario:**
When displaying wallet addresses in logs or UI, full addresses are shown as `0x1234...5678` for privacy and readability. This masking function is used throughout dashboards, audit logs, and notification systems.

**Problem statement:**
Write a function `maskAddress` that takes a wallet address and optional visible character count, and returns a masked version showing the first `visibleChars` and last `visibleChars` characters with `...` in between.

**Input:**

```typescript
address: string
visibleChars?: number    // default: 4
```

**Output:**

```typescript
string;
```

**Example:**

```
Input:  address: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12", visibleChars: 4
Output: "0xAb...f12"

Input:  address: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12"
Output: "0xAb...f12"  (uses default 4)

Input:  address: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12", visibleChars: 6
Output: "0xAbCd...Ef12Ab"
```

**Acceptance Criteria:**

- [ ] Optional parameter with default value of 4
- [ ] Correct number of visible characters at start and end
- [ ] `...` separator in the middle
- [ ] Returns address unchanged if shorter than 2 \* visibleChars

**Why this challenge matters:**
Optional parameters with defaults are used constantly in production TypeScript — Express route handlers, Drizzle query builders, and viem client configs all use this pattern.

---

## Challenge 6 — Block Confirmation Calculator

**Difficulty: 2.2/10**

**Concepts:**

- Function declaration
- Arithmetic operations
- Conditional logic
- Descriptive return objects

**Real-world scenario:**
After submitting a transaction, your backend calculates how many block confirmations are needed and estimates the wait time. Different transaction types require different confirmation thresholds — a small transfer needs 3, a bridge needs 12, an exchange deposit needs 30.

**Problem statement:**
Write a function `calculateConfirmations` that takes the current block number, the block the transaction was included in, and the required confirmations, and returns a confirmation status object.

**Input:**

```typescript
currentBlock: number;
txBlock: number;
required: number;
```

**Output:**

```typescript
type ConfirmationStatus = {
  current: number; // how many confirmations so far
  required: number;
  remaining: number; // how many more needed (min 0)
  percentComplete: number; // rounded to nearest integer
  isConfirmed: boolean;
  estimatedWaitSeconds: number; // remaining * 12 (avg block time)
};
```

**Example:**

```
Input:  currentBlock: 19000010, txBlock: 19000005, required: 12
Output: {
  current: 5,
  required: 12,
  remaining: 7,
  percentComplete: 42,
  isConfirmed: false,
  estimatedWaitSeconds: 84
}
```

**Acceptance Criteria:**

- [ ] `current` = currentBlock - txBlock
- [ ] `remaining` is never negative
- [ ] `percentComplete` rounded to nearest integer, max 100
- [ ] `isConfirmed` true when current >= required
- [ ] `estimatedWaitSeconds` = remaining \* 12

**Why this challenge matters:**
Your `waitForConfirmations` async challenge from the foundation set polls block numbers. This function does the math inside that polling loop — the synchronous calculation that feeds the async decision.

---

## Challenge 7 — Token Allowance Checker

**Difficulty: 2.3/10**

**Concepts:**

- Function declaration
- BigInt handling in TypeScript
- Comparison logic
- Descriptive return type

**Real-world scenario:**
Before a DeFi transaction (swap, stake, lend), your backend checks whether the user has approved sufficient token allowance for the protocol contract. Insufficient allowance means the transaction will revert on-chain, wasting gas.

**Problem statement:**
Write a function `checkAllowance` that takes current allowance, required amount, and token decimals, and returns an allowance check result.

**Input:**

```typescript
currentAllowance: bigint;
requiredAmount: bigint;
tokenSymbol: string;
decimals: number;
```

**Output:**

```typescript
type AllowanceCheck = {
  tokenSymbol: string;
  currentAllowance: bigint;
  requiredAmount: bigint;
  isSufficient: boolean;
  shortfallAmount: bigint; // 0n if sufficient
  approvalNeeded: boolean; // true if shortfall > 0
  formattedCurrent: string; // human readable
  formattedRequired: string; // human readable
};
```

**Example:**

```
Input:
  currentAllowance: 500000000n  (500 USDC, 6 decimals)
  requiredAmount: 1000000000n   (1000 USDC)
  tokenSymbol: "USDC"
  decimals: 6

Output: {
  tokenSymbol: "USDC",
  currentAllowance: 500000000n,
  requiredAmount: 1000000000n,
  isSufficient: false,
  shortfallAmount: 500000000n,
  approvalNeeded: true,
  formattedCurrent: "500.000000 USDC",
  formattedRequired: "1000.000000 USDC"
}
```

**Acceptance Criteria:**

- [ ] Uses `bigint` arithmetic correctly
- [ ] `shortfallAmount` is 0n when sufficient
- [ ] `formattedCurrent` and `formattedRequired` show correct decimal places
- [ ] `approvalNeeded` matches `!isSufficient`

**Why this challenge matters:**
BigInt handling is mandatory in Web3 TypeScript — viem returns all token amounts as `bigint`. This pattern appears in every token interaction in Month 2 onward.

---

## Challenge 8 — RPC Response Normalizer

**Difficulty: 2.5/10**

**Concepts:**

- Function declaration
- Object destructuring in parameters
- Type aliases
- Null handling

**Real-world scenario:**
Different RPC providers return slightly different response shapes for the same data. A normalizer function converts these inconsistent shapes into your backend's standard format. This is a critical pattern in any multi-provider setup.

**Problem statement:**
Write a function `normalizeRPCResponse` that takes a raw RPC response (which may have inconsistent field names) and returns a normalized transaction object.

**Input:**

```typescript
type RawRPCResponse = {
  hash?: string;
  transactionHash?: string; // some providers use this instead
  from?: string;
  sender?: string; // some providers use this instead
  to?: string;
  recipient?: string; // some providers use this instead
  value?: string; // hex string e.g. "0x1a2b"
  gasUsed?: string; // hex string
  blockNumber?: string; // hex string
  status?: string; // "0x1" success, "0x0" failed
};

raw: RawRPCResponse;
```

**Output:**

```typescript
type NormalizedTx = {
  hash: string | null;
  from: string | null;
  to: string | null;
  valueWei: bigint;
  gasUsed: number;
  blockNumber: number;
  success: boolean;
};
```

**Example:**

```
Input: {
  transactionHash: "0xabc",
  sender: "0xAlice",
  recipient: "0xBob",
  value: "0x1a2b",
  gasUsed: "0x5208",
  blockNumber: "0x1234",
  status: "0x1"
}

Output: {
  hash: "0xabc",
  from: "0xAlice",
  to: "0xBob",
  valueWei: 6699n,
  gasUsed: 21000,
  blockNumber: 4660,
  success: true
}
```

**Acceptance Criteria:**

- [ ] Handles both field name variants (hash/transactionHash, from/sender, to/recipient)
- [ ] Converts hex strings to correct types (bigint for value, number for gasUsed/blockNumber)
- [ ] `success` is true only when status is "0x1"
- [ ] Returns null for missing hash/from/to

**Why this challenge matters:**
Normalizing inconsistent data shapes is one of the most common tasks in any backend that talks to multiple external APIs. Your multi-RPC fallback system in Month 2 uses this exact pattern.

---

---

# SECTION 2 — Arrow Functions

> **Goal:** Arrow functions are not just shorter syntax — they have specific
> rules about `this` binding and implicit returns that make them the
> standard in modern TypeScript and all Web3 SDKs.
> Every viem function, every Express callback, every array method
> uses arrow function syntax. Master it here.

---

## Challenge 9 — Convert Function Declaration to Arrow

**Difficulty: 2/10**

**Concepts:**

- Arrow function syntax
- Explicit vs implicit return
- Type annotations on arrow functions

**Real-world scenario:**
Real Web3 codebases use arrow functions almost exclusively. Reading and writing them fluently is non-negotiable when working with viem, ethers, Express middleware, and React hooks.

**Problem statement:**
Below are three function declarations. Rewrite each as an arrow function — first with explicit return, then with implicit return (where applicable). All three must produce identical output to the originals.

```typescript
// Rewrite these three:

function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    137: "Polygon",
    42161: "Arbitrum One",
    8453: "Base",
  };
  return networks[chainId] ?? "Unknown Network";
}

function isWhaleWallet(balanceUSD: number): boolean {
  return balanceUSD >= 1000000;
}

function buildRPCUrl(baseUrl: string, apiKey: string): string {
  return `${baseUrl}/${apiKey}`;
}
```

**Acceptance Criteria:**

- [ ] All three rewritten as arrow functions with explicit return
- [ ] `isWhaleWallet` and `buildRPCUrl` also written with implicit return
- [ ] TypeScript type annotations preserved
- [ ] Output identical to originals

**Why this challenge matters:**
The moment you open any viem or Express documentation, every example uses arrow functions. If you hesitate when reading them, your learning pace slows dramatically.

---

## Challenge 10 — Arrow Functions Returning Objects

**Difficulty: 2.5/10**

**Concepts:**

- Arrow functions with implicit object return
- Parentheses around object literals
- Type annotations

**Real-world scenario:**
Array `.map()` calls — which you will use constantly to transform blockchain data — often use arrow functions that return objects. The syntax for implicit object return trips up most beginners.

**Problem statement:**
Write four arrow functions that each return an object with implicit return syntax (no `return` keyword, no curly braces for the function body).

```typescript
// Write these as arrow functions with implicit object return:

// 1. Takes a wallet address and balance, returns a WalletSummary
type WalletSummary = { address: string; balance: number; isWhale: boolean };

// 2. Takes a txHash and blockNumber, returns a TxRef
type TxRef = { hash: string; block: number; explorerUrl: string };
// explorerUrl format: `https://etherscan.io/tx/${hash}`

// 3. Takes a token symbol and price, returns a PriceEntry
type PriceEntry = { symbol: string; priceUSD: number; updatedAt: number };
// updatedAt: Date.now()

// 4. Takes a chainId and rpcUrl, returns a NetworkConfig
type NetworkConfig = { chainId: number; rpcUrl: string; isTestnet: boolean };
// isTestnet: chainId >= 10000 or chainId in [5, 11155111, 80001]
```

**Acceptance Criteria:**

- [ ] All four use implicit return with parentheses: `(arg) => ({ ... })`
- [ ] No `return` keyword used
- [ ] No function body curly braces
- [ ] Types annotated correctly

**Why this challenge matters:**
`transactions.map(tx => ({ hash: tx.hash, sender: tx.from }))` — this exact pattern appears in every data transformation in your backend. If the implicit object return syntax is unfamiliar, every map call will confuse you.

---

## Challenge 11 — Single vs Multi Parameter Arrow Functions

**Difficulty: 2.5/10**

**Concepts:**

- Single parameter (no parentheses)
- Multiple parameters (with parentheses)
- No parameters (empty parentheses)
- Arrow function syntax rules

**Real-world scenario:**
Array methods like `.map(tx => tx.hash)` use single-parameter arrows. Event handlers like `(req, res) => { ... }` use multi-parameter arrows. Both appear constantly in Web3 backends.

**Problem statement:**
Write each of the following as arrow functions following the correct syntax rules. No TypeScript errors allowed.

```typescript
// Write as arrow functions:

// 1. Single param — extracts hash from a transaction
// Takes: tx: { hash: string; amount: number }
// Returns: string (the hash)

// 2. No params — returns current timestamp
// Returns: number

// 3. Two params — calculates fee
// Takes: amount: number, feePercent: number
// Returns: number (amount * feePercent / 100, rounded to 2dp)

// 4. Three params — builds a transfer event description
// Takes: from: string, to: string, amount: number
// Returns: string — e.g. "Transfer: 0xAlice → 0xBob (500 tokens)"

// 5. Single param — checks if address is valid
// Takes: address: string
// Returns: boolean (starts with "0x" and length === 42)
```

**Acceptance Criteria:**

- [ ] Single param arrows written without parentheses around param
- [ ] No-param arrows use empty `()`
- [ ] Multi-param arrows use parentheses around params
- [ ] All type annotations present

**Why this challenge matters:**
Express middleware `(req, res, next) => {}`, array methods `items.map(x => x.id)`, event handlers `emitter.on("event", (data) => {})` — all use arrow functions with different parameter counts. Reading them fluently requires knowing these syntax rules.

---

## Challenge 12 — Arrow Functions as Object Properties

**Difficulty: 3/10**

**Concepts:**

- Arrow functions stored in object properties
- Method shorthand vs arrow function
- `this` binding difference

**Real-world scenario:**
SDK clients in Web3 are objects with method properties. When you call `client.getBalance(address)`, `getBalance` is a function stored as an object property. Understanding how to define and read these is essential for using and building SDKs.

**Problem statement:**
Build a `WalletClient` object that has arrow function methods. Each method should work correctly when called.

```typescript
type WalletClient = {
  address: string;
  getShortAddress: () => string; // first 6 + last 4 chars
  formatBalance: (wei: bigint) => string; // wei / 10^18, 4dp + " ETH"
  canAfford: (priceWei: bigint) => boolean;
  buildTransferLog: (to: string, amount: bigint) => string;
  // format: "[address] transferred [amount] ETH to [to]"
};

// Create this wallet client:
const myWallet: WalletClient = {
  address: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12",
  // Define each method as an arrow function
};
```

**Example:**

```
myWallet.getShortAddress()
→ "0xAbCd...Ef12"

myWallet.formatBalance(2500000000000000000n)
→ "2.5000 ETH"

myWallet.canAfford(500000000000000000n)
→ true (if wallet has >= 0.5 ETH)

myWallet.buildTransferLog("0xBob", 1000000000000000000n)
→ "0xAbCd...Ef12 transferred 1.0000 ETH to 0xBob"
```

**Acceptance Criteria:**

- [ ] All methods defined as arrow functions
- [ ] `getShortAddress` uses the wallet's own `address` property
- [ ] `formatBalance` handles bigint correctly
- [ ] All methods produce correct output

**Why this challenge matters:**
viem's `createPublicClient`, `createWalletClient`, and every Web3 SDK returns objects with function properties. Knowing how to read and write them is essential for Month 2 onward.

---

## Challenge 13 — Arrow Functions as Variables

**Difficulty: 3/10**

**Concepts:**

- Storing arrow functions in `const` variables
- Function type annotations
- Calling stored functions

**Real-world scenario:**
In Node.js backends, middleware functions, validators, and handlers are often stored as named constants before being passed to Express or other frameworks. This pattern is everywhere in production codebases.

**Problem statement:**
Define each of the following as a `const` arrow function with explicit TypeScript type annotation on the variable itself (not just the parameters).

```typescript
// Define these as typed const arrow functions:

// 1. A validator — type: (address: string) => boolean
const isValidAddress = ...

// 2. A formatter — type: (amount: number, symbol: string) => string
const formatTokenAmount = ...

// 3. A classifier — type: (gasPriceGwei: number) => "low" | "medium" | "high"
// low: < 20, medium: 20-50, high: > 50
const classifyGasPrice = ...

// 4. A calculator — type: (principal: bigint, ratePercent: number) => bigint
// Returns principal + (principal * rate / 100n) — simple interest
const calculateInterest = ...

// 5. A logger — type: (event: string, data: Record<string, unknown>) => void
// Logs: [ISO timestamp] EVENT: data as JSON
const logBlockchainEvent = ...
```

**Acceptance Criteria:**

- [ ] Each variable explicitly typed: `const name: (params) => ReturnType = ...`
- [ ] All five functions produce correct output
- [ ] `logBlockchainEvent` returns void and logs to console
- [ ] `calculateInterest` uses bigint arithmetic

**Why this challenge matters:**
Express middleware is stored exactly this way: `const authMiddleware: RequestHandler = (req, res, next) => { ... }`. Understanding typed const arrow functions makes middleware patterns immediately readable.

---

## Challenge 14 — Returning Arrow Functions from Functions

**Difficulty: 3.5/10**

**Concepts:**

- Functions that return arrow functions
- Closure — inner function accessing outer variables
- Type annotations for function return types

**Real-world scenario:**
This is the foundation of Higher-Order Functions. A function factory — a function that creates and returns other functions — is used constantly in middleware generation, validator factories, and SDK builder patterns in Web3 backends.

**Problem statement:**
Write a function `createRPCLogger` that takes a `prefix: string` and returns an arrow function. The returned function takes a `message: string` and logs `[prefix] message` to the console.

Then write two more factories following the same pattern:

```typescript
// Factory 1: createRPCLogger
// Takes: prefix: string
// Returns: (message: string) => void

const createRPCLogger = ...

const alchemyLog = createRPCLogger("[Alchemy]")
const infuraLog = createRPCLogger("[Infura]")
alchemyLog("Connected")     // logs: [Alchemy] Connected
infuraLog("Rate limited")   // logs: [Infura] Rate limited

// Factory 2: createBalanceChecker
// Takes: minBalanceWei: bigint
// Returns: (walletBalance: bigint) => boolean

const createBalanceChecker = ...

const hasSufficientForGas = createBalanceChecker(21000n * 30n)
hasSufficientForGas(1000000n)  // true or false

// Factory 3: createThresholdAlert
// Takes: threshold: number, label: string
// Returns: (currentValue: number) => { triggered: boolean; message: string }

const createThresholdAlert = ...

const gasAlert = createThresholdAlert(50, "gas price")
gasAlert(75)  // { triggered: true, message: "gas price exceeded threshold: 75 > 50" }
gasAlert(25)  // { triggered: false, message: "gas price within threshold: 25 <= 50" }
```

**Acceptance Criteria:**

- [ ] All three factories return arrow functions
- [ ] Returned functions correctly access outer scope variables (closure)
- [ ] Type annotations on factory parameters and return types
- [ ] Output matches examples exactly

**Why this challenge matters:**
Express's `cors()`, `express.json()`, and middleware factories all use this exact pattern — a function called with config that returns the actual middleware function. This is the most important pattern in the entire curriculum.

---

## Challenge 15 — Arrow Functions with Destructuring

**Difficulty: 3.5/10**

**Concepts:**

- Destructuring in arrow function parameters
- Object destructuring
- Array destructuring
- Default values in destructuring

**Real-world scenario:**
When viem returns a transaction object, you destructure the fields you need directly in the function parameter. This pattern makes code cleaner and is used throughout production Web3 code.

**Problem statement:**
Write each arrow function using destructuring in the parameter list.

```typescript
type Transaction = {
  hash: string
  from: string
  to: string
  value: bigint
  gasPrice: bigint
  blockNumber: number
  status: "success" | "failed" | "pending"
}

// 1. Extracts and formats just the key fields
// Parameter: Transaction (destructure hash, from, to, value)
// Returns: string — "hash from→to value ETH"
const summarizeTx = ({ hash, from, to, value }: Transaction): string => ...

// 2. Calculates total cost
// Parameter: Transaction (destructure value, gasPrice)
// Returns: bigint — value + (gasPrice * 21000n)
const calculateTotalCost = ...

// 3. Checks if transaction is from a specific sender
// Parameters: Transaction, expectedSender: string (destructure from)
// Returns: boolean
const isFromSender = ...

// 4. Builds an explorer URL
// Parameter: { hash, blockNumber } (only these two needed)
// Returns: string — "https://etherscan.io/tx/[hash]"
const buildExplorerUrl = ...

// 5. Formats with defaults
// Parameter: Partial<Transaction> with default hash "0x000"
// Returns: string — the hash (or default)
const getHashSafe = ...
```

**Acceptance Criteria:**

- [ ] All five use destructuring in parameter list
- [ ] No accessing fields via `tx.hash` — must destructure
- [ ] Default value used in #5
- [ ] Correct return types

**Why this challenge matters:**
`app.get("/tx/:hash", ({ params: { hash } }, res) => { ... })` — Express destructures request properties directly in the handler. viem callbacks destructure event args. This syntax is everywhere.

---

## Challenge 16 — Arrow Functions in Arrays

**Difficulty: 4/10**

**Concepts:**

- Arrays of arrow functions
- Calling functions stored in arrays
- Iterating over function arrays
- Function pipeline pattern (preview)

**Real-world scenario:**
Validation pipelines run an array of validator functions against input data. Middleware chains in Express are arrays of functions executed in order. Understanding arrays of functions is the bridge to Higher-Order Functions.

**Problem statement:**
Create an array of validator arrow functions for wallet addresses. Then write a function `runValidators` that runs all validators against an address and returns a validation report.

```typescript
type ValidatorFn = (address: string) => { valid: boolean; message: string }

// Create these validators as arrow functions in an array:
const addressValidators: ValidatorFn[] = [
  // 1. Checks starts with "0x"
  // 2. Checks length is exactly 42 characters
  // 3. Checks contains only hex characters after "0x"
  // 4. Checks is not all zeros after "0x"
  // 5. Checks is not mixed case (either all upper or all lower after 0x, or checksum — just check not mixed)
]

// Write this function:
function runValidators(
  address: string,
  validators: ValidatorFn[]
): {
  address: string
  passed: boolean
  results: Array<{ valid: boolean; message: string }>
  failCount: number
} {
  ...
}
```

**Example:**

```
Input: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12"
Output: {
  address: "0xAbCdEf...",
  passed: true,
  results: [
    { valid: true, message: "starts with 0x" },
    { valid: true, message: "correct length (42)" },
    ...
  ],
  failCount: 0
}
```

**Acceptance Criteria:**

- [ ] validators array contains exactly 5 arrow functions
- [ ] `runValidators` calls each validator in order
- [ ] `passed` is true only if all validators pass
- [ ] `failCount` is accurate

**Why this challenge matters:**
Express middleware is an array of functions. Drizzle query builders chain functions. Viem's transport fallback is an array of functions. This is the architectural pattern you will use in every backend you build.

---

---

# SECTION 3 — Callbacks

> **Goal:** A callback is a function passed to another function to be called later.
> This is the single most important concept in async JavaScript/TypeScript.
> Promises, async/await, event listeners, Express middleware — all of these
> are callbacks underneath. Master callbacks here and async becomes obvious.

---

## Challenge 17 — Your First Callback

**Difficulty: 3/10**

**Concepts:**

- Passing a function as an argument
- Calling a received function
- Callback timing
- Function type annotation as parameter

**Real-world scenario:**
Node.js's original async pattern used callbacks everywhere. `fs.readFile(path, callback)` calls your callback when the file is ready. `setTimeout(callback, ms)` calls your callback after a delay. Understanding this pattern is foundational to understanding how async JavaScript actually works.

**Problem statement:**
Write a function `processTransaction` that takes a transaction object and a callback function. It validates the transaction, then calls the callback with either an error or the processed result.

```typescript
type RawTx = {
  hash: string;
  amount: number;
  sender: string;
};

type ProcessedTx = {
  hash: string;
  amount: number;
  sender: string;
  processedAt: number;
  isValid: boolean;
};

// Write this function:
function processTransaction(
  tx: RawTx,
  callback: (error: Error | null, result: ProcessedTx | null) => void,
): void {
  // Validate: hash must start with "0x", amount must be > 0, sender must start with "0x"
  // If invalid: call callback(new Error("Invalid transaction"), null)
  // If valid: call callback(null, { ...tx, processedAt: Date.now(), isValid: true })
}

// Then call it like this:
processTransaction(
  { hash: "0xabc", amount: 500, sender: "0xAlice" },
  (error, result) => {
    if (error) {
      console.log("Error:", error.message);
    } else {
      console.log("Processed:", result);
    }
  },
);
```

**Acceptance Criteria:**

- [ ] `processTransaction` calls the callback — never returns a value
- [ ] Callback called with `(null, result)` on success
- [ ] Callback called with `(error, null)` on failure
- [ ] The callback arrow function passed at the call site correctly handles both cases

**Why this challenge matters:**
This is the exact pattern Node.js was built on. `legacyGetBalance(address, callback)` in your Easy #1 challenge uses this pattern. Every Promise was once written this way. Understanding it makes Promises feel like a natural upgrade.

---

## Challenge 18 — Callback Execution Order

**Difficulty: 3.2/10**

**Concepts:**

- Synchronous callback execution
- Understanding when callbacks run
- Predicting output order

**Real-world scenario:**
One of the most common bugs in async programming is assuming a callback runs at a specific time. This challenge makes callback timing explicit by predicting and then verifying execution order — the exact mental model needed for debugging async code.

**Problem statement:**
Read the following code carefully. Before running it, predict the exact output order by writing comments next to each `console.log`. Then run it to verify.

```typescript
function applyFee(
  amount: number,
  feeCalculator: (amount: number) => number,
): number {
  console.log("1. applyFee called");
  const fee = feeCalculator(amount);
  console.log("3. fee calculated:", fee);
  return amount - fee;
}

console.log("A. Before applyFee");

const result = applyFee(1000, (amount) => {
  console.log("2. feeCalculator running, amount:", amount);
  return amount * 0.02;
});

console.log("B. After applyFee, result:", result);
```

After predicting and verifying, rewrite the same logic but with THREE different fee strategies passed as callbacks:

1. Fixed fee of 5
2. Percentage fee of 2%
3. Tiered fee: 1% if amount < 500, 2% if amount >= 500

**Acceptance Criteria:**

- [ ] Correct execution order predicted before running
- [ ] Three fee strategy callbacks written as arrow functions
- [ ] Each callback produces correct fee for test inputs
- [ ] No modification to `applyFee` function for different strategies

**Why this challenge matters:**
Not knowing when a callback runs is the root cause of most async bugs. If you can predict synchronous callback order, you can reason about async callback order — which is Promise `.then()` chaining.

---

## Challenge 19 — Writing a Custom forEach

**Difficulty: 3.5/10**

**Concepts:**

- Implementing a higher-order function from scratch
- Callback with index parameter
- Understanding what built-in methods do internally

**Real-world scenario:**
Understanding how `forEach` works internally makes `.map()`, `.filter()`, and `.reduce()` obvious. When you implement these yourself, you understand exactly what the callback receives and why.

**Problem statement:**
Implement your own `blockchainForEach` function that behaves exactly like `Array.prototype.forEach` but works specifically on transaction arrays and logs extra debugging info.

```typescript
type Transaction = {
  hash: string;
  amount: number;
  token: string;
  sender: string;
};

// Implement this:
function blockchainForEach(
  transactions: Transaction[],
  callback: (
    transaction: Transaction,
    index: number,
    all: Transaction[],
  ) => void,
): void {
  // Your implementation — must call callback for each transaction
  // with (transaction, index, fullArray)
}

// Test it with these callbacks:

// Callback 1: logs each transaction hash
blockchainForEach(txList, (tx, i) => {
  console.log(`${i + 1}. ${tx.hash}`);
});

// Callback 2: logs sender and amount
blockchainForEach(txList, (tx) => {
  console.log(`${tx.sender}: ${tx.amount} ${tx.token}`);
});

// Callback 3: logs only if amount > 1000
blockchainForEach(txList, (tx, i, all) => {
  if (tx.amount > 1000) {
    console.log(`Large tx at index ${i} of ${all.length}: ${tx.hash}`);
  }
});
```

**Acceptance Criteria:**

- [ ] `blockchainForEach` loops and calls callback for each item
- [ ] Callback receives transaction, index, and full array
- [ ] Returns void — does not return a new array
- [ ] All three test callbacks produce correct output

**Why this challenge matters:**
Implementing `forEach` yourself forces you to understand the callback contract — what arguments the callback receives and when it is called. This is the exact understanding needed to write correct `.map()`, `.filter()`, and `.reduce()` callbacks.

---

## Challenge 20 — Callbacks with State

**Difficulty: 3.8/10**

**Concepts:**

- Callback accessing outer scope variables (closure)
- Accumulating state through callbacks
- The accumulator pattern

**Real-world scenario:**
Event listeners accumulate state over time. Your Whale Watcher accumulates Transfer events into a running total. Understanding how callbacks can read and modify outer variables is essential for building stateful systems.

**Problem statement:**
Create a `TransactionAccumulator` using closures and callbacks. The accumulator maintains internal state and calls a callback whenever a threshold is crossed.

```typescript
function createTransactionAccumulator(
  threshold: number,
  onThresholdCrossed: (total: number, count: number) => void,
): {
  add: (amount: number) => void;
  getTotal: () => number;
  getCount: () => number;
  reset: () => void;
} {
  // Internal state — not accessible from outside
  let total = 0;
  let count = 0;

  return {
    add: (amount: number) => {
      // Add to total, increment count
      // If total crosses threshold, call onThresholdCrossed
    },
    getTotal: () => total,
    getCount: () => count,
    reset: () => {
      total = 0;
      count = 0;
    },
  };
}

// Test:
const acc = createTransactionAccumulator(10000, (total, count) => {
  console.log(
    `Alert: ${count} transactions totaling ${total} crossed threshold`,
  );
});

acc.add(3000); // total: 3000 — no alert
acc.add(4000); // total: 7000 — no alert
acc.add(5000); // total: 12000 — ALERT fires
acc.add(2000); // total: 14000 — ALERT fires again
```

**Acceptance Criteria:**

- [ ] Internal state not accessible from outside
- [ ] `onThresholdCrossed` called every time total exceeds threshold
- [ ] `add`, `getTotal`, `getCount`, `reset` all work correctly
- [ ] Callback receives current total and count at time of call

**Why this challenge matters:**
Your Month 5 event listener accumulates Transfer events and triggers alerts when volume crosses a threshold. This is the exact pattern — a callback called when a condition is met — behind every monitoring and alerting system.

---

## Challenge 21 — Callback Arrays (Middleware Pattern)

**Difficulty: 4/10**

**Concepts:**

- Arrays of callback functions
- Executing callbacks in sequence
- `next()` pattern — calling the next function in a chain
- Express middleware preview

**Real-world scenario:**
Express middleware is literally an array of callback functions. When you call `app.use(logger, auth, handler)`, Express runs each function in order, calling `next()` to move to the next one. Understanding this pattern makes Express immediately readable.

**Problem statement:**
Build a simple middleware runner that executes an array of middleware functions in order, where each function can call `next()` to proceed or stop the chain by not calling it.

```typescript
type Context = {
  walletAddress: string;
  isAuthenticated: boolean;
  hasBalance: boolean;
  data: Record<string, unknown>;
};

type MiddlewareFn = (ctx: Context, next: () => void) => void;

function runMiddleware(ctx: Context, middlewares: MiddlewareFn[]): void {
  // Execute middlewares in order
  // Each middleware receives ctx and a next function
  // If middleware calls next(), the next middleware runs
  // If middleware does NOT call next(), chain stops
}

// Test with these middleware functions:
const logRequest: MiddlewareFn = (ctx, next) => {
  console.log("Request from:", ctx.walletAddress);
  next();
};

const checkAuth: MiddlewareFn = (ctx, next) => {
  if (!ctx.isAuthenticated) {
    console.log("Rejected: not authenticated");
    return; // does NOT call next — chain stops here
  }
  next();
};

const checkBalance: MiddlewareFn = (ctx, next) => {
  if (!ctx.hasBalance) {
    console.log("Rejected: insufficient balance");
    return;
  }
  next();
};

const handleRequest: MiddlewareFn = (ctx, next) => {
  console.log("Processing request for:", ctx.walletAddress);
  ctx.data.result = "Transaction submitted";
  next();
};

runMiddleware(
  {
    walletAddress: "0xAlice",
    isAuthenticated: true,
    hasBalance: true,
    data: {},
  },
  [logRequest, checkAuth, checkBalance, handleRequest],
);
```

**Acceptance Criteria:**

- [ ] Middlewares execute in order
- [ ] Chain stops when a middleware does not call `next()`
- [ ] `ctx` object is shared and mutatable across middleware
- [ ] Authenticated wallet with balance completes all 4 middleware

**Why this challenge matters:**
This is Express middleware. Exactly. When you write `app.use(cors(), express.json(), authMiddleware, routeHandler)`, this is what Express does internally. Understanding it makes every Express error immediately debuggable.

---

## Challenge 22 — Error-First Callbacks

**Difficulty: 4/10**

**Concepts:**

- Node.js error-first callback convention
- (error, result) parameter pattern
- Handling errors in callbacks
- Propagating errors up the chain

**Real-world scenario:**
Node.js built its entire ecosystem on the error-first callback convention — `callback(error, result)` where the first argument is always null or an Error. Understanding this convention is what makes Promise rejection and async try/catch intuitive.

**Problem statement:**
Build a chain of three functions that each use error-first callbacks. If any function in the chain encounters an error, it should propagate to the final callback without continuing the chain.

```typescript
type EFCallback<T> = (error: Error | null, result: T | null) => void;

// Function 1: fetches a wallet
function fetchWallet(
  address: string,
  callback: EFCallback<{ address: string; balance: number }>,
): void {
  // If address doesn't start with "0x" → callback(new Error("Invalid address"), null)
  // Otherwise → callback(null, { address, balance: 1500 })
}

// Function 2: validates sufficient balance
function validateBalance(
  wallet: { address: string; balance: number },
  requiredAmount: number,
  callback: EFCallback<{ address: string; balance: number; approved: boolean }>,
): void {
  // If balance < requiredAmount → callback(new Error("Insufficient balance"), null)
  // Otherwise → callback(null, { ...wallet, approved: true })
}

// Function 3: submits the transaction
function submitTransaction(
  approvedWallet: { address: string; balance: number; approved: boolean },
  amount: number,
  callback: EFCallback<{ txHash: string; success: boolean }>,
): void {
  // Always succeeds → callback(null, { txHash: "0x" + Date.now(), success: true })
}

// Chain them — if any fails, the final callback gets the error:
fetchWallet("0xAlice", (err, wallet) => {
  if (err) return callback(err, null); // propagate
  validateBalance(wallet!, 1000, (err, validated) => {
    if (err) return callback(err, null);
    submitTransaction(validated!, 1000, callback);
  });
});
```

**Acceptance Criteria:**

- [ ] Error-first callback convention used correctly
- [ ] Chain stops immediately on any error
- [ ] Final callback receives either an error or the tx result
- [ ] Works for valid address with sufficient balance

**Why this challenge matters:**
`Promise.then().catch()` is the modern syntax for exactly this chain. When you see `fetchWallet(address).then(validateBalance).then(submit).catch(handleError)`, you are reading the Promise version of this code. Understanding the callback version makes the Promise version obvious.

---

## Challenge 23 — Async Simulation with Callbacks

**Difficulty: 4.5/10**

**Concepts:**

- setTimeout as a callback scheduler
- Simulating async with callbacks
- Callback hell (and why Promises exist)
- Timing and execution order

**Real-world scenario:**
Before Promises, all async operations used setTimeout-style callbacks. Reading legacy Web3 code or understanding why async/await was invented requires understanding this pattern. This challenge recreates the problem Promises were designed to solve.

**Problem statement:**
Build an RPC simulation using setTimeout callbacks. Chain three operations — each depends on the previous — and observe how the code becomes nested ("callback hell").

```typescript
// Simulate an RPC call with 200ms delay
function simulateRPCCall<T>(
  operation: string,
  result: T,
  shouldFail: boolean,
  callback: (error: Error | null, data: T | null) => void,
): void {
  setTimeout(() => {
    if (shouldFail) {
      callback(new Error(`${operation} failed`), null);
    } else {
      console.log(`${operation} completed`);
      callback(null, result);
    }
  }, 200);
}

// Using simulateRPCCall, chain these three operations:
// 1. Get current block number → returns 19000000
// 2. Get transaction at that block → returns { hash: "0xabc", amount: 500 }
// 3. Get receipt for that transaction → returns { success: true, gasUsed: 21000 }
// If any fails → log "Operation failed: [error message]" and stop

// Write this as nested callbacks first (callback hell):
simulateRPCCall("getBlockNumber", 19000000, false, (err, blockNumber) => {
  // ... nest the next two calls inside here
});
```

**Acceptance Criteria:**

- [ ] Three operations chained using nested callbacks
- [ ] Error in any step stops the chain
- [ ] All three complete logs appear in order when no errors
- [ ] Each step uses the result from the previous step

**Why this challenge matters:**
This is why Promises exist. After completing this challenge, you will understand exactly what `async/await` is solving. The callback hell you just wrote is what `const block = await getBlockNumber()` replaces.

---

## Challenge 24 — Callback to Promise Conversion

**Difficulty: 5/10**

**Concepts:**

- Converting error-first callbacks to Promises
- `new Promise()` wrapper pattern
- Understanding Promise as a callback wrapper
- Promisify pattern

**Real-world scenario:**
Legacy blockchain libraries use callbacks. Modern backends use Promises. Knowing how to wrap callbacks in Promises — and understanding WHY the wrapper works — is the bridge between the old world and the new. Your Easy #1 challenge did this — now you understand exactly what you were doing.

**Problem statement:**
Take the three functions from Challenge 23 and wrap each one in a Promise. Then chain them using `.then()`. Then rewrite the chain using `async/await`. At each step, verify the output is identical.

```typescript
// Step 1: Wrap simulateRPCCall in a Promise
function getBlockNumberAsync(): Promise<number> {
  return new Promise((resolve, reject) => {
    simulateRPCCall("getBlockNumber", 19000000, false, (err, data) => {
      if (err) reject(err);
      else resolve(data!);
    });
  });
}

// Do the same for the other two operations

// Step 2: Chain with .then()
getBlockNumberAsync()
  .then((blockNumber) => getTransactionAsync(blockNumber))
  .then((tx) => getReceiptAsync(tx.hash))
  .then((receipt) => console.log("Done:", receipt))
  .catch((err) => console.log("Failed:", err.message));

// Step 3: Rewrite with async/await
async function runChain(): Promise<void> {
  // Same logic, async/await syntax
}
```

**Acceptance Criteria:**

- [ ] All three functions correctly wrapped in Promises
- [ ] `.then()` chain produces identical output to callback version
- [ ] `async/await` version produces identical output to `.then()` version
- [ ] Error handling works in all three versions

**Why this challenge matters:**
This is the definitive bridge challenge. After this, async/await is not a mystery — it is just the callback wrapper pattern you just built, with nicer syntax. This is the insight that unlocks all of async programming.

---

---

# SECTION 4 — Array Methods

> **Goal:** Array methods (map, filter, reduce, find, some, every) are
> Higher-Order Functions — they take callback functions as arguments.
> Once you understand callbacks, these methods become obvious.
> They appear in EVERY data transformation in your backend.

---

## Challenge 25 — forEach vs for Loop

**Difficulty: 3/10**

**Concepts:**

- forEach with arrow callback
- When to use forEach vs for
- forEach returns void

**Real-world scenario:**
Your Express route returns an array of transactions. Before sending them, you log each one for debugging. `forEach` is the standard way to iterate when you do not need a new array.

**Problem statement:**
You have a list of transactions. Use `forEach` with an arrow callback to:

1. Log each transaction in a specific format
2. Count transactions above 1000 (using an external counter)
3. Build a lookup object by hash (using an external object)

```typescript
const transactions = [
  { hash: "0xaaa", amount: 500,  token: "USDC", sender: "0xAlice" },
  { hash: "0xbbb", amount: 1500, token: "ETH",  sender: "0xBob"   },
  { hash: "0xccc", amount: 200,  token: "USDC", sender: "0xCarol" },
  { hash: "0xddd", amount: 2000, token: "DAI",  sender: "0xDiana" },
]

// Task 1: Log each as "[hash]: [sender] sent [amount] [token]"
transactions.forEach(...)

// Task 2: Count transactions above 1000
let largeCount = 0
transactions.forEach(...)
console.log("Large transactions:", largeCount)  // Expected: 2

// Task 3: Build a lookup by hash
const lookup: Record<string, typeof transactions[0]> = {}
transactions.forEach(...)
console.log(lookup["0xbbb"])  // Expected: { hash: "0xbbb", ... }
```

**Acceptance Criteria:**

- [ ] All three tasks use forEach with arrow callbacks
- [ ] Task 1 output format matches exactly
- [ ] Task 2 count is correct
- [ ] Task 3 lookup object contains all four transactions

**Why this challenge matters:**
Your Express routes will use forEach to process request data before database insertion. Your event listener will use forEach to process incoming blockchain events.

---

## Challenge 26 — map — Transform Every Item

**Difficulty: 3.2/10**

**Concepts:**

- map returns a new array of same length
- Transforming object shapes
- map does not mutate the original

**Real-world scenario:**
Your backend receives raw transaction data from the RPC node and must transform it into the format your database expects. This transformation — same array length, different shape — is exactly what `.map()` is designed for.

**Problem statement:**
Transform the raw RPC transactions into database-ready format using `.map()`.

```typescript
type RPCTransaction = {
  hash: string
  from: string
  to: string
  value: string        // hex string e.g. "0x1a2b"
  gas: string          // hex string
  blockNumber: string  // hex string
}

type DBTransaction = {
  txHash: string
  sender: string
  recipient: string
  amountWei: bigint
  gasLimit: number
  block: number
  createdAt: number    // Date.now()
}

const rpcTransactions: RPCTransaction[] = [
  { hash: "0xaaa", from: "0xAlice", to: "0xBob", value: "0xde0b6b3a7640000", gas: "0x5208", blockNumber: "0x1234" },
  { hash: "0xbbb", from: "0xBob", to: "0xCarol", value: "0x1bc16d674ec80000", gas: "0x7530", blockNumber: "0x1235" },
]

// Transform using map:
const dbTransactions: DBTransaction[] = rpcTransactions.map(tx => ...)

// Also write a map that extracts just the hashes:
const hashes: string[] = rpcTransactions.map(...)

// Also write a map that checks if each transaction is large (> 1 ETH):
const isLarge: boolean[] = rpcTransactions.map(...)
```

**Acceptance Criteria:**

- [ ] All three map calls produce correct output
- [ ] Hex strings correctly converted to bigint and number
- [ ] `createdAt` populated with `Date.now()`
- [ ] Original array not mutated

**Why this challenge matters:**
`const formatted = events.map(e => ({ ...e, formattedAmount: formatWei(e.amount) }))` — this appears in every data pipeline in your backend. The map callback shape you write here is used constantly.

---

## Challenge 27 — filter — Keep Only What Matches

**Difficulty: 3.3/10**

**Concepts:**

- filter returns a subset of the original array
- Boolean-returning callbacks
- Chaining filter with map

**Real-world scenario:**
Your database returns all transactions but the API client only wants USDC transfers above 1000 USDC from a specific sender. Filtering on the backend before sending the response is more efficient than returning everything.

**Problem statement:**
Apply multiple filter operations to a transaction list.

```typescript
const transactions = [
  { hash: "0x1", token: "USDC", amount: 1500, sender: "0xAlice", status: "success" },
  { hash: "0x2", token: "ETH",  amount: 2.5,  sender: "0xBob",   status: "success" },
  { hash: "0x3", token: "USDC", amount: 500,  sender: "0xAlice", status: "failed"  },
  { hash: "0x4", token: "USDC", amount: 3000, sender: "0xCarol", status: "success" },
  { hash: "0x5", token: "DAI",  amount: 800,  sender: "0xAlice", status: "success" },
  { hash: "0x6", token: "USDC", amount: 2000, sender: "0xAlice", status: "pending" },
]

// Filter 1: Only successful USDC transactions
const successfulUSDC = transactions.filter(...)

// Filter 2: Only from 0xAlice AND status is success
const aliceSuccess = transactions.filter(...)

// Filter 3: Only amounts above 1000
const largeOnly = transactions.filter(...)

// Filter 4: Chain — successful USDC above 1000, return only hashes
const successfulLargeUSDCHashes: string[] = transactions
  .filter(...)
  .filter(...)
  .map(...)
```

**Acceptance Criteria:**

- [ ] Filter 1: 3 results (hash 1, 4 — wait, check: 1=success USDC ✓, 3=failed ✗, 4=success USDC ✓, 6=pending ✗)
- [ ] Filter 2: 2 results (hash 1 and 5 — wait: 1=Alice+success ✓, 3=Alice+failed ✗, 5=Alice+success ✓, 6=Alice+pending ✗)
- [ ] Filter 3: 4 results
- [ ] Filter 4: correct hashes as strings

**Why this challenge matters:**
Every API endpoint filters data before returning it. Your `/transactions/filter?token=USDC` Express route could use this exact pattern internally instead of a database WHERE clause.

---

## Challenge 28 — find and findIndex

**Difficulty: 3.5/10**

**Concepts:**

- find returns first match or undefined
- findIndex returns index or -1
- Handling undefined return from find

**Real-world scenario:**
Your backend receives a transaction hash from a client and must find that specific transaction in a cached array. `find` returns the first match — perfect for hash lookups where hashes are unique.

**Problem statement:**
Implement several lookup functions using `find` and `findIndex`.

```typescript
const transactions = [
  { hash: "0xaaa", amount: 500,  token: "USDC", sender: "0xAlice", block: 100 },
  { hash: "0xbbb", amount: 1500, token: "ETH",  sender: "0xBob",   block: 101 },
  { hash: "0xccc", amount: 200,  token: "USDC", sender: "0xCarol", block: 100 },
  { hash: "0xddd", amount: 2000, token: "DAI",  sender: "0xDiana", block: 102 },
]

// 1. Find transaction by hash (returns transaction or undefined)
function findByHash(hash: string) { ... }

// 2. Find first transaction above 1000 from any sender
function findFirstLarge() { ... }

// 3. Find index of a transaction by hash (-1 if not found)
function findIndexByHash(hash: string): number { ... }

// 4. Safe find — returns a default if not found
function safeFindByHash(hash: string): typeof transactions[0] {
  // Returns the found transaction OR a default object if not found
  // Default: { hash: "0x000", amount: 0, token: "UNKNOWN", sender: "0x000", block: 0 }
}

// Test each:
console.log(findByHash("0xbbb"))        // { hash: "0xbbb", ... }
console.log(findByHash("0xzzz"))        // undefined
console.log(findFirstLarge())           // { hash: "0xbbb", ... }
console.log(findIndexByHash("0xccc"))   // 2
console.log(findIndexByHash("0xzzz"))   // -1
console.log(safeFindByHash("0xzzz"))    // default object
```

**Acceptance Criteria:**

- [ ] `findByHash` returns correct transaction or undefined
- [ ] `findFirstLarge` returns first transaction with amount > 1000
- [ ] `findIndexByHash` returns correct index or -1
- [ ] `safeFindByHash` never returns undefined

**Why this challenge matters:**
Your GET `/transactions/:hash` Express route finds a transaction by hash. `find` is the in-memory equivalent of the database query you already wrote with Drizzle.

---

## Challenge 29 — some and every

**Difficulty: 3.5/10**

**Concepts:**

- some returns true if any item matches
- every returns true if all items match
- Short-circuit evaluation
- Boolean aggregation over arrays

**Real-world scenario:**
Security checks on batches of transactions use `some` and `every`. Before processing a batch, your backend checks: "are ALL transactions from authorized senders?" and "does ANY transaction contain a suspicious pattern?"

**Problem statement:**
Write validation checks using `some` and `every`.

```typescript
const batch = [
  { hash: "0x1", sender: "0xAlice", amount: 500,  token: "USDC", flagged: false },
  { hash: "0x2", sender: "0xBob",   amount: 1500, token: "ETH",  flagged: false },
  { hash: "0x3", sender: "0xAlice", amount: 200,  token: "DAI",  flagged: true  },
  { hash: "0x4", sender: "0xCarol", amount: 3000, token: "USDC", flagged: false },
]

const authorizedSenders = ["0xAlice", "0xBob", "0xCarol"]

// 1. Are ALL transactions from authorized senders?
const allAuthorized: boolean = batch.every(...)

// 2. Is ANY transaction flagged?
const hasFlaggedTx: boolean = batch.some(...)

// 3. Are ALL amounts under 2000?
const allUnder2000: boolean = batch.every(...)

// 4. Does ANY transaction involve more than 2500?
const hasLargeAmount: boolean = batch.some(...)

// 5. Are ALL transactions for the same token?
const allSameToken: boolean = batch.every(tx => tx.token === batch[0].token)

// Build a batch validation report:
type BatchValidation = {
  isValid: boolean      // true if allAuthorized AND !hasFlaggedTx
  allAuthorized: boolean
  hasFlaggedTx: boolean
  allUnder2000: boolean
  hasLargeAmount: boolean
  allSameToken: boolean
}
```

**Acceptance Criteria:**

- [ ] All five boolean checks correct
- [ ] BatchValidation assembled correctly
- [ ] `isValid` logic correct
- [ ] No traditional loops used

**Why this challenge matters:**
`transactions.every(tx => authorizedSenders.includes(tx.sender))` — this exact check runs in your transaction validation middleware before database insertion.

---

## Challenge 30 — reduce — The Power Method

**Difficulty: 4/10**

**Concepts:**

- reduce accumulates a single value from an array
- Accumulator pattern
- Initial value importance
- reduce for objects, numbers, and arrays

**Real-world scenario:**
Your backend aggregates transaction data for reports — total volume, per-token summaries, sender totals. All of these are reduce operations — collapsing an array of items into a single summary value.

**Problem statement:**
Solve four reduce challenges — each producing a different output type.

```typescript
const transactions = [
  { hash: "0x1", token: "USDC", amount: 500,  sender: "0xAlice" },
  { hash: "0x2", token: "ETH",  amount: 1500, sender: "0xBob"   },
  { hash: "0x3", token: "USDC", amount: 800,  sender: "0xAlice" },
  { hash: "0x4", token: "DAI",  amount: 300,  sender: "0xCarol" },
  { hash: "0x5", token: "ETH",  amount: 2000, sender: "0xBob"   },
]

// 1. Total volume (number)
const totalVolume: number = transactions.reduce(...)
// Expected: 5100

// 2. Volume by token (object)
const volumeByToken: Record<string, number> = transactions.reduce(...)
// Expected: { USDC: 1300, ETH: 3500, DAI: 300 }

// 3. Volume by sender (object)
const volumeBySender: Record<string, number> = transactions.reduce(...)
// Expected: { "0xAlice": 1300, "0xBob": 3500, "0xCarol": 300 }

// 4. Largest transaction per token (object)
const maxByToken: Record<string, number> = transactions.reduce(...)
// Expected: { USDC: 800, ETH: 2000, DAI: 300 }
```

**Acceptance Criteria:**

- [ ] All four reduce calls produce correct output
- [ ] Correct initial values for each reduce (0, {}, {})
- [ ] No traditional loops used
- [ ] Type annotations correct

**Why this challenge matters:**
`transactions.reduce((acc, tx) => ({ ...acc, [tx.token]: (acc[tx.token] ?? 0) + tx.amount }), {})` — this exact pattern is in every aggregation endpoint in your backend.

---

## Challenge 31 — Chaining Array Methods

**Difficulty: 4.5/10**

**Concepts:**

- Chaining filter → map → reduce
- Reading chained method calls
- Understanding data shape at each step

**Real-world scenario:**
Your reporting endpoint needs to return total USDC volume for successful transactions from authorized wallets, formatted for display. This is a chain: filter → filter → map → reduce. All in one expression.

**Problem statement:**
Build a complete data pipeline using chained array methods. For each step, predict the intermediate data shape before writing the code.

```typescript
const rawEvents = [
  { hash: "0x1", token: "USDC", amount: 1500, sender: "0xAlice", status: "success" },
  { hash: "0x2", token: "ETH",  amount: 2.5,  sender: "0xBob",   status: "success" },
  { hash: "0x3", token: "USDC", amount: 500,  sender: "0xAlice", status: "failed"  },
  { hash: "0x4", token: "USDC", amount: 3000, sender: "0xCarol", status: "success" },
  { hash: "0x5", token: "USDC", amount: 200,  sender: "0xEve",   status: "success" },
]

const authorized = ["0xAlice", "0xBob", "0xCarol"]

// Pipeline 1: Total USDC from authorized senders with success status
const totalUSDC = rawEvents
  .filter(...)    // only USDC
  .filter(...)    // only success
  .filter(...)    // only authorized senders
  .map(...)       // extract amount
  .reduce(...)    // sum
// Expected: 4500 (1500 + 3000)

// Pipeline 2: Summary objects for large successful transactions
const largeSummaries = rawEvents
  .filter(tx => tx.amount > 1000 && tx.status === "success")
  .map(tx => ({
    hash: tx.hash,
    displayAmount: `${tx.amount} ${tx.token}`,
    isWhale: tx.amount > 2000
  }))
// Expected: 2 objects — 0x2 (ETH 2.5) and 0x4 (USDC 3000)

// Pipeline 3: Count by token for successful transactions
const countByToken = rawEvents
  .filter(...)
  .reduce<Record<string, number>>(...)
// Expected: { USDC: 3, ETH: 1 }
```

**Acceptance Criteria:**

- [ ] All three pipelines produce correct output
- [ ] No traditional loops anywhere
- [ ] Chained in single expression (no intermediate variables)
- [ ] Type annotations on reduce initial values

**Why this challenge matters:**
This is how your reporting endpoints will work. `GET /stats` returns aggregated data built from a chain exactly like this. Understanding how to read and write method chains is essential for reading any production Web3 backend code.

---

## Challenge 32 — sort with Callbacks

**Difficulty: 4/10**

**Concepts:**

- sort comparator function
- Ascending and descending sort
- Sorting objects by property
- Multiple sort criteria

**Real-world scenario:**
Your liquidation scanner returns positions sorted by profitability — highest liquidation bonus first. Your transaction history endpoint returns transactions sorted by block number descending. Sorting with custom comparators is essential.

**Problem statement:**
Sort transaction arrays using custom comparator callbacks.

```typescript
const transactions = [
  { hash: "0xa", amount: 1500, gasPrice: 25, block: 1003 },
  { hash: "0xb", amount: 500,  gasPrice: 45, block: 1001 },
  { hash: "0xc", amount: 3000, gasPrice: 15, block: 1002 },
  { hash: "0xd", amount: 800,  gasPrice: 35, block: 1001 },
  { hash: "0xe", amount: 1500, gasPrice: 30, block: 1004 },
]

// 1. Sort by amount ascending
const byAmountAsc = [...transactions].sort(...)

// 2. Sort by amount descending
const byAmountDesc = [...transactions].sort(...)

// 3. Sort by block descending, then gasPrice ascending (multi-criteria)
const byBlockThenGas = [...transactions].sort(...)

// 4. Sort by hash alphabetically
const byHash = [...transactions].sort(...)

// 5. Sort: largest amount first, if tie then lowest gasPrice first
const byAmountThenGas = [...transactions].sort(...)
```

**Acceptance Criteria:**

- [ ] All five sorts produce correct order
- [ ] Original array not mutated (use spread `[...arr]`)
- [ ] Multi-criteria sort (#3 and #5) correct
- [ ] Comparator functions written as arrow callbacks

**Why this challenge matters:**
Your liquidation engine sorts positions by bonus descending. Your transaction history sorts by block descending. Every sort in production uses a custom comparator callback.

---

## Challenge 33 — Array Methods on Nested Data

**Difficulty: 5.5/10**

**Concepts:**

- map + flatMap on nested arrays
- reduce for nested aggregation
- Complex data transformations

**Real-world scenario:**
Your indexer stores blocks, each containing multiple transactions. To get a flat list of all transactions across multiple blocks, or to aggregate data across blocks and transactions, you need to work with nested arrays.

**Problem statement:**
Work with nested blockchain data using array methods.

```typescript
type BlockData = {
  blockNumber: number
  miner: string
  transactions: Array<{
    hash: string
    token: string
    amount: number
    sender: string
    gasUsed: number
  }>
}

const blocks: BlockData[] = [
  {
    blockNumber: 100,
    miner: "0xMiner1",
    transactions: [
      { hash: "0x1", token: "USDC", amount: 500,  sender: "0xAlice", gasUsed: 21000 },
      { hash: "0x2", token: "ETH",  amount: 1500, sender: "0xBob",   gasUsed: 65000 },
    ]
  },
  {
    blockNumber: 101,
    miner: "0xMiner2",
    transactions: [
      { hash: "0x3", token: "USDC", amount: 800,  sender: "0xAlice", gasUsed: 21000 },
      { hash: "0x4", token: "DAI",  amount: 300,  sender: "0xCarol", gasUsed: 45000 },
      { hash: "0x5", token: "USDC", amount: 2000, sender: "0xDiana", gasUsed: 21000 },
    ]
  },
]

// 1. Flat list of all transactions across all blocks
const allTxs = blocks.flatMap(...)

// 2. Total gas used across ALL transactions in ALL blocks
const totalGas = blocks.flatMap(...).reduce(...)

// 3. All USDC transactions from all blocks, sorted by amount descending
const allUSDC = blocks
  .flatMap(...)
  .filter(...)
  .sort(...)

// 4. Per-block summary
type BlockSummary = {
  blockNumber: number
  txCount: number
  totalVolume: number
  uniqueSenders: number
}
const summaries: BlockSummary[] = blocks.map(block => ({
  blockNumber: block.blockNumber,
  txCount: ...,
  totalVolume: ...,
  uniqueSenders: ..., // hint: new Set(senders).size
}))
```

**Acceptance Criteria:**

- [ ] `allTxs` contains all 5 transactions in block order
- [ ] `totalGas` is 173000
- [ ] `allUSDC` contains 3 transactions sorted descending
- [ ] `summaries` has correct counts and volumes for each block

**Why this challenge matters:**
Your event indexer in Month 5 processes blocks containing multiple events. Working with nested arrays using flatMap is the standard pattern for flattening indexed blockchain data.

---

---

# SECTION 5 — Higher-Order Functions

> **Goal:** A Higher-Order Function (HOF) either takes a function as an argument
> OR returns a function. You have been using HOFs since Challenge 17 (callbacks).
> This section makes the pattern explicit and teaches you to BUILD your own HOFs.
> Every Express middleware factory, every Drizzle query builder, every
> viem transport is a Higher-Order Function.

---

## Challenge 34 — Build Your Own map

**Difficulty: 5/10**

**Concepts:**

- Implementing HOF from scratch
- Generic type parameters
- Understanding the map contract

**Real-world scenario:**
Implementing array methods from scratch forces you to understand exactly what the callback contract is — what arguments it receives and what it must return. This understanding makes you a better debugger when callbacks behave unexpectedly.

**Problem statement:**
Implement a typed `transform` function that behaves exactly like `Array.prototype.map` but works on blockchain transaction arrays.

```typescript
// Implement this:
function transform<TInput, TOutput>(
  items: TInput[],
  transformFn: (item: TInput, index: number) => TOutput,
): TOutput[] {
  // Your implementation — do not use .map() inside
}

// Test with these:
type Tx = { hash: string; amount: number; token: string };

const txs: Tx[] = [
  { hash: "0xaaa", amount: 500, token: "USDC" },
  { hash: "0xbbb", amount: 1500, token: "ETH" },
];

// Test 1: transform to display strings
const displays = transform(txs, (tx) => `${tx.hash}: ${tx.amount} ${tx.token}`);

// Test 2: transform to amounts only
const amounts = transform(txs, (tx) => tx.amount);

// Test 3: transform with index
const indexed = transform(txs, (tx, i) => ({ position: i + 1, ...tx }));

// Then prove it works identically to .map():
console.log(displays);
console.log(txs.map((tx) => `${tx.hash}: ${tx.amount} ${tx.token}`));
// Both should match exactly
```

**Acceptance Criteria:**

- [ ] Uses a loop internally — no `.map()` call
- [ ] Generic types `<TInput, TOutput>` used correctly
- [ ] Index passed to callback correctly
- [ ] Output identical to `.map()` equivalent

**Why this challenge matters:**
Understanding that `map` is just "loop + collect callback results" makes you comfortable implementing any custom iteration pattern. Your event processor in Month 5 uses custom iteration logic exactly like this.

---

## Challenge 35 — Build Your Own filter and find

**Difficulty: 5/10**

**Concepts:**

- Implementing filter from scratch
- Type predicates
- Generic HOF patterns

**Real-world scenario:**
Custom filtering functions are used throughout production backends — filtered database queries, filtered API responses, filtered monitoring alerts. Building filter from scratch cements the HOF pattern.

**Problem statement:**
Implement `select` (like filter) and `locate` (like find) as Higher-Order Functions.

```typescript
function select<T>(
  items: T[],
  predicate: (item: T, index: number) => boolean,
): T[] {
  // Implement without using .filter()
}

function locate<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  // Implement without using .find()
}

// Then build a higher-order filter factory:
function createFilter<T>(predicate: (item: T) => boolean): (items: T[]) => T[] {
  // Returns a filter function pre-configured with the predicate
}

// Test:
const isUSDC = createFilter<Tx>((tx) => tx.token === "USDC");
const isLarge = createFilter<Tx>((tx) => tx.amount > 1000);

const usdcTxs = isUSDC(txs);
const largeTxs = isLarge(txs);

// Compose filters:
const largeUSDC = isUSDC(isLarge(txs));
```

**Acceptance Criteria:**

- [ ] `select` and `locate` work without using .filter()/.find()
- [ ] `createFilter` returns a reusable filter function
- [ ] Composition (isUSDC applied to isLarge result) works correctly
- [ ] Generic types used correctly

**Why this challenge matters:**
`createFilter` is a factory that returns a function — exactly the pattern used by Express middleware factories, Drizzle where clause builders, and viem filter factories.

---

## Challenge 36 — Function Composition Pipeline

**Difficulty: 5.5/10**

**Concepts:**

- Composing multiple functions
- Data flowing through a pipeline
- pipe and compose patterns

**Real-world scenario:**
Data transformation pipelines in backends process data through a series of steps — validate, normalize, enrich, format. The `pipe` pattern makes this explicit: each function takes the output of the previous one.

**Problem statement:**
Build a `pipe` function that takes multiple transformation functions and applies them in sequence, passing the output of each to the next.

```typescript
// Implement pipe:
function pipe<T>(...fns: Array<(input: T) => T>): (input: T) => T {
  // Returns a function that applies all fns in order
}

// Define transformation steps:
type TxData = {
  hash: string;
  amount: number;
  sender: string;
  token: string;
  fee?: number;
  formattedAmount?: string;
  senderShort?: string;
};

const addFee = (tx: TxData): TxData => ({
  ...tx,
  fee: tx.amount * 0.003,
});

const formatAmount = (tx: TxData): TxData => ({
  ...tx,
  formattedAmount: `${tx.amount.toFixed(2)} ${tx.token}`,
});

const shortenSender = (tx: TxData): TxData => ({
  ...tx,
  senderShort: `${tx.sender.slice(0, 6)}...${tx.sender.slice(-4)}`,
});

// Build and use the pipeline:
const processTx = pipe(addFee, formatAmount, shortenSender);

const raw: TxData = {
  hash: "0xabc",
  amount: 1000,
  sender: "0xAlice1234567890",
  token: "USDC",
};
const processed = processTx(raw);
// Expected: { hash, amount: 1000, sender, token, fee: 3, formattedAmount: "1000.00 USDC", senderShort: "0xAlic...7890" }

// Also apply the pipeline to an array:
const processedAll = txList.map(processTx);
```

**Acceptance Criteria:**

- [ ] `pipe` applies functions left-to-right
- [ ] Each step receives the full output of previous step
- [ ] Works with any number of transformation functions
- [ ] Used correctly with `.map()` on arrays

**Why this challenge matters:**
Drizzle's query builder, viem's transport chain, and Express middleware are all pipe patterns. Understanding pipe makes these APIs readable immediately.

---

## Challenge 37 — Memoization HOF

**Difficulty: 6/10**

**Concepts:**

- Caching function results
- HOF wrapping any function
- Cache invalidation
- Performance optimization

**Real-world scenario:**
Fetching token prices, gas prices, and wallet balances repeatedly is expensive. A memoize HOF caches expensive function results so they are only computed once per unique input. This is a simplified version of your TTL cache challenge.

**Problem statement:**
Build a `memoize` Higher-Order Function that wraps any function and caches its results.

```typescript
function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string, // optional custom cache key
): (...args: TArgs) => TReturn {
  // Returns a wrapped version of fn that caches results
  // Default key: JSON.stringify(args)
}

// Test:
let callCount = 0;

const expensiveCalc = (tokenAddress: string, blockNumber: number): number => {
  callCount++;
  return tokenAddress.length + blockNumber; // simulate expensive work
};

const memoizedCalc = memoize(expensiveCalc);

console.log(memoizedCalc("0xUSDC", 100)); // computed, callCount: 1
console.log(memoizedCalc("0xUSDC", 100)); // cached,   callCount: 1
console.log(memoizedCalc("0xETH", 100)); // computed, callCount: 2
console.log(memoizedCalc("0xUSDC", 100)); // cached,   callCount: 2

// With custom key:
const memoizedByToken = memoize(
  expensiveCalc,
  (token, _block) => token, // cache by token only, ignore block
);

console.log(memoizedByToken("0xUSDC", 100)); // computed
console.log(memoizedByToken("0xUSDC", 999)); // cached (same token)
```

**Acceptance Criteria:**

- [ ] Second call with same args returns cached result
- [ ] `callCount` confirms function not called again for cached args
- [ ] Custom `keyFn` overrides default caching key
- [ ] Generic types work for any function signature

**Why this challenge matters:**
Your TTL cache from the medium challenges is a memoize function with expiry. Understanding memoize makes caching patterns obvious — it is just "store the result the first time, return it every time after."

---

## Challenge 38 — Middleware Factory Pattern

**Difficulty: 6/10**

**Concepts:**

- HOF that returns middleware functions
- Configurable behavior via closure
- Express middleware type pattern

**Real-world scenario:**
Express middleware factories are the most common HOF pattern in Node.js backends. `cors({ origin: "https://myapp.com" })` returns a middleware. `express.json({ limit: "10mb" })` returns a middleware. You will write these yourself for rate limiting, authentication, and logging.

**Problem statement:**
Build three middleware factories for a blockchain API backend.

```typescript
type Middleware = (
  req: { path: string; headers: Record<string, string>; body: unknown },
  res: { status: (code: number) => { json: (data: unknown) => void } },
  next: () => void,
) => void;

// Factory 1: Rate limiter
// Takes: maxRequests per minute per wallet
// Returns: middleware that tracks requests and blocks if over limit
function createRateLimiter(maxRequestsPerMinute: number): Middleware {
  // Must track request counts internally (closure)
  // If over limit: res.status(429).json({ error: "Rate limit exceeded" })
  // Otherwise: next()
}

// Factory 2: API Key validator
// Takes: validKeys array
// Returns: middleware that checks X-API-Key header
function createApiKeyValidator(validKeys: string[]): Middleware {
  // If no header or invalid key: res.status(401).json({ error: "Invalid API key" })
  // Otherwise: next()
}

// Factory 3: Request logger
// Takes: prefix string
// Returns: middleware that logs [prefix] PATH at TIMESTAMP
function createLogger(prefix: string): Middleware {
  // Logs then always calls next()
}

// Use them:
const rateLimiter = createRateLimiter(10);
const apiKeyValidator = createApiKeyValidator(["key-abc", "key-xyz"]);
const logger = createLogger("[API]");
```

**Acceptance Criteria:**

- [ ] All three factories return middleware functions
- [ ] Rate limiter tracks state correctly using closure
- [ ] API key validator checks correct header
- [ ] Logger always calls next()
- [ ] Each middleware has correct behavior when condition fails

**Why this challenge matters:**
This is production Express code. Every auth middleware, rate limiter, and logger in your Month 5 backend follows this exact factory pattern.

---

## Challenge 39 — Event Emitter Pattern

**Difficulty: 6.5/10**

**Concepts:**

- Storing callbacks in a registry
- Calling registered callbacks when events fire
- Multiple callbacks per event
- Unregistering callbacks

**Real-world scenario:**
Node.js's EventEmitter is built on this pattern. viem's `watchContractEvent` is built on this pattern. Your Whale Watcher subscribes to Transfer events — under the hood, it registers a callback that fires when new events arrive.

**Problem statement:**
Build a typed `BlockchainEventEmitter` class that allows registering and emitting typed events.

```typescript
type EventMap = {
  transfer: { from: string; to: string; amount: number; token: string };
  block: { number: number; hash: string; txCount: number };
  error: { message: string; code: number };
};

class BlockchainEventEmitter {
  // on(event, callback): register a callback for an event
  on<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void,
  ): void;

  // off(event, callback): remove a specific callback
  off<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void,
  ): void;

  // emit(event, data): call all registered callbacks for this event
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void;

  // once(event, callback): register callback that fires only once then auto-removes
  once<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void,
  ): void;
}

// Test:
const emitter = new BlockchainEventEmitter();

const onTransfer = (data: EventMap["transfer"]) => {
  console.log(`Transfer: ${data.amount} ${data.token} from ${data.from}`);
};

emitter.on("transfer", onTransfer);
emitter.on("block", ({ number }) => console.log("New block:", number));

emitter.emit("transfer", {
  from: "0xAlice",
  to: "0xBob",
  amount: 500,
  token: "USDC",
});
emitter.emit("block", { number: 19000001, hash: "0xabc", txCount: 142 });

emitter.off("transfer", onTransfer);
emitter.emit("transfer", {
  from: "0xAlice",
  to: "0xBob",
  amount: 100,
  token: "USDC",
});
// This should NOT log — callback was removed
```

**Acceptance Criteria:**

- [ ] `on` registers callback correctly
- [ ] `emit` calls all registered callbacks for that event
- [ ] `off` correctly removes specific callback
- [ ] `once` fires exactly once then auto-removes
- [ ] TypeScript types ensure correct data shape per event

**Why this challenge matters:**
viem's `watchContractEvent` is an event emitter. Node.js streams are event emitters. Your Whale Watcher in Month 2 uses this pattern. Understanding it makes the entire event-driven architecture of Node.js readable.

---

## Challenge 40 — HOF Composition: Build a Query Builder

**Difficulty: 7/10**

**Concepts:**

- Method chaining using HOFs
- Builder pattern
- Functions returning modified versions of themselves
- Fluent interface

**Real-world scenario:**
Drizzle ORM's query builder is a Higher-Order Function chain. `db.select().from(table).where(condition).orderBy(field).limit(10)` — each method returns a new builder with the constraint added. Understanding this pattern makes Drizzle's API immediately readable.

**Problem statement:**
Build a simple `TransactionQueryBuilder` that uses method chaining to build a query, then execute it against an in-memory transaction array.

```typescript
type Tx = {
  hash: string;
  token: string;
  amount: number;
  sender: string;
  block: number;
  status: string;
};

class TransactionQueryBuilder {
  private _data: Tx[];
  private _filters: Array<(tx: Tx) => boolean> = [];
  private _sortFn?: (a: Tx, b: Tx) => number;
  private _limitCount?: number;
  private _selectedFields?: Array<keyof Tx>;

  constructor(data: Tx[]) {
    this._data = data;
  }

  where(predicate: (tx: Tx) => boolean): TransactionQueryBuilder {
    // Add predicate to filters, return this
  }

  orderBy(
    field: keyof Tx,
    direction: "asc" | "desc" = "asc",
  ): TransactionQueryBuilder {
    // Set sort function, return this
  }

  limit(count: number): TransactionQueryBuilder {
    // Set limit, return this
  }

  select(...fields: Array<keyof Tx>): TransactionQueryBuilder {
    // Set selected fields, return this
  }

  execute(): Partial<Tx>[] {
    // Apply all filters, sort, limit, and field selection
    // Return results
  }
}

// Test:
const results = new TransactionQueryBuilder(txData)
  .where((tx) => tx.token === "USDC")
  .where((tx) => tx.amount > 500)
  .orderBy("amount", "desc")
  .limit(5)
  .execute();
```

**Acceptance Criteria:**

- [ ] Each method returns `this` for chaining
- [ ] Multiple `where` calls are combined (AND logic)
- [ ] `orderBy` sorts correctly
- [ ] `limit` caps results
- [ ] `execute()` applies all constraints in correct order

**Why this challenge matters:**
`db.select().from(transactions).where(eq(transactions.token, "USDC")).limit(10)` — this is Drizzle. Understanding that each method returns a modified builder makes every ORM and query builder API immediately readable.

---

---

# SECTION 6 — Real-World Web3 Function Reading

> **Goal:** Read and understand real production-style TypeScript code.
> After Section 5, you should be able to read any callback or HOF code.
> These challenges verify that understanding by presenting real patterns
> from viem, Express, and Web3 backends — and asking you to explain,
> extend, or fix them.

---

## Challenge 41 — Read and Extend a viem-Style Client

**Difficulty: 6/10**

**Concepts:**

- Reading function-heavy object definitions
- Extending existing HOF patterns
- viem client architecture

**Real-world scenario:**
This is the architecture of viem's `createPublicClient`. When you use viem in Month 2, you will call methods on objects that look exactly like this. Being able to read and extend them confidently is essential.

**Problem statement:**
Read the following viem-style client definition. Explain what each method does in a comment. Then add three new methods.

```typescript
type PublicClient = {
  getBalance: (address: string) => Promise<bigint>;
  getBlockNumber: () => Promise<number>;
  getTransaction: (
    hash: string,
  ) => Promise<{
    hash: string;
    from: string;
    to: string;
    value: bigint;
  } | null>;
  watchBlocks: (onBlock: (blockNumber: number) => void) => () => void; // returns unsubscribe fn
  simulateTransaction: (
    tx: { from: string; to: string; value: bigint },
    onResult: (success: boolean, gasEstimate: number) => void,
  ) => void;
};

// TASK 1: Add a comment to each method explaining what it does
//         and what the callback/return type means

// TASK 2: Add these three methods to the type and implement them
// as mock functions (same pattern as above — no real RPC calls):

// getTokenBalance(tokenAddress: string, walletAddress: string): Promise<bigint>
// watchTransfers(token: string, onTransfer: (from: string, to: string, amount: bigint) => void): () => void
// batchGetBalances(addresses: string[]): Promise<Array<{ address: string; balance: bigint }>>

// TASK 3: Use the client — call each of the three new methods
// and log the results
```

**Acceptance Criteria:**

- [ ] All five original methods have clear explanatory comments
- [ ] Three new methods added with correct type signatures
- [ ] Mock implementations follow the same patterns as originals
- [ ] All three new methods called and results logged

**Why this challenge matters:**
This IS viem. When you install viem in Month 2, `createPublicClient` returns exactly this structure. Reading it fluently means you can use viem without constantly consulting documentation.

---

## Challenge 42 — Read and Debug Callback-Heavy Code

**Difficulty: 6.5/10**

**Concepts:**

- Tracing callback execution
- Identifying bugs in callback patterns
- Fixing HOF usage

**Real-world scenario:**
Production debugging of callback-heavy code is a core skill. When your event listener produces wrong data or misses events, you need to trace the callback execution order to find the bug.

**Problem statement:**
The following code has FOUR bugs. Find and fix each one. Write a comment explaining what each bug was and why it caused the observed behavior.

```typescript
type Transfer = { hash: string; from: string; to: string; amount: number };

// BUG HUNT — find and fix 4 bugs:

const transfers: Transfer[] = [
  { hash: "0x1", from: "0xAlice", to: "0xBob", amount: 500 },
  { hash: "0x2", from: "0xBob", to: "0xCarol", amount: 1500 },
  { hash: "0x3", from: "0xAlice", to: "0xCarol", amount: 800 },
];

// Bug 1: This filter should return large transfers (> 1000) but returns wrong results
const largeTransfers = transfers.filter((tx) => {
  return tx.amount < 1000; // BUG
});

// Bug 2: This map should return senders only but crashes
const senders = transfers.map((tx) => tx.sender); // BUG — wrong field name

// Bug 3: This reduce should sum amounts but always returns 0
const total = transfers.reduce((acc, tx) => {
  acc + tx.amount; // BUG — missing return
}, 0);

// Bug 4: This find should get Alice's first transfer but returns wrong result
const aliceTx = transfers.find((tx) => tx.from !== "0xAlice"); // BUG — wrong operator

// After fixing, the expected outputs are:
// largeTransfers: [{ hash: "0x2", amount: 1500 }]
// senders: ["0xAlice", "0xBob", "0xAlice"]
// total: 2800
// aliceTx: { hash: "0x1", from: "0xAlice", ... }
```

**Acceptance Criteria:**

- [ ] All four bugs identified and fixed
- [ ] Comment explaining each bug
- [ ] All four expected outputs correct after fixes
- [ ] TypeScript shows no errors after fixes

**Why this challenge matters:**
Debugging callback code is 50% of your job as a backend engineer. The bugs above — wrong comparator, wrong field name, missing return, wrong operator — are the four most common real bugs in production callback code.

---

## Challenge 43 — Implement an Express-Style Router

**Difficulty: 7/10**

**Concepts:**

- HOF patterns in routing
- Callback registration and dispatch
- Pattern matching on strings
- Middleware chain pattern combined with routing

**Real-world scenario:**
Express's routing system is a collection of HOFs. Understanding how routes are registered and dispatched makes Express middleware and route handlers immediately readable and debuggable.

**Problem statement:**
Build a simplified `Router` class that mimics Express's routing API.

```typescript
type HandlerFn = (
  req: {
    path: string;
    method: string;
    params: Record<string, string>;
    body: unknown;
  },
  res: {
    json: (data: unknown) => void;
    status: (code: number) => { json: (data: unknown) => void };
  },
) => void;

class Router {
  get(path: string, handler: HandlerFn): void;
  post(path: string, handler: HandlerFn): void;
  use(middleware: HandlerFn): void;
  dispatch(method: string, path: string, body?: unknown): void;
  // dispatch simulates receiving a request and running it through middleware + handlers
}

// Test:
const router = new Router();

router.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.path}`);
  // Must call next somehow — design this into your Router
});

router.get("/transactions", (req, res) => {
  res.json({ transactions: [] });
});

router.get("/transactions/:hash", (req, res) => {
  res.json({ hash: req.params.hash });
});

router.post("/transactions", (req, res) => {
  res.status(201).json({ message: "created", data: req.body });
});

router.dispatch("GET", "/transactions");
router.dispatch("GET", "/transactions/0xabc");
router.dispatch("POST", "/transactions", { hash: "0xnew", amount: 100 });
```

**Acceptance Criteria:**

- [ ] `get` and `post` register route handlers correctly
- [ ] `use` registers middleware that runs before handlers
- [ ] `dispatch` routes to correct handler based on method + path
- [ ] `:hash` parameter extracted correctly into `req.params`
- [ ] Middleware runs before handler

**Why this challenge matters:**
This IS Express. You are building a simplified version of the framework you already use. Understanding the internals makes every Express behavior — route matching, middleware ordering, parameter extraction — obvious.

---

## Challenge 44 — Async-Ready HOF Patterns

**Difficulty: 7.5/10**

**Concepts:**

- HOFs that work with async callbacks
- Promise-returning callbacks in array methods
- Sequential vs concurrent async HOFs
- Preparing for return to async

**Real-world scenario:**
Now that you understand HOFs deeply, you are ready to see how they combine with async. This challenge bridges your HOF knowledge with async patterns — this is the actual code you write in Month 2 backends.

**Problem statement:**
Build HOFs that accept async callbacks and handle them correctly.

```typescript
// 1. asyncMap — like map but callback returns Promise
async function asyncMap<T, U>(
  items: T[],
  asyncFn: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  // Execute all callbacks CONCURRENTLY
}

// 2. asyncMapSequential — like asyncMap but callbacks run one at a time
async function asyncMapSequential<T, U>(
  items: T[],
  asyncFn: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  // Execute callbacks SEQUENTIALLY
}

// 3. asyncFilter — like filter but predicate returns Promise<boolean>
async function asyncFilter<T>(
  items: T[],
  asyncPredicate: (item: T) => Promise<boolean>,
): Promise<T[]> {
  // Run all predicates concurrently, collect truthy results
}

// 4. withRetry — wraps any async function with retry logic
function withRetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  maxAttempts: number,
  delayMs: number,
): (...args: TArgs) => Promise<TReturn> {
  // Returns a new function that retries on failure
}

// Test:
const addresses = ["0xAlice", "0xBob", "0xCarol", "0xUnknown"];

const balances = await asyncMap(addresses, async (addr) => {
  const balance = await mockFetchBalance(addr);
  return { address: addr, balance };
});

const richAddresses = await asyncFilter(addresses, async (addr) => {
  const balance = await mockFetchBalance(addr);
  return balance > 1000;
});

const fetchWithRetry = withRetry(mockFetchBalance, 3, 500);
const balance = await fetchWithRetry("0xAlice");
```

**Acceptance Criteria:**

- [ ] `asyncMap` runs callbacks concurrently (Promise.all)
- [ ] `asyncMapSequential` runs callbacks one at a time
- [ ] `asyncFilter` returns only items where predicate resolves true
- [ ] `withRetry` retries up to maxAttempts times with delay

**Why this challenge matters:**
This IS your async foundation challenges — but now you understand exactly why they are written the way they are. `asyncMap` is Promise.all on mapped callbacks. `asyncMapSequential` is a for-of with await. `withRetry` is your Challenge 7. The HOF wrapper is the only new concept.

---

## Challenge 45 — Read Real viem Code

**Difficulty: 8/10**

**Concepts:**

- Reading production TypeScript HOF patterns
- Generic type parameters in HOFs
- Discriminated unions with callbacks
- Full Web3 code literacy

**Real-world scenario:**
This is the capstone of Section 6. Real viem source code uses advanced TypeScript generics and HOF patterns. Being able to read it without hesitation means you are ready for Month 2 production code.

**Problem statement:**
Read the following viem-inspired code. For each function, write:

1. A plain English explanation of what it does
2. What the callback receives and when it is called
3. What it returns and why

Then extend each function with one additional feature.

```typescript
// Read and explain each of these:

// Function A:
function createWatchEventFilter<TEventData>(
  eventName: string,
  decoder: (rawLog: string) => TEventData,
  onEvent: (data: TEventData) => void,
  onError?: (error: Error) => void,
): {
  start: () => void;
  stop: () => void;
  getEventCount: () => number;
} {
  let count = 0;
  let running = false;
  const interval = setInterval(() => {
    if (!running) return;
    try {
      const rawLog = `mock_log_${Date.now()}`;
      const decoded = decoder(rawLog);
      count++;
      onEvent(decoded);
    } catch (e) {
      onError?.(e as Error);
    }
  }, 500);

  return {
    start: () => {
      running = true;
    },
    stop: () => {
      running = false;
      clearInterval(interval);
    },
    getEventCount: () => count,
  };
}

// Function B:
function createBatchProcessor<TInput, TOutput>(
  batchSize: number,
  processor: (batch: TInput[]) => TOutput[],
): {
  add: (item: TInput) => void;
  flush: () => TOutput[];
  size: () => number;
} {
  const queue: TInput[] = [];
  return {
    add: (item) => queue.push(item),
    flush: () => {
      const results: TOutput[] = [];
      while (queue.length > 0) {
        const batch = queue.splice(0, batchSize);
        results.push(...processor(batch));
      }
      return results;
    },
    size: () => queue.length,
  };
}
```

**Acceptance Criteria:**

- [ ] Clear plain-English explanation for both functions
- [ ] Callback timing correctly identified for Function A
- [ ] Generic type parameters explained
- [ ] Both functions extended with one new feature each

**Why this challenge matters:**
Function A is viem's `watchContractEvent`. Function B is a batch processor for your indexer. If you can read these without confusion, you are ready to use any Web3 SDK and write production backend code.

---

---

# CAPSTONE — Final Assessment

> These 5 challenges combine EVERYTHING from Sections 1–6.
> Each one is a mini-project, not just a function.
> Complete all 5 and you are ready to return to async/await
> with full understanding of the foundations underneath it.

---

## Capstone 1 — Transaction Processing Pipeline

**Difficulty: 7/10**

**Concepts:** Function declarations, arrow functions, callbacks, map/filter/reduce, HOF composition, pipeline pattern

**Problem statement:**
Build a complete transaction processing pipeline using only synchronous functions, callbacks, and array methods. No async allowed.

The pipeline must:

1. Validate each transaction (using a validator array — Section 2/3 pattern)
2. Normalize valid transactions (using map — Section 4 pattern)
3. Enrich with fee calculation (using a HOF factory — Section 5 pattern)
4. Filter by minimum amount (using a configurable filter — Section 5 pattern)
5. Sort by amount descending (using sort callback — Section 4 pattern)
6. Reduce to a final report (using reduce — Section 4 pattern)
7. Emit a "pipeline complete" event (using your EventEmitter — Section 5 pattern)

All seven steps must be composable — each step is a function that can be replaced or reordered.

---

## Capstone 2 — Configurable Monitoring System

**Difficulty: 7.5/10**

**Concepts:** HOF factories, middleware pattern, callbacks, closures, arrays of functions

**Problem statement:**
Build a `MonitoringSystem` that uses HOF factories to create configurable monitors for different blockchain metrics.

```typescript
// The system must support:
const monitor = createMonitoringSystem({
  onAlert: (alert: Alert) => console.log("ALERT:", alert),
  onMetric: (metric: Metric) => console.log("METRIC:", metric),
})

monitor.addCheck("gas", createGasMonitor({ threshold: 50, interval: 1000 }))
monitor.addCheck("balance", createBalanceMonitor({ minBalance: 100, wallets: [...] }))
monitor.addCheck("txRate", createTxRateMonitor({ maxPerMinute: 10 }))

monitor.start()
// ... runs checks at configured intervals
// ... fires callbacks when conditions are met
monitor.stop()
```

Every monitor is a HOF factory. The system is assembled by composing them.

---

## Capstone 3 — Type-Safe Event Bus

**Difficulty: 8/10**

**Concepts:** Advanced TypeScript generics, HOF patterns, EventEmitter, type-safe callbacks

**Problem statement:**
Build a fully type-safe event bus where:

- Each event type has a specific payload type
- Registering a callback for an event enforces the correct payload type at compile time
- Events can be wildcarded (`*` listens to all events)
- Callbacks can be async
- The bus supports middleware (functions that can modify events before they reach listeners)

This is the production-grade version of Challenge 39.

---

## Capstone 4 — Mini Express Clone

**Difficulty: 8.5/10**

**Concepts:** HOF patterns, middleware chains, routing, callbacks, closures

**Problem statement:**
Extend your Challenge 43 Router into a full mini-Express with:

- Middleware chains with `next()`
- Error handling middleware (4 parameters: error, req, res, next)
- Route parameters (`:param`)
- Query string parsing
- Request body handling
- Response methods: `json()`, `status()`, `send()`
- Router mounting: `app.use("/api", apiRouter)`

Test it with a complete blockchain API:

- GET `/api/transactions`
- GET `/api/transactions/:hash`
- POST `/api/transactions`
- GET `/api/wallets/:address/balance`

---

## Capstone 5 — Async Foundation Bridge

**Difficulty: 9/10**

**Concepts:** Everything from Sections 1–6 PLUS callbacks-to-promises bridge (Challenge 24)

**Problem statement:**
Take your complete Transaction Processing Pipeline from Capstone 1 and convert it to use Promises throughout.

Each step becomes async:

1. Async validator (validator returns `Promise<ValidationResult>`)
2. Async normalizer (fetches exchange rates to normalize amounts)
3. Async enricher (fetches fee data from a simulated RPC)
4. Async filter (checks balance against a simulated database)
5. Async sort (gets current block for timestamp comparison)
6. Async reduce (builds report with live data)

All six async steps must be composable into a single pipeline function using the HOF patterns from Section 5.

This challenge proves that you understand async not as magic — but as callbacks with better syntax, wrapped in the exact same HOF patterns you mastered here.

---

---

## COMPLETION CHECKLIST

```
SECTION 1 — Function Fundamentals
[ ] Ch 1  — Wallet Balance Formatter
[ ] Ch 2  — RPC Endpoint Validator
[ ] Ch 3  — Transaction Status Descriptor
[ ] Ch 4  — Gas Price Analyzer
[ ] Ch 5  — Wallet Address Masker
[ ] Ch 6  — Block Confirmation Calculator
[ ] Ch 7  — Token Allowance Checker
[ ] Ch 8  — RPC Response Normalizer

SECTION 2 — Arrow Functions
[ ] Ch 9  — Convert Function Declaration to Arrow
[ ] Ch 10 — Arrow Functions Returning Objects
[ ] Ch 11 — Single vs Multi Parameter Arrow Functions
[ ] Ch 12 — Arrow Functions as Object Properties
[ ] Ch 13 — Arrow Functions as Variables
[ ] Ch 14 — Returning Arrow Functions from Functions
[ ] Ch 15 — Arrow Functions with Destructuring
[ ] Ch 16 — Arrow Functions in Arrays

SECTION 3 — Callbacks
[ ] Ch 17 — Your First Callback
[ ] Ch 18 — Callback Execution Order
[ ] Ch 19 — Writing a Custom forEach
[ ] Ch 20 — Callbacks with State
[ ] Ch 21 — Callback Arrays (Middleware Pattern)
[ ] Ch 22 — Error-First Callbacks
[ ] Ch 23 — Async Simulation with Callbacks
[ ] Ch 24 — Callback to Promise Conversion

SECTION 4 — Array Methods
[ ] Ch 25 — forEach vs for Loop
[ ] Ch 26 — map — Transform Every Item
[ ] Ch 27 — filter — Keep Only What Matches
[ ] Ch 28 — find and findIndex
[ ] Ch 29 — some and every
[ ] Ch 30 — reduce — The Power Method
[ ] Ch 31 — Chaining Array Methods
[ ] Ch 32 — sort with Callbacks
[ ] Ch 33 — Array Methods on Nested Data

SECTION 5 — Higher-Order Functions
[ ] Ch 34 — Build Your Own map
[ ] Ch 35 — Build Your Own filter and find
[ ] Ch 36 — Function Composition Pipeline
[ ] Ch 37 — Memoization HOF
[ ] Ch 38 — Middleware Factory Pattern
[ ] Ch 39 — Event Emitter Pattern
[ ] Ch 40 — HOF Composition: Query Builder

SECTION 6 — Real-World Web3 Function Reading
[ ] Ch 41 — Read and Extend a viem-Style Client
[ ] Ch 42 — Read and Debug Callback-Heavy Code
[ ] Ch 43 — Implement an Express-Style Router
[ ] Ch 44 — Async-Ready HOF Patterns
[ ] Ch 45 — Read Real viem Code

CAPSTONE
[ ] Cap 1 — Transaction Processing Pipeline
[ ] Cap 2 — Configurable Monitoring System
[ ] Cap 3 — Type-Safe Event Bus
[ ] Cap 4 — Mini Express Clone
[ ] Cap 5 — Async Foundation Bridge
```

---

## RETURN TO ASYNC

When all 50 challenges are checked — return to:

1. Promises (`.then()`, `.catch()`, `.finally()`)
2. `async/await`
3. `Promise.all`, `Promise.allSettled`, `Promise.race`
4. Your async foundation challenges (1–10)
5. The 7 medium weekly challenges

You will find that async code is not mysterious anymore.
It is callbacks — wrapped in a nicer syntax — applied to the exact
HOF patterns you just spent 2–4 weeks mastering.
