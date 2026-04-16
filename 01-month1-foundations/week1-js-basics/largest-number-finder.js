function largestOfAll(arr) {
  let result = [];
  for (let subArr of arr) {
    let max = subArr[0];
    for (let number of subArr) {
      if (number > max) {
        max = number;
      }
    }
    result.push(max);
  }
  return result;
}


console.log(largestOfAll([[4, 5, 1, 3], [13, 27, 18, 26], [32, 35, 37, 39], [1000, 1001, 857, 1]]))