function mockRPCCall(url: string): Promise<{ blockNumber: number }> {
  const latencies: Record<string, number> = {
    "https://alchemy.example.com": 120,
    "https://infura.example.com": 2500,
    "https://quicknode.example.com": 800,
    "https://dead.example.com": 99999,
    "https://slow.example.com": 4500,
  };
  const latency = latencies[url] ?? 200;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (latency > 6000) reject(new Error("Connection timeout"));
      else resolve({ blockNumber: 19000000 + Math.floor(Math.random() * 1000) });
    }, Math.min(latency, 6000));
  });
}

type NodeStatus = "healthy" | "degraded" | "offline";

type NodeHealth = {
  name: string;
  url: string;
  region: string;
  status: NodeStatus;
  latencyMs: number | null;
  checkedAt: number;
  error?: string;
};

type HealthReport = {
  totalChecked: number;
  healthy: number;
  degraded: number;
  offline: number;
  nodes: NodeHealth[];
  bestNode: string | null;
  reportGeneratedAt: number;
};

type RPCEndpoint = {
  name: string;
  url: string;
  region: string;
};

async function checkSingleEndpoint(endpoint: RPCEndpoint): Promise<NodeHealth> {
  const startTime = Date.now();
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 5000)
    );
    const response = await Promise.race([
      mockRPCCall(endpoint.url),
      timeoutPromise,
    ]);
    const latency = Date.now() - startTime;
    let status: NodeStatus;
    if (latency < 2000) {
      status = "healthy";
    } else if (latency <= 5000) {
      status = "degraded";
    } else {
      status = "offline";
    }
    return {
      name: endpoint.name,
      url: endpoint.url,
      region: endpoint.region,
      status,
      latencyMs: latency,
      checkedAt: Date.now(),
    };
  } catch (error) {
    return {
      name: endpoint.name,
      url: endpoint.url,
      region: endpoint.region,
      status: "offline",
      latencyMs: null,
      checkedAt: Date.now(),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkRPCHealth(endpoints: RPCEndpoint[]): Promise<HealthReport> {
  const promises = endpoints.map((ep) => checkSingleEndpoint(ep));
  const nodes = await Promise.all(promises);

  nodes.sort((a, b) => {
    if (a.latencyMs === null && b.latencyMs === null) return 0;
    if (a.latencyMs === null) return 1;
    if (b.latencyMs === null) return -1;
    return a.latencyMs - b.latencyMs;
  });

  let healthyCount = 0;
  let degradedCount = 0;
  let offlineCount = 0;
  for (const node of nodes) {
    if (node.status === "healthy") healthyCount++;
    else if (node.status === "degraded") degradedCount++;
    else offlineCount++;
  }

  let bestNode: string | null = null;
  for (const node of nodes) {
    if (node.status === "healthy" && node.latencyMs !== null) {
      bestNode = node.name;
      break;
    }
  }

  return {
    totalChecked: endpoints.length,
    healthy: healthyCount,
    degraded: degradedCount,
    offline: offlineCount,
    nodes,
    bestNode,
    reportGeneratedAt: Date.now(),
  };
}

// ============================================
// TEST: Run this after the function definitions
// ============================================

const testEndpoints: RPCEndpoint[] = [
  { name: "Alchemy",   url: "https://alchemy.example.com",   region: "us-east-1" },
  { name: "Infura",    url: "https://infura.example.com",    region: "us-east-1" },
  { name: "QuickNode", url: "https://quicknode.example.com", region: "us-west-2" },
  { name: "DeadNode",  url: "https://dead.example.com",      region: "eu-central-1" },
  { name: "SlowNode",  url: "https://slow.example.com",      region: "ap-southeast-1" },
];

async function runTest() {
  console.log("Checking RPC endpoints...\n");
  const report = await checkRPCHealth(testEndpoints);
  console.log("=== Health Report ===");
  console.log(JSON.stringify(report, null, 2));
}

runTest();