async function checkWalletSecurity(walletAddress) {
    try {
        const response = await fetch(`https://api.web3security.com/check/${walletAddress}`);
        const data = await response.json();  // fixed
        if (data.malicious === true) {
            console.log("ALERT: Wallet is compromised!");
        } else {
            console.log("Wallet is safe.");
        }
    } catch (error) {
        console.log("Error connecting to security node:", error);
    }
}

checkWalletSecurity("0x123");