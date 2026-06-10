type AllowanceCheck = {
  tokenSymbol: string;
  currentAllowance: bigint;
  requiredAmount: bigint;
  isSufficient: boolean;
  shortfallAmount: bigint; // 0n if sufficient
  approvalNeeded: boolean; // true if shortfall > 0
  formattedCurrent: string; // human readable
  formattedRequired: string; // human readable
};

function checkAllowance(
  currentAllowance: bigint,
  requiredAmount: bigint,
  tokenSymbol: string,
  decimals: number,
): AllowanceCheck {
  const isSufficient = currentAllowance >= requiredAmount;
  const shortfallAmount = isSufficient ? 0n : requiredAmount - currentAllowance;
  const approvalNeeded = !isSufficient;

  const formatAmount = (amount: bigint) => {
    const s = amount.toString();
    const padded = s.padStart(decimals + 1, "0");
    const intPart = padded.slice(0, padded.length - decimals);
    const fracPart = padded.slice(padded.length - decimals);
    return fracPart ? `${intPart}.${fracPart} ${tokenSymbol}` : intPart;
  };

  return {
    tokenSymbol: tokenSymbol,
    currentAllowance: currentAllowance,
    requiredAmount: requiredAmount,
    isSufficient: isSufficient,
    shortfallAmount: shortfallAmount,
    approvalNeeded: approvalNeeded,
    formattedCurrent: formatAmount(currentAllowance),
    formattedRequired: formatAmount(requiredAmount),
  };
}

console.log(checkAllowance(500000000n, 1000000000n, "USDC", 6));
console.log(checkAllowance(2000000000n, 1000000000n, "USDC", 6));
