/**
 * Web3 Configuration for Base Mainnet
 */

// Base Mainnet Configuration
export const BASE_MAINNET_CONFIG = {
    chainId: '0x2105', // 8453 in hex
    chainName: 'Base',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: [
        'https://mainnet.base.org',
        'https://base-mainnet.g.alchemy.com/v2/demo',
        'https://base.gateway.tenderly.co'
    ],
    blockExplorerUrls: ['https://basescan.org']
};

// Contract Configuration
export const CONTRACT_CONFIG = {
    // GM Check-in Contract Address (to be deployed)
    GM_CHECKIN_ADDRESS: '0x0000000000000000000000000000000000000000', // Placeholder
    
    // Contract ABI for GM Check-in
    GM_CHECKIN_ABI: [
        {
            "inputs": [],
            "name": "checkIn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "getUserStats",
            "outputs": [
                {"internalType": "uint256", "name": "currentStreak", "type": "uint256"},
                {"internalType": "uint256", "name": "totalCheckIns", "type": "uint256"},
                {"internalType": "uint256", "name": "tokens", "type": "uint256"},
                {"internalType": "uint256", "name": "lastCheckIn", "type": "uint256"}
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "canCheckInToday",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
                {"indexed": false, "internalType": "uint256", "name": "streak", "type": "uint256"},
                {"indexed": false, "internalType": "uint256", "name": "tokens", "type": "uint256"}
            ],
            "name": "CheckIn",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
                {"indexed": false, "internalType": "uint256", "name": "milestone", "type": "uint256"},
                {"indexed": false, "internalType": "uint256", "name": "bonus", "type": "uint256"}
            ],
            "name": "MilestoneReached",
            "type": "event"
        }
    ]
};

// Token Configuration (if using custom token)
export const TOKEN_CONFIG = {
    GM_TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000', // Placeholder
    GM_TOKEN_ABI: [
        {
            "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

// Gas Configuration
export const GAS_CONFIG = {
    CHECK_IN_GAS_LIMIT: 100000,
    GAS_PRICE_MULTIPLIER: 1.1 // 10% buffer
};

// API Endpoints
export const API_CONFIG = {
    BASE_SCAN_API: 'https://api.basescan.org/api',
    COINGECKO_API: 'https://api.coingecko.com/api/v3',
    ALCHEMY_API: 'https://base-mainnet.g.alchemy.com/v2'
};

// Feature Flags
export const FEATURES = {
    ENABLE_WEB3: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: false,
    ENABLE_REFERRALS: true,
    ENABLE_LEADERBOARD: true
};