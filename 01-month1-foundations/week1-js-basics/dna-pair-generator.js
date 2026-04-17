function pairElement(str) {
  let result = [];
    for (let i = 0; i < str.length ; i++) {
      if (str[i] === "A") result.push(["A","T"]);
      else if (str[i] === "T") result.push(["T","A"]);
      else if (str[i] === "C") result.push(["C","G"]);
      else if (str[i] === "G") result.push(["G","C"]);
    }
  return result;
}


console.log(pairElement("ATCGA"))
