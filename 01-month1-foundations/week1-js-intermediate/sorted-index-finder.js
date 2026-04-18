function getIndexToIns(arr, num) {
  let sorted = arr.slice().sort((a, b) => a - b);
  let index = sorted.findIndex(element => element >= num);
  if (index === -1) {
    return sorted.length
  } else {
    return index;
  }
}


console.log(getIndexToIns([10, 20, 30, 40, 50], 35))
console.log(getIndexToIns([3, 10, 5], 11))
console.log(getIndexToIns([], 5))
