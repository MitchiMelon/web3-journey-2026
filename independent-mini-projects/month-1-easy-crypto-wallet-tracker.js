/**
 * EASY #1: Crypto Wallet Balance Tracker
 * 
 * You're building a simple crypto wallet tracker.
 * Each cryptocurrency has a symbol, amount held, and current price per unit.
 * 
 * Your tasks:
 * 1. Create a function that calculates the total value of a single crypto holding
 * 2. Create a function that calculates the total portfolio value (all cryptos combined)
 * 3. Create a function that finds which crypto is your most valuable holding
 * 4. Console.log a summary report

// 1. function calculateHoldingValue(symbol, wallet) { ... }
// 2. function calculatePortfolioValue(wallet) { ... }
// 3. function getMostValuedCrypto(wallet) { ... }

// Example output:
// BTC value: $21,000
// ETH value: $7,040
// ADA value: $85
// SOL value: $2,750
// Total Portfolio Value: $30,875
// Most Valuable Holding: BTC
**/

const wallet = {
  BTC: { amount: 0.5, price: 42000 },
  ETH: { amount: 3.2, price: 2200 },
  ADA: { amount: 100, price: 0.85 },
  SOL: { amount: 25, price: 110 }
};

function calculateHoldingValue(symbol, wallet) {
  const holding = wallet[symbol];
  if (!holding) return 0;          // Symbol doesn't exist
  return holding.amount * holding.price;
}

function calculatePortfolioValue(wallet) {
  let total = 0;
  for (let symbol in wallet) {
    total += calculateHoldingValue(symbol, wallet);
  }
  return total;
}

function getMostValuedCrypto(wallet) {
  let maxValue = 0;
  let maxSymbol = "";
  for (let symbol in wallet) {
    const value = calculateHoldingValue(symbol, wallet);
    if (value > maxValue) {
      maxValue = value;
      maxSymbol = symbol;
    }
  }
  return maxSymbol;
}

function printWalletReport(wallet) {
  for (let symbol in wallet) {
    const value = calculateHoldingValue(symbol, wallet);
    const formatted = Math.round(value).toLocaleString('en-US');
    console.log(`${symbol} value: $${formatted}`);
  }
  
  const total = calculatePortfolioValue(wallet);
  const formattedTotal = Math.round(total).toLocaleString('en-US');
  console.log(`Total Portfolio Value: $${formattedTotal}`);
  
  const top = getMostValuedCrypto(wallet);
  console.log(`Most Valuable Holding: ${top}`);
}

printWalletReport(wallet);
