# Month 2 Backend Fundamentals — Complete Knowledge Audit

## Everything You Should Know Before Month 3

### Review Guide · Study Document · Self-Assessment Framework

---

> **HOW TO USE THIS DOCUMENT**
>
> Read each section. For every concept, ask yourself:
> "Can I explain this out loud to someone who has never heard of it?"
> If you hesitate — that is a gap. Mark it and return to it.
>
> This document is not a tutorial. It is a mirror.
> It shows you what you know and what you only think you know.

---

## TABLE OF CONTENTS

1. JavaScript Fundamentals
2. TypeScript Fundamentals
3. SQL Fundamentals
4. PostgreSQL Fundamentals
5. Node.js Fundamentals
6. Express.js Fundamentals
7. API Fundamentals
8. Drizzle ORM Fundamentals
9. viem Fundamentals
10. Putting It All Together
11. Knowledge Audit Quiz (30 questions)
12. Technical Assessment (20 scenarios)
13. Grading Rubric

---

---

# SECTION 1 — JavaScript Fundamentals

---

## 1.1 Variables

**What it is:**
Variables are named containers that store values. JavaScript has three declaration keywords: `var`, `let`, and `const`.

**Why it exists:**
Code needs to store and reference data — wallet addresses, amounts, statuses — throughout execution.

```javascript
const walletAddress = "0xAlice"; // cannot be reassigned
let balance = 1500; // can be reassigned
var legacy = "avoid this"; // function-scoped, avoid in modern code
```

**The critical difference:**

- `const` — block-scoped, cannot be reassigned. Use by default.
- `let` — block-scoped, can be reassigned. Use when the value changes.
- `var` — function-scoped, hoisted. Never use in modern code.

**Common mistake:**
Thinking `const` means immutable. `const` prevents reassignment of the variable, not mutation of its value.

```javascript
const tx = { hash: "0xaaa", amount: 500 };
tx.amount = 1000; // ALLOWED — mutating the object
tx = { hash: "0xbbb" }; // ERROR — reassigning the variable
```

---

## 1.2 Data Types

**Primitive types:**

| Type        | Example        | Backend usage                      |
| ----------- | -------------- | ---------------------------------- |
| `string`    | `"0xAlice"`    | Wallet addresses, hashes           |
| `number`    | `3200`         | Gas prices, amounts                |
| `bigint`    | `1500000000n`  | Token amounts (wei)                |
| `boolean`   | `true`         | Status flags                       |
| `null`      | `null`         | Intentionally empty value          |
| `undefined` | `undefined`    | Variable declared but not assigned |
| `symbol`    | `Symbol("id")` | Rare — unique identifiers          |

**Reference types:**

- Objects — `{ hash: "0xaaa", amount: 500 }`
- Arrays — `["0xAlice", "0xBob"]`
- Functions — first-class values in JavaScript

**Why bigint matters in Web3:**
Token amounts on Ethereum can exceed `Number.MAX_SAFE_INTEGER` (2^53 - 1). A wallet holding 10 ETH stores `10000000000000000000` wei — too large for a regular number. viem returns all amounts as `bigint`.

**Common mistake:**
Mixing `null` and `undefined`. `null` is explicitly set to "no value." `undefined` means a variable exists but was never given a value.

---

## 1.3 Functions

**Three ways to define a function:**

```typescript
// 1. Function declaration — hoisted, named
function getBalance(address: string): number {
  return 1500;
}

// 2. Function expression — not hoisted
const getBalance = function (address: string): number {
  return 1500;
};

// 3. Arrow function — not hoisted, no own `this`
const getBalance = (address: string): number => 1500;
```

**Parameters vs arguments:**

- Parameters — the named variables in the function definition
- Arguments — the actual values passed when calling the function

```typescript
function transfer(from: string, to: string, amount: number) {
  // parameters
  // ...
}
transfer("0xAlice", "0xBob", 500); // arguments
```

**Return values:**
A function without `return` returns `undefined`. A `void` function intentionally returns nothing.

---

## 1.4 Arrow Functions

**What they are:**
A shorter syntax for function expressions with two key differences from regular functions:

1. No own `this` binding
2. Cannot be used as constructors

```typescript
// Regular function — has own `this`
const obj = {
  name: "wallet",
  getName: function () {
    return this.name;
  }, // works
};

// Arrow function — inherits `this` from surrounding scope
const obj2 = {
  name: "wallet",
  getName: () => this.name, // undefined — no own `this`
};
```

**Implicit return:**

```typescript
const double = (n: number) => n * 2; // implicit return
const getObj = (x: number) => ({ value: x }); // implicit object return — needs parens
const complex = (n: number) => {
  return n * 2;
}; // explicit return
```

**Why they dominate Web3 code:**
Every array method callback, every Express middleware, every viem event handler uses arrow functions. They are the default in modern TypeScript.

---

## 1.5 Callbacks

**What it is:**
A function passed as an argument to another function, to be called at a later time.

```typescript
function processTransaction(
  tx: { hash: string; amount: number },
  onSuccess: (result: string) => void,
  onError: (error: Error) => void,
): void {
  if (tx.amount > 0) {
    onSuccess(`Processed: ${tx.hash}`);
  } else {
    onError(new Error("Invalid amount"));
  }
}

processTransaction(
  { hash: "0xaaa", amount: 500 },
  (result) => console.log(result), // callback
  (error) => console.error(error), // callback
);
```

**Why it exists:**
Callbacks are how JavaScript handles asynchronous operations. Before Promises, ALL async code used callbacks.

**The error-first convention:**
Node.js standardized `callback(error, result)` where the first argument is always null or an Error.

**Common mistake:**
Not handling the error case, leading to silent failures in production.

---

## 1.6 Higher-Order Functions

**What it is:**
A function that either takes a function as an argument OR returns a function (or both).

```typescript
// Takes a function as argument
function applyToBalance(
  amount: number,
  transformer: (n: number) => number,
): number {
  return transformer(amount);
}

applyToBalance(1000, (n) => n * 0.98); // apply 2% fee

// Returns a function
function createFeeCalculator(feePercent: number) {
  return (amount: number) => amount * (feePercent / 100);
}

const calc2Percent = createFeeCalculator(2);
calc2Percent(1000); // 20
```

**Why it matters in backends:**
Every array method (map, filter, reduce) is a HOF. Every Express middleware factory is a HOF. Every viem transport is a HOF. Reading and writing them fluently is non-negotiable.

---

## 1.7 Arrays and Array Methods

**Core methods:**

```typescript
const amounts = [500, 1200, 300, 800, 2000];

// map — transform every item, same length
const doubled = amounts.map((n) => n * 2);

// filter — keep matching items, shorter or equal length
const large = amounts.filter((n) => n > 1000);

// reduce — collapse to single value
const total = amounts.reduce((acc, n) => acc + n, 0);

// find — first match or undefined
const firstLarge = amounts.find((n) => n > 1000);

// some — true if any match
const hasLarge = amounts.some((n) => n > 1000);

// every — true if all match
const allPositive = amounts.every((n) => n > 0);

// sort — sorts in place (mutates original)
const sorted = [...amounts].sort((a, b) => b - a); // always spread first
```

