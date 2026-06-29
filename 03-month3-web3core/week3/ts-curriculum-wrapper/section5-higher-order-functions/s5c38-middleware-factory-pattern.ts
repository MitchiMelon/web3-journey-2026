type Middleware = (
  req: { path: string; headers: Record<string, string>; body: unknown },
  res: { status: (code: number) => { json: (data: unknown) => void } },
  next: () => void,
) => void;

// Factory 1: Rate limiter
function createRateLimiter(maxRequestsPerMinute: number): Middleware {
  const requestCounts = new Map<string, { count: number; resetAt: number }>();

  return (req, res, next) => {
    const wallet = req.headers["x-wallet"] || "anonymous";
    const now = Date.now();
    let entry = requestCounts.get(wallet);

    if (!entry || now > entry.resetAt) {
      // Reset window (1 minute)
      entry = { count: 1, resetAt: now + 60_000 };
      requestCounts.set(wallet, entry);
      next();
    } else if (entry.count < maxRequestsPerMinute) {
      entry.count++;
      next();
    } else {
      res.status(429).json({ error: "Rate limit exceeded" });
    }
  };
}

// Factory 2: API Key validator
function createApiKeyValidator(validKeys: string[]): Middleware {
  return (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || !validKeys.includes(apiKey)) {
      res.status(401).json({ error: "Invalid API key" });
    } else {
      next();
    }
  };
}

// Factory 3: Request logger
function createLogger(prefix: string): Middleware {
  return (req, res, next) => {
    console.log(`${prefix} ${req.path} at ${Date.now()}`);
    next();
  };
}

// --- Test calls ---
const rateLimiter = createRateLimiter(2); // max 2 req/min per wallet
const apiKeyValidator = createApiKeyValidator(["key-abc", "key-xyz"]);
const logger = createLogger("[API]");

// Mock req/res
function mockReq(path: string, headers: Record<string, string> = {}) {
  return { path, headers, body: {} };
}
function mockRes() {
  return {
    status: (code: number) => ({
      json: (data: unknown) => {
        console.log(`Status ${code}:`, data);
      },
    }),
  };
}
function next() {
  console.log("→ next called");
}

console.log("--- Logger test ---");
logger(mockReq("/health"), mockRes(), next); // Should log and call next

console.log("\n--- API Key validator ---");
apiKeyValidator(
  mockReq("/private", { "x-api-key": "key-abc" }),
  mockRes(),
  next,
); // valid
apiKeyValidator(
  mockReq("/private", { "x-api-key": "bad-key" }),
  mockRes(),
  next,
); // invalid

console.log("\n--- Rate limiter (limit 2) ---");
const walletAReq = (path: string) => mockReq(path, { "x-wallet": "0xAlice" });
const res = mockRes();
rateLimiter(walletAReq("/tx"), res, next); // 1st request: allowed
rateLimiter(walletAReq("/tx"), res, next); // 2nd request: allowed
rateLimiter(walletAReq("/tx"), res, next); // 3rd request: blocked
