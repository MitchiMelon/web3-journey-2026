function generatePassword(passLength) {
  let password = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  for (let i = 0; i < passLength; i++) {
    let randomIndex = Math.floor(Math.random() * chars.length);
    let randomChar = chars[randomIndex];;
    password += randomChar;
  }
  return password;
}


const password = generatePassword(33);
console.log(`Generated password: ${password}`);
