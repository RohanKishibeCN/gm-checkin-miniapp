/**
 * Web3 Integration for GM Check-in App on Base Mainnet
 */

import { BASE_MAINNET_CONFIG, CONTRACT_CONFIG, TOKEN_CONFIG, GAS_CONFIG } from './web3-config.js';

class Web3Integration {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.contract = null;
        this.tokenContract = null;
        this.isConnected = false;
        this.chainId = null;
        
        this.init();
    }

    /**
     * Initialize Web3 integration
     */
    async init() {
        try {
            // Check if Web3 is available
            if (typeof window.ethereum !== 'undefined') {
                console.log('Web3 wallet detected');
                
                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.handleAccountsChanged(accounts);
                });

                // Listen for chain changes
                window.ethereum.on('chainChanged', (chainId) => {
                    this.handleChainChanged(chainId);
                });

                // Listen for disconnect
                window.ethereum.on('disconnect', () => {
                    this.handleDisconnect();
                });

                // Auto-connect if previously connected
                await this.autoConnect();
            } else {
                console.log('No Web3 wallet detected');
                this.showInstallWalletPrompt();
            }
        } catch (error) {
            console.error('Error initializing Web3:', error);
        }
    }

    /**
     * Connect to wallet
     */
    async connectWallet() {
        try {
            if (!window.ethereum) {
                throw new Error('No Web3 wallet found');
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            this.account = accounts[0];
            this.chainId = await window.ethereum.request({ method: 'eth_chainId' });

            // Check if on Base network
            if (this.chainId !== BASE_MAINNET_CONFIG.chainId) {
                await this.switchToBase();
            }

            // Initialize contracts
            await this.initializeContracts();

            this.isConnected = true;
            
            // Save connection state
            localStorage.setItem('web3Connected', 'true');
            localStorage.setItem('web3Account', this.account);

            console.log('Wallet connected:', this.account);
            return { success: true, account: this.account };

        } catch (error) {
            console.error('Error connecting wallet:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Auto-connect if previously connected
     */
    async autoConnect() {
        try {
            const wasConnected = localStorage.getItem('web3Connected');
            if (!wasConnected) return;

            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (accounts.length > 0) {
                this.account = accounts[0];
                this.chainId = await window.ethereum.request({ method: 'eth_chainId' });
                
                if (this.chainId === BASE_MAINNET_CONFIG.chainId) {
                    await this.initializeContracts();
                    this.isConnected = true;
                    console.log('Auto-connected to wallet:', this.account);
                }
            }
        } catch (error) {
            console.error('Error auto-connecting:', error);
        }
    }

    /**
     * Switch to Base network
     */
    async switchToBase() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BASE_MAINNET_CONFIG.chainId }]
            });
        } catch (switchError) {
            // If Base is not added to wallet, add it
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [BASE_MAINNET_CONFIG]
                });
            } else {
                throw switchError;
            }
        }
    }

    /**
     * Initialize smart contracts
     */
    async initializeContracts() {
        try {
            // Initialize Web3 instance
            this.web3 = new Web3(window.ethereum);

            // Initialize GM Check-in contract
            if (CONTRACT_CONFIG.GM_CHECKIN_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                this.contract = new this.web3.eth.Contract(
                    CONTRACT_CONFIG.GM_CHECKIN_ABI,
                    CONTRACT_CONFIG.GM_CHECKIN_ADDRESS
                );
            }

            // Initialize token contract
            if (TOKEN_CONFIG.GM_TOKEN_ADDRESS !== '0x0000000000000000000000000000000000000000') {
                this.tokenContract = new this.web3.eth.Contract(
                    TOKEN_CONFIG.GM_TOKEN_ABI,
                    TOKEN_CONFIG.GM_TOKEN_ADDRESS
                );
            }

            console.log('Contracts initialized');
        } catch (error) {
            console.error('Error initializing contracts:', error);
        }
    }

    /**
     * Perform on-chain check-in
     */
    async performCheckIn() {
        try {
            if (!this.isConnected || !this.contract) {
                throw new Error('Wallet not connected or contract not initialized');
            }

            // Check if user can check in today
            const canCheckIn = await this.contract.methods.canCheckInToday(this.account).call();
            if (!canCheckIn) {
                throw new Error('Already checked in today');
            }

            // Estimate gas
            const gasEstimate = await this.contract.methods.checkIn().estimateGas({
                from: this.account
            });

            // Get current gas price
            const gasPrice = await this.web3.eth.getGasPrice();
            const adjustedGasPrice = Math.floor(gasPrice * GAS_CONFIG.GAS_PRICE_MULTIPLIER);

            // Send transaction
            const transaction = await this.contract.methods.checkIn().send({
                from: this.account,
                gas: Math.min(gasEstimate * 1.2, GAS_CONFIG.CHECK_IN_GAS_LIMIT),
                gasPrice: adjustedGasPrice
            });

            console.log('Check-in transaction:', transaction.transactionHash);
            return {
                success: true,
                txHash: transaction.transactionHash,
                blockNumber: transaction.blockNumber
            };

        } catch (error) {
            console.error('Error performing on-chain check-in:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get user stats from blockchain
     */
    async getUserStats() {
        try {
            if (!this.isConnected || !this.contract) {
                return null;
            }

            const stats = await this.contract.methods.getUserStats(this.account).call();
            
            return {
                currentStreak: parseInt(stats.currentStreak),
                totalCheckIns: parseInt(stats.totalCheckIns),
                tokens: parseInt(stats.tokens),
                lastCheckIn: parseInt(stats.lastCheckIn)
            };

        } catch (error) {
            console.error('Error getting user stats:', error);
            return null;
        }
    }

    /**
     * Get token balance
     */
    async getTokenBalance() {
        try {
            if (!this.isConnected || !this.tokenContract) {
                return 0;
            }

            const balance = await this.tokenContract.methods.balanceOf(this.account).call();
            const decimals = await this.tokenContract.methods.decimals().call();
            
            return parseFloat(balance) / Math.pow(10, decimals);

        } catch (error) {
            console.error('Error getting token balance:', error);
            return 0;
        }
    }

    /**
     * Get ETH balance
     */
    async getETHBalance() {
        try {
            if (!this.isConnected) {
                return 0;
            }

            const balance = await this.web3.eth.getBalance(this.account);
            return this.web3.utils.fromWei(balance, 'ether');

        } catch (error) {
            console.error('Error getting ETH balance:', error);
            return 0;
        }
    }

    /**
     * Listen for contract events
     */
    listenForEvents(callback) {
        if (!this.contract) return;

        // Listen for CheckIn events
        this.contract.events.CheckIn({
            filter: { user: this.account }
        })
        .on('data', (event) => {
            console.log('CheckIn event:', event);
            callback('checkin', event.returnValues);
        })
        .on('error', console.error);

        // Listen for MilestoneReached events
        this.contract.events.MilestoneReached({
            filter: { user: this.account }
        })
        .on('data', (event) => {
            console.log('MilestoneReached event:', event);
            callback('milestone', event.returnValues);
        })
        .on('error', console.error);
    }

    /**
     * Disconnect wallet
     */
    async disconnectWallet() {
        try {
            this.account = null;
            this.isConnected = false;
            this.contract = null;
            this.tokenContract = null;
            
            // Clear stored connection state
            localStorage.removeItem('web3Connected');
            localStorage.removeItem('web3Account');

            console.log('Wallet disconnected');
            return { success: true };

        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Handle account changes
     */
    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.handleDisconnect();
        } else if (accounts[0] !== this.account) {
            this.account = accounts[0];
            console.log('Account changed to:', this.account);
            
            // Reinitialize contracts with new account
            this.initializeContracts();
            
            // Notify app of account change
            window.dispatchEvent(new CustomEvent('web3AccountChanged', {
                detail: { account: this.account }
            }));
        }
    }

    /**
     * Handle chain changes
     */
    handleChainChanged(chainId) {
        this.chainId = chainId;
        console.log('Chain changed to:', chainId);
        
        if (chainId !== BASE_MAINNET_CONFIG.chainId) {
            console.warn('Not on Base network');
            // Optionally prompt user to switch back to Base
        }
        
        // Notify app of chain change
        window.dispatchEvent(new CustomEvent('web3ChainChanged', {
            detail: { chainId }
        }));
    }

    /**
     * Handle disconnect
     */
    handleDisconnect() {
        console.log('Wallet disconnected');
        this.disconnectWallet();
        
        // Notify app of disconnect
        window.dispatchEvent(new CustomEvent('web3Disconnected'));
    }

    /**
     * Show install wallet prompt
     */
    showInstallWalletPrompt() {
        const installPrompt = document.createElement('div');
        installPrompt.className = 'wallet-install-prompt';
        installPrompt.innerHTML = `
            <div class="prompt-content">
                <h3>Web3 Wallet Required</h3>
                <p>To use blockchain features, please install a Web3 wallet:</p>
                <div class="wallet-options">
                    <a href="https://metamask.io/" target="_blank" class="wallet-link">
                        <img src="https://metamask.io/images/metamask-logo.png" alt="MetaMask" width="24">
                        MetaMask
                    </a>
                    <a href="https://www.coinbase.com/wallet" target="_blank" class="wallet-link">
                        <img src="https://wallet.coinbase.com/assets/images/favicon.ico" alt="Coinbase Wallet" width="24">
                        Coinbase Wallet
                    </a>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Continue without wallet</button>
            </div>
        `;
        
        document.body.appendChild(installPrompt);
    }

    /**
     * Format address for display
     */
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    /**
     * Get transaction URL
     */
    getTxUrl(txHash) {
        return `${BASE_MAINNET_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`;
    }

    /**
     * Get address URL
     */
    getAddressUrl(address) {
        return `${BASE_MAINNET_CONFIG.blockExplorerUrls[0]}/address/${address}`;
    }
}

// Export singleton instance
export default new Web3Integration();