class TransactionClassifier {
    constructor() {
        this.mevBots = new Set();
        this.walletTxMap = new Map();
        this.allTransactions = [];
    }
    addMEVBot(address) {
        this.mevBots.add(address);
    }

    addTransaction(tx) {
        this.allTransactions.push(tx);
    }

    classify() {
        this.walletTxMap.clear();
        const classifiedArray = this.allTransactions.map(tx => {
            let classification = "";
            let riskScore = 0;

            if (this.mevBots.has(tx.from) || this.mevBots.has(tx.to)) {
                classification = "MEV_BOT";
                riskScore = 90;
            } else if (tx.gasPrice > 100) {
                classification = "HIGH_GAS";
                riskScore = 70;
            } else if (tx.amount > 100000) {
                classification = "WHALE";
                riskScore = 50;
            } else {
                classification = "NORMAL";
                riskScore = 10;
            }

            const classifiedTx = {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                amount: tx.amount,
                token: tx.token,
                classification: classification,
                riskScore: riskScore
            };

            if (!this.walletTxMap.has(tx.from)) {
                this.walletTxMap.set(tx.from, []);
            }
            this.walletTxMap.get(tx.from).push(classifiedTx);

            if (!this.walletTxMap.has(tx.to)) {
                this.walletTxMap.set(tx.to, []);
            }
            this.walletTxMap.get(tx.to).push(classifiedTx);

            return classifiedTx;
        });

        this.classifiedArray = classifiedArray;
        return classifiedArray;
    }

    getReport() {
        const totalTransactions = this.classifiedArray.length;

        const byClassification = this.classifiedArray.reduce((acc, tx) => {
            acc[tx.classification] = (acc[tx.classification] || 0) + 1;
            return acc;
        }, {});

        const highRiskWallets = [];
        for (const [wallet, txs] of this.walletTxMap.entries()) {
            const totalRisk = txs.reduce((sum, tx) => sum + tx.riskScore, 0);
            const avgRisk = totalRisk / txs.length;
            if (avgRisk > 50) {
                highRiskWallets.push({ wallet, avgRisk });
            }
        }
        highRiskWallets.sort((a, b) => b.avgRisk - a.avgRisk);

        const totalVolume = this.classifiedArray.reduce((sum, tx) => sum + tx.amount, 0);

        return {
            totalTransactions,
            byClassification,
            highRiskWallets,
            totalVolume
        };
    }
}

// -------------------------------------------------------
// Test data and execution
// -------------------------------------------------------
const classifier = new TransactionClassifier();

classifier.addMEVBot("0xMEV1");
classifier.addMEVBot("0xMEV2");

const txData = [
    { hash: "0xa1", from: "0xAlice", to: "0xBob",   amount: 500,    token: "USDC", gasPrice: 25,  timestamp: 1714000001 },
    { hash: "0xa2", from: "0xMEV1",  to: "0xAlice", amount: 1000,   token: "ETH",  gasPrice: 150, timestamp: 1714000002 },
    { hash: "0xa3", from: "0xBob",   to: "0xCarol", amount: 200000, token: "USDC", gasPrice: 30,  timestamp: 1714000003 },
    { hash: "0xa4", from: "0xCarol", to: "0xMEV2",  amount: 800,    token: "DAI",  gasPrice: 20,  timestamp: 1714000004 },
    { hash: "0xa5", from: "0xAlice", to: "0xDiana", amount: 300,    token: "USDC", gasPrice: 120, timestamp: 1714000005 },
    { hash: "0xa6", from: "0xDiana", to: "0xBob",   amount: 50,     token: "ETH",  gasPrice: 18,  timestamp: 1714000006 },
    { hash: "0xa7", from: "0xBob",   to: "0xAlice", amount: 150000, token: "USDC", gasPrice: 22,  timestamp: 1714000007 },
];

txData.forEach(tx => classifier.addTransaction(tx));

console.log("Classified:");
console.log(classifier.classify());

console.log("\nReport:");
console.log(classifier.getReport());