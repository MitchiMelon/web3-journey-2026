function smallestCommons(arr) {
    function gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    function lcmTwo(a, b) {
        return (a * b) / gcd(a, b);
    }


    let min = Math.min(arr[0], arr[1]);
    let max = Math.max(arr[0], arr[1]);


    let range = [];
    for (let i = min; i <= max; i++) {
        range.push(i);
    }


    let lcm = range[0];
    for (let i = 1; i < range.length; i++) {
        lcm = lcmTwo(lcm, range[i]);
    }


    return lcm;
}


console.log(smallestCommons([1, 5]));
console.log(smallestCommons([5, 1]));
console.log(smallestCommons([23, 18]));
