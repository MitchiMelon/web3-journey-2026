function maskAddress(address: string, visibleChars: number = 4): string {
  if (address.length < 2 * visibleChars) {
    return address;
  }

  const start = address.slice(0, visibleChars);
  const end = address.slice(-visibleChars);
  return `${start}...${end}`;
}

console.log(maskAddress("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12", 4));
console.log(maskAddress("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12"));
console.log(maskAddress("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12", 6));
console.log(maskAddress("0xAbCdEf1234567890AbCdEf1234567890AbCdEf12", 10));
console.log(maskAddress("0xA", 10));