**Critical:** `sort` mutates the original array. Always spread first: `[...arr].sort()`

**flatMap:**

```typescript
const blocks = [
  { number: 100, txs: ["0x1", "0x2"] },
  { number: 101, txs: ["0x3"] },
];
const allTxs = blocks.flatMap((b) => b.txs); // ["0x1", "0x2", "0x3"]
```

---

## 1.8 Objects

**What it is:**
A collection of key-value pairs. The most common data structure in JavaScript backends.

```typescript
const transaction = {
  hash: "0xaaa",
  from: "0xAlice",
  to: "0xBob",
  amount: 500,
  token: "USDC",
};

// Access
transaction.hash; // dot notation
transaction["hash"]; // bracket notation — use when key is dynamic

// Destructuring
const { hash, amount } = transaction;

// Spread — shallow copy
const copy = { ...transaction };
const updated = { ...transaction, amount: 1000 };

// Optional chaining
const symbol = transaction?.token?.toLowerCase();
```

**Common mistake:**
Shallow copy vs deep copy. Spread only copies one level deep.

```typescript
const obj = { nested: { value: 1 } };
const copy = { ...obj };
copy.nested.value = 99; // MUTATES original too — shallow copy
```

---

## 1.9 Scope and Closures

**Scope:**
Where a variable is accessible. Block scope (`let`/`const`) means the variable only exists inside `{}`.

```typescript
{
  const x = 10;
  console.log(x); // works
}
console.log(x); // ReferenceError — x out of scope
```

**Closure:**
A function that remembers variables from the scope where it was created, even after that scope is gone.

```typescript
function createCounter(start: number) {
  let count = start; // outer variable

  return {
    increment: () => ++count, // inner function remembers count
    get: () => count,
  };
}

const counter = createCounter(0);
counter.increment(); // 1
counter.increment(); // 2
counter.get(); // 2 — count persists via closure
```

**Why it matters:**
Your `TransactionAccumulator` and every middleware factory uses closures to maintain private state.

---

## 1.10 The Event Loop

**What it is:**
The mechanism that allows Node.js to handle asynchronous operations without blocking the thread.

```
Call Stack           Callback Queue        Microtask Queue
──────────           ──────────────        ───────────────
main()               setTimeout cb         Promise.then cb
  │                       │                      │
  ▼                  (waits here)           (priority!)
setTimeout(cb, 0)
fetch(url)
Promise.then(cb)
```

**The order:**

1. Execute all synchronous code (call stack)
2. Process all microtasks (Promise callbacks) — **priority**
3. Process one macro task (setTimeout, I/O callbacks)
4. Repeat

```typescript
console.log("1");
setTimeout(() => console.log("3"), 0);
Promise.resolve().then(() => console.log("2"));
console.log("4");

// Output: 1, 4, 2, 3
// Sync runs first, then microtasks (Promise), then macrotasks (setTimeout)
```

**Why it matters:**
Understanding the event loop explains why async code behaves the way it does, why `await` pauses a function but not the whole process, and why blocking the event loop (with a long synchronous operation) freezes your entire Node.js server.

---

## 1.11 Promises

**What it is:**
A Promise represents a value that is not available yet but will be in the future. It is an object that can be in one of three states: pending, fulfilled, or rejected.

```typescript
const promise = new Promise<number>((resolve, reject) => {
  // async work here
  if (success)
    resolve(1500); // fulfilled
  else reject(new Error("failed")); // rejected
});

// Consuming with .then()/.catch()
promise
  .then((value) => console.log("Got:", value))
  .catch((error) => console.log("Error:", error.message))
  .finally(() => console.log("Always runs"));
```

**Promise combinators:**

```typescript
// Promise.all — all must succeed, fails fast if any rejects
const [balance, nonce] = await Promise.all([getBalance(), getNonce()]);

// Promise.allSettled — waits for all, never rejects
const results = await Promise.allSettled([getBalance(), getPrice()]);
// results[0] = { status: "fulfilled", value: 1500 }
// results[1] = { status: "rejected", reason: Error }

// Promise.race — first to settle wins (resolve OR reject)
const result = await Promise.race([fetchFast(), fetchSlow()]);

// Promise.any — first to RESOLVE wins (ignores rejections)
const first = await Promise.any([fetchA(), fetchB()]);
```

**Common mistake:**
Not handling rejections. An unhandled Promise rejection crashes Node.js in production.

---

## 1.12 async/await

**What it is:**
Syntactic sugar over Promises. Makes async code look and behave like synchronous code.

```typescript
// Promise chain version
function getWalletData(address: string) {
  return fetchBalance(address).then((balance) =>
    fetchNonce(address).then((nonce) => ({ address, balance, nonce })),
  );
}

// async/await version — same thing, much cleaner
async function getWalletData(address: string) {
  const balance = await fetchBalance(address);
  const nonce = await fetchNonce(address);
  return { address, balance, nonce };
}
```

**Rules:**

- `await` can only be used inside an `async` function
- `await` pauses the function, not the whole program
- An `async` function always returns a Promise

**Error handling:**

```typescript
async function safeGetBalance(address: string) {
  try {
    const balance = await fetchBalance(address);
    return { success: true, balance };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
```

**Common mistake — sequential when should be concurrent:**

```typescript
// SLOW — sequential (one after another)
const a = await fetchBalance("0xAlice");
const b = await fetchBalance("0xBob");

// FAST — concurrent (at the same time)
const [a, b] = await Promise.all([
  fetchBalance("0xAlice"),
  fetchBalance("0xBob"),
]);
```

---

## 1.13 Error Handling

**The three layers:**

```typescript
// 1. try/catch — for individual async operations
try {
  const result = await fetchData();
} catch (error) {
  if (error instanceof TypeError) {
    /* handle type error */
  } else {
    throw error;
  } // re-throw unknown errors
}

// 2. .catch() — on promise chains
fetchData().catch((error) => handleError(error));

// 3. Process-level — catch unhandled rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled:", error);
  process.exit(1);
});
```

**Custom errors:**

```typescript
class InsufficientBalanceError extends Error {
  constructor(
    public required: number,
    public available: number,
  ) {
    super(`Required ${required}, available ${available}`);
    this.name = "InsufficientBalanceError";
  }
}
```

---

## 1.14 Modules

**ES Modules (modern — use this):**

```typescript
// Export
export const VERSION = "1.0.0"
export function formatBalance(wei: bigint): string { ... }
export default class WalletClient { ... }

// Import
import { formatBalance } from "./utils.js"
import WalletClient from "./wallet.js"
import * as utils from "./utils.js"
```

**CommonJS (legacy Node.js):**

```typescript
// Export
module.exports = { formatBalance };

// Import
const { formatBalance } = require("./utils");
```

**In your project:**
Your package.json `"type": "module"` means all `.js` and `.ts` files use ES Modules. Import paths must include the extension: `import { db } from "./db.js"` (even for `.ts` files — tsx handles the resolution).

---

---

# SECTION 2 — TypeScript Fundamentals

---

## 2.1 What Problem TypeScript Solves

JavaScript has no type system. You can call a function with the wrong arguments, access properties that do not exist, and assign incompatible values — and only discover the bug at runtime, in production.

TypeScript adds a static type system that catches these errors at compile time, before the code runs.

