function titleCase(str) {
  let result = [];
  let strLowerCase = str.toLowerCase()
  let words = strLowerCase.split(" ");
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let capitalizedWord = word[0].toUpperCase() + word.slice(1);
    result.push(capitalizedWord);
    }
  return result.join(" ");
}


console.log(titleCase("I'm a little tea pot"))
console.log(titleCase("sHoRt AnD sToUt"))