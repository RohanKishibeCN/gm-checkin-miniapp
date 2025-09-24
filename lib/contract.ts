// GM Check-in Contract ABI and Address
export const GM_CONTRACT_ADDRESS = '0x...' // 需要部署合约后填入

export const GM_CONTRACT_ABI = [
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
      {"internalType": "uint256", "name": "totalCheckIns", "type": "uint256"},
      {"internalType": "uint256", "name": "currentStreak", "type": "uint256"},
      {"internalType": "uint256", "name": "lastCheckIn", "type": "uint256"},
      {"internalType": "uint256", "name": "totalRewards", "type": "uint256"}
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
      {"indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256"}
    ],
    "name": "CheckIn",
    "type": "event"
  }
] as const

// 奖励配置
export const REWARDS = {
  DAILY: '10', // 10 tokens per day
  STREAK_7: '100', // 100 bonus tokens for 7-day streak
  STREAK_15: '300', // 300 bonus tokens for 15-day streak
  STREAK_30: '1000', // 1000 bonus tokens for 30-day streak
}