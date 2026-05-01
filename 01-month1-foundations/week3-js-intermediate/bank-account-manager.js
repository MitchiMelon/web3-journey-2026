class BankAccount {
  constructor() {
    this.balance = 0;
    this.transactions = [];
  }


  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      this.transactions.push({
        type: "deposit",
        amount: amount 
      })
      return `Successfully deposited $${amount}. New balance: $${this.balance}`;
    } else {
      return `Deposit amount must be greater than zero.`;
    }
  }


  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      this.transactions.push({
        type: "withdraw",
        amount: amount 
      })
      return `Successfully withdrew $${amount}. New balance: $${this.balance}`;
    } else {
      return `Insufficient balance or invalid amount.`;
    }
  }


  checkBalance() {
    return `Current balance: $${this.balance}`
  }


  listAllDeposits() {
    return "Deposits: " + this.transactions
      .filter(tx => tx.type === "deposit")
      .map(tx => tx.amount)
      .join(",");
  }


  listAllWithdrawals() {
    return "Withdrawals: " + this.transactions
      .filter(tx => tx.type === "withdraw")
      .map(tx => tx.amount)
      .join(",");
  }
}


const myAccount = new BankAccount();


myAccount.deposit(200);
myAccount.deposit(1993);
myAccount.withdraw(99);
myAccount.deposit(55);
myAccount.withdraw(138);


console.log(myAccount.deposit(100));
console.log(myAccount.deposit(0));
console.log(myAccount.deposit(-50));
console.log(myAccount.withdraw(50));
console.log(myAccount.withdraw(200));
console.log(myAccount.withdraw(0));
console.log(myAccount.withdraw(-30));
console.log(myAccount.checkBalance());
console.log(myAccount.listAllDeposits());
console.log(myAccount.listAllWithdrawals());