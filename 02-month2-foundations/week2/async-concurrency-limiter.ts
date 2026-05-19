async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await fn(items[currentIndex]);
    }
  }

  const workerCount = Math.min(limit, items.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);
  return results;
}

const inflightCount = new Set<string>();
async function fetchBalance(address: string): Promise<number> {
  inflightCount.add(address);
  console.log(`⚡ Start ${address}  (in flight: ${inflightCount.size})`);
  await new Promise((r) => setTimeout(r, 200));
  inflightCount.delete(address);
  console.log(`✅ Done  ${address}`);
  return address.length * 100;
}

async function runTest() {
  const addresses = ["Alice", "Bob", "Carol", "Dave", "Eve"];
  const limit = 2;

  console.log("=== Starting concurrency-limited batch ===\n");
  const balances = await mapWithConcurrencyLimit(
    addresses,
    fetchBalance,
    limit,
  );
  console.log("\nAll results:", balances);

  const expected = addresses.map((a) => a.length * 100);
  console.log(
    JSON.stringify(balances) === JSON.stringify(expected)
      ? "✅ Order preserved PASS"
      : "❌ Order FAIL",
  );
}

runTest();
