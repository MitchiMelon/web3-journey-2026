//Rewrite these three

/*
function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    137: "Polygon",
    42161: "Arbitrum One",
    8453: "Base",
  };
  return networks[chainId] ?? "Unknown Network";
}
*/

const getNetworkName = (chainId: number): string => {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    137: "Polygon",
    42161: "Arbitrum One",
    8453: "Base",
  };
  return networks[chainId] ?? "Unknown Network";
};

/*
function isWhaleWallet(balanceUSD: number): boolean {
  return balanceUSD >= 1000000;
}
*/

const isWhaleWallet = (balanceUSD: number): boolean => balanceUSD >= 1000000;

/*
function buildRPCUrl(baseUrl: string, apiKey: string): string {
  return `${baseUrl}/${apiKey}`;
}
*/

const buildRPCUrl = (baseUrl: string, apiKey: string): string =>
  `${baseUrl}/${apiKey}`;

// Test getNetworkName
console.log(getNetworkName(1)); // "Ethereum Mainnet"
console.log(getNetworkName(137)); // "Polygon"
console.log(getNetworkName(42161)); // "Arbitrum One"
console.log(getNetworkName(8453)); // "Base"
console.log(getNetworkName(999)); // "Unknown Network"

// Test isWhaleWallet
console.log(isWhaleWallet(1_500_000)); // true (>= 1M)
console.log(isWhaleWallet(1_000_000)); // true (exactly 1M)
console.log(isWhaleWallet(500_000)); // false
console.log(isWhaleWallet(0)); // false

// Test buildRPCUrl
console.log(buildRPCUrl("https://mainnet.infura.io/v3", "abc123"));
// "https://mainnet.infura.io/v3/abc123"
console.log(buildRPCUrl("wss://polygon-rpc.com", "key456"));
// "wss://polygon-rpc.com/key456"
