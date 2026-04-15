function findLongestWordLength(str) {
  let strSplit = str.split(" ");
  let longest = 0;
  for (let i = 0; i < strSplit.length; i++) {
    if (strSplit[i].length > longest) {
      longest = strSplit[i].length;
    }
  }
  return longest;
}
