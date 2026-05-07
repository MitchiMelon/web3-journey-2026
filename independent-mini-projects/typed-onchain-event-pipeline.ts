type TransferEvent = {
    type: "Transfer";
    from: string;
    to: string;
    amount: number;
    token: string;
    blockNumber: number;
}

type ApprovalEvent = {
    type: "Approval";
    owner: string;
    spender: string;
    amount: number;
    token: string;
    blockNumber: number;
}

type LiquidationEvent = {
    type: "Liquidation";
    liquidator: string;
    borrower: string;
    debtToken: string;
    collateralToken: string;
    debtAmount: number;
    blockNumber: number;
}

type ContractEvent = TransferEvent | ApprovalEvent | LiquidationEvent;

type EventProcessingResult = {
    success: boolean;
    eventType: string;
    blockNumber: number;
    message: string;
    processedAt?: number;   
}

function isTransfer(event: ContractEvent): event is TransferEvent {
    return event.type === "Transfer";
}
function isApproval(event: ContractEvent): event is ApprovalEvent {
    return event.type === "Approval";
}
function isLiquidation(event: ContractEvent): event is LiquidationEvent {
    return event.type === "Liquidation";
}

function processEvent<T extends ContractEvent>(event: T): EventProcessingResult {
    if (isTransfer(event)) {
        let message = `Transfer: ${event.amount} ${event.token} from ${event.from} to ${event.to}`;
        return {
            success: true, 
            eventType: event.type, 
            blockNumber: event.blockNumber, 
            message: message, 
            processedAt: Date.now()
        };
    } else if (isApproval(event)) {
        let message = `Approval: ${event.owner} approved ${event.spender} for ${event.amount} ${event.token}`;
        return {
            success: true, 
            eventType: event.type, 
            blockNumber: event.blockNumber, 
            message: message, 
            processedAt: Date.now()
        };
    } else if (isLiquidation(event)) {
        let message = `Liquidation: ${event.liquidator} liquidated ${event.borrower} — debt: ${event.debtAmount} ${event.debtToken}`;
        return {
            success: true, 
            eventType: event.type, 
            blockNumber: event.blockNumber, 
            message: message, 
            processedAt: Date.now()
        };
    }
    throw new Error(`Unknown event type: ${(event as any).type}`);
}

function routeEvent(event: TransferEvent): string;
function routeEvent(event: LiquidationEvent): string;

function routeEvent(event: ContractEvent): string {
    if (event.type === "Transfer" && event.amount > 10000) {
        return "HIGH_VALUE_TRANSFER";
    } else if (event.type === "Transfer" && event.amount <= 10000) {
        return "NORMAL_TRANSFER";
    } else if (event.type === "Liquidation") {
        return "LIQUIDATION_ALERT";
    } else {
        return "UNROUTED";
    }
}

function freezeEvents(events: ContractEvent[]): Readonly<ContractEvent>[] {
    return events.map(event => Object.freeze(event))
}

// ============================================================
// TEST DATA — do not modify
// ============================================================

const transfer1: any = {
  type: "Transfer",
  from: "0xAlice",
  to: "0xBob",
  amount: 50000,
  token: "USDC",
  blockNumber: 19000001
}

const transfer2: any = {
  type: "Transfer",
  from: "0xCarol",
  to: "0xDiana",
  amount: 500,
  token: "ETH",
  blockNumber: 19000002
}

const approval1: any = {
  type: "Approval",
  owner: "0xAlice",
  spender: "0xUniswap",
  amount: 1000000,
  token: "USDC",
  blockNumber: 19000003
}

const liquidation1: any = {
  type: "Liquidation",
  liquidator: "0xBot",
  borrower: "0xBob",
  debtToken: "USDC",
  collateralToken: "ETH",
  debtAmount: 38000,
  blockNumber: 19000004
}

const allEvents: any[] = [transfer1, transfer2, approval1, liquidation1]


// ============================================================
// TESTS — uncomment as you complete each part
// ============================================================

// PART 2 TEST — type guards
console.log("--- Type Guards ---")
console.log(isTransfer(transfer1))     // true
console.log(isTransfer(approval1))     // false
console.log(isLiquidation(liquidation1)) // true

// PART 3 TEST — processEvent
console.log("\n--- Process Events ---")
console.log(processEvent(transfer1))
// Expected: { success: true, eventType: 'Transfer', blockNumber: 19000001,
//             message: 'Transfer: 50000 USDC from 0xAlice to 0xBob',
//             processedAt: <timestamp> }
//
console.log(processEvent(liquidation1))
// Expected: { success: true, eventType: 'Liquidation', blockNumber: 19000004,
//             message: 'Liquidation: 0xBot liquidated 0xBob — debt: 38000 USDC',
//             processedAt: <timestamp> }

// PART 4 TEST — routeEvent
console.log("\n--- Route Events ---")
console.log(routeEvent(transfer1))    // "HIGH_VALUE_TRANSFER" (50000 > 10000)
console.log(routeEvent(transfer2))    // "NORMAL_TRANSFER" (500 <= 10000)
console.log(routeEvent(liquidation1)) // "LIQUIDATION_ALERT"

// PART 5 TEST — freezeEvents
console.log("\n--- Frozen Events ---")
const frozen = freezeEvents(allEvents)
console.log(frozen[0])
frozen[0].blockNumber = 999  // ← uncomment this — should show TypeScript error