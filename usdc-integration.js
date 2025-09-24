/**
 * USDC Integration for GM Check-in App
 * Handles USDC rewards on Base network
 */

// USDC Contract on Base Mainnet
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC Contract ABI (minimal for transfers)
const USDC_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    }
];

class USDCIntegration {
    constructor(web3Provider) {
        this.web3 = web3Provider;
        this.contract = null;
        this.decimals = 6; // USDC has 6 decimals
        this.init();
    }

    async init() {
        try {
            if (this.web3) {
                this.contract = new this.web3.eth.Contract(USDC_ABI, USDC_CONTRACT_ADDRESS);
                console.log('USDC contract initialized');
            }
        } catch (error) {
            console.error('Error initializing USDC contract:', error);
        }
    }

    /**
     * Get USDC balance for an address
     */
    async getBalance(address) {
        try {
            if (!this.contract) return 0;
            
            const balance = await this.contract.methods.balanceOf(address).call();
            return this.fromWei(balance);
        } catch (error) {
            console.error('Error getting USDC balance:', error);
            return 0;
        }
    }

    /**
     * Convert USDC amount from wei to human readable
     */
    fromWei(amount) {
        return parseFloat(amount) / Math.pow(10, this.decimals);
    }

    /**
     * Convert USDC amount to wei
     */
    toWei(amount) {
        return Math.floor(parseFloat(amount) * Math.pow(10, this.decimals));
    }

    /**
     * Format USDC amount for display
     */
    formatAmount(amount) {
        return `${parseFloat(amount).toFixed(2)} USDC`;
    }

    /**
     * Calculate total USDC earned based on check-ins
     */
    calculateTotalEarned(totalCheckIns, milestoneCount) {
        const baseReward = totalCheckIns * 0.01; // 0.01 USDC per check-in
        const milestoneReward = milestoneCount * 0.01; // 0.01 USDC per milestone
        return baseReward + milestoneReward;
    }

    /**
     * Get milestone count for a given streak
     */
    getMilestoneCount(currentStreak, checkInHistory) {
        const milestones = [3, 7, 15, 30, 100, 365];
        let count = 0;
        
        // Count how many milestones have been achieved
        milestones.forEach(milestone => {
            if (currentStreak >= milestone) {
                count++;
            }
        });
        
        return count;
    }

    /**
     * Simulate USDC reward distribution (for demo purposes)
     * In production, this would interact with a smart contract
     */
    async distributeReward(userAddress, amount) {
        try {
            console.log(`Simulating USDC reward distribution:`);
            console.log(`To: ${userAddress}`);
            console.log(`Amount: ${this.formatAmount(amount)}`);
            
            // In production, this would:
            // 1. Call a smart contract function
            // 2. Transfer USDC from treasury to user
            // 3. Record transaction on blockchain
            
            return {
                success: true,
                txHash: '0x' + Math.random().toString(16).substr(2, 64),
                amount: amount,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error distributing USDC reward:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get USDC price in USD (for display purposes)
     */
    async getUSDCPrice() {
        try {
            // USDC is pegged to USD, so price is always ~1.00
            return 1.00;
        } catch (error) {
            console.error('Error getting USDC price:', error);
            return 1.00;
        }
    }

    /**
     * Validate USDC address format
     */
    isValidAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    /**
     * Get transaction details
     */
    async getTransactionDetails(txHash) {
        try {
            if (!this.web3) return null;
            
            const tx = await this.web3.eth.getTransaction(txHash);
            const receipt = await this.web3.eth.getTransactionReceipt(txHash);
            
            return {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: this.fromWei(tx.value),
                gasUsed: receipt.gasUsed,
                status: receipt.status,
                blockNumber: receipt.blockNumber
            };
        } catch (error) {
            console.error('Error getting transaction details:', error);
            return null;
        }
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = USDCIntegration;
} else if (typeof window !== 'undefined') {
    window.USDCIntegration = USDCIntegration;
}