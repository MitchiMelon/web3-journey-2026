class WatchlistManager {
  constructor() {
    this.tokens = new Map();
  }

  addToken(symbol, price) {
    this.tokens.set(symbol, price);
  }

  updatePrice(symbol, newPrice) {
    if (!this.tokens.has(symbol)) {
      throw new Error(`Token ${symbol} not found`)
    }
    this.tokens.set(symbol, newPrice)
  }

  removeToken(symbol) {
    this.tokens.delete(symbol);
  }

  getExpensive(threshold) {
    const entries = [...this.tokens];
    const expensivePairs = entries.filter(entry => entry[1] > threshold);
    const symbols = expensivePairs.map(entry => entry[0]);
    return symbols;
  }

  getSummary() {
    return [...this.tokens]
      .map(([symbol, price]) => ({ symbol, price }))
      .sort((a, b) => b.price - a.price);
  }
}

// Test block (provided by lab)
const watchlist = new WatchlistManager();
watchlist.addToken("ETH", 3200);
watchlist.addToken("BTC", 67000);
watchlist.addToken("USDC", 1);
watchlist.addToken("SOL", 180);
watchlist.addToken("LINK", 18);
watchlist.updatePrice("ETH", 3500);
watchlist.removeToken("USDC");


console.log("Expensive (above 100):", watchlist.getExpensive(100));
console.log("Summary:", watchlist.getSummary());