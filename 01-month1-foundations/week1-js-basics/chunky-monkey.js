function chunkArrayInGroups(arr, size) {
  let chunk = [];
  for (let i = 0; i < arr.length; i += size) {
    chunk.push(arr.slice(i, i + size))
  }
  return chunk;
}


console.log(chunkArrayInGroups(["a", "b", "c", "d"], 2))