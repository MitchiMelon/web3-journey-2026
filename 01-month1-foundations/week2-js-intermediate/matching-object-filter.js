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
