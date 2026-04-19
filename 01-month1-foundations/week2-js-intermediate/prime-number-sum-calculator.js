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
