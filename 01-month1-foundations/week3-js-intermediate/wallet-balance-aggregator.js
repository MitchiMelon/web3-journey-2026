const walletTransfers = [
  { token: "USDC", amount: 1000, type: "in"  },
  { token: "ETH",  amount: 2,    type: "in"  },
  { token: "USDC", amount: 200,  type: "out" },
  { token: "ETH",  amount: 0.5,  type: "out" },
  { token: "USDC", amount: 500,  type: "in"  },
  { token: "ETH",  amount: 1,    type: "in"  },
  { token: "USDC", amount: 100,  type: "out" },
]


function getNetBalances(transfers) {
  const result = transfers.reduce((balances, transfer) => {
    if (!balances[transfer.token]) {
      balances[transfer.token] = 0;
    }
    if (transfer.type === "in") {
      balances[transfer.token] += transfer.amount;
    } else if (transfer.type === "out") {
        balances[transfer.token] -= transfer.amount;
    }
    return balances;
  }, {});
  return result;
}


console.log(getNetBalances(walletTransfers));
