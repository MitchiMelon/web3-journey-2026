function dropElements(arr, func) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i]) === true) {
      return result = arr.slice(i);
    }
  }
  return result;
}


console.log(dropElements([1, 2, 3, 4], function(n) {return n >= 3;}))
console.log(dropElements([1, 2, 3, 4], function(n) {return n > 5;}))
console.log(dropElements([1, 2, 3, 9, 2], function(n) {return n > 2;}))
