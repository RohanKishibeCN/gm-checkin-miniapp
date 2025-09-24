// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
<<<<<<< HEAD
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title GM Check-in Contract
 * @dev A contract for daily check-ins with streak tracking and token rewards
 */
contract GMCheckin is Ownable, ReentrancyGuard, Pausable {
    
    // Struct to store user data
    struct UserData {
        uint256 currentStreak;
        uint256 bestStreak;
        uint256 totalCheckIns;
        uint256 tokens;
        uint256 lastCheckIn;
        bool exists;
    }
    
    // Mapping from user address to their data
    mapping(address => UserData) public users;
    
    // Array to store all user addresses for leaderboard
    address[] public userAddresses;
    
    // Token contract interface (optional)
    IERC20 public gmToken;
    
    // Constants
    uint256 public constant BASE_REWARD = 10;
    uint256 public constant SECONDS_IN_DAY = 86400;
    
    // Milestone rewards
    mapping(uint256 => uint256) public milestoneRewards;
    
    // Events
    event CheckIn(address indexed user, uint256 streak, uint256 tokens, uint256 timestamp);
    event MilestoneReached(address indexed user, uint256 milestone, uint256 bonus);
    event TokensWithdrawn(address indexed user, uint256 amount);
    
    constructor() {
        // Initialize milestone rewards
        milestoneRewards[3] = 20;
        milestoneRewards[7] = 50;
        milestoneRewards[15] = 100;
        milestoneRewards[30] = 200;
        milestoneRewards[100] = 500;
        milestoneRewards[365] = 2000;
    }
    
    /**
     * @dev Set the GM token contract address
     * @param _tokenAddress Address of the GM token contract
     */
    function setGMToken(address _tokenAddress) external onlyOwner {
        gmToken = IERC20(_tokenAddress);
    }
    
    /**
     * @dev Check if user can check in today
     * @param user Address of the user
     * @return bool True if user can check in today
     */
    function canCheckInToday(address user) public view returns (bool) {
        if (!users[user].exists) {
            return true;
        }
        
        uint256 lastCheckIn = users[user].lastCheckIn;
        uint256 today = block.timestamp / SECONDS_IN_DAY;
        uint256 lastCheckInDay = lastCheckIn / SECONDS_IN_DAY;
        
        return today > lastCheckInDay;
    }
    
    /**
     * @dev Perform daily check-in
     */
    function checkIn() external nonReentrant whenNotPaused {
        require(canCheckInToday(msg.sender), "Already checked in today");
        
        UserData storage userData = users[msg.sender];
        
        // If user doesn't exist, add to array
        if (!userData.exists) {
            userAddresses.push(msg.sender);
            userData.exists = true;
        }
        
        uint256 currentTime = block.timestamp;
        uint256 today = currentTime / SECONDS_IN_DAY;
        uint256 yesterday = today - 1;
        
        // Calculate new streak
        uint256 newStreak = 1;
        if (userData.lastCheckIn > 0) {
            uint256 lastCheckInDay = userData.lastCheckIn / SECONDS_IN_DAY;
            if (lastCheckInDay == yesterday) {
                newStreak = userData.currentStreak + 1;
            }
        }
        
        // Calculate rewards
        uint256 tokensEarned = BASE_REWARD;
        uint256 milestoneBonus = 0;
        
        // Check for milestone rewards
        if (milestoneRewards[newStreak] > 0) {
            milestoneBonus = milestoneRewards[newStreak];
            tokensEarned += milestoneBonus;
            emit MilestoneReached(msg.sender, newStreak, milestoneBonus);
        }
        
        // Update user data
        userData.currentStreak = newStreak;
        userData.totalCheckIns += 1;
        userData.tokens += tokensEarned;
        userData.lastCheckIn = currentTime;
        
        // Update best streak
        if (newStreak > userData.bestStreak) {
            userData.bestStreak = newStreak;
        }
        
        emit CheckIn(msg.sender, newStreak, tokensEarned, currentTime);
    }
    
    /**
     * @dev Get user statistics
     * @param user Address of the user
     * @return currentStreak Current streak count
     * @return totalCheckIns Total number of check-ins
     * @return tokens Total tokens earned
     * @return lastCheckIn Timestamp of last check-in
     */
    function getUserStats(address user) external view returns (
        uint256 currentStreak,
        uint256 totalCheckIns,
        uint256 tokens,
        uint256 lastCheckIn
    ) {
        UserData memory userData = users[user];
        return (
            userData.currentStreak,
            userData.totalCheckIns,
            userData.tokens,
            userData.lastCheckIn
        );
    }
    
    /**
     * @dev Get user's best streak
     * @param user Address of the user
     * @return bestStreak Best streak achieved
     */
    function getUserBestStreak(address user) external view returns (uint256 bestStreak) {
        return users[user].bestStreak;
    }
    
    /**
     * @dev Get leaderboard data
     * @param limit Maximum number of users to return
     * @return addresses Array of user addresses
     * @return streaks Array of current streaks
     * @return totalCheckIns Array of total check-ins
     */
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory addresses,
        uint256[] memory streaks,
        uint256[] memory totalCheckIns
    ) {
        uint256 length = userAddresses.length;
        if (limit > 0 && limit < length) {
            length = limit;
        }
        
        addresses = new address[](length);
        streaks = new uint256[](length);
        totalCheckIns = new uint256[](length);
        
        // Simple implementation - in production, consider sorting off-chain
        for (uint256 i = 0; i < length; i++) {
            address user = userAddresses[i];
            addresses[i] = user;
            streaks[i] = users[user].currentStreak;
            totalCheckIns[i] = users[user].totalCheckIns;
        }
    }
    
    /**
     * @dev Withdraw tokens (if GM token is set)
     * @param amount Amount of tokens to withdraw
     */
    function withdrawTokens(uint256 amount) external nonReentrant {
        require(address(gmToken) != address(0), "GM token not set");
        require(users[msg.sender].tokens >= amount, "Insufficient token balance");
        require(gmToken.balanceOf(address(this)) >= amount, "Contract has insufficient tokens");
        
        users[msg.sender].tokens -= amount;
        gmToken.transfer(msg.sender, amount);
        
        emit TokensWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Get total number of users
     * @return Total number of users who have checked in
     */
    function getTotalUsers() external view returns (uint256) {
        return userAddresses.length;
    }
    
    /**
     * @dev Get contract statistics
     * @return totalUsers Total number of users
     * @return totalCheckIns Total number of check-ins across all users
     * @return totalTokensDistributed Total tokens distributed
     */
    function getContractStats() external view returns (
        uint256 totalUsers,
        uint256 totalCheckIns,
        uint256 totalTokensDistributed
    ) {
        totalUsers = userAddresses.length;
        
        for (uint256 i = 0; i < userAddresses.length; i++) {
            UserData memory userData = users[userAddresses[i]];
            totalCheckIns += userData.totalCheckIns;
            totalTokensDistributed += userData.tokens;
        }
    }
    
    /**
     * @dev Update milestone reward (only owner)
     * @param milestone Milestone day count
     * @param reward Reward amount
     */
    function updateMilestoneReward(uint256 milestone, uint256 reward) external onlyOwner {
        milestoneRewards[milestone] = reward;
    }
    
    /**
     * @dev Emergency pause (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency token withdrawal (only owner)
     * @param token Token contract address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    /**
     * @dev Get current day number
     * @return Current day since epoch
     */
    function getCurrentDay() external view returns (uint256) {
        return block.timestamp / SECONDS_IN_DAY;
=======

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
>>>>>>> b3933a4145ac66a094b2782445a115bbd66258f8
    }
}