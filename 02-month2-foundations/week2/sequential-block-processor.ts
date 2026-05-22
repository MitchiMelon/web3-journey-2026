// MOCK FUNCTION:
function mockFetchBlock(blockNumber: number): Promise<{
  blockNumber: number;
  events: Array<{
    type: "Transfer" | "Approval" | "Liquidation";
    from: string;
    to: string;
    amount: number;
  }>;
}> {
  const blockData: Record<number, any[]> = {
    100: [
      { type: "Transfer", from: "0xAlice", to: "0xBob", amount: 500 },
      { type: "Approval", from: "0xAlice", to: "0xUniswap", amount: 10000 },
    ],
    101: [
      { type: "Transfer", from: "0xBob", to: "0xCarol", amount: 250 },
      { type: "Liquidation", from: "0xProtocol", to: "0xBob", amount: 1500 },
    ],
    102: [{ type: "Transfer", from: "0xCarol", to: "0xDiana", amount: 750 }],
    103: [], // empty block
    104: [
      { type: "Transfer", from: "0xDiana", to: "0xAlice", amount: 300 },
      { type: "Transfer", from: "0xAlice", to: "0xEve", amount: 100 },
    ],
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        blockNumber,
        events: (blockData[blockNumber] ?? []).map((e) => ({
          ...e,
          blockNumber,
        })),
      });
    }, 80);
  });
}

type ProcessorConfig = {
  contractAddress: string;
  startBlock: number;
  endBlock: number;
};

type BlockEvent = {
  type: "Transfer" | "Approval" | "Liquidation";
  from: string;
  to: string;
  amount: number;
  blockNumber: number;
};

type ProcessorState = {
  blocksProcessed: number;
  totalEvents: number;
  totalVolume: number;
  uniqueAddresses: string[];
  eventsByType: Record<string, number>;
  lastProcessedBlock: number;
  processingTimeMs: number;
};

async function processBlockRange(
  config: ProcessorConfig,
): Promise<ProcessorState> {
  const state: ProcessorState = {
    blocksProcessed: 0,
    totalEvents: 0,
    totalVolume: 0,
    uniqueAddresses: [],
    eventsByType: {},
    lastProcessedBlock: 0,
    processingTimeMs: 0,
  };
  const startTime = Date.now();
  const addressSet = new Set<string>();
  for (
    let blockNumber = config.startBlock;
    blockNumber <= config.endBlock;
    blockNumber++
  ) {
    const block = await mockFetchBlock(blockNumber);
    state.blocksProcessed++;
    for (const event of block.events) {
      state.totalEvents++;
      if (event.type === "Transfer") state.totalVolume += event.amount;
      addressSet.add(event.from);
      addressSet.add(event.to);
      if (!state.eventsByType[event.type]) state.eventsByType[event.type] = 0;
      state.eventsByType[event.type]++;
    }
  }
  state.uniqueAddresses = Array.from(addressSet);
  state.lastProcessedBlock = config.endBlock;
  state.processingTimeMs = Date.now() - startTime;

  return state;
}

// TEST:
async function testWednesday() {
  console.log("\n=== WEDNESDAY: Sequential Block Processor ===");
  const state = await processBlockRange({
    contractAddress: "0xVault",
    startBlock: 100,
    endBlock: 104,
  });
  console.log("Final state:", JSON.stringify(state, null, 2));
  console.log("Expected: blocksProcessed=5, totalVolume=1900, totalEvents=7");
}

testWednesday();
