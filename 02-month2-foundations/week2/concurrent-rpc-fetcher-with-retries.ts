function mockRpcCall(endpoint: string, address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const delay = 50 + Math.floor(Math.random() * 100);
    setTimeout(() => {
      if (Math.random() < 0.4) {
        reject(new Error(`RPC error on ${endpoint}: temporary failure`));
      } else {
        resolve(1000 * endpoint.length + address.length);
      }
    }, delay);
  });
}

async function fetchBalancesWithRetry(
  endpoints: string[],
  address: string,
  maxRetries: number,
): Promise<{ endpoint: string; balance: number | null; error?: string }[]> {
  const fetchWithRetry = async (endpoint: string): Promise<number> => {
    let lastError: Error | undefined;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await mockRpcCall(endpoint, address);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 50 * (attempt + 1)),
          );
        }
      }
    }
    throw lastError!;
  };

  const promises = endpoints.map(async (endpoint) => {
    try {
      const balance = await fetchWithRetry(endpoint);
      return { endpoint, balance };
    } catch (err) {
      return {
        endpoint,
        balance: null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });

  return Promise.all(promises);
}

(async () => {
  const endpoints = [
    "https://rpc.eth.example",
    "https://rpc.polygon.example",
    "https://rpc.avalanche.example",
    "https://rpc.bad.example",
  ];
  const address = "0xAbC";
  const maxRetries = 2;

  console.log("Fetching balances with retry...\n");
  const results = await fetchBalancesWithRetry(endpoints, address, maxRetries);

  results.forEach((r) => {
    console.log(
      `Endpoint: ${r.endpoint}\n  Balance: ${r.balance !== null ? r.balance : "null"}${
        r.error ? `\n  Error: ${r.error}` : ""
      }\n`,
    );
  });

  console.log("Done.");
})();
