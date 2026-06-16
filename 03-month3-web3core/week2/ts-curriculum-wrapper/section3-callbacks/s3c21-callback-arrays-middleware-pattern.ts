type Context = {
  walletAddress: string;
  isAuthenticated: boolean;
  hasBalance: boolean;
  data: Record<string, unknown>;
};

type MiddlewareFn = (ctx: Context, next: () => void) => void;

function runMiddleware(ctx: Context, middlewares: MiddlewareFn[]): void {
  // Execute middlewares in order
  // Each middleware receives ctx and a next function
  // If middleware calls next(), the next middleware runs
  // If middleware does NOT call next(), chain stops
  const dispatch = (index: number): void => {
    if (index >= middlewares.length) return;
    const middleware = middlewares[index];
    middleware(ctx, () => dispatch(index + 1));
  };
  dispatch(0);
}

// Test with these middleware functions:
const logRequest: MiddlewareFn = (ctx, next) => {
  console.log("Request from:", ctx.walletAddress);
  next();
};

const checkAuth: MiddlewareFn = (ctx, next) => {
  if (!ctx.isAuthenticated) {
    console.log("Rejected: not authenticated");
    return; // does NOT call next — chain stops here
  }
  next();
};

const checkBalance: MiddlewareFn = (ctx, next) => {
  if (!ctx.hasBalance) {
    console.log("Rejected: insufficient balance");
    return;
  }
  next();
};

const handleRequest: MiddlewareFn = (ctx, next) => {
  console.log("Processing request for:", ctx.walletAddress);
  ctx.data.result = "Transaction submitted";
  next();
};

runMiddleware(
  {
    walletAddress: "0xAlice",
    isAuthenticated: true,
    hasBalance: true,
    data: {},
  },
  [logRequest, checkAuth, checkBalance, handleRequest],
);