```typescript
// JavaScript — no protection
function getBalance(address) {
  return fetch(`/balance/${address}`);
}
getBalance(undefined); // silently fails at runtime

// TypeScript — caught at compile time
function getBalance(address: string): Promise<number> {
  return fetch(`/balance/${address}`);
}
getBalance(undefined); // ERROR: Argument of type 'undefined' is not assignable to parameter of type 'string'
```

---

## 2.2 Types and Type Annotations

```typescript
// Primitive annotations
const address: string = "0xAlice";
const balance: number = 1500;
const amount: bigint = 1500000000n;
const isActive: boolean = true;

// Object type annotation
const tx: { hash: string; amount: number } = {
  hash: "0xaaa",
  amount: 500,
};

// Array annotations
const hashes: string[] = ["0xaaa", "0xbbb"];
const amounts: Array<number> = [500, 1200];

// Function annotations
const format: (wei: bigint) => string = (wei) => wei.toString();
```

---

## 2.3 Interfaces vs Type Aliases

```typescript
// Interface — extendable, better for objects
interface Transaction {
  hash: string;
  amount: number;
  token: string;
}

interface ExtendedTx extends Transaction {
  sender: string; // adds a field
}

// Type alias — more flexible, works for unions, primitives, etc
type TxStatus = "pending" | "confirmed" | "failed";
type Hash = string; // alias for readability
type TxOrNull = Transaction | null;
```

**When to use which:**

- Interfaces for object shapes that may need extension
- Type aliases for union types, primitives, and complex compositions
- In practice, both work for object shapes — pick one and be consistent

---

## 2.4 Union Types and Intersection Types

```typescript
// Union — one OR the other
type Status = "pending" | "confirmed" | "failed";
type AddressOrHash = { address: string } | { hash: string };

// Intersection — all combined (AND)
type AuthenticatedRequest = Request & { userId: string };
```

**Discriminated unions — the most useful pattern:**

```typescript
type RPCResult =
  | { status: "success"; data: TransactionData }
  | { status: "error"; message: string }
  | { status: "pending" };

function handleResult(result: RPCResult) {
  if (result.status === "success") {
    console.log(result.data); // TypeScript knows data exists here
  } else if (result.status === "error") {
    console.log(result.message); // TypeScript knows message exists here
  }
}
```

---

## 2.5 Generics

**What it is:**
A way to write reusable code that works with any type while preserving type safety.

```typescript
// Without generics — loses type information
function getFirst(arr: unknown[]): unknown {
  return arr[0];
}

// With generics — preserves type
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstHash = getFirst(["0xaaa", "0xbbb"]); // TypeScript knows this is string
const firstAmount = getFirst([500, 1200]); // TypeScript knows this is number
```

**Generic interfaces:**

```typescript
interface APIResponse<T> {
  data: T;
  status: number;
  timestamp: number;
}

type TransactionResponse = APIResponse<Transaction>;
type BalanceResponse = APIResponse<{ address: string; balance: bigint }>;
```

**Constrained generics:**

```typescript
function getHash<T extends { hash: string }>(item: T): string {
  return item.hash; // TypeScript knows hash exists because of the constraint
}
```

---

## 2.6 Utility Types

```typescript
// Partial — all fields optional
type PartialTx = Partial<Transaction>; // { hash?: string; amount?: number; ... }

// Required — all fields required
type RequiredTx = Required<PartialTx>;

// Readonly — prevents mutation
type ImmutableTx = Readonly<Transaction>;

// Pick — select specific fields
type TxSummary = Pick<Transaction, "hash" | "amount">;

// Omit — exclude specific fields
type TxWithoutId = Omit<Transaction, "id">;

// Record — typed object
type TokenPrices = Record<string, number>; // { USDC: 1, ETH: 3200, ... }

// ReturnType — extract return type from function
type BalanceResult = ReturnType<typeof getBalance>;
```

---

## 2.7 Type Narrowing

**What it is:**
TypeScript narrowing down a broad type to a specific type inside a conditional block.

```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // TypeScript knows it's string here
  } else {
    console.log(value.toFixed(2)); // TypeScript knows it's number here
  }
}

// instanceof narrowing
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message); // TypeScript knows it's Error
  }
}

// in narrowing
function handleResult(result: { data: string } | { error: string }) {
  if ("data" in result) {
    console.log(result.data); // TypeScript knows data exists
  } else {
    console.log(result.error);
  }
}
```

---

## 2.8 async Typing

```typescript
// async function return type is always Promise<T>
async function getBalance(address: string): Promise<number> {
  return 1500;
}

// Promise typing
const balancePromise: Promise<number> = getBalance("0xAlice");

// Async with error handling
async function safeGetBalance(address: string): Promise<{
  success: boolean;
  balance: number | null;
  error?: string;
}> {
  try {
    const balance = await getBalance(address);
    return { success: true, balance };
  } catch (e) {
    return { success: false, balance: null, error: (e as Error).message };
  }
}
```

---

---

# SECTION 3 — SQL Fundamentals

---

## 3.1 Core Concepts

**Table:** A structured collection of data organized in rows and columns. Like a spreadsheet but with enforced structure.

**Row:** A single record in a table. One transaction, one wallet, one block.

**Column:** A named attribute with a specific data type. `hash TEXT`, `amount NUMERIC`, `created_at TIMESTAMP`.

**Primary Key:** A column (or columns) that uniquely identifies each row. Cannot be null. Cannot be duplicated.

**Foreign Key:** A column that references the primary key of another table. Enforces relationships.

**Constraint:** A rule enforced on a column or table. `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`.

---

## 3.2 Core SQL Operations

```sql
-- CREATE TABLE
CREATE TABLE transactions (
  id         SERIAL PRIMARY KEY,
  hash       TEXT    NOT NULL UNIQUE,
  amount     NUMERIC NOT NULL,
  token      TEXT    NOT NULL,
  sender     TEXT    NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- INSERT
INSERT INTO transactions (hash, amount, token, sender)
VALUES ('0xaaa', 500, 'USDC', '0xAlice');

-- SELECT
SELECT * FROM transactions;
SELECT hash, amount FROM transactions WHERE token = 'USDC';
SELECT * FROM transactions ORDER BY amount DESC LIMIT 10;

-- UPDATE
UPDATE transactions SET amount = 600 WHERE hash = '0xaaa';

-- DELETE
DELETE FROM transactions WHERE hash = '0xaaa';
```

---

## 3.3 WHERE and Filtering

```sql
-- Comparison operators
WHERE amount > 1000
WHERE amount >= 500 AND amount <= 2000
WHERE token = 'USDC' OR token = 'DAI'
WHERE sender != '0xAlice'

-- NULL checks
WHERE created_at IS NULL
WHERE created_at IS NOT NULL

-- Pattern matching
WHERE hash LIKE '0x%'        -- starts with 0x
WHERE sender ILIKE '0xalice' -- case-insensitive

-- IN operator
WHERE token IN ('USDC', 'DAI', 'ETH')

-- BETWEEN
WHERE amount BETWEEN 500 AND 2000
```

---

## 3.4 GROUP BY, HAVING, and Aggregates

