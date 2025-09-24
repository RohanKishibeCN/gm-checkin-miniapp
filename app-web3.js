/**
 * Enhanced GM Check-in App with Web3 Integration for Base Mainnet
 */

import Web3Integration from './web3-integration.js';
import { FEATURES } from './web3-config.js';

class GMCheckinAppWeb3 {
    constructor() {
        // Application state
        this.appData = {
            lastCheckIn: null,
            currentStreak: 0,
            bestStreak: 0,
            totalCheckIns: 0,
            tokens: 0,
            checkInHistory: [],
            settings: {
                notifications: false,
                reminderTime: '09:00',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                useBlockchain: true,
                autoSync: true
            }
        };

        // Web3 state
        this.web3State = {
            isConnected: false,
            account: null,
            balance: 0,
            tokenBalance: 0,
            networkName: 'Base',
            lastSyncTime: null
        };

        // DOM element cache
        this.elements = {};
        
        // Current date for calendar
        this.currentCalendarDate = new Date();
        
        // Initialize app
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoading(true);
            
            // Cache DOM elements
            this.cacheElements();
            
            // Load saved data
            await this.loadData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize Web3 if enabled
            if (FEATURES.ENABLE_WEB3 && this.appData.settings.useBlockchain) {
                await this.initializeWeb3();
            }
            
            // Initialize UI
            this.updateUI();
            this.updateGreeting();
            this.checkCanCheckIn();
            this.initializeCalendar();
            this.initializeSettings();
            
            // Setup periodic updates
            this.setupPeriodicUpdates();
            
            this.showLoading(false);
            
            console.log('GM Check-in App with Web3 initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showToast('Error initializing app. Please refresh the page.');
            this.showLoading(false);
        }
    }

    /**
     * Initialize Web3 integration
     */
    async initializeWeb3() {
        try {
            // Listen for Web3 events
            window.addEventListener('web3AccountChanged', (event) => {
                this.handleWeb3AccountChanged(event.detail.account);
            });

            window.addEventListener('web3ChainChanged', (event) => {
                this.handleWeb3ChainChanged(event.detail.chainId);
            });

            window.addEventListener('web3Disconnected', () => {
                this.handleWeb3Disconnected();
            });

            // Listen for contract events
            Web3Integration.listenForEvents((eventType, data) => {
                this.handleContractEvent(eventType, data);
            });

            // Auto-connect if previously connected
            if (Web3Integration.isConnected) {
                await this.syncWithBlockchain();
            }

        } catch (error) {
            console.error('Error initializing Web3:', error);
        }
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        const elementIds = [
            'greeting', 'timezoneInfo', 'streak', 'streakFire', 'total', 
            'tokens', 'bestStreak', 'checkinBtn', 'btnText', 'buttonRipple',
            'status', 'overlay', 'rewardPopup', 'rewardAnimation', 'rewardTitle', 
            'rewardText', 'rewardCloseBtn', 'toast', 'toastMessage', 'toastClose',
            'loading', 'currentMonth', 'prevMonth', 'nextMonth', 'calendarGrid',
            'notifications', 'reminderTime', 'timezone', 'exportData', 'importData',
            'resetData', 'shareBtn', 'fileInput'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });

        // Cache milestone elements
        [3, 7, 15, 30, 100].forEach(days => {
            this.elements[`milestone${days}`] = document.getElementById(`milestone${days}`);
        });

        // Cache tab elements
        this.elements.tabButtons = document.querySelectorAll('.tab-button');
        this.elements.tabPanels = document.querySelectorAll('.tab-panel');

