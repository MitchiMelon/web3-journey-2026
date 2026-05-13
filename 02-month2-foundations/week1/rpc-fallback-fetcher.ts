type FetchParams = {
  primaryUrl: string;
  fallbackUrls: string[];
  requestData: any;
  timeoutMs?: number;
};

type RPCResponse = {
  data: any;
  nodeUrl: string;
};

function mockRPC(url: string, data: any): Promise<any> {
  const responses: Record<string, { result: any; delay: number; fails: boolean }> = {
    'https://primary.example.com':     { result: { block: 123 }, delay: 2000, fails: false },
    'https://slow-primary.example.com':{ result: { block: 456 }, delay: 6000, fails: false },
    'https://fast-fallback.example.com':{ result: { block: 789 }, delay: 300, fails: false },
    'https://flaky.example.com':       { result: null, delay: 100, fails: true },
    'https://dead.example.com':        { result: null, delay: 0, fails: true },
    'https://backup1.example.com':     { result: { block: 111 }, delay: 500, fails: false },
  };
  const cfg = responses[url] ?? { result: { block: 999 }, delay: 400, fails: false };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cfg.fails) reject(new Error(`Connection refused to ${url}`));
      else resolve(cfg.result);
    }, cfg.delay);
  });
}

async function callWithTimeout(url: string, requestData: any, timeoutMs: number): Promise<any> {
  return Promise.race([
    mockRPC(url, requestData),
    new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms for ${url}`)), timeoutMs)
    ),
  ]);
}

async function fetchWithFallback(params: FetchParams): Promise<RPCResponse> {
  const { primaryUrl, fallbackUrls, requestData, timeoutMs = 5000 } = params;

  try {
    const primaryResult = await callWithTimeout(primaryUrl, requestData, timeoutMs);
    return { data: primaryResult, nodeUrl: primaryUrl };
  } catch (primaryError) {
    for (const fallbackUrl of fallbackUrls) {
      try {
        const fallbackResult = await callWithTimeout(fallbackUrl, requestData, timeoutMs);
        return { data: fallbackResult, nodeUrl: fallbackUrl };
      } catch (fallbackError) {
        continue;
      }
    }
  }

  throw new Error('All RPC endpoints failed');
}

// Test cases (optional to include)
async function runTests() {
  try {
    const res1 = await fetchWithFallback({
      primaryUrl: 'https://slow-primary.example.com',
      fallbackUrls: ['https://fast-fallback.example.com'],
      requestData: {},
      timeoutMs: 3000
    });
    console.log(res1);
  } catch (e) {
    console.error(e);
  }

  try {
    const res2 = await fetchWithFallback({
      primaryUrl: 'https://dead.example.com',
      fallbackUrls: ['https://flaky.example.com'],
      requestData: {},
      timeoutMs: 2000
    });
    console.log(res2);
  } catch (e) {
    console.error(e.message); // All RPC endpoints failed
  }
}

runTests();