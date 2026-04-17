function uniteUnique(...arrays) {
  const result = [];
  const seen = {};
  for (let i = 0; i < arrays.length; i++) {
    const currentArray = arrays[i];
    for (let j = 0; j < currentArray.length; j++) {
      const value = currentArray[j];
      if (!seen.hasOwnProperty(value)) {
        seen[value] = true;
        result.push(value);
      }
    }
  }
  return result;
}


console.log(uniteUnique([1, 3, 2], [5, 2, 1, 4], [2, 1]))
