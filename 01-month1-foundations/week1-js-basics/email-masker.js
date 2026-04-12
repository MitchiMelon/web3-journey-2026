function maskEmail(email) {
 let atIndex = email.indexOf("@");
 let localName = email.slice(0, atIndex);
 let domain = email.slice(atIndex + 1); 
 let firstChar = localName[0];
 let lastChar = localName[localName.length - 1];
 let charToMask = localName.length - 2;
 let maskedChar = firstChar + "*".repeat(charToMask) + lastChar;
 return maskedChar + "@" + domain;
}


let email = "apple.pie@example.com";
console.log(maskEmail(email));
email = "user@domain.org";
console.log(maskEmail(email));