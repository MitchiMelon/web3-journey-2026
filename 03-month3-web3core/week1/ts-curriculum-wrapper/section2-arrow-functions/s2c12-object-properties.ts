type WalletClient = {
  address: string;
  balance: bigint;
  getShortAddress: () => string; // first 6 + last 4 chars
  formatBalance: (wei: bigint) => string; // wei / 10^18, 4dp + " ETH"
  canAfford: (priceWei: bigint) => boolean;
  buildTransferLog: (to: string, amount: bigint) => string;
  // format: "[address] transferred [amount] ETH to [to]"
};

const myWallet: WalletClient = {
  address: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12",
  balance: 2_000_000_000_000_000_000n,
  getShortAddress: () =>
    myWallet.address.slice(0, 6) + "..." + myWallet.address.slice(-4),
  formatBalance: (wei) => `${(Number(wei) / 1e18).toFixed(4)} ETH`,
  canAfford: (priceWei) => myWallet.balance >= priceWei,
  buildTransferLog: (to, amount) =>
    `${myWallet.getShortAddress()} transferred ${(Number(amount) / 1e18).toFixed(4)} ETH to ${to}`,
};

console.log(myWallet.getShortAddress());
console.log(myWallet.formatBalance(2500000000000000000n)); // "2.5000 ETH"
console.log(myWallet.formatBalance(500000000000000000n)); // "0.5000 ETH"
console.log(myWallet.canAfford(500_000_000_000_000_000n));
console.log(myWallet.buildTransferLog("0xBob", 1_000_000_000_000_000_000n));
