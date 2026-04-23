/**
 * EASY CHALLENGE: Wallet Account Validator
 * 
 * SCENARIO:
 * In blockchain systems, wallet accounts must be validated before transactions.
 * You need to validate incoming wallet objects, check for duplicates,
 * and initialize wallets correctly before allowing transfers.
 * 
 * PROBLEM:
 * Create a function that:
 * 1. Validates that a wallet object has all required properties
 * 2. Prevents duplicate wallets (by wallet address)
 * 3. Initializes the wallet list if needed
 * 4. Returns a success/error message
 * 
 * CONSTRAINTS:
 * - Wallet address is case-insensitive ("0xABC" = "0xabc")
 * - Balance must be a number ≥ 0
 * - Owner name must not be empty
 * - All three properties required: address, balance, owner
 * - Use loops (no .find() or .some())
 */

// ============================================
// YOUR CHALLENGE STARTS HERE
// ============================================

// TODO: Write your function here

function validateAndAddWallet(walletList, walletObj) {
  
  const requiredProps = ["address", "balance", "owner"];
  const missing = [];
  for (let prop of requiredProps) {
    if (walletObj[prop] === undefined) {
      missing.push(prop);
    }
  }
  if (missing.length > 0) {
    return { 
      success: false, 
      message: "Error: Missing required property: " + missing.join(", "),
      walletList: walletList
    };
  }
  
  if (typeof walletObj.balance !== "number" || walletObj.balance < 0) {
    return { 
      success: false, 
      message: "Error: Balance must be a non-negative number.",
      walletList: walletList
    };
  }

  if (typeof walletObj.owner !== "string" || walletObj.owner.trim() === "") {
    return { 
      success: false, 
      message: "Error: Owner name must be filled.",
      walletList: walletList
    };
  }

  for (let i = 0; i < walletList.length; i++) {
    let existingAddr = walletList[i].address.toLowerCase();
    let newAddr = walletObj.address.toLowerCase();
    if (existingAddr === newAddr) {
      return { 
        success: false, 
        message: "Error: Wallet " + newAddr + " already exists",
        walletList: walletList
      };
    }
  }

  const newWallet = {
    address: walletObj.address.toLowerCase(),
    balance: walletObj.balance,
    owner: walletObj.owner
  };

  walletList.push(newWallet);
  return { 
    success: true, 
    message: "Wallet " + newWallet.address + " added successfully.",
    walletList: walletList
  };
}

let wallets = [];

// Test 1: Valid wallet
console.log(validateAndAddWallet(wallets, { 
  address: "0xA1B2C3D4", 
  balance: 100, 
  owner: "Alice" 
}));
// Expected: success: true

// Test 2: Duplicate (case-insensitive)
console.log(validateAndAddWallet(wallets, { 
  address: "0xa1b2c3d4",  // Same as above, different case
  balance: 50, 
  owner: "Bob" 
}));
// Expected: success: false (duplicate detected!)

// Test 3: Negative balance
console.log(validateAndAddWallet(wallets, { 
  address: "0xE5F6G7H8", 
  balance: -50, 
  owner: "Charlie" 
}));
// Expected: success: false

// Test 4: Missing owner
console.log(validateAndAddWallet(wallets, { 
  address: "0xI9J0K1L2", 
  balance: 200 
}));
// Expected: success: false

// Test 5: Valid second wallet
console.log(validateAndAddWallet(wallets, { 
  address: "0xM3N4O5P6", 
  balance: 250, 
  owner: "Diana" 
}));
// Expected: success: true

console.log("Final wallet list:", wallets);