import "dotenv/config";
import { createPublicClient, http, parseAbi, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import { db } from "./db.js";
import { transactions } from "./schema.js";

// USDC contract address on Ethereum mainnet
const USDC_CONTRACT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// Minimum transfer to watch — 10,000 USDC
const MIN_AMOUNT = 10_000n * 1_000_000n; // USDC has 6 decimals

// ABI — only the Transfer event, nothing else needed
const abi = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]);

// Create the viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
});

async function startWatcher() {
  console.log("🐳 Whale Watcher starting...");
  console.log(`Watching USDC transfers >= ${formatUnits(MIN_AMOUNT, 6)} USDC`);

  // Watch for Transfer events
  const unwatch = client.watchContractEvent({
    address: USDC_CONTRACT,
    abi,
    eventName: "Transfer",
    onLogs: async (logs) => {
      for (const log of logs) {
        const { from, to, value } = log.args;

        // Skip small transfers
        if (!value || value < MIN_AMOUNT) continue;

        const formattedAmount = formatUnits(value, 6);
        console.log(`\n🚨 Whale transfer detected!`);
        console.log(`   From:   ${from}`);
        console.log(`   To:     ${to}`);
        console.log(`   Amount: ${formattedAmount} USDC`);
        console.log(`   Tx:     ${log.transactionHash}`);

        // Save to database
        try {
          await db.insert(transactions).values({
            hash: log.transactionHash ?? "unknown",
            amount: formattedAmount,
            token: "USDC",
            sender: from ?? "unknown",
          });
          console.log(`   ✅ Saved to database`);
        } catch (error) {
          console.error(`   ❌ Failed to save:`, error);
        }
      }
    },
    onError: (error) => {
      console.error("Watcher error:", error);
    },
  });

  console.log("✅ Watcher running. Press Ctrl+C to stop.\n");

  // Clean up on exit
  process.on("SIGINT", () => {
    console.log("\nStopping watcher...");
    unwatch();
    process.exit(0);
  });
}

startWatcher().catch(console.error);