```sql
-- COUNT, SUM, AVG, MIN, MAX
SELECT token, COUNT(*), SUM(amount), AVG(amount)
FROM transactions
GROUP BY token;

-- HAVING filters after grouping (WHERE filters before)
SELECT token, SUM(amount) as total
FROM transactions
GROUP BY token
HAVING SUM(amount) > 10000;

-- ORDER of operations in a SELECT query:
-- FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

## 3.5 JOINs

```sql
-- Tables
CREATE TABLE wallets (
  address TEXT PRIMARY KEY,
  label TEXT
);

-- INNER JOIN — only rows that match in BOTH tables
SELECT t.hash, t.amount, w.label
FROM transactions t
INNER JOIN wallets w ON t.sender = w.address;

-- LEFT JOIN — all rows from left table, matching from right (NULL if no match)
SELECT t.hash, w.label
FROM transactions t
LEFT JOIN wallets w ON t.sender = w.address;
-- Transactions without a matching wallet still appear, label is NULL

-- When to use which:
-- INNER JOIN: only want records with complete data
-- LEFT JOIN: want all records from main table even if related data missing
```

---

## 3.6 Indexes

**What it is:**
A data structure that speeds up queries on specific columns. Like an index in a book — instead of reading every page, you jump to the right page.

```sql
-- Create an index on frequently queried column
CREATE INDEX idx_transactions_sender ON transactions(sender);
CREATE INDEX idx_transactions_token ON transactions(token);

-- Composite index for queries that filter on multiple columns
CREATE INDEX idx_token_sender ON transactions(token, sender);
```

**Performance implications:**

- Indexes speed up `SELECT` with `WHERE`, `ORDER BY`, `JOIN`
- Indexes slow down `INSERT`, `UPDATE`, `DELETE` (must update index too)
- Every primary key is automatically indexed
- Too many indexes = slow writes
- Too few = slow reads

**When to add an index:**
Add an index on any column you frequently filter or sort by. Your `transactions.token` and `transactions.sender` columns are good candidates.

---

---

# SECTION 4 — PostgreSQL Fundamentals

---

## 4.1 What PostgreSQL Is

PostgreSQL is an open-source relational database management system (RDBMS). It is the most advanced open-source database and is the standard choice for production backends in Web3 and traditional finance.

**Why it is widely used:**

- ACID compliance guarantees data integrity
- Excellent support for complex queries
- Strong typing with many data types
- Supports JSON natively
- Excellent performance at scale
- Homebrew install — zero cost

---

## 4.2 ACID Properties

**ACID** guarantees that database transactions are processed reliably.

| Property        | Meaning                                                                   | Example                                                                                         |
| --------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Atomicity**   | All or nothing — a transaction either fully completes or fully rolls back | Transfer $500: debit Alice AND credit Bob. If Bob's credit fails, Alice's debit is rolled back. |
| **Consistency** | Database always moves from one valid state to another                     | A balance cannot go below zero if a constraint prevents it                                      |
| **Isolation**   | Concurrent transactions do not interfere with each other                  | Two users updating the same record simultaneously produce a correct result                      |
| **Durability**  | Committed transactions survive crashes                                    | After `COMMIT`, data is written to disk even if the server crashes immediately after            |

---

## 4.3 Transactions in PostgreSQL

```sql
BEGIN;                    -- start transaction
  INSERT INTO transactions (hash, amount) VALUES ('0xaaa', 500);
  UPDATE wallets SET balance = balance - 500 WHERE address = '0xAlice';
  UPDATE wallets SET balance = balance + 500 WHERE address = '0xBob';
COMMIT;                   -- save all changes

-- If anything fails:
ROLLBACK;                 -- undo all changes since BEGIN
```

**Why transactions matter:**
Without transactions, a server crash between the debit and credit would result in money disappearing. The transaction ensures both happen or neither happens.

---

## 4.4 Common PostgreSQL Data Types

| Type                   | Use case                                           |
| ---------------------- | -------------------------------------------------- |
| `SERIAL` / `BIGSERIAL` | Auto-incrementing integer IDs                      |
| `TEXT`                 | Variable-length strings — wallet addresses, hashes |
| `VARCHAR(n)`           | Strings with max length                            |
| `NUMERIC`              | Exact decimal numbers — amounts                    |
| `BIGINT`               | Large integers — block numbers                     |
| `BOOLEAN`              | True/false                                         |
| `TIMESTAMP`            | Date and time without timezone                     |
| `TIMESTAMPTZ`          | Date and time WITH timezone (prefer this)          |
| `JSONB`                | JSON stored as binary — fast querying              |
| `UUID`                 | Universally unique identifier                      |

---

## 4.5 Connections and Connection Pooling

**What it is:**
A database connection is a TCP connection between your application and PostgreSQL. Opening a connection is expensive (several hundred milliseconds). Connection pooling reuses existing connections instead of opening new ones for each query.

```typescript
// Without pooling — slow, opens new connection per query
const client = new Client({ connectionString: DATABASE_URL });
await client.connect();

// With pooling — fast, reuses connections
const pool = new Pool({ connectionString: DATABASE_URL, max: 10 });
// Pool manages up to 10 concurrent connections
```

**Drizzle uses pg Pool automatically.** You do not need to manage this manually.

---

---

# SECTION 5 — Node.js Fundamentals

---

## 5.1 What Node.js Is

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows JavaScript to run outside the browser — on servers, command-line tools, and anywhere that is not a browser.

**Runtime vs language:**

- JavaScript is the language (the syntax, the rules)
- Node.js is the runtime (the environment that executes the language)
- V8 is the engine that compiles JavaScript to machine code

---

## 5.2 Non-Blocking I/O

**The problem Node.js solves:**
Traditional web servers (Apache, older frameworks) create one thread per request. If a thread is waiting for a database query, it is blocked — doing nothing, wasting resources. Under load, this does not scale.

**Node.js's approach:**
One thread, non-blocking I/O. When a database query is made, Node.js registers a callback and continues executing other code. When the query finishes, the callback is called.

```
Thread 1 (traditional)     Node.js (single thread)
───────────────────────    ──────────────────────
Request 1: waiting DB...   Request 1: DB query → register callback
Thread blocked              Continue processing Request 2
                           Request 2: RPC call → register callback
                           Continue processing Request 3
                           DB query returns → call Request 1's callback
```

**Why this matters for Web3:**
Your backend makes many RPC calls to Ethereum nodes. Each takes 100–500ms. Non-blocking I/O means your server can handle hundreds of requests simultaneously while waiting for RPC responses.

---

## 5.3 Environment Variables

**What they are:**
Configuration values stored outside your code. Database URLs, API keys, port numbers. Never hardcoded in source files.

```typescript
// .env file (never commit this)
DATABASE_URL=postgresql://localhost:5432/web3_learning
PORT=3000
ALCHEMY_API_KEY=your_key_here

