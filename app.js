/**
 * GM Check-in Application
 * A modern, feature-rich daily check-in app with PWA support
 */

class GMCheckinApp {
    constructor() {
        // Application state
        this.appData = {
            lastCheckIn: null,
            currentStreak: 0,
            bestStreak: 0,
            totalCheckIns: 0,
            tokens: 0,
            checkInHistory: [], // Array of check-in dates
            settings: {
                notifications: false,
                reminderTime: '09:00',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        // DOM element cache
        this.elements = {};
        
        // Current date for calendar
        this.currentCalendarDate = new Date();
        
        // Notification permission
        this.notificationPermission = 'default';
        
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
            
            // Initialize UI
            this.updateUI();
            this.updateGreeting();
            this.checkCanCheckIn();
            this.initializeCalendar();
            this.initializeSettings();
            
            // Setup periodic updates
            this.setupPeriodicUpdates();
            
            // Request notification permission
            await this.requestNotificationPermission();
            
            this.showLoading(false);
            
            console.log('GM Check-in App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showToast('Error initializing app. Please refresh the page.');
            this.showLoading(false);
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

        // Visibility change (for background sync)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    /**
     * Load data from localStorage with error handling
     */
    async loadData() {
        try {
            const saved = localStorage.getItem('gmCheckinData');
            if (saved) {
                const parsedData = JSON.parse(saved);
                
                // Merge with default data to handle new properties
                this.appData = {
                    ...this.appData,
                    ...parsedData,
                    settings: {
                        ...this.appData.settings,
                        ...parsedData.settings
                    }
                };

                // Validate and clean data
                this.validateData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error loading saved data. Starting fresh.');
        }
    }

    /**
     * Validate and clean loaded data
     */
    validateData() {
        // Ensure numeric values are valid
        this.appData.currentStreak = Math.max(0, parseInt(this.appData.currentStreak) || 0);
        this.appData.bestStreak = Math.max(0, parseInt(this.appData.bestStreak) || 0);
        this.appData.totalCheckIns = Math.max(0, parseInt(this.appData.totalCheckIns) || 0);
        this.appData.tokens = Math.max(0, parseInt(this.appData.tokens) || 0);

        // Ensure arrays exist
        if (!Array.isArray(this.appData.checkInHistory)) {
            this.appData.checkInHistory = [];
        }

        // Update best streak if current is higher
        if (this.appData.currentStreak > this.appData.bestStreak) {
            this.appData.bestStreak = this.appData.currentStreak;
        }
    }

    /**
     * Save data to localStorage with error handling
     */
    async saveData() {
        try {
            localStorage.setItem('gmCheckinData', JSON.stringify(this.appData));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error saving data. Please check your storage.');
        }
    }

    /**
     * Update greeting based on current time and timezone
     */
    updateGreeting() {
        if (!this.elements.greeting || !this.elements.timezoneInfo) return;

        try {
            const now = new Date();
            const hour = now.getHours();
            const timezone = this.appData.settings.timezone;
            
            let greeting;
            if (hour < 12) {
                greeting = 'Good Morning!';
            } else if (hour < 18) {
                greeting = 'Good Afternoon!';
            } else {
                greeting = 'Good Evening!';
            }
            
            this.elements.greeting.textContent = greeting;
            this.elements.timezoneInfo.textContent = `${now.toLocaleTimeString()} (${timezone})`;
        } catch (error) {
            console.error('Error updating greeting:', error);
        }
    }

    /**
     * Check if user can check in today
     */
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

    /**
     * Get date string in YYYY-MM-DD format for consistent comparison
     */
    getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Set button to active state
     */
    setButtonActive() {
        if (!this.elements.checkinBtn || !this.elements.btnText || !this.elements.status) return;

        this.elements.checkinBtn.className = 'checkin-button active';
        this.elements.checkinBtn.disabled = false;
        this.elements.btnText.textContent = 'GM!';
        this.elements.status.textContent = 'Ready for today\'s check-in!';
    }

    /**
     * Set button to disabled state
     */
    setButtonDisabled() {
        if (!this.elements.checkinBtn || !this.elements.btnText || !this.elements.status) return;

        this.elements.checkinBtn.className = 'checkin-button disabled';
        this.elements.checkinBtn.disabled = true;
        this.elements.btnText.textContent = 'Done';
        this.elements.status.textContent = 'Already checked in today. Come back tomorrow!';
    }

    /**
     * Handle check-in button click with ripple effect
     */
    async handleCheckIn(event) {
        if (!this.checkCanCheckIn()) return;

        try {
            // Create ripple effect
            this.createRippleEffect(event);
            
            // Perform check-in
            await this.performCheckIn();
            
        } catch (error) {
            console.error('Error during check-in:', error);
            this.showToast('Error during check-in. Please try again.');
        }
    }

    /**
     * Create ripple effect on button click
     */
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

    /**
     * Perform the actual check-in logic
     */
    async performCheckIn() {
        const now = new Date();
        const today = this.getDateString(now);
        let newStreak = 1;
        let tokensEarned = 10; // Base reward

        // Calculate streak
        if (this.appData.lastCheckIn) {
            const lastCheckInDate = new Date(this.appData.lastCheckIn);
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            
            // If checked in yesterday, increment streak
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

        // Update best streak
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

        // Show reward popup
        const title = milestoneReward > 0 ? milestoneText : 'Check-in successful!';
        const text = `Earned ${tokensEarned} tokens! 🎉`;
        this.showRewardPopup(title, text);

        // Send notification if enabled
        if (this.appData.settings.notifications && this.notificationPermission === 'granted') {
            this.sendNotification('Check-in Complete!', `Day ${newStreak} streak! Earned ${tokensEarned} tokens.`);
        }
    }

    /**
     * Calculate milestone rewards
     */
    calculateMilestoneReward(streak) {
        const milestones = {
            3: { reward: 20, text: '3-day streak achieved!' },
            7: { reward: 50, text: '7-day streak achieved!' },
            15: { reward: 100, text: '15-day streak achieved!' },
            30: { reward: 200, text: '30-day streak achieved!' },
            100: { reward: 500, text: '100-day streak achieved!' }
        };

        if (milestones[streak]) {
            return {
                milestoneReward: milestones[streak].reward,
                milestoneText: milestones[streak].text
            };
        }

        return { milestoneReward: 0, milestoneText: '' };
    }

    /**
     * Play check-in animation
     */
    playCheckInAnimation() {
        if (!this.elements.checkinBtn) return;

        this.elements.checkinBtn.classList.add('animate');
        setTimeout(() => {
            this.elements.checkinBtn.classList.remove('animate');
        }, 600);
    }

    /**
     * Update all UI elements
     */
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
                this.elements.tokens.textContent = this.appData.tokens;
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
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }

    /**
     * Update milestone status
     */
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

    /**
     * Show reward popup with animation
     */
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

        // Auto-close after 5 seconds
        setTimeout(() => {
            this.closeRewardPopup();
        }, 5000);
    }

    /**
     * Close reward popup
     */
    closeRewardPopup() {
        if (!this.elements.overlay || !this.elements.rewardPopup) return;

        this.elements.overlay.classList.remove('show');
        this.elements.rewardPopup.classList.remove('show');
    }

    /**
     * Show toast notification
     */
    showToast(message, duration = 3000) {
        if (!this.elements.toast || !this.elements.toastMessage) return;

        this.elements.toastMessage.textContent = message;
        this.elements.toast.classList.add('show');

        setTimeout(() => {
            this.hideToast();
        }, duration);
    }

    /**
     * Hide toast notification
     */
    hideToast() {
        if (!this.elements.toast) return;
        this.elements.toast.classList.remove('show');
    }

    /**
     * Show/hide loading spinner
     */
    showLoading(show) {
        if (!this.elements.loading) return;
        
        if (show) {
            this.elements.loading.classList.add('show');
        } else {
            this.elements.loading.classList.remove('show');
        }
    }

    /**
     * Switch between tabs
     */
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

    /**
     * Initialize calendar
     */
    initializeCalendar() {
        this.updateCalendar();
    }

    /**
     * Navigate calendar months
     */
    navigateCalendar(direction) {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.updateCalendar();
    }

    /**
     * Update calendar display
     */
    updateCalendar() {
        if (!this.elements.currentMonth || !this.elements.calendarGrid) return;

        try {
            const year = this.currentCalendarDate.getFullYear();
            const month = this.currentCalendarDate.getMonth();
            
            // Update month header
            this.elements.currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });

            // Clear calendar grid
            this.elements.calendarGrid.innerHTML = '';

            // Add day headers
            const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayHeaders.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day header';
                dayElement.textContent = day;
                this.elements.calendarGrid.appendChild(dayElement);
            });

            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            const todayString = this.getDateString(today);

            // Add empty cells for days before month starts
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day other-month';
                this.elements.calendarGrid.appendChild(emptyDay);
            }

            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;

                const dayDate = new Date(year, month, day);
                const dayString = this.getDateString(dayDate);

                // Mark today
                if (dayString === todayString) {
                    dayElement.classList.add('today');
                }

                // Mark checked-in days
                if (this.appData.checkInHistory.includes(dayString)) {
                    dayElement.classList.add('checked-in');
                }

                this.elements.calendarGrid.appendChild(dayElement);
            }
        } catch (error) {
            console.error('Error updating calendar:', error);
        }
    }

    /**
     * Initialize settings
     */
    initializeSettings() {
        try {
            // Populate timezone dropdown
            if (this.elements.timezone) {
                const timezones = Intl.supportedValuesOf('timeZone');
                timezones.forEach(tz => {
                    const option = document.createElement('option');
                    option.value = tz;
                    option.textContent = tz.replace(/_/g, ' ');
                    if (tz === this.appData.settings.timezone) {
                        option.selected = true;
                    }
                    this.elements.timezone.appendChild(option);
                });
            }

            // Set current settings values
            if (this.elements.notifications) {
                this.elements.notifications.checked = this.appData.settings.notifications;
            }
            if (this.elements.reminderTime) {
                this.elements.reminderTime.value = this.appData.settings.reminderTime;
            }
        } catch (error) {
            console.error('Error initializing settings:', error);
        }
    }

    /**
     * Update a setting
     */
    async updateSetting(key, value) {
        try {
            this.appData.settings[key] = value;
            await this.saveData();
            
            if (key === 'notifications' && value) {
                await this.requestNotificationPermission();
            }
            
            this.showToast('Setting updated successfully');
        } catch (error) {
            console.error('Error updating setting:', error);
            this.showToast('Error updating setting');
        }
    }

    /**
     * Export data as JSON file
     */
    exportData() {
        try {
            const dataStr = JSON.stringify(this.appData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `gm-checkin-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            this.showToast('Data exported successfully');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Error exporting data');
        }
    }

    /**
     * Import data from JSON file
     */
    importData() {
        if (this.elements.fileInput) {
            this.elements.fileInput.click();
        }
    }

    /**
     * Handle file import
     */
    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importedData = JSON.parse(text);
            
            // Validate imported data
            if (this.validateImportedData(importedData)) {
                this.appData = {
                    ...this.appData,
                    ...importedData,
                    settings: {
                        ...this.appData.settings,
                        ...importedData.settings
                    }
                };
                
                this.validateData();
                await this.saveData();
                this.updateUI();
                this.updateCalendar();
                this.initializeSettings();
                
                this.showToast('Data imported successfully');
            } else {
                this.showToast('Invalid data format');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showToast('Error importing data');
        }
        
        // Reset file input
        event.target.value = '';
    }

    /**
     * Validate imported data structure
     */
    validateImportedData(data) {
        const requiredFields = ['currentStreak', 'totalCheckIns', 'tokens'];
        return requiredFields.every(field => typeof data[field] === 'number');
    }

    /**
     * Reset all data with confirmation
     */
    async resetData() {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            try {
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
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    }
                };
                
                await this.saveData();
                this.updateUI();
                this.updateCalendar();
                this.initializeSettings();
                this.checkCanCheckIn();
                
                this.showToast('All data has been reset');
            } catch (error) {
                console.error('Error resetting data:', error);
                this.showToast('Error resetting data');
            }
        }
    }

    /**
     * Share progress using Web Share API or fallback
     */
    async shareProgress() {
        const shareData = {
            title: 'GM Check-in Progress',
            text: `I've maintained a ${this.appData.currentStreak}-day check-in streak and earned ${this.appData.tokens} tokens! 🔥`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                this.showToast('Progress copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            this.showToast('Error sharing progress');
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Space or Enter to check in
        if ((event.code === 'Space' || event.code === 'Enter') && 
            event.target === document.body && 
            this.checkCanCheckIn()) {
            event.preventDefault();
            this.handleCheckIn({ currentTarget: this.elements.checkinBtn, clientX: 0, clientY: 0 });
        }
        
        // Tab navigation with numbers
        if (event.code >= 'Digit1' && event.code <= 'Digit3' && event.altKey) {
            event.preventDefault();
            const tabIndex = parseInt(event.code.slice(-1)) - 1;
            const tabs = ['milestones', 'calendar', 'settings'];
            if (tabs[tabIndex]) {
                this.switchTab(tabs[tabIndex]);
            }
        }
    }

    /**
     * Handle visibility change (when user switches tabs/apps)
     */
    handleVisibilityChange() {
        if (!document.hidden) {
            // App became visible, update UI
            this.updateGreeting();
            this.checkCanCheckIn();
        }
    }

    /**
     * Setup periodic updates
     */
    setupPeriodicUpdates() {
        // Update every minute
        setInterval(() => {
            this.updateGreeting();
            this.checkCanCheckIn();
        }, 60000);

        // Check for new day every hour
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                this.checkCanCheckIn();
                this.updateCalendar();
            }
        }, 3600000);
    }

    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        if ('Notification' in window) {
            try {
                this.notificationPermission = await Notification.requestPermission();
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    }

    /**
     * Send notification
     */
    sendNotification(title, body) {
        if ('Notification' in window && this.notificationPermission === 'granted') {
            try {
                new Notification(title, {
                    body,
                    icon: 'icon-192.png',
                    badge: 'icon-192.png'
                });
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gmApp = new GMCheckinApp();
    });
} else {
    window.gmApp = new GMCheckinApp();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GMCheckinApp;
}