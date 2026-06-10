type GasAnalysis = {
  currentGwei: number;
  maxAcceptableGwei: number;
  isSafe: boolean;
  recommendation: string; // "submit" | "wait" | "urgent"
  percentOfMax: number; // currentGwei / maxAcceptableGwei * 100, rounded to 1dp
};

function analyzeGasPrice(
  currentGwei: number,
  maxAcceptableGwei: number,
): GasAnalysis {
  const isSafe: boolean = currentGwei <= maxAcceptableGwei;
  const roundedPercentOfMax: number =
    Math.round((currentGwei / maxAcceptableGwei) * 1000) / 10;
  let recommendation: string = "";
  if (roundedPercentOfMax <= 60) {
    recommendation = "submit";
  } else if (roundedPercentOfMax <= 100) {
    recommendation = "urgent";
  } else {
    recommendation = "wait";
  }

  return {
    currentGwei: currentGwei,
    maxAcceptableGwei: maxAcceptableGwei,
    isSafe: isSafe,
    recommendation: recommendation,
    percentOfMax: roundedPercentOfMax,
  };
}

console.log(analyzeGasPrice(25, 50));
console.log(analyzeGasPrice(95, 50));
console.log(analyzeGasPrice(50, 100));
console.log(analyzeGasPrice(70, 100));
