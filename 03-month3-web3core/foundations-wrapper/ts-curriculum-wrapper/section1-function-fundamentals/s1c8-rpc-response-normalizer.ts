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

type NormalizedTx = {
  hash: string | null;
  from: string | null;
  to: string | null;
  valueWei: bigint;
  gasUsed: number;
  blockNumber: number;
  success: boolean;
};

function normalizeRPCResponse(raw: RawRPCResponse): NormalizedTx {
  const hash = raw.hash ?? raw.transactionHash ?? null;
  const from = raw.from ?? raw.sender ?? null;
  const to = raw.to ?? raw.recipient ?? null;
  const valueWei = raw.value ? BigInt(raw.value) : 0n;
  const gasUsed = raw.gasUsed ? Number(raw.gasUsed) : 0;
  const blockNumber = raw.blockNumber ? Number(raw.blockNumber) : 0;
  const success = raw.status === "0x1";

  return {
    hash,
    from,
    to,
    valueWei,
    gasUsed,
    blockNumber,
    success,
  };
}

const input1 = {
  transactionHash: "0xabc",
  sender: "0xAlice",
  recipient: "0xBob",
  value: "0x1a2b",
  gasUsed: "0x5208",
  blockNumber: "0x1234",
  status: "0x1",
};

console.log(normalizeRPCResponse(input1));

// Test helper
function test(description: string, raw: RawRPCResponse) {
  console.log(`\n--- ${description} ---`);
  console.log(normalizeRPCResponse(raw));
}

// 1. Standard (happy path)
test("Standard: transactionHash, sender, recipient", {
  transactionHash: "0xabc",
  sender: "0xAlice",
  recipient: "0xBob",
  value: "0x1a2b",
  gasUsed: "0x5208",
  blockNumber: "0x1234",
  status: "0x1",
});

// 2. Alternative field names
test("Alternative: hash, from, to", {
  hash: "0xdef",
  from: "0xCarol",
  to: "0xDave",
  value: "0x0",
  gasUsed: "0x0",
  blockNumber: "0x1",
  status: "0x0",
});

// 3. Missing fields
test("Missing all optional fields", {});

// 4. Partial fields
test("Only sender provided", {
  sender: "0xEve",
  transactionHash: "0x123",
});

// 5. Falsy status cases
test("Unknown status", {
  hash: "0x999",
  status: "0x2",
});
