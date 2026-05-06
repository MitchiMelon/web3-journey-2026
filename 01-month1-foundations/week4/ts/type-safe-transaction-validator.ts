function validateTransaction(tx: { from: string; to: string; amount: number }): boolean {
  if (typeof tx.from !== 'string' || tx.from === undefined || tx.from === '') {
    return false;
  } else if (typeof tx.to !== 'string' || tx.to === undefined || tx.to === '') {
    return false;
  } else if (typeof tx.amount !== 'number' || tx.amount === undefined || tx.amount <= 0) {
    return false;
  } else {
    return true;
  }
}

console.log('Test 1 – valid transaction:');
console.log(validateTransaction({ from: '0xAlice', to: '0xBob', amount: 500 }));

console.log('\nTest 2 – empty from:');
console.log(validateTransaction({ from: '', to: '0xBob', amount: 500 }));

console.log('\nTest 3 – from is not a string (number):');
console.log(validateTransaction({ from: 123, to: '0xBob', amount: 500 }));

console.log('\nTest 4 – amount is negative:');
console.log(validateTransaction({ from: '0xAlice', to: '0xBob', amount: -50 }));

console.log('\nTest 5 – amount is zero:');
console.log(validateTransaction({ from: '0xAlice', to: '0xBob', amount: 0 }));

console.log('\nTest 6 – to is undefined (missing property):');
console.log(validateTransaction({ from: '0xAlice', amount: 500 }));
