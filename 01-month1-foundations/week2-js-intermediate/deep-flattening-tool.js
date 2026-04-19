function steamrollArray(arr) {
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            return acc.concat(steamrollArray(curr));
        } else {
            return acc.concat(curr);
        }
    }, []);
}


console.log(steamrollArray([[["a"]], [["b"]]]));
console.log(steamrollArray(steamrollArray([1, {}, [3, [[4]]]])));