// Access in code (after dotenv loads)
import "dotenv/config"
const port = process.env.PORT || 3000
const dbUrl = process.env.DATABASE_URL  // string | undefined
```

**Why they exist:**

- Different values in development vs production (local DB vs cloud DB)
- Secrets should never appear in version control
- Easy to change configuration without code changes

---

## 5.4 Node.js Modules

**ES Modules (your project):**

```typescript
// package.json: "type": "module"
import express from "express"; // named default import
import { eq } from "drizzle-orm"; // named export import
import * as viem from "viem"; // namespace import
```

**Built-in Node.js modules:**

```typescript
import { readFileSync } from "fs"; // file system
import { createServer } from "http"; // HTTP server
import path from "path"; // file paths
import { EventEmitter } from "events"; // event system
```

---

---

# SECTION 6 — Express.js Fundamentals

---

## 6.1 What Express Is

Express is a minimal, flexible Node.js web application framework. It provides routing, middleware, and HTTP utilities on top of Node's built-in `http` module.

**What it adds over raw Node.js:**

- Routing — map URL patterns to handler functions
- Middleware — composable request processing pipeline
- Request/response helpers — `res.json()`, `req.params`, `req.body`

---

## 6.2 Request Lifecycle

```
HTTP Request arrives
        ↓
Express receives it
        ↓
Global middleware (cors, express.json, logger)
        ↓
Route-specific middleware (auth, validation)
        ↓
Route handler
        ↓
Response sent
        ↓
HTTP Response leaves
```

**The complete flow through your current backend:**

```typescript
app.use(express.json()); // 1. Parse JSON body

app.get("/transactions", async (req, res) => {
  // 2. Route matched
  try {
    const all = await db.select(); // 3. Database query
    res.json(all); // 4. Send response
  } catch (error) {
    res.status(500).json({ error }); // 4b. Send error response
  }
});
```

---

## 6.3 Middleware

**What it is:**
A function that has access to `req`, `res`, and `next`. It can execute code, modify req/res, end the request, or call `next()` to pass to the next middleware.

```typescript
type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

// Logger middleware
const logger: MiddlewareFn = (req, res, next) => {
  console.log(`${req.method} ${req.path} ${Date.now()}`);
  next(); // MUST call next or request hangs forever
};

// Auth middleware — can stop the chain
const requireAuth: MiddlewareFn = (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key) {
    res.status(401).json({ error: "Unauthorized" });
    return; // do NOT call next
  }
  next();
};

app.use(logger); // runs for every route
app.use("/api", requireAuth); // runs for /api/* routes only
```

**What happens if you forget `next()`:**
The request hangs forever. The client waits indefinitely and eventually times out. This is one of the most common Express bugs.

---

## 6.4 Routing

```typescript
// Route methods
app.get("/transactions", handler); // GET
app.post("/transactions", handler); // POST
app.put("/transactions/:id", handler); // PUT
app.delete("/transactions/:id", handler); // DELETE
app.patch("/transactions/:id", handler); // PATCH

// Route parameters
app.get("/transactions/:hash", (req, res) => {
  const { hash } = req.params; // captured from URL
  res.json({ hash });
});

// Query strings
app.get("/transactions", (req, res) => {
  const { token, limit } = req.query; // from ?token=USDC&limit=10
  res.json({ token, limit });
});

// Request body
app.post("/transactions", (req, res) => {
  const { hash, amount } = req.body; // from JSON body
  res.json({ hash, amount });
});
```

**CRITICAL — route order matters:**
Express matches routes in the order they are registered. A `/:param` route will match `/filter` if registered first. Specific routes must come before parameterized routes.

```typescript
// CORRECT
app.get("/transactions/filter", handler); // specific first
app.get("/transactions/:hash", handler); // param second

// WRONG
app.get("/transactions/:hash", handler); // captures "filter" as hash
app.get("/transactions/filter", handler); // never reached
```

---

## 6.5 Error Handling Middleware

```typescript
// Error middleware — 4 parameters, MUST have all four
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error.message });
});
```

**How to trigger it:**
Pass an error to `next(error)` from any middleware or route handler.

```typescript
app.get("/transactions", async (req, res, next) => {
  try {
    const all = await db.select().from(transactions);
    res.json(all);
  } catch (error) {
    next(error); // sends to error middleware
  }
});
```

---

## 6.6 HTTP Status Codes

| Code | Meaning               | When to use                             |
| ---- | --------------------- | --------------------------------------- |
| 200  | OK                    | Successful GET, PUT, PATCH              |
| 201  | Created               | Successful POST that creates a resource |
| 204  | No Content            | Successful DELETE                       |
| 400  | Bad Request           | Invalid input from client               |
| 401  | Unauthorized          | Missing or invalid authentication       |
| 403  | Forbidden             | Authenticated but not permitted         |
| 404  | Not Found             | Resource does not exist                 |
| 409  | Conflict              | Resource already exists (duplicate)     |
| 422  | Unprocessable Entity  | Validation failed                       |
| 429  | Too Many Requests     | Rate limit exceeded                     |
| 500  | Internal Server Error | Unexpected server error                 |
| 503  | Service Unavailable   | Database or dependency down             |

---

---

# SECTION 7 — API Fundamentals

---

## 7.1 REST

**What it is:**
Representational State Transfer. An architectural style for building APIs. Not a protocol — a set of conventions.

**REST conventions:**

| Operation | Method | URL               | What it does                |
| --------- | ------ | ----------------- | --------------------------- |
| Get all   | GET    | /transactions     | Returns all transactions    |
| Get one   | GET    | /transactions/:id | Returns one transaction     |
| Create    | POST   | /transactions     | Creates a new transaction   |
| Replace   | PUT    | /transactions/:id | Replaces entire transaction |
| Update    | PATCH  | /transactions/:id | Updates specific fields     |
| Delete    | DELETE | /transactions/:id | Deletes a transaction       |

**REST constraints:**

- Stateless — each request contains all information needed
- Client-server — frontend and backend are separate
- Uniform interface — consistent URL and method conventions

---

## 7.2 HTTP Methods

**GET:** Retrieve data. No body. Idempotent — calling it twice returns the same result and changes nothing.

**POST:** Create a resource. Has a body. Not idempotent — calling it twice creates two records.

**PUT:** Replace a resource entirely. Idempotent.

**PATCH:** Update specific fields. Not always idempotent.

**DELETE:** Remove a resource. Idempotent.

---

## 7.3 Headers

```
Request headers:
Content-Type: application/json        // body format
Authorization: Bearer <token>          // authentication
X-API-Key: your-key-here              // API key auth
Accept: application/json              // expected response format

Response headers:
Content-Type: application/json        // response body format
X-RateLimit-Remaining: 99            // rate limit info
Cache-Control: no-cache               // caching instructions
```

---

## 7.4 REST API Design Best Practices

```
✅ Use nouns for resources, not verbs:
  /transactions         not /getTransactions
  /transactions/:id     not /getTransaction/:id

✅ Use plural for collections:
  /transactions         not /transaction

✅ Return consistent error format:
  { "error": "Transaction not found", "code": "NOT_FOUND" }

✅ Version your API:
  /api/v1/transactions

✅ Validate input before processing

✅ Use appropriate status codes

