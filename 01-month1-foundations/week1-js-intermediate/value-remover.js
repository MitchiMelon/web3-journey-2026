function destroyer(targetArray, ...valuesToRemove) {
  return targetArray.filter(element => !valuesToRemove.includes(element))
}


console.log(destroyer([1, 2, 3, 1, 2, 3], 2, 3))
console.log(destroyer( ["possum", "trollo", 12, "safari", "hotdog", 92, 65, "grandma", "bugati", "trojan", "yacht"], "yacht", "possum", "trollo", "safari", "hotdog", "grandma", "bugati", "trojan" ))
