function frankenSplice(arr1, arr2, index) {
  let arrCopy = arr2.slice();
  arrCopy.splice(index, 0, ...arr1)
  return arrCopy;
}


console.log(frankenSplice([1, 2], ["a", "b"], 1));
console.log(frankenSplice(["claw", "tentacle"], ["head", "shoulders", "knees", "toes"], 2));
