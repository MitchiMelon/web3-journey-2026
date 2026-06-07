import "dotenv/config";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
});

async function main() {
  // 1. Get current block number
  const blockNumber = await client.getBlockNumber();
  console.log("Current block:", blockNumber);

  // 2. Get ETH balance of Vitalik's wallet
  const balance = await client.getBalance({
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  });
  console.log("Vitalik balance:", formatEther(balance), "ETH");

  // 3. Get latest block details
  const block = await client.getBlock({ blockTag: "latest" });
  console.log("Latest block hash:", block.hash);
  console.log("Transactions in block:", block.transactions.length);
}

main().catch(console.error);