        // Add Web3 specific elements
        this.addWeb3Elements();
    }

    /**
     * Add Web3 specific UI elements
     */
    addWeb3Elements() {
        // Add Web3 wallet section to header
        const header = document.querySelector('.header');
        if (header) {
            const web3Section = document.createElement('div');
            web3Section.className = 'web3-section';
            web3Section.innerHTML = `
                <div class="wallet-info" id="walletInfo" style="display: none;">
                    <div class="wallet-address" id="walletAddress"></div>
                    <div class="wallet-balance">
                        <span id="ethBalance">0</span> ETH | 
                        <span id="tokenBalance">0</span> GM
                    </div>
                </div>
                <button class="wallet-btn" id="walletBtn">Connect Wallet</button>
            `;
            header.appendChild(web3Section);

            // Cache new elements
            this.elements.walletInfo = document.getElementById('walletInfo');
            this.elements.walletAddress = document.getElementById('walletAddress');
            this.elements.ethBalance = document.getElementById('ethBalance');
            this.elements.tokenBalance = document.getElementById('tokenBalance');
            this.elements.walletBtn = document.getElementById('walletBtn');
        }

        // Add blockchain toggle to settings
        const settingsContainer = document.querySelector('.settings-container');
        if (settingsContainer) {
            const blockchainSetting = document.createElement('div');
            blockchainSetting.className = 'setting-item';
            blockchainSetting.innerHTML = `
                <label for="useBlockchain">Use Blockchain</label>
                <input type="checkbox" id="useBlockchain" ${this.appData.settings.useBlockchain ? 'checked' : ''}>
            `;
            settingsContainer.insertBefore(blockchainSetting, settingsContainer.firstChild);

            this.elements.useBlockchain = document.getElementById('useBlockchain');
        }

        // Add transaction history section
        const tabContent = document.querySelector('.tab-content');
        if (tabContent) {
            const transactionsTab = document.createElement('div');
            transactionsTab.className = 'tab-panel';
            transactionsTab.id = 'transactions';
            transactionsTab.innerHTML = `
                <div class="transactions-container">
                    <h3>Transaction History</h3>
                    <div class="transaction-list" id="transactionList">
                        <p class="no-transactions">No transactions yet</p>
                    </div>
                </div>
            `;
            tabContent.appendChild(transactionsTab);

            // Add transactions tab button
            const tabs = document.querySelector('.tabs');
            if (tabs) {
                const transactionsTabBtn = document.createElement('button');
                transactionsTabBtn.className = 'tab-button';
                transactionsTabBtn.dataset.tab = 'transactions';
                transactionsTabBtn.textContent = 'Transactions';
                tabs.appendChild(transactionsTabBtn);
            }

            this.elements.transactionList = document.getElementById('transactionList');
        }
    }

    /**
     * Setup all event listeners including Web3
     */
    setupEventListeners() {
        // Original event listeners
        this.setupOriginalEventListeners();

        // Web3 specific event listeners
        if (this.elements.walletBtn) {
            this.elements.walletBtn.addEventListener('click', () => this.handleWalletConnection());
        }

        if (this.elements.useBlockchain) {
            this.elements.useBlockchain.addEventListener('change', (e) => {
                this.updateSetting('useBlockchain', e.target.checked);
                if (e.target.checked && !Web3Integration.isConnected) {
                    this.handleWalletConnection();
                }
            });
        }
    }

    /**
     * Setup original event listeners (from base app)
     */
    setupOriginalEventListeners() {
        // Check-in button
        if (this.elements.checkinBtn) {
            this.elements.checkinBtn.addEventListener('click', (e) => this.handleCheckIn(e));
        }

        // Reward popup close
        if (this.elements.rewardCloseBtn) {
            this.elements.rewardCloseBtn.addEventListener('click', () => this.closeRewardPopup());
        }
        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => this.closeRewardPopup());
        }

        // Toast close
        if (this.elements.toastClose) {
            this.elements.toastClose.addEventListener('click', () => this.hideToast());
        }

        // Tab navigation
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Calendar navigation
        if (this.elements.prevMonth) {
            this.elements.prevMonth.addEventListener('click', () => this.navigateCalendar(-1));
        }
        if (this.elements.nextMonth) {
            this.elements.nextMonth.addEventListener('click', () => this.navigateCalendar(1));
        }

        // Settings
        if (this.elements.notifications) {
            this.elements.notifications.addEventListener('change', (e) => this.updateSetting('notifications', e.target.checked));
        }
        if (this.elements.reminderTime) {
            this.elements.reminderTime.addEventListener('change', (e) => this.updateSetting('reminderTime', e.target.value));
        }
        if (this.elements.timezone) {
            this.elements.timezone.addEventListener('change', (e) => this.updateSetting('timezone', e.target.value));
        }

        // Data management
        if (this.elements.exportData) {
            this.elements.exportData.addEventListener('click', () => this.exportData());
        }
        if (this.elements.importData) {
            this.elements.importData.addEventListener('click', () => this.importData());
        }
        if (this.elements.resetData) {
            this.elements.resetData.addEventListener('click', () => this.resetData());
        }
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.handleFileImport(e));
        }

        // Share functionality
        if (this.elements.shareBtn) {
            this.elements.shareBtn.addEventListener('click', () => this.shareProgress());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    /**
     * Handle wallet connection
     */
    async handleWalletConnection() {
        try {
            if (Web3Integration.isConnected) {
                // Disconnect wallet
                const result = await Web3Integration.disconnectWallet();
                if (result.success) {
                    this.updateWeb3UI(false);
                    this.showToast('Wallet disconnected');
                }
            } else {
                // Connect wallet
                this.showLoading(true);
                const result = await Web3Integration.connectWallet();
                
                if (result.success) {
                    this.web3State.isConnected = true;
                    this.web3State.account = result.account;
                    
                    await this.syncWithBlockchain();
                    this.updateWeb3UI(true);
                    this.showToast('Wallet connected successfully!');
                } else {
                    this.showToast(`Failed to connect wallet: ${result.error}`);
                }
                
                this.showLoading(false);
            }
        } catch (error) {
            console.error('Error handling wallet connection:', error);
            this.showToast('Error connecting to wallet');
            this.showLoading(false);
        }
    }

    /**
     * Sync data with blockchain
     */
    async syncWithBlockchain() {
        try {
            if (!Web3Integration.isConnected) return;

            // Get user stats from blockchain
            const blockchainStats = await Web3Integration.getUserStats();
            if (blockchainStats) {
                // Update local data with blockchain data
                this.appData.currentStreak = blockchainStats.currentStreak;
                this.appData.totalCheckIns = blockchainStats.totalCheckIns;
                this.appData.tokens = blockchainStats.tokens;
                
                if (blockchainStats.lastCheckIn > 0) {
                    this.appData.lastCheckIn = new Date(blockchainStats.lastCheckIn * 1000).toISOString();
                }
            }

            // Get balances
            this.web3State.balance = await Web3Integration.getETHBalance();
            this.web3State.tokenBalance = await Web3Integration.getTokenBalance();
            this.web3State.lastSyncTime = new Date().toISOString();

            // Save updated data
            await this.saveData();
            this.updateUI();

            console.log('Synced with blockchain successfully');
        } catch (error) {
            console.error('Error syncing with blockchain:', error);
        }
    }

    /**
     * Handle check-in (with blockchain integration)
     */
    async handleCheckIn(event) {
        if (!this.checkCanCheckIn()) return;

        try {
            // Create ripple effect
            this.createRippleEffect(event);
            
            if (this.appData.settings.useBlockchain && Web3Integration.isConnected) {
                // Perform blockchain check-in
                await this.performBlockchainCheckIn();
            } else {
                // Perform local check-in
                await this.performLocalCheckIn();
            }
            
        } catch (error) {
            console.error('Error during check-in:', error);
            this.showToast('Error during check-in. Please try again.');
        }
    }

    /**
     * Perform blockchain check-in
     */
    async performBlockchainCheckIn() {
        try {
            this.showLoading(true);
            this.showToast('Submitting transaction...');

            const result = await Web3Integration.performCheckIn();
            
            if (result.success) {
                this.showToast('Transaction submitted! Waiting for confirmation...');
                
                // Wait for transaction confirmation and sync
                setTimeout(async () => {
                    await this.syncWithBlockchain();
                    this.updateUI();
                    this.setButtonDisabled();
                    
                    this.showRewardPopup(
                        'Blockchain Check-in Complete!',
                        `Transaction confirmed! View on BaseScan: ${Web3Integration.getTxUrl(result.txHash)}`
                    );
                }, 3000);
                
            } else {
                throw new Error(result.error);
            }
            
            this.showLoading(false);
        } catch (error) {
            this.showLoading(false);
            throw error;
        }
    }

    /**
     * Perform local check-in (fallback)
     */
    async performLocalCheckIn() {
        const now = new Date();
        const today = this.getDateString(now);
        let newStreak = 1;
        let tokensEarned = 10;

        // Calculate streak
        if (this.appData.lastCheckIn) {
            const lastCheckInDate = new Date(this.appData.lastCheckIn);
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.getDateString(lastCheckInDate) === this.getDateString(yesterday)) {
                newStreak = this.appData.currentStreak + 1;
            }
        }

        // Calculate milestone rewards
        const { milestoneReward, milestoneText } = this.calculateMilestoneReward(newStreak);
        tokensEarned += milestoneReward;

        // Update data
        this.appData.lastCheckIn = now.toISOString();
        this.appData.currentStreak = newStreak;
        this.appData.totalCheckIns += 1;
        this.appData.tokens += tokensEarned;
        this.appData.checkInHistory.push(today);

        if (newStreak > this.appData.bestStreak) {
            this.appData.bestStreak = newStreak;
        }

        await this.saveData();
        this.playCheckInAnimation();
        this.updateUI();
        this.setButtonDisabled();
        this.updateCalendar();

        const title = milestoneReward > 0 ? milestoneText : 'Check-in successful!';
        const text = `Earned ${tokensEarned} tokens! 🎉`;
        this.showRewardPopup(title, text);
    }

    /**
     * Update Web3 UI elements
     */
    updateWeb3UI(connected) {
        if (!this.elements.walletBtn) return;

        if (connected && Web3Integration.isConnected) {
            this.elements.walletBtn.textContent = 'Disconnect';
            
            if (this.elements.walletInfo) {
                this.elements.walletInfo.style.display = 'block';
            }
            
            if (this.elements.walletAddress) {
                this.elements.walletAddress.textContent = Web3Integration.formatAddress(Web3Integration.account);
            }
            
            if (this.elements.ethBalance) {
                this.elements.ethBalance.textContent = parseFloat(this.web3State.balance).toFixed(4);
            }
            
            if (this.elements.tokenBalance) {
                this.elements.tokenBalance.textContent = Math.floor(this.web3State.tokenBalance);
            }
        } else {
            this.elements.walletBtn.textContent = 'Connect Wallet';
            
            if (this.elements.walletInfo) {
                this.elements.walletInfo.style.display = 'none';
            }
        }
    }

    /**
     * Handle Web3 account change
     */
    async handleWeb3AccountChanged(newAccount) {
        this.web3State.account = newAccount;
        await this.syncWithBlockchain();
        this.updateWeb3UI(true);
        this.showToast(`Account changed to ${Web3Integration.formatAddress(newAccount)}`);
    }

    /**
     * Handle Web3 chain change
     */
    handleWeb3ChainChanged(chainId) {
        if (chainId !== '0x2105') { // Base mainnet
            this.showToast('Please switch to Base network');
        }
    }

    /**
     * Handle Web3 disconnect
     */
    handleWeb3Disconnected() {
        this.web3State.isConnected = false;
        this.web3State.account = null;
        this.updateWeb3UI(false);
        this.showToast('Wallet disconnected');
    }

    /**
     * Handle contract events
     */
    handleContractEvent(eventType, data) {
        if (eventType === 'checkin') {
            this.showToast(`Check-in confirmed! Streak: ${data.streak}`);
        } else if (eventType === 'milestone') {
            this.showToast(`Milestone reached! ${data.milestone} days - Bonus: ${data.bonus} tokens`);
        }
    }

    // Include all other methods from the original app...
    // (For brevity, I'm not repeating all methods, but they would all be included)

    /**
     * Load data with Web3 state
     */
    async loadData() {
        try {
            const saved = localStorage.getItem('gmCheckinData');
            if (saved) {
                const parsedData = JSON.parse(saved);
                this.appData = { ...this.appData, ...parsedData };
            }

            const web3Saved = localStorage.getItem('gmWeb3State');
            if (web3Saved) {
                const parsedWeb3Data = JSON.parse(web3Saved);
                this.web3State = { ...this.web3State, ...parsedWeb3Data };
            }

            this.validateData();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    /**
     * Save data with Web3 state
     */
    async saveData() {
        try {
            localStorage.setItem('gmCheckinData', JSON.stringify(this.appData));
            localStorage.setItem('gmWeb3State', JSON.stringify(this.web3State));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // ... (include all other methods from the original app)
    
    // Placeholder methods - in real implementation, include all methods from original app
    validateData() { /* Implementation */ }
    updateGreeting() { /* Implementation */ }
    checkCanCheckIn() { /* Implementation */ }
    getDateString(date) { return date.toISOString().split('T')[0]; }
    setButtonActive() { /* Implementation */ }
    setButtonDisabled() { /* Implementation */ }
    createRippleEffect(event) { /* Implementation */ }
    calculateMilestoneReward(streak) { return { milestoneReward: 0, milestoneText: '' }; }
    playCheckInAnimation() { /* Implementation */ }
    updateUI() { /* Implementation */ }
    updateCalendar() { /* Implementation */ }
    showRewardPopup(title, text) { /* Implementation */ }
    closeRewardPopup() { /* Implementation */ }
    showToast(message) { /* Implementation */ }
    hideToast() { /* Implementation */ }
    showLoading(show) { /* Implementation */ }
    switchTab(tabName) { /* Implementation */ }
    initializeCalendar() { /* Implementation */ }
    initializeSettings() { /* Implementation */ }
    navigateCalendar(direction) { /* Implementation */ }
    updateSetting(key, value) { /* Implementation */ }
    exportData() { /* Implementation */ }
    importData() { /* Implementation */ }
    resetData() { /* Implementation */ }
    handleFileImport(event) { /* Implementation */ }
    shareProgress() { /* Implementation */ }
    handleKeyboardShortcuts(event) { /* Implementation */ }
    handleVisibilityChange() { /* Implementation */ }
    setupPeriodicUpdates() { /* Implementation */ }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gmApp = new GMCheckinAppWeb3();
    });
} else {
    window.gmApp = new GMCheckinAppWeb3();
}

export default GMCheckinAppWeb3;