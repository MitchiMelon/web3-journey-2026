function mockFetch(url: string): Promise<string> {
  const delays: Record<string, number> = {
    "https://a.example.com": 100,
    "https://b.example.com": 2000,
    "https://c.example.com": 150,
    "https://d.example.com": 3000,
  };
  const delay = delays[url] ?? 100;
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Data from ${url}`), delay);
  });
}

async function fetchWithTimeoutAll(
  urls: string[],
  timeoutMs: number,
): Promise<{ results: string[]; failures: number }> {
  const promises = urls.map(async (url) => {
    try {
      const result = await Promise.race([
        mockFetch(url),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs),
        ),
      ]);
      return result;
    } catch {
      return null;
    }
  });

  const settled = await Promise.all(promises);
  const results: string[] = [];
  let failures = 0;
  for (const item of settled) {
    if (item !== null) {
      results.push(item);
    } else {
      failures++;
    }
  }
  return { results, failures };
}

// Test runner
async function test() {
  const urls = [
    "https://a.example.com",
    "https://b.example.com",
    "https://c.example.com",
  ];
  const result = await fetchWithTimeoutAll(urls, 500);
  console.log(result);
  console.log(
    result.results.length === 2 && result.failures === 1 ? "PASS" : "FAIL",
  );
}
test();
