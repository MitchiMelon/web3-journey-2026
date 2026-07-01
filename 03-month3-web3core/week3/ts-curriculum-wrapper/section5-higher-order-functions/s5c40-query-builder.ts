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
    this._filters.push(predicate);
    return this;
  }

  orderBy(
    field: keyof Tx,
    direction: "asc" | "desc" = "asc",
  ): TransactionQueryBuilder {
    this._sortFn = (a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      // numbers and other comparable types
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    };
    return this;
  }

  limit(count: number): TransactionQueryBuilder {
    this._limitCount = count;
    return this;
  }

  select(...fields: Array<keyof Tx>): TransactionQueryBuilder {
    this._selectedFields = fields;
    return this;
  }

  execute(): Partial<Tx>[] {
    // Apply all filters (AND logic)
    let result: Tx[] = this._data.filter((tx) =>
      this._filters.every((predicate) => predicate(tx)),
    );

    // Apply sorting
    if (this._sortFn) {
      result = [...result].sort(this._sortFn);
    }

    // Apply limit
    if (this._limitCount !== undefined) {
      result = result.slice(0, this._limitCount);
    }

    // Apply field selection
    if (this._selectedFields) {
      const selectedFields = this._selectedFields;
      return result.map(
        (tx) =>
          Object.fromEntries(
            selectedFields.map((field) => [field, tx[field]]),
          ) as Partial<Tx>,
      );
    }

    return result;
  }
}

// ── Test data ──
const txData: Tx[] = [
  {
    hash: "0x1",
    token: "USDC",
    amount: 1500,
    sender: "0xAlice",
    block: 100,
    status: "confirmed",
  },
  {
    hash: "0x2",
    token: "ETH",
    amount: 2000,
    sender: "0xBob",
    block: 101,
    status: "pending",
  },
  {
    hash: "0x3",
    token: "USDC",
    amount: 500,
    sender: "0xCarol",
    block: 100,
    status: "confirmed",
  },
  {
    hash: "0x4",
    token: "DAI",
    amount: 3000,
    sender: "0xAlice",
    block: 102,
    status: "confirmed",
  },
  {
    hash: "0x5",
    token: "USDC",
    amount: 1200,
    sender: "0xBob",
    block: 103,
    status: "failed",
  },
];

// ── Test calls ──
console.log("All USDC > 500, desc by amount, limit 5:");
const result1 = new TransactionQueryBuilder(txData)
  .where((tx) => tx.token === "USDC")
  .where((tx) => tx.amount > 500)
  .orderBy("amount", "desc")
  .limit(5)
  .execute();
console.log(result1);

console.log("\nAll confirmed, select only hash and sender:");
const result2 = new TransactionQueryBuilder(txData)
  .where((tx) => tx.status === "confirmed")
  .select("hash", "sender")
  .execute();
console.log(result2);

console.log("\nAll from 0xAlice, ordered by block ascending, limit 2:");
const result3 = new TransactionQueryBuilder(txData)
  .where((tx) => tx.sender === "0xAlice")
  .orderBy("block", "asc")
  .limit(2)
  .execute();
console.log(result3);
