type ValidatorFn = (address: string) => { valid: boolean; message: string };

const addressValidators: ValidatorFn[] = [
  (address) => ({
    valid: address.startsWith("0x"),
    message: address.startsWith("0x")
      ? "starts with 0x"
      : "address must start with 0x",
  }),
  (address) => ({
    valid: address.length === 42,
    message:
      address.length === 42
        ? "correct length (42)"
        : "address length must be 42 characters",
  }),
  (address) => ({
    valid: /^[0-9A-Fa-f]+$/.test(address.slice(2)),
    message: /^[0-9A-Fa-f]+$/.test(address.slice(2))
      ? "hex characters after 0x"
      : "address must contain only hex characters after 0x",
  }),
  (address) => ({
    valid: !address
      .slice(2)
      .split("")
      .every((char) => char === "0"),
    message: !address
      .slice(2)
      .split("")
      .every((char) => char === "0")
      ? "not all zeros after 0x"
      : "address can't be all zeros after 0x",
  }),
  (address) => {
    const hexPart = address.slice(2);
    const isAllUpper = /^[0-9A-F]+$/.test(hexPart);
    const isAllLower = /^[0-9a-f]+$/.test(hexPart);
    const valid = isAllUpper || isAllLower;
    return {
      valid,
      message: valid
        ? "not mixed case"
        : "address must be all uppercase or all lowercase after 0x",
    };
  },
];

function runValidators(
  address: string,
  validators: ValidatorFn[],
): {
  address: string;
  passed: boolean;
  result: Array<{ valid: boolean; message: string }>;
  failCount: number;
} {
  const results = validators.map((v) => v(address));
  const passed = results.every((r) => r.valid);
  const failCount = results.filter((r) => !r.valid).length;

  return {
    address,
    passed: passed,
    result: results,
    failCount: failCount,
  };
}

const validAddress = "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12";
const allZeros = "0x0000000000000000000000000000000000000000";
const tooShort = "0x123";
const noHex = "0xGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF12";

console.log(runValidators(validAddress, addressValidators));
// passed: true, failCount: 0

console.log(runValidators(allZeros, addressValidators));
// passed: false, failCount: 1 (all‑zeros validator fails)

console.log(runValidators(tooShort, addressValidators));
// passed: false, failCount: at least 1 (length)

console.log(runValidators(noHex, addressValidators));
// passed: false, failCount: at least 1 (hex)
