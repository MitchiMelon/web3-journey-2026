function pyramid(str, num, value) {
  let result = "\n";
  let totalWidth = 2 * num - 1; 
  for (let i = 0; i < num; i++) {
    let rowNumber;
    if (value === false) {
      rowNumber = i + 1;
    } else {
      rowNumber = num - i;
    }
  let charsCount = 2 * rowNumber - 1;
  let spacesCount = (totalWidth - charsCount) / 2; 
  let spaces = " ".repeat(spacesCount);
  let chars = str.repeat(charsCount);
  let row = spaces + chars;
  result += row + "\n";  
  }
  return result;
}


console.log(pyramid("o", 4, false));
console.log(pyramid("p", 5, true));