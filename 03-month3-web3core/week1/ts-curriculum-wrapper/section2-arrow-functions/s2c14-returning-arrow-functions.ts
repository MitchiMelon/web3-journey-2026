const createRPCLogger = (prefix: string): ((message: string) => void) => {
  return (message: string): void => {
    console.log(`${prefix} ${message}`);
  };
};

const alchemyLog = createRPCLogger("[Alchemy]");
const infuraLog = createRPCLogger("[Infura]");
alchemyLog("Connected"); // logs: [Alchemy] Connected
infuraLog("Rate limited"); // logs: [Infura] Rate limited

const createBalanceChecker =
  (minBalanceWei: bigint): ((walletBalance: bigint) => boolean) =>
  (walletBalance) =>
    walletBalance >= minBalanceWei;

const hasSufficientForGas = createBalanceChecker(21000n * 30n); // 630,000 wei minimum
console.log(hasSufficientForGas(1_000_000n)); // true
console.log(hasSufficientForGas(500_000n)); // false

const createThresholdAlert = (
  threshold: number,
  label: string,
): ((currentValue: number) => { triggered: boolean; message: string }) => {
  return (currentValue: number) => {
    const triggered = currentValue > threshold;
    return {
      triggered,
      message: triggered
        ? `${label} exceeded threshold: ${currentValue} > ${threshold}`
        : `${label} within threshold: ${currentValue} <= ${threshold}`,
    };
  };
};

const gasAlert = createThresholdAlert(50, "gas price");
console.log(gasAlert(75)); // { triggered: true, message: "gas price exceeded threshold: 75 > 50" }
console.log(gasAlert(25)); // { triggered: false, message: "gas price within threshold: 25 <= 50" }
console.log(gasAlert(50)); // { triggered: false, message: "gas price within threshold: 50 <= 50" }
