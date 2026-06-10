type ConfirmationStatus = {
  current: number;
  required: number;
  remaining: number;
  percentComplete: number; // rounded to nearest integer, 0–100
  isConfirmed: boolean;
  estimatedWaitSeconds: number; // remaining * 12
};

function calculateConfirmations(
  currentBlock: number,
  txBlock: number,
  required: number,
): ConfirmationStatus {
  const current = currentBlock - txBlock;
  const remaining = Math.max(required - current, 0);

  let percentComplete = 0;
  if (required > 0) {
    percentComplete = Math.round((current / required) * 100);
    percentComplete = Math.min(percentComplete, 100);
    percentComplete = Math.max(percentComplete, 0);
  }

  const isConfirmed = current >= required;
  const estimatedWaitSeconds = remaining * 12;

  return {
    current,
    required,
    remaining,
    percentComplete,
    isConfirmed,
    estimatedWaitSeconds,
  };
}

console.log(calculateConfirmations(19000010, 19000005, 12));
console.log(calculateConfirmations(100, 100, 5));
console.log(calculateConfirmations(105, 100, 5));
