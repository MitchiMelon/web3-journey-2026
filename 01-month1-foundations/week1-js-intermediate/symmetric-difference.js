function diffArray(arrA, arrB) {
    const onlyInA = arrA.filter(item => !arrB.includes(item));
    const onlyInB = arrB.filter(item => !arrA.includes(item));
    return onlyInA.concat(onlyInB);
}


console.log(diffArray(["diorite", "andesite", "grass", "dirt", "pink wool", "dead shrub"], ["diorite", "andesite", "grass", "dirt", "dead shrub"]));
console.log(diffArray(["pen", "book"], ["book", "pencil", "notebook"]));
console.log(diffArray([], []));
