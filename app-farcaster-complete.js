/**
 * Complete GM Check-in App with Farcaster Integration
 * Optimized for Farcaster Mini Apps with robust error handling
 */

// Import Farcaster SDK with fallback
let sdk;
try {
    if (typeof window !== 'undefined' && window.FarcasterSDK) {
        sdk = window.FarcasterSDK;
    } else {
        const module = await import('https://esm.sh/@farcaster/miniapp-sdk');
        sdk = module.sdk;
    }
} catch (error) {
    console.warn('Farcaster SDK not available, running in standalone mode');
    // Create mock SDK for standalone operation
    sdk = {
        quickAuth: {
            getToken: () => Promise.resolve({ token: null }),
            fetch: () => Promise.reject(new Error('No auth available'))
        },
        actions: {
            ready: () => Promise.resolve(),
            openUrl: (url) => window.open(url, '_blank')
        }
    };
}

class GMCheckinFarcasterApp {
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

        // Farcaster state
        this.farcasterState = {
            isAuthenticated: false,
            user: null,
            fid: null,
            username: null,
            avatar: null,
            quickAuthToken: null
        };

        // DOM element cache
        this.elements = {};
        
        // Current date for calendar
        this.currentCalendarDate = new Date();
        
        // Initialize app
        this.init();
    }

    /**
     * Initialize the application with Farcaster integration
     */
    async init() {
        try {
            console.log('Initializing GM Check-in Farcaster App...');
            
            // Cache DOM elements
            this.cacheElements();
            
            // Initialize Farcaster authentication
            await this.initializeFarcaster();
            
            // Load saved data
            await this.loadData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI
            this.updateUI();
            this.updateGreeting();
            this.checkCanCheckIn();
            this.initializeCalendar();
            this.initializeSettings();
            
            // Setup periodic updates
            this.setupPeriodicUpdates();
            
            // Hide splash screen and show app
            await this.showApp();
            
            console.log('GM Check-in Farcaster App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showToast('Error initializing app. Please refresh the page.');
            await this.showApp(); // Show app even if there's an error
        }
    }

    /**
     * Initialize Farcaster authentication and user data
     */
    async initializeFarcaster() {
        try {
            console.log('Initializing Farcaster authentication...');
            
            // Check if running in Farcaster environment
            if (!this.isInFarcaster()) {
                console.log('Not running in Farcaster, skipping auth');
                return;
            }
            
            // Get Quick Auth token with timeout
            const tokenPromise = sdk.quickAuth.getToken();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Auth timeout')), 5000)
            );
            
            const { token } = await Promise.race([tokenPromise, timeoutPromise]);
            
            if (!token) {
                console.warn('No auth token received');
                return;
            }
            
            this.farcasterState.quickAuthToken = token;
            
            // Make authenticated request to get user info
            const userResponse = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                this.farcasterState.user = userData;
                this.farcasterState.fid = userData.fid;
                this.farcasterState.username = userData.username;
                this.farcasterState.avatar = userData.avatar;
                this.farcasterState.isAuthenticated = true;
                
                console.log('Farcaster authentication successful:', userData);
                this.updateFarcasterUI();
            } else {
                console.warn('Failed to get user info from API');
            }
        } catch (error) {
            console.error('Error initializing Farcaster:', error);
            // Continue without Farcaster auth - app should still work
        }
    }

    /**
     * Check if running in Farcaster environment
     */
    isInFarcaster() {
        return typeof window !== 'undefined' && 
               (window.location.hostname.includes('farcaster') || 
                window.navigator.userAgent.includes('Farcaster') ||
                window.parent !== window); // Running in iframe
    }

    /**
     * Update Farcaster-specific UI elements
     */
    updateFarcasterUI() {
        if (this.farcasterState.isAuthenticated && this.elements.farcasterUserInfo) {
            this.elements.farcasterUserInfo.style.display = 'flex';
            
            if (this.elements.farcasterUsername) {
                this.elements.farcasterUsername.textContent = this.farcasterState.username || 'Anonymous';
            }
            
            if (this.elements.farcasterFid) {
                this.elements.farcasterFid.textContent = `FID: ${this.farcasterState.fid}`;
            }
            
            if (this.elements.farcasterAvatar && this.farcasterState.avatar) {
                this.elements.farcasterAvatar.style.backgroundImage = `url(${this.farcasterState.avatar})`;
                this.elements.farcasterAvatar.style.backgroundSize = 'cover';
            }
        }
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        const elementIds = [
            'loadingSplash', 'greeting', 'timezoneInfo', 'streak', 'streakFire', 
            'total', 'tokens', 'bestStreak', 'checkinBtn', 'btnText', 'buttonRipple',
            'status', 'overlay', 'rewardPopup', 'rewardAnimation', 'rewardTitle', 
            'rewardText', 'rewardCloseBtn', 'rewardShareBtn', 'toast', 'toastMessage', 
            'toastClose', 'loading', 'currentMonth', 'prevMonth', 'nextMonth', 
            'calendarGrid', 'notifications', 'reminderTime', 'timezone', 'useBlockchain',
            'exportData', 'importData', 'resetData', 'fileInput', 'farcasterUserInfo',
            'farcasterUsername', 'farcasterFid', 'farcasterAvatar', 'shareCastBtn',
            'achievementPreview', 'shareStreak', 'shareTokens', 'leaderboardList'
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
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
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

        // Share buttons
        if (this.elements.shareCastBtn) {
            this.elements.shareCastBtn.addEventListener('click', () => this.shareAsCast());
        }
        if (this.elements.rewardShareBtn) {
            this.elements.rewardShareBtn.addEventListener('click', () => this.shareAchievement());
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
        if (this.elements.useBlockchain) {
            this.elements.useBlockchain.addEventListener('change', (e) => this.updateSetting('useBlockchain', e.target.checked));
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

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    /**
     * Show the app and hide splash screen
     */
    async showApp() {
        try {
            // Hide splash screen
            if (this.elements.loadingSplash) {
                this.elements.loadingSplash.classList.add('hidden');
            }
            
            // Tell Farcaster the app is ready
            if (this.isInFarcaster()) {
                await sdk.actions.ready();
            }
            
            console.log('App is now visible and ready');
        } catch (error) {
            console.error('Error showing app:', error);
            // Fallback: hide splash screen anyway
            if (this.elements.loadingSplash) {
                this.elements.loadingSplash.classList.add('hidden');
            }
        }
    }

    /**
     * Handle check-in with Farcaster integration
     */
    async handleCheckIn(event) {
        if (!this.checkCanCheckIn()) return;

        try {
            // Create ripple effect
            this.createRippleEffect(event);
            
            // Perform check-in
            await this.performCheckIn();
            
            // Auto-share milestone achievements
            if (this.shouldAutoShare()) {
                setTimeout(() => this.shareAchievement(), 2000);
            }
            
        } catch (error) {
            console.error('Error during check-in:', error);
            this.showToast('Error during check-in. Please try again.');
        }
    }

    /**
     * Perform check-in logic
     */
    async performCheckIn() {
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

        // Calculate milestone rewards (0.01 USDC base + 0.01 USDC milestone bonus)
        const baseReward = 0.01; // 0.01 USDC per check-in
        const { milestoneReward, milestoneText } = this.calculateMilestoneReward(newStreak);
        const totalUSDC = baseReward + milestoneReward;

        // Update data
        this.appData.lastCheckIn = now.toISOString();
        this.appData.currentStreak = newStreak;
        this.appData.totalCheckIns += 1;
        this.appData.tokens += totalUSDC;
        this.appData.checkInHistory.push(today);

        if (newStreak > this.appData.bestStreak) {
            this.appData.bestStreak = newStreak;
        }

        // Save data
        await this.saveData();

        // Play animations
        this.playCheckInAnimation();

        // Update UI
        this.updateUI();
        this.setButtonDisabled();
        this.updateCalendar();
        this.updateSocialTab();

        // Show reward popup
        const title = milestoneReward > 0 ? milestoneText : 'Check-in successful!';
        const text = `Earned ${totalUSDC.toFixed(2)} USDC! 💰`;
        this.showRewardPopup(title, text);
    }

    /**
     * Share progress as a Farcaster cast
     */
    async shareAsCast() {
        try {
            const castText = this.generateCastText();
            const embedUrl = encodeURIComponent(window.location.href);
            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${embedUrl}`;
            
            if (this.isInFarcaster() && sdk.actions) {
                await sdk.actions.openUrl(warpcastUrl);
            } else {
                // Fallback for non-Farcaster environments
                window.open(warpcastUrl, '_blank');
            }
            
            this.showToast('Opening Warpcast to share your progress!');
        } catch (error) {
            console.error('Error sharing cast:', error);
            // Fallback to direct link
            const castText = this.generateCastText();
            const embedUrl = encodeURIComponent(window.location.href);
            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${embedUrl}`;
            window.open(warpcastUrl, '_blank');
            this.showToast('Opening Warpcast...');
        }
    }

    /**
     * Share achievement after milestone
     */
    async shareAchievement() {
        try {
            const achievementText = this.generateAchievementText();
            const embedUrl = encodeURIComponent(window.location.href);
            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(achievementText)}&embeds[]=${embedUrl}`;
            
            if (this.isInFarcaster() && sdk.actions) {
                await sdk.actions.openUrl(warpcastUrl);
            } else {
                window.open(warpcastUrl, '_blank');
            }
            
            this.closeRewardPopup();
        } catch (error) {
            console.error('Error sharing achievement:', error);
            // Fallback
            const achievementText = this.generateAchievementText();
            const embedUrl = encodeURIComponent(window.location.href);
            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(achievementText)}&embeds[]=${embedUrl}`;
            window.open(warpcastUrl, '_blank');
            this.closeRewardPopup();
        }
    }

    /**
     * Generate cast text for sharing
     */
    generateCastText() {
        const streakEmoji = this.appData.currentStreak >= 30 ? '🔥🔥🔥' : 
                           this.appData.currentStreak >= 7 ? '🔥🔥' : '🔥';
        
        return `GM! ${streakEmoji} Day ${this.appData.currentStreak} of my daily check-in streak! I've earned ${this.appData.tokens.toFixed(2)} USDC building consistent habits on @base. Join me in the GM Check-in challenge! 🌅💰`;
    }

    /**
     * Generate achievement text for milestones
     */
    generateAchievementText() {
        const milestone = this.appData.currentStreak;
        let achievementText = `🎉 MILESTONE ACHIEVED! 🎉\n\n`;
        
        if (milestone >= 100) {
            achievementText += `💯 ${milestone}-day GM streak! I'm officially a habit master! `;
        } else if (milestone >= 30) {
            achievementText += `🏆 ${milestone}-day GM streak! One month of consistency! `;
        } else if (milestone >= 7) {
            achievementText += `⭐ ${milestone}-day GM streak! One week strong! `;
        } else {
            achievementText += `🌟 ${milestone}-day GM streak! Building momentum! `;
        }
        
        achievementText += `\n\nTotal USDC earned: ${this.appData.tokens.toFixed(2)} USDC 💰\nBuilding habits on @base 🔵`;
        
        return achievementText;
    }

    /**
     * Update social tab with current stats
     */
    updateSocialTab() {
        if (this.elements.shareStreak) {
            this.elements.shareStreak.textContent = this.appData.currentStreak;
        }
        if (this.elements.shareTokens) {
            this.elements.shareTokens.textContent = `${this.appData.tokens.toFixed(2)} USDC`;
        }
    }

    /**
     * Check if should auto-share achievement
     */
    shouldAutoShare() {
        const milestones = [3, 7, 15, 30, 100];
        return milestones.includes(this.appData.currentStreak);
    }

    /**
     * Calculate milestone rewards (0.01 USDC bonus for each milestone)
     */
    calculateMilestoneReward(streak) {
        const milestones = {
            3: { reward: 0.01, text: '3-day streak achieved! 🌟' },
            7: { reward: 0.01, text: '7-day streak achieved! ⭐' },
            15: { reward: 0.01, text: '15-day streak achieved! 🏆' },
            30: { reward: 0.01, text: '30-day streak achieved! 💯' },
            100: { reward: 0.01, text: '100-day streak achieved! 🔥' },
            365: { reward: 0.01, text: '365-day streak achieved! 🎊' }
        };

        if (milestones[streak]) {
            return {
                milestoneReward: milestones[streak].reward,
                milestoneText: milestones[streak].text
            };
        }

        return { milestoneReward: 0, milestoneText: '' };
    }

    // Essential utility methods
    getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    checkCanCheckIn() {
        try {
            const now = new Date();
            const today = this.getDateString(now);
            
            if (this.appData.lastCheckIn) {
                const lastCheckInDate = this.getDateString(new Date(this.appData.lastCheckIn));
                
                if (lastCheckInDate === today) {
                    this.setButtonDisabled();
                    return false;
                }
            }
            
            this.setButtonActive();
            return true;
        } catch (error) {
            console.error('Error checking check-in status:', error);
            this.setButtonDisabled();
            return false;
        }
    }

    setButtonActive() {
        if (!this.elements.checkinBtn || !this.elements.btnText || !this.elements.status) return;

        this.elements.checkinBtn.className = 'checkin-button active';
        this.elements.checkinBtn.disabled = false;
        this.elements.btnText.textContent = 'GM!';
        this.elements.status.textContent = 'Ready for today\'s check-in!';
    }

    setButtonDisabled() {
        if (!this.elements.checkinBtn || !this.elements.btnText || !this.elements.status) return;

        this.elements.checkinBtn.className = 'checkin-button disabled';
        this.elements.checkinBtn.disabled = true;
        this.elements.btnText.textContent = 'Done';
        this.elements.status.textContent = 'Already checked in today. Come back tomorrow!';
    }

    createRippleEffect(event) {
        if (!this.elements.buttonRipple) return;

        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        this.elements.buttonRipple.style.width = size + 'px';
        this.elements.buttonRipple.style.height = size + 'px';
        this.elements.buttonRipple.style.left = x + 'px';
        this.elements.buttonRipple.style.top = y + 'px';
        this.elements.buttonRipple.style.transform = 'scale(0)';
        this.elements.buttonRipple.style.animation = 'ripple 0.6s linear';

        setTimeout(() => {
            this.elements.buttonRipple.style.animation = '';
        }, 600);
    }

    playCheckInAnimation() {
        if (!this.elements.checkinBtn) return;

        this.elements.checkinBtn.classList.add('animate');
        setTimeout(() => {
            this.elements.checkinBtn.classList.remove('animate');
        }, 600);
    }

    updateUI() {
        try {
            // Update stats
            if (this.elements.streak) {
                this.elements.streak.textContent = `${this.appData.currentStreak} ${this.appData.currentStreak === 1 ? 'day' : 'days'}`;
            }
            if (this.elements.total) {
                this.elements.total.textContent = this.appData.totalCheckIns;
            }
            if (this.elements.tokens) {
                this.elements.tokens.textContent = `${this.appData.tokens.toFixed(2)} USDC`;
            }
            if (this.elements.bestStreak) {
                this.elements.bestStreak.textContent = this.appData.bestStreak;
            }

            // Update streak fire animation
            if (this.elements.streakFire) {
                this.elements.streakFire.style.display = this.appData.currentStreak > 0 ? 'block' : 'none';
            }

            // Update milestones
            this.updateMilestones();
            
            // Update social tab
            this.updateSocialTab();
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }

    updateMilestones() {
        const milestones = [3, 7, 15, 30, 100];
        
        milestones.forEach(days => {
            const element = this.elements[`milestone${days}`];
            if (element) {
                if (this.appData.currentStreak >= days) {
                    element.className = 'milestone completed';
                } else {
                    element.className = 'milestone pending';
                }
            }
        });
    }

    showRewardPopup(title, text) {
        if (!this.elements.overlay || !this.elements.rewardPopup) return;

        if (this.elements.rewardTitle) this.elements.rewardTitle.textContent = title;
        if (this.elements.rewardText) this.elements.rewardText.textContent = text;
        
        // Animate reward icon
        if (this.elements.rewardAnimation) {
            this.elements.rewardAnimation.style.animation = 'celebration 1s ease-in-out';
        }

        this.elements.overlay.classList.add('show');
        this.elements.rewardPopup.classList.add('show');

        // Auto-close after 8 seconds (longer for Farcaster)
        setTimeout(() => {
            this.closeRewardPopup();
        }, 8000);
    }

    closeRewardPopup() {
        if (!this.elements.overlay || !this.elements.rewardPopup) return;

        this.elements.overlay.classList.remove('show');
        this.elements.rewardPopup.classList.remove('show');
    }

    showToast(message, duration = 3000) {
        if (!this.elements.toast || !this.elements.toastMessage) return;

        this.elements.toastMessage.textContent = message;
        this.elements.toast.classList.add('show');

        setTimeout(() => {
            this.hideToast();
        }, duration);
    }

    hideToast() {
        if (!this.elements.toast) return;
        this.elements.toast.classList.remove('show');
    }

    switchTab(tabName) {
        // Update tab buttons
        this.elements.tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Update tab panels
        this.elements.tabPanels.forEach(panel => {
            if (panel.id === tabName) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Update calendar when switching to calendar tab
        if (tabName === 'calendar') {
            this.updateCalendar();
        }
    }

    // Data management methods
    async loadData() {
        try {
            const saved = localStorage.getItem('gmCheckinData');
            if (saved) {
                const parsedData = JSON.parse(saved);
                this.appData = { ...this.appData, ...parsedData };
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async saveData() {
        try {
            localStorage.setItem('gmCheckinData', JSON.stringify(this.appData));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    updateGreeting() {
        if (!this.elements.greeting || !this.elements.timezoneInfo) return;

        try {
            const now = new Date();
            const hour = now.getHours();
            
            let greeting;
            if (hour < 12) {
                greeting = 'Good Morning!';
            } else if (hour < 18) {
                greeting = 'Good Afternoon!';
            } else {
                greeting = 'Good Evening!';
            }
            
            this.elements.greeting.textContent = greeting;
            this.elements.timezoneInfo.textContent = `${now.toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error updating greeting:', error);
        }
    }

    // Calendar methods
    initializeCalendar() {
        this.updateCalendar();
    }

    updateCalendar() {
        if (!this.elements.calendarGrid || !this.elements.currentMonth) return;

        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        // Update month display
        this.elements.currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Clear calendar
        this.elements.calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day-header';
            dayElement.textContent = day;
            this.elements.calendarGrid.appendChild(dayElement);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            this.elements.calendarGrid.appendChild(emptyDay);
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if this day has a check-in
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (this.appData.checkInHistory.includes(dateString)) {
                dayElement.classList.add('checked-in');
            }

            // Highlight today
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }

            this.elements.calendarGrid.appendChild(dayElement);
        }
    }

    navigateCalendar(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.updateCalendar();
    }

    // Settings methods
    initializeSettings() {
        // Populate timezone dropdown
        if (this.elements.timezone) {
            const timezones = Intl.supportedValuesOf('timeZone');
            const currentTimezone = this.appData.settings.timezone;
            
            timezones.forEach(tz => {
                const option = document.createElement('option');
                option.value = tz;
                option.textContent = tz;
                if (tz === currentTimezone) {
                    option.selected = true;
                }
                this.elements.timezone.appendChild(option);
            });
        }

        // Set other settings
        if (this.elements.notifications) {
            this.elements.notifications.checked = this.appData.settings.notifications;
        }
        if (this.elements.reminderTime) {
            this.elements.reminderTime.value = this.appData.settings.reminderTime;
        }
        if (this.elements.useBlockchain) {
            this.elements.useBlockchain.checked = this.appData.settings.useBlockchain;
        }
    }

    updateSetting(key, value) {
        this.appData.settings[key] = value;
        this.saveData();
        this.showToast(`Setting updated: ${key}`);
    }

    // Data management
    exportData() {
        try {
            const dataStr = JSON.stringify(this.appData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `gm-checkin-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showToast('Data exported successfully!');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Error exporting data');
        }
    }

    importData() {
        this.elements.fileInput?.click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (this.validateImportedData(importedData)) {
                    this.appData = { ...this.appData, ...importedData };
                    this.saveData();
                    this.updateUI();
                    this.updateCalendar();
                    this.showToast('Data imported successfully!');
                } else {
                    this.showToast('Invalid data format');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showToast('Error importing data');
            }
        };
        reader.readAsText(file);
    }

    validateImportedData(data) {
        return data && 
               typeof data.currentStreak === 'number' &&
               typeof data.totalCheckIns === 'number' &&
               Array.isArray(data.checkInHistory);
    }

    resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.appData = {
                lastCheckIn: null,
                currentStreak: 0,
                bestStreak: 0,
                totalCheckIns: 0,
                tokens: 0,
                checkInHistory: [],
                settings: this.appData.settings // Keep settings
            };
            this.saveData();
            this.updateUI();
            this.updateCalendar();
            this.showToast('All data has been reset');
        }
    }

    // Event handlers
    handleKeyboardShortcuts(event) {
        if (event.code === 'Space' && !event.target.matches('input, textarea, select')) {
            event.preventDefault();
            if (this.checkCanCheckIn()) {
                this.handleCheckIn({ currentTarget: this.elements.checkinBtn, clientX: 0, clientY: 0 });
            }
        }
    }

    handleVisibilityChange() {
        if (!document.hidden) {
            // App became visible, update UI
            this.updateGreeting();
            this.checkCanCheckIn();
        }
    }

    setupPeriodicUpdates() {
        // Update greeting and check-in status every minute
        setInterval(() => {
            this.updateGreeting();
            this.checkCanCheckIn();
        }, 60000);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gmApp = new GMCheckinFarcasterApp();
    });
} else {
    window.gmApp = new GMCheckinFarcasterApp();
}

export default GMCheckinFarcasterApp;