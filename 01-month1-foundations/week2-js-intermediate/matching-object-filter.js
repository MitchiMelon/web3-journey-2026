function whatIsInAName(collection, source) {
  let result = [];
  for (let i = 0; i < collection.length; i++) {
    let obj = collection[i];
    let isMatch = true;
    for (let key in source) {
      if (obj[key] !== source[key]) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      result.push(obj)
    }
  }
  return result;
}


console.log(whatIsInAName([{ first: "Romeo", last: "Montague" }, { first: "Mercutio", last: null }, { first: "Tybalt", last: "Capulet" }], { last: "Capulet" }))


console.log(whatIsInAName([{"a": 1, "b": 2, "c": 3, "d": 9999}], {"a": 1, "b": 9999, "c": 3}))

Prime Number Sum Calculator


function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}


function sumPrimes(num) {
    if (num < 2) return 0;
    let sum = 0;
    for (let i = 2; i <= num; i++) {
        if (isPrime(i)) {
            sum += i;
        }
    }
    return sum;
}


console.log(sumPrimes(10)); // 17
console.log(sumPrimes(5));  // 10
console.log(sumPrimes(977)); // 73156
