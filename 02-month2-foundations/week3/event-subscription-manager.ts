let _subPollCount: Record<string, number> = {};

function mockPollEvents(
  contract: string,
  eventName: string,
): Promise<
  Array<{
    txHash: string;
    args: Record<string, string | number>;
    blockNumber: number;
  }>
> {
  const key = `${contract}-${eventName}`;
  _subPollCount[key] = (_subPollCount[key] ?? 0) + 1;
  const count = _subPollCount[key];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (count % 5 === 0) {
        reject(new Error(`RPC error on poll ${count}`));
        return;
      }
      const events =
        count % 3 === 0
          ? []
          : [
              {
                txHash: `0x${count.toString(16).padStart(8, "0")}`,
                args: { from: "0xAlice", to: "0xBob", amount: count * 100 },
                blockNumber: 19000000 + count,
              },
            ];
      resolve(events);
    }, 60);
  });
}

type SubscriptionConfig = {
  name: string;
  contractAddress: string;
  eventName: string;
  pollIntervalMs: number;
  maxRetries: number;
};

type BlockEvent = {
  txHash: string;
  eventName: string;
  args: Record<string, string | number>;
  blockNumber: number;
  timestamp: number;
};

type EventCallback = (events: BlockEvent[]) => void;
type SubscriptionErrorCallback = (name: string, error: Error) => void;

type SubscriptionStatus = {
  name: string;
  contractAddress: string;
  eventName: string;
  isActive: boolean;
  pollCount: number;
  eventCount: number;
  errorCount: number;
  lastPollAt: number | null;
  state: "running" | "stopped" | "errored";
};

class EventSubscriptionManager {
  private subscriptions = new Map<
    string,
    {
      name: string;
      contractAddress: string;
      eventName: string;
      isActive: boolean;
      pollCount: number;
      eventCount: number;
      errorCount: number;
      lastPollAt: number | null;
      state: "running" | "stopped" | "errored";
      config: SubscriptionConfig;
      onEvent: EventCallback;
      onError?: SubscriptionErrorCallback;
      timerId: ReturnType<typeof setTimeout> | null;
      running: boolean;
      currentRetries: number;
    }
  >();

  subscribe(
    config: SubscriptionConfig,
    onEvent: EventCallback,
    onError?: SubscriptionErrorCallback,
  ): void {
    if (this.subscriptions.has(config.name))
      throw new Error(`Subscription ${config.name} already exists`);

    this.subscriptions.set(config.name, {
      name: config.name,
      contractAddress: config.contractAddress,
      eventName: config.eventName,
      isActive: true,
      pollCount: 0,
      eventCount: 0,
      errorCount: 0,
      lastPollAt: null,
      state: "running",
      config,
      onEvent,
      onError,
      timerId: null,
      running: true,
      currentRetries: 0,
    });

    this.startPolling(config.name);
  }

  private startPolling(name: string): void {
    const sub = this.subscriptions.get(name);
    if (!sub) return;

    const poll = async () => {
      if (!sub.running) return;
      sub.pollCount++;
      sub.lastPollAt = Date.now();
      try {
        const rawEvents = await mockPollEvents(
          sub.config.contractAddress,
          sub.config.eventName,
        );
        sub.currentRetries = 0;
        if (rawEvents.length > 0) {
          const events: BlockEvent[] = rawEvents.map((e) => ({
            txHash: e.txHash,
            eventName: sub.config.eventName,
            args: e.args,
            blockNumber: e.blockNumber,
            timestamp: Date.now(),
          }));
          sub.eventCount += events.length;
          sub.onEvent(events);
        }
      } catch (error) {
        sub.errorCount++;
        sub.currentRetries++;
        if (sub.currentRetries > sub.config.maxRetries) {
          sub.state = "errored";
          sub.running = false;
          sub.timerId = null;
          if (sub.onError) sub.onError(sub.name, error as Error);
          return;
        }
      }
      if (sub.running) {
        sub.timerId = setTimeout(poll, sub.config.pollIntervalMs);
      }
    };
    sub.timerId = setTimeout(poll, sub.config.pollIntervalMs);
  }

  unsubscribe(name: string): boolean {
    const sub = this.subscriptions.get(name);
    if (!sub) return false;
    sub.running = false;
    if (sub.timerId) clearTimeout(sub.timerId);
    sub.timerId = null;
    sub.isActive = false;
    sub.state = "stopped";
    return true;
  }

  getStatus(name: string): SubscriptionStatus | null {
    const sub = this.subscriptions.get(name);
    if (!sub) return null;
    return {
      name: sub.name,
      contractAddress: sub.contractAddress,
      eventName: sub.eventName,
      isActive: sub.isActive,
      pollCount: sub.pollCount,
      eventCount: sub.eventCount,
      errorCount: sub.errorCount,
      lastPollAt: sub.lastPollAt,
      state: sub.state,
    };
  }

  getAll(): SubscriptionStatus[] {
    return Array.from(this.subscriptions.values()).map((sub) => ({
      name: sub.name,
      contractAddress: sub.contractAddress,
      eventName: sub.eventName,
      isActive: sub.isActive,
      pollCount: sub.pollCount,
      eventCount: sub.eventCount,
      errorCount: sub.errorCount,
      lastPollAt: sub.lastPollAt,
      state: sub.state,
    }));
  }

  stopAll(): void {
    for (const sub of this.subscriptions.values()) {
      sub.running = false;
      if (sub.timerId) clearTimeout(sub.timerId);
      sub.timerId = null;
      sub.isActive = false;
      sub.state = "stopped";
    }
  }
}

async function testSaturday() {
  console.log("\n=== SATURDAY: Async Event Subscription Manager ===");
  _subPollCount = {};

  const manager = new EventSubscriptionManager();
  let transferEvents = 0;
  let approvalEvents = 0;

  manager.subscribe(
    {
      name: "transfers",
      contractAddress: "0xUSDC",
      eventName: "Transfer",
      pollIntervalMs: 150,
      maxRetries: 2,
    },
    (events: BlockEvent[]) => {
      transferEvents += events.length;
    },
    (name: string, err: Error) => {
      console.log(`Error in ${name}:`, err.message);
    },
  );

  manager.subscribe(
    {
      name: "approvals",
      contractAddress: "0xUSDC",
      eventName: "Approval",
      pollIntervalMs: 200,
      maxRetries: 1,
    },
    (events: BlockEvent[]) => {
      approvalEvents += events.length;
    },
  );

  await new Promise((r) => setTimeout(r, 1200));

  console.log("Transfers status:", manager.getStatus("transfers"));
  console.log("Approvals status:", manager.getStatus("approvals"));
  console.log("Transfer events received:", transferEvents);

  manager.unsubscribe("transfers");
  const countAtUnsub = transferEvents;
  await new Promise((r) => setTimeout(r, 300));
  console.log(
    "Events after unsubscribe (should be same):",
    transferEvents === countAtUnsub ? "✓" : "✗",
  );

  manager.stopAll();
  console.log(
    "All:",
    manager.getAll().map((s) => ({ name: s.name, state: s.state })),
  );
}

testSaturday();
