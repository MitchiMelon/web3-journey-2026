function isValidRPCEndpoint(url: string): boolean {
  if (url === "") return false;

  const hasValidProtocol =
    url.startsWith("https://") || url.startsWith("wss://");
  if (!hasValidProtocol) return false;

  if (url.includes(" ")) return false;

  const protocolEnd = url.indexOf("://") + 3;
  const afterProtocol = url.slice(protocolEnd);
  if (!afterProtocol.includes(".")) return false;

  return true;
}

// Tests
console.log(isValidRPCEndpoint("https://eth-mainnet.g.alchemy.com/v2/key")); // true
console.log(isValidRPCEndpoint("http://insecure-rpc.com")); // false
console.log(isValidRPCEndpoint("not a url")); // false
console.log(isValidRPCEndpoint("")); // false
console.log(isValidRPCEndpoint("wss://localhost")); // false (no dot after protocol)
