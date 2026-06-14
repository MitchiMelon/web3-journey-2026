// Write these as arrow functions with implicit object return:

// 1. Takes a wallet address and balance, returns a WalletSummary
type WalletSummary = {
  address: string;
  balance: number;
  isWhale: boolean;
};

const makeWalletSummary = (
  address: string,
  balance: number,
): WalletSummary => ({
  address,
  balance,
  isWhale: balance >= 1_000_000,
});

console.log(makeWalletSummary("0xAlice", 500_000)); // isWhale: false
console.log(makeWalletSummary("0xBob", 2_000_000)); // isWhale: true

// 2. Takes a txHash and blockNumber, returns a TxRef
type TxRef = {
  hash: string;
  block: number;
  explorerUrl: string;
};
// explorerUrl format: `https://etherscan.io/tx/${hash}`

const makeTxRef = (txHash: string, blockNumber: number): TxRef => ({
  hash: txHash,
  block: blockNumber,
  explorerUrl: `https://etherscan.io/tx/${txHash}`,
});

console.log(makeTxRef("0xabc123def456", 19000000));
// { hash: "0xabc123def456", block: 19000000, explorerUrl: "https://etherscan.io/tx/0xabc123def456" }

// 3. Takes a token symbol and price, returns a PriceEntry
type PriceEntry = {
  symbol: string;
  priceUSD: number;
  updatedAt: number;
};
// updatedAt: Date.now()

const makePriceEntry = (symbol: string, price: number): PriceEntry => ({
  symbol,
  priceUSD: price,
  updatedAt: Date.now(),
});

const priceEntry = makePriceEntry("ETH", 3200.5);
console.log(priceEntry);
// Example: { symbol: "ETH", priceUSD: 3200.50, updatedAt: 1718000000000 } (timestamp changes)
console.log(typeof priceEntry.updatedAt === "number"); // should be true

// 4. Takes a chainId and rpcUrl, returns a NetworkConfig
type NetworkConfig = {
  chainId: number;
  rpcUrl: string;
  isTestnet: boolean;
};
// isTestnet: chainId >= 10000 or chainId in [5, 11155111, 80001]

const Network = (chainId: number, rpcUrl: string): NetworkConfig => ({
  chainId,
  rpcUrl,
  isTestnet:
    chainId >= 10000 ||
    chainId === 5 ||
    chainId === 11155111 ||
    chainId === 80001,
});

console.log(Network(1, "https://mainnet.infura.io/v3/abc"));
// { chainId: 1, rpcUrl: "https://mainnet.infura.io/v3/abc", isTestnet: false }
console.log(Network(5, "https://goerli.infura.io/v3/abc"));
// { chainId: 5, rpcUrl: "https://goerli.infura.io/v3/abc", isTestnet: true }
console.log(Network(137, "https://polygon-rpc.com"));
// { chainId: 137, rpcUrl: "https://polygon-rpc.com", isTestnet: false }
console.log(Network(11155111, "https://sepolia.infura.io/v3/abc"));
// { chainId: 11155111, rpcUrl: "...", isTestnet: true }
console.log(Network(80001, "https://mumbai.polygonscan.com"));
// { chainId: 80001, rpcUrl: "...", isTestnet: true }
console.log(Network(10000, "https://some-custom-testnet.io"));
// { chainId: 10000, rpcUrl: "...", isTestnet: true } (chainId >= 10000)