❌ Never return 200 with an error in the body
❌ Never expose internal error messages to clients in production
```

---

---

# SECTION 8 — Drizzle ORM Fundamentals

---

## 8.1 What an ORM Is

An Object-Relational Mapper (ORM) maps between database tables (relational) and code objects (object-oriented). Instead of writing raw SQL, you write TypeScript that the ORM converts to SQL.

**ORM advantages:**

- Type safety — TypeScript knows your table schema
- No SQL injection — parameterized queries by default
- Reusable queries — write once, call from anywhere
- Migration management — schema changes tracked as code

**ORM disadvantages:**

- Abstraction overhead — complex queries can be harder to write
- Performance — sometimes generates inefficient SQL
- Learning curve — must know both ORM API and underlying SQL

---

## 8.2 Drizzle Schema Definition

```typescript
import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  amount: numeric("amount"),
  token: text("token"),
  sender: text("sender"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**What this does:**
Defines a TypeScript object that represents your database table. Drizzle uses this to:

1. Generate type-safe query methods
2. Generate migration SQL
3. Provide autocomplete in VS Code

---

## 8.3 Drizzle Queries

```typescript
import { db } from "./db";
import { transactions } from "./schema";
import { eq, gt, and, desc } from "drizzle-orm";

// SELECT all
const all = await db.select().from(transactions);

// SELECT with WHERE
const usdc = await db
  .select()
  .from(transactions)
  .where(eq(transactions.token, "USDC"));

// SELECT with multiple conditions
const largeUsdc = await db
  .select()
  .from(transactions)
  .where(and(eq(transactions.token, "USDC"), gt(transactions.amount, "1000")));

// SELECT with ORDER and LIMIT
const recent = await db
  .select()
  .from(transactions)
  .orderBy(desc(transactions.createdAt))
  .limit(10);

// INSERT
await db.insert(transactions).values({
  hash: "0xaaa",
  amount: "500",
  token: "USDC",
  sender: "0xAlice",
});

// UPDATE
await db
  .update(transactions)
  .set({ amount: "600" })
  .where(eq(transactions.hash, "0xaaa"));

// DELETE
await db.delete(transactions).where(eq(transactions.hash, "0xaaa"));
```

---

## 8.4 How Drizzle Connects to PostgreSQL

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

**The chain:**
`db.select()` (Drizzle API) → SQL string generated → `pg` Pool sends SQL → PostgreSQL executes → result returned → Drizzle maps to TypeScript types

---

---

# SECTION 9 — viem Fundamentals

---

## 9.1 What viem Is

viem is a TypeScript library for interacting with Ethereum and EVM-compatible blockchains. It provides type-safe, performant interfaces for reading blockchain state, sending transactions, watching events, and interacting with smart contracts.

**Why viem instead of ethers.js:**

- First-class TypeScript support
- Better tree-shaking (smaller bundle)
- More explicit API design
- Actively maintained as of 2026

---

## 9.2 Clients

**Public Client — read-only operations:**

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`),
});

// Read operations
const blockNumber = await publicClient.getBlockNumber();
const balance = await publicClient.getBalance({ address: "0xAlice" });
const block = await publicClient.getBlock({ blockTag: "latest" });
```

**Wallet Client — write operations (requires private key):**

```typescript
import { createWalletClient, privateKeyToAccount } from "viem";

const account = privateKeyToAccount("0xprivatekey");
const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(RPC_URL),
});

// Write operations
const txHash = await walletClient.sendTransaction({
  to: "0xBob",
  value: parseEther("0.1"),
});
```

---

## 9.3 RPC Calls

**What RPC is:**
Remote Procedure Call. Your viem client sends JSON-RPC requests to an Ethereum node (Alchemy, Infura, or your own) which queries the blockchain and returns data.

```
Your Code
    ↓
viem (serializes to JSON-RPC format)
    ↓
HTTP POST to https://eth-mainnet.g.alchemy.com/v2/KEY
    ↓
Request: { "method": "eth_getBalance", "params": ["0xAlice", "latest"] }
    ↓
Alchemy queries Ethereum node
    ↓
Response: { "result": "0x152d02c7e14af6800000" }
    ↓
viem deserializes to bigint: 100000000000000000000n
    ↓
Your Code receives: 100000000000000000000n
```

---

## 9.4 Watching Events

**This is the foundation of your Whale Watcher:**

```typescript
// Watch for USDC Transfer events
publicClient.watchContractEvent({
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC contract
  abi: erc20Abi,
  eventName: "Transfer",
  onLogs: (logs) => {
    for (const log of logs) {
      console.log("Transfer:", log.args);
      // Save to database
    }
  },
});
```

---

## 9.5 ABI Concepts

**What ABI is:**
Application Binary Interface. A JSON description of a smart contract's functions and events. Without the ABI, you cannot encode/decode contract calls.

```typescript
const erc20Abi = [
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;
```

---

---

# SECTION 10 — Putting It All Together

---

## 10.1 The Complete Backend Architecture

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT                          │
│         (browser, mobile app, curl)                 │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP Request
                      ▼
┌─────────────────────────────────────────────────────┐
│                   EXPRESS.JS                        │
│  • Receives HTTP request                            │
│  • Runs global middleware (json parser, logger)     │
│  • Matches route                                    │
│  • Runs route middleware (auth, validation)         │
│  • Calls route handler                              │
└─────────────────────┬───────────────────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
           ▼                     ▼
┌──────────────────┐   ┌──────────────────────────────┐
│   DRIZZLE ORM    │   │          viem                │
│                  │   │                              │
│ • Builds SQL     │   │ • Builds JSON-RPC request    │
│ • Sends to pg    │   │ • Sends to Alchemy           │
│ • Returns typed  │   │ • Decodes response           │
│   results        │   │ • Returns typed data         │
└────────┬─────────┘   └──────────────┬───────────────┘
         │                             │
         ▼                             ▼
┌─────────────────┐          ┌─────────────────────┐
│   POSTGRESQL    │          │   ETHEREUM NODE      │
│                 │          │   (via Alchemy)      │
│ • Executes SQL  │          │                      │
│ • Returns rows  │          │ • Returns chain data │
└─────────────────┘          └─────────────────────┘
```

---

## 10.2 Complete Request Flow — Database Path

**Request:** `GET /transactions?token=USDC`

```
1. Client sends: GET /transactions?token=USDC

2. Express receives → parses query string → req.query = { token: "USDC" }

3. Global middleware runs:
   - express.json() → no body to parse
   - logger → logs the request

4. Route matched: app.get("/transactions", handler)

5. Handler executes:
   async (req, res) => {
     const { token } = req.query
     const results = await db.select().from(transactions).where(eq(transactions.token, token))
     res.json(results)
   }

6. Drizzle generates SQL:
   SELECT * FROM transactions WHERE token = $1  [params: ["USDC"]]

7. pg Pool sends SQL to PostgreSQL

8. PostgreSQL executes, returns rows

9. Drizzle maps rows to TypeScript objects

10. res.json() serializes to JSON string

11. Express sets Content-Type: application/json header

12. HTTP 200 response sent to client

Total time: ~5-20ms
```

---

## 10.3 Complete Request Flow — Blockchain Path

**What your Whale Watcher does:**

```
1. viem connects to Alchemy via HTTP/WebSocket

2. watchContractEvent registers listener:
   - Contract: USDC (0xA0b8...)
   - Event: Transfer

3. Alchemy monitors the blockchain for new blocks

4. When a new block arrives:
   - Alchemy checks for Transfer events from USDC contract
   - Sends event logs to your listener

5. Your onLogs callback fires:
   for (const log of logs) {
     const { from, to, value } = log.args
     await db.insert(transactions).values({ ... })
   }

6. Drizzle inserts the event into PostgreSQL

7. Your GET /transactions endpoint can now return it

Total time from on-chain event to database: ~500ms-2s
```

---

## 10.4 Error Lifecycle

```
Database down:
  db.select() throws error
    ↓
  catch(error) in route handler
    ↓
  res.status(500).json({ error: "Internal server error" })
    ↓
  Client receives 500 response
  (error message hidden from client — logged server-side)

RPC failure:
  viem call throws error
    ↓
  catch(error) in async function
    ↓
  retry logic fires (up to N times)
    ↓
  if all retries fail → log warning, use cached data or skip

Validation failure:
  req.body missing required field
    ↓
  validation check in route handler
    ↓
  res.status(400).json({ error: "hash and sender are required" })
    ↓
  Client receives 400 — their mistake, not yours
```

---

---

# SECTION 11 — Knowledge Audit Quiz

**Instructions:**
Answer each question without consulting notes or documentation.
Mark questions you cannot answer — those are your gaps.
Do not look up answers until after completing all 30.

---

### JavaScript & TypeScript (Questions 1–10)

**Q1.** What is the difference between `null` and `undefined` in JavaScript? Give a real backend example of when you would use each.

**Q2.** Explain what a closure is. Write a function `createRateLimiter(maxRequests: number)` that returns a function — the returned function should return `true` if a new request is allowed and `false` if the limit is exceeded.

**Q3.** What is the difference between `Promise.all` and `Promise.allSettled`? Write code showing a scenario where `Promise.all` fails but `Promise.allSettled` succeeds.

**Q4.** What does `async/await` actually compile to? What is the relationship between `async/await` and Promises?

**Q5.** What is the output of the following code and why?

```typescript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

**Q6.** What is the difference between `interface` and `type` in TypeScript? When would you use each?

**Q7.** Explain generics in TypeScript with a Web3 example. Write a generic function `wrapResponse<T>` that takes data of any type and returns `{ data: T; timestamp: number }`.

**Q8.** What does `Partial<T>` do? Give a real use case in a PATCH route.

**Q9.** What is type narrowing? Write a function that accepts `string | Error` and handles each case correctly.

**Q10.** What is the difference between `==` and `===` in JavaScript? Why does `==` cause bugs?

---

### SQL & PostgreSQL (Questions 11–17)

**Q11.** What is the difference between `WHERE` and `HAVING`? Write a query that uses both.

**Q12.** Explain the difference between `INNER JOIN` and `LEFT JOIN`. Give a blockchain example where LEFT JOIN is more appropriate than INNER JOIN.

**Q13.** What are ACID properties? For each letter, give a concrete example from a transaction system.

**Q14.** Why are database indexes important? What is the downside of having too many indexes?

**Q15.** What is a database transaction (not blockchain transaction) and why do you need one when transferring tokens between wallets in a database?

**Q16.** Write a SQL query that returns the total amount per token for successful transactions only, ordered by total amount descending.

**Q17.** What is connection pooling? Why is it important for a web server that handles many concurrent requests?

---

### Node.js & Express (Questions 18–24)

**Q18.** What is the Node.js event loop? Why does blocking the event loop with synchronous computation break your server?

**Q19.** What happens if Express middleware does not call `next()`? How do you debug this?

**Q20.** Explain the difference between these two Express patterns and when each is appropriate:

```typescript
// Pattern A
app.use(middleware);

// Pattern B
app.use("/api", middleware);
```

**Q21.** Your Express route has this order:

```typescript
app.get("/transactions/:hash", handler1);
app.get("/transactions/filter", handler2);
```

Why does `GET /transactions/filter` never reach `handler2`? How do you fix it?

**Q22.** What is `.env` file and why should it never be committed to Git? What is the correct way to share required environment variables with your team?

**Q23.** Write an Express route `POST /transactions` that validates input, handles database errors, and returns appropriate status codes for all scenarios.

**Q24.** What HTTP status code should each return and why?

- Creating a new transaction successfully
- Transaction hash already exists in database
- Request missing required fields
- Database is down when processing the request
- User is not authenticated

---

### Drizzle & viem (Questions 25–30)

**Q25.** What is an ORM? What does Drizzle specifically provide that raw SQL does not?

**Q26.** Explain this Drizzle query in plain English:

```typescript
await db
  .select()
  .from(transactions)
  .where(and(eq(transactions.token, "USDC"), gt(transactions.amount, "1000")))
  .orderBy(desc(transactions.createdAt))
  .limit(10);
```

**Q27.** What is an RPC node and what role does Alchemy play in your current architecture?

**Q28.** What is the difference between a viem `PublicClient` and `WalletClient`? When do you need each?

**Q29.** What is an ABI and why does viem need it to read contract events?

**Q30.** Explain what happens at each step when your viem script calls `client.getBalance({ address: "0xAlice" })`. Include everything from the TypeScript call to the BigInt you receive back.

---

---

# SECTION 12 — Technical Assessment

**These 20 scenarios test practical debugging and decision-making.**
For each: identify the problem, explain why it occurs, and state the fix.

---

**T1.** Your backend receives 200 concurrent requests. Each opens a new `pg.Client` and connects to PostgreSQL. After 50 requests, PostgreSQL starts refusing connections. What is wrong and how do you fix it?

**T2.** A developer writes this code:

```typescript
const results = [];
transactions.forEach(async (tx) => {
  const result = await processTransaction(tx);
  results.push(result);
});
console.log(results); // always []
```

Why is `results` always empty? What is the correct approach?

**T3.** Your Express server has this middleware order:

```typescript
app.get("/transactions/:id", handler);
app.use(express.json());
app.post("/transactions", handler);
```

POST requests fail with `req.body` being `undefined`. Why?

**T4.** A developer writes this SQL query that is extremely slow on a table with 1 million rows:

```sql
SELECT * FROM transactions WHERE sender = '0xAlice'
```

What is likely missing and how would you verify it?

**T5.** Your async function never resolves:

```typescript
async function getData() {
  return new Promise((resolve) => {
    fetchData((error, data) => {
      if (error) throw error; // BUG
      resolve(data);
    });
  });
}
```

Why does throwing inside a Promise constructor not reject the Promise? What is the fix?

**T6.** A developer fetches multiple RPC endpoints sequentially:

```typescript
const price = await getEthPrice(); // 300ms
const block = await getBlockNumber(); // 150ms
const nonce = await getNonce(); // 200ms
```

Total time: 650ms. How would you reduce this to approximately 300ms?

**T7.** Your viem `watchContractEvent` callback receives the same Transfer event twice. What could cause this and how would you prevent duplicate processing?

**T8.** A developer writes:

```typescript
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

`fetchB()` always fails. What happens to `fetchA()`'s result? How would you handle this so `fetchA()`'s result is usable even when `fetchB()` fails?

**T9.** Your `DELETE /transactions/:hash` route returns 200 even when the hash does not exist. Why does this happen with a naive Drizzle delete and how do you fix it?

**T10.** A developer stores sensitive data:

```typescript
const app = express();
const API_KEY = "alk3j29djf8"; // hardcoded
```

Why is this a security problem? List three specific ways this causes harm.

**T11.** Your Express server crashes with `UnhandledPromiseRejection` at random times. What is the most likely cause and how do you prevent it globally?

**T12.** A developer writes this TypeScript but gets no type errors even though it is wrong:

```typescript
async function getBalance(address: string): Promise<number> {
  return "not a number"; // wrong type but no error?
}
```

Why might TypeScript not catch this? What is the fix?

**T13.** Your PostgreSQL query hangs indefinitely. How do you diagnose which query is blocked and what is likely blocking it?

**T14.** A developer writes:

```typescript
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});
```

The error middleware never runs even when errors occur. What is wrong?

**T15.** Your `GET /transactions` route returns all 100,000 records every time. Users complain about slow responses. What two architectural changes should you make?

**T16.** A developer checks if a user has enough ETH:

```typescript
if (balance > 1000000000000000000) {
  // 1 ETH in wei
  // proceed
}
```

This works in JavaScript but fails silently in production for large balances. Why?

**T17.** Your viem script calls `getBalance()` successfully in development but fails in production with "Invalid API key." You check your .env file and the key is correct. What are three possible causes?

**T18.** A developer writes this Drizzle query but always gets empty results despite data existing:

```typescript
const result = await db
  .select()
  .from(transactions)
  .where(eq(transactions.amount, 500)); // amount column is NUMERIC type
