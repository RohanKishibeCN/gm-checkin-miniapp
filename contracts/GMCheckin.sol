// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GMCheckin is Ownable, ReentrancyGuard {
    IERC20 public rewardToken;
    
    // 奖励配置
    uint256 public constant DAILY_REWARD = 10 * 10**18; // 10 tokens
    uint256 public constant STREAK_7_BONUS = 100 * 10**18; // 100 tokens
    uint256 public constant STREAK_15_BONUS = 300 * 10**18; // 300 tokens
    uint256 public constant STREAK_30_BONUS = 1000 * 10**18; // 1000 tokens
    
    struct UserStats {
        uint256 totalCheckIns;
        uint256 currentStreak;
        uint256 lastCheckIn;
        uint256 totalRewards;
        mapping(uint256 => bool) dailyCheckIns; // day => checked
    }
    
    mapping(address => UserStats) public userStats;
    
    event CheckIn(address indexed user, uint256 streak, uint256 reward);
    event StreakBonus(address indexed user, uint256 streak, uint256 bonus);
    
    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
    }
    
    function checkIn() external nonReentrant {
        require(canCheckInToday(msg.sender), "Already checked in today");
        
        UserStats storage stats = userStats[msg.sender];
        uint256 today = block.timestamp / 86400; // 当前天数
        
        // 检查连续性
        uint256 yesterday = today - 1;
        bool isConsecutive = stats.lastCheckIn == 0 || 
                           stats.dailyCheckIns[yesterday] || 
                           stats.lastCheckIn / 86400 == yesterday;
        
        // 更新统计
        stats.totalCheckIns++;
        stats.lastCheckIn = block.timestamp;
        stats.dailyCheckIns[today] = true;
        
        if (isConsecutive) {
            stats.currentStreak++;
        } else {
            stats.currentStreak = 1;
        }
        
        // 计算奖励
        uint256 totalReward = DAILY_REWARD;
        
        // 检查里程碑奖励
        if (stats.currentStreak == 7) {
            totalReward += STREAK_7_BONUS;
            emit StreakBonus(msg.sender, 7, STREAK_7_BONUS);
        } else if (stats.currentStreak == 15) {
            totalReward += STREAK_15_BONUS;
            emit StreakBonus(msg.sender, 15, STREAK_15_BONUS);
        } else if (stats.currentStreak == 30) {
            totalReward += STREAK_30_BONUS;
            emit StreakBonus(msg.sender, 30, STREAK_30_BONUS);
        }
        
        stats.totalRewards += totalReward;
        
        // 发放奖励
        require(rewardToken.transfer(msg.sender, totalReward), "Reward transfer failed");
        
        emit CheckIn(msg.sender, stats.currentStreak, totalReward);
    }
    
    function canCheckInToday(address user) public view returns (bool) {
        uint256 today = block.timestamp / 86400;
        return !userStats[user].dailyCheckIns[today];
    }
    
    function getUserStats(address user) external view returns (
        uint256 totalCheckIns,
        uint256 currentStreak,
        uint256 lastCheckIn,
        uint256 totalRewards
    ) {
        UserStats storage stats = userStats[user];
        return (
            stats.totalCheckIns,
            stats.currentStreak,
            stats.lastCheckIn,
            stats.totalRewards
        );
    }
    
    // 管理员功能
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(rewardToken.transfer(owner(), amount), "Withdraw failed");
    }
    
    function updateRewardToken(address _newToken) external onlyOwner {
        rewardToken = IERC20(_newToken);
    }
}