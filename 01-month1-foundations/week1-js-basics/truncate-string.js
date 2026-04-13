function truncateString(str, limit) {
  if (str.length > limit) {
    return str.slice(0, limit) + "...";
  } else {
    return str;
  }
}


console.log(truncateString("A-tisket a-tasket A green and yellow basket", 8))
console.log(truncateString("A-tisket a-tasket A green and yellow basket", "A-tisket a-tasket A green and yellow basket".length))
