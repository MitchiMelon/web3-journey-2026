type EventMap = {
  transfer: { from: string; to: string; amount: number; token: string };
  block: { number: number; hash: string; txCount: number };
  error: { message: string; code: number };
};

class BlockchainEventEmitter {
  private listeners = new Map<
    keyof EventMap,
    Array<(...args: any[]) => void>
  >();

  on<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void,
  ): void {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    this.listeners.set(
      event,
      cbs.filter((cb) => cb !== callback),
    );
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    // Iterate over a copy to allow safe removal inside callbacks
    for (const cb of [...cbs]) {
      cb(data);
    }
  }

  once<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void,
  ): void {
    const wrapper = (data: EventMap[K]) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Test calls
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
// Should NOT log — callback was removed

// Test once
const onceCallback = (data: EventMap["error"]) => {
  console.log("Once error:", data.message);
};
emitter.once("error", onceCallback);
emitter.emit("error", { message: "RPC timeout", code: 408 });
emitter.emit("error", { message: "RPC timeout again", code: 408 });
// Only the first emit should log, second should do nothing because callback auto-removed
