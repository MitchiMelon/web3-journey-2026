const blocks = [
  { blockNumber: 19000001, gasPrice: 32.4 },
  { blockNumber: 19000002, gasPrice: 18.1 },
  { blockNumber: 19000003, gasPrice: 55.7 },
  { blockNumber: 19000004, gasPrice: 22.0 },
  { blockNumber: 19000005, gasPrice: 41.3 },
  { blockNumber: 19000006, gasPrice: 15.9 },
]


function analyzeGasPrices(blockList) {
  const sortedBlocks = [...blockList];
  sortedBlocks.sort((a, b) => b.gasPrice - a.gasPrice);


  const highest = sortedBlocks[0].gasPrice;
  const lowest = sortedBlocks[sortedBlocks.length -1].gasPrice;


  let average = sortedBlocks.map(block => block.gasPrice).reduce((sum, price) => sum + price, 0) / sortedBlocks.length;
  average = Math.round(average * 100) / 100;


  return{
    sorted: sortedBlocks,
    highest: highest,
    lowest: lowest,
    average: average
  }
}


console.log(analyzeGasPrices(blocks))