```

Why does this return empty and how do you fix it?

**T19.** Your Express server returns `{"error": "Cannot set headers after they are sent to the client"}`. What causes this error?

**T20.** A developer writes an async function that sometimes works and sometimes returns wrong data:

```typescript
let cached: Transaction | null = null;

async function getTransaction(hash: string) {
  if (!cached) {
    cached = await fetchFromDB(hash);
  }
  return cached;
}
```

What is the concurrency bug in this code? What happens when 10 requests arrive simultaneously?

---

---

# SECTION 13 — Grading Rubric

---

## How to Score Yourself

**Knowledge Audit Quiz (30 questions):**

- Confident, correct answer = 3 points
- Partial answer = 1 point
- Could not answer = 0 points
- Maximum: 90 points

**Technical Assessment (20 scenarios):**

- Correctly identified problem AND fix = 2 points
- Identified problem only = 1 point
- Could not identify = 0 points
- Maximum: 40 points

**Total maximum: 130 points**

---

## Score Levels

### 0–20 — Beginner

**Strengths:**
You have been exposed to the concepts and can recognize them.

**Weaknesses:**
Cannot explain concepts in your own words. Struggles to apply knowledge to new scenarios. May be confusing async patterns with synchronous ones.

**What to review:**
Start over with Section 1. Focus on callbacks and closures first — these are the foundation of everything else. Do not move forward until you can explain what a callback is and draw the execution order.

**Action:** Return to the async foundations challenges (1–10) and complete them without any AI assistance.

---

### 21–40 — Early Junior

**Strengths:**
Understands basic concepts in isolation. Can write simple functions, queries, and routes when given a template to follow.

**Weaknesses:**
Struggles when concepts combine. Cannot debug multi-layer problems. SQL and async together in the same problem causes confusion.

**What to review:**
Focus on Section 3 (SQL) and Section 6 (Express). The interaction between them — a route handler that queries a database — is the core skill at this level. Practice writing route handlers from scratch without looking at existing code.

**Action:** Build a new Express + Drizzle backend from scratch on a different topic (e.g. a token price tracker) without referencing your existing code.

---

### 41–60 — Junior

**Strengths:**
Can build the basic CRUD backend. Understands the request lifecycle. Can write SQL queries for common operations. Understands async/await at the surface level.

**Weaknesses:**
Error handling is incomplete. Performance issues not yet considered. Cannot explain WHY things work, only THAT they work. Struggles with concurrent async patterns.

**What to review:**
Sections 7 (API design), 8 (Drizzle), and Section 10 (putting it together). Focus on error handling at every layer — what happens when the database is down, when an RPC call fails, when input is invalid. These are the scenarios that separate junior from strong junior.

**Action:** Add comprehensive error handling to your existing backend. Write a test plan that covers every failure scenario.

---

### 61–80 — Strong Junior

**Strengths:**
Can build a complete, working backend with proper error handling. Understands the full request lifecycle. Can debug most common issues. Explains concepts clearly.

**Weaknesses:**
Performance optimizations not yet instinctive. Security considerations shallow. Advanced TypeScript patterns (generics, utility types) occasionally confuse. Concurrent async patterns require thought.

**What to review:**
Technical Assessment scenarios 1, 4, 6, 15, and 16. These cover performance, concurrency, and data integrity — the areas that separate strong junior from the next level. Review Section 4 (PostgreSQL) in depth — indexes, connection pooling, and transactions specifically.

**Action:** Add pagination to your existing API. Add a proper connection pool configuration. Add input validation middleware that runs before all POST/PUT routes.

---

### 81–100 — Junior+

**Strengths:**
Solid foundational understanding across all areas. Can build production-quality basic backends. Explains concepts with confidence and accuracy. Handles error scenarios proactively.

**Weaknesses:**
viem and blockchain-specific patterns still forming. Advanced SQL (explain, query planning) not yet developed. Architecture decisions (when to use transactions, when to cache) made by instinct rather than analysis.

**What to review:**
Section 9 (viem) deeply. The relationship between public client, wallet client, and RPC nodes. Contract event watching patterns. Review Technical Assessment scenarios 7, 11, 17, 19, and 20 — these are production-level debugging scenarios.

**Action:** Build the Whale Watcher. This single project combines everything from Month 1 and Month 2 into one real system.

---

### 101–120 — Ready for Month 3

**Strengths:**
Deep understanding of all foundational areas. Can debug complex multi-layer issues. Explains trade-offs (ORM vs raw SQL, sequential vs concurrent, when to use transactions). Proactively handles edge cases.

**Weaknesses:**
Solidity and smart contract concepts not yet started. Foundry testing patterns unknown. Security audit methodology not yet developed.

**Action:** You are ready for Month 3. Start Cyfrin Updraft immediately. Your backend knowledge is the foundation that will make Solidity integration intuitive rather than mysterious.

---

## The Honest Check

Before scoring yourself, ask these five questions out loud. No notes.

1. Can you explain what happens — step by step — when `GET /transactions?token=USDC` hits your server?
2. Can you explain what happens — step by step — when viem calls `client.getBalance()`?
3. Can you write an Express route with proper validation, database query, and error handling from memory?
4. Can you explain why `await` inside a `forEach` does not work the way most beginners expect?
5. Can you explain the difference between a 400 and a 500 status code and give one example of each?

If you can answer all five confidently and correctly — you are ready for Month 3.

If any one of them causes hesitation — that section needs more time.

---

> **Final note:**
>
> The goal of this audit is not to feel good about how much you know.
> The goal is to find exactly what you do not know and fix it before
> moving to Month 3, where Solidity sits on top of everything in this document.
>
> A shaky foundation in async or Express makes Solidity integration
> confusing. A solid foundation makes it obvious.
>
> Be honest. Fix the gaps. Then move forward.
