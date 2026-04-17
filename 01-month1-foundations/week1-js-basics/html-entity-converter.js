function convertHTML(str) {
  let entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  }
  let converted = "";
  for (let i = 0; i < str.length; i++) {
    converted += entities[str[i]] || str[i];
  }
  return converted;
}


console.log(convertHTML("Dolce & Gabbana"))
console.log("&amp;");