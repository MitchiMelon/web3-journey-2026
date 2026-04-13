function confirmEnding(str, char) {
  return str.slice(-char.length) === char;
}

console.log(confirmEnding("Bastian", "n"));
console.log(confirmEnding("He has to give me a new name", "name"))
console.log(confirmEnding("Open sesame", "game"));
