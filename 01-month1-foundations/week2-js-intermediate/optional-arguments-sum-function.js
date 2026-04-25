function addTogether(a, b) {
  if (arguments.length === 2) {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    }
    return undefined;
  }


  if (typeof a !== "number") {
    return undefined;
  }


  return function(c) {
    if (typeof c === "number") {
      return a + c;
    }
    return undefined;
  };
}


console.log(addTogether(2, 3));
console.log(addTogether(23.4, 30));
console.log(addTogether("2", 3));
console.log(addTogether(5, undefined));
console.log(addTogether(5));
console.log(addTogether(5)(7));
console.log(addTogether(2)([3]));
console.log(addTogether("2"));
