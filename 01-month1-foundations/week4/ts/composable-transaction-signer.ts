interface UnsignedTransaction {
    from: string;
    to: string; 
    value: number; 
    gasLimit: number;
}

interface SignedTransaction extends UnsignedTransaction {
    signature: string;
}

function broadcastTransaction(tx: UnsignedTransaction | SignedTransaction): string {
    if ("signature" in tx) {
        return `Broadcasting signed tx from ${tx.from} to ${tx.to}`;
    } else {
        return `Cannot broadcast: transaction requires a signature.`
    }
}

const signed: SignedTransaction = {
  from: "0xAlice",
  to: "0xBob",
  value: 1,
  gasLimit: 21000,
  signature: "0xabc"
};

const unsigned: UnsignedTransaction = {
  from: "0xAlice",
  to: "0xBob",
  value: 1,
  gasLimit: 21000
};


console.log(broadcastTransaction(signed));   
console.log(broadcastTransaction(unsigned));
