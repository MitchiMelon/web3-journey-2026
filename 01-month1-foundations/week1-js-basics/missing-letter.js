function fearNotLetter(str) {
  for (let i = 0; i < str.length - 1; i++) {
    let currentCode = str.charCodeAt(i);
    let nextExpectedCode = currentCode + 1;
    let actualNextCode = str.charCodeAt(i+1);
    if (actualNextCode !== nextExpectedCode) {
      return String.fromCharCode(nextExpectedCode)
    }   
  }
  return undefined;
}


console.log(fearNotLetter("abce"));
console.log(fearNotLetter("abcdefghijklmnopqrstuvwxyz"));