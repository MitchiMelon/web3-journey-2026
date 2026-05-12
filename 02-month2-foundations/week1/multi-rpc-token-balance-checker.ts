function mockGetBalance(
  nodeUrl: string,
  wallet: string,
  token: string
): Promise<bigint> {
  const responses: Record<string, { balance: bigint; delay: number; fails: boolean }> = {
    "https://rpc1.example.com": { balance: BigInt("2500000000000000000"), delay: 800, fails: false },
    "https://rpc2.example.com": { balance: BigInt("2500000000000000000"), delay: 200, fails: false },
    "https://rpc3.example.com": { balance: BigInt("0"), delay: 0, fails: true },
    "https://rpc4.example.com": { balance: BigInt("2500000000000000000"), delay: 1500, fails: false },
    "https://dead1.example.com": { balance: BigInt("0"), delay: 0, fails: true },
    "https://dead2.example.com": { balance: BigInt("0"), delay: 0, fails: true },
  };
  const cfg = responses[nodeUrl] ?? { balance: BigInt(0), delay: 100, fails: false };
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cfg.fails) reject(new Error(`Node ${nodeUrl}: connection refused`));
      else resolve(cfg.balance);
    }, cfg.delay);
  });
}

type BalanceQuery = {
  walletAddress: string;
  tokenAddress: string;
  nodes: string[];
  timeoutMs: number;
};

type BalanceResult = {
  walletAddress: string;
  tokenAddress: string;
  balance: bigint;
  formattedBalance: string;
  respondedNode: string;
  latencyMs: number;
  queriedAt: number;
};

async function fetchSingleNode(
  nodeUrl: string,
  wallet: string,
  token: string,
  timeoutMs: number
): Promise<{ balance: bigint; nodeUrl: string }> {
  return Promise.race([
    mockGetBalance(nodeUrl, wallet, token).then(balance => ({ balance, nodeUrl })),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Node ${nodeUrl}: timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

async function fetchTokenBalance(query: BalanceQuery): Promise<BalanceResult> {
  const { walletAddress, tokenAddress, nodes, timeoutMs } = query;
  const startTime = Date.now();

  const promises = nodes.map(nodeUrl =>
    fetchSingleNode(nodeUrl, walletAddress, tokenAddress, timeoutMs)
  );

  try {
    const result = await Promise.any(promises);
    const latencyMs = Date.now() - startTime;

    const rawString = result.balance.toString().padStart(19, '0');
    const intPart = rawString.slice(0, rawString.length - 18) || '0';
    const decPart = rawString.slice(rawString.length - 18, rawString.length - 14);
    const formattedBalance = `${intPart}.${decPart}`;

    return {
      walletAddress,
      tokenAddress,
      balance: result.balance,
      formattedBalance,
      respondedNode: result.nodeUrl,
      latencyMs,
      queriedAt: startTime,
    };
  } catch (error) {
    const aggregateError = error as AggregateError;
    const messages = aggregateError.errors.map((e: Error) => e.message).join('; ');
    throw new Error(`All RPC nodes failed: ${messages}`);
  }
}

async function testMonday() {
  console.log('\n=== MONDAY: Multi-RPC Token Balance Checker ===');
  try {
    const result = await fetchTokenBalance({
      walletAddress: '0xAlice',
      tokenAddress: '0xUSDC',
      nodes: ['https://rpc3.example.com', 'https://rpc2.example.com', 'https://rpc1.example.com'],
      timeoutMs: 1000,
    });
    console.log('Result:', result);
    console.log('Expected respondedNode: https://rpc2.example.com (200ms)');
    console.log('Expected formattedBalance: 2.5000');
  } catch (e) {
    console.error('Error:', (e as Error).message);
  }

  try {
    await fetchTokenBalance({
      walletAddress: '0xAlice',
      tokenAddress: '0xUSDC',
      nodes: ['https://dead1.example.com', 'https://dead2.example.com'],
      timeoutMs: 500,
    });
  } catch (e) {
    console.log('All-fail test:', (e as Error).message);
    console.log("Expected: 'All RPC nodes failed: ...'");
  }
}

testMonday();