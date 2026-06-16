function createTransactionAccumulator(
  threshold: number,
  onThresholdCrossed: (total: number, count: number) => void,
): {
  add: (amount: number) => void;
  getTotal: () => number;
  getCount: () => number;
  reset: () => void;
} {
  let total = 0;
  let count = 0;

  return {
    add: (amount: number) => {
      total += amount;
      count++;
      if (total > threshold) onThresholdCrossed(total, count);
    },
    getTotal: () => total,
    getCount: () => count,
    reset: () => {
      total = 0;
      count = 0;
    },
  };
}

const acc = createTransactionAccumulator(10000, (total, count) => {
  console.log(
    `Alert: ${count} transactions totaling ${total} crossed threshold`,
  );
});

acc.add(3000); // total: 3000 — no alert
acc.add(4000); // total: 7000 — no alert
acc.add(5000); // total: 12000 — ALERT fires
acc.add(2000); // total: 14000 — ALERT fires again
