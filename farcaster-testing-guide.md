# Farcaster MiniApp Testing Guide

Comprehensive guide for testing the GM Check-in MiniApp in Farcaster environment.

## Testing Overview

This guide covers testing the GM Check-in MiniApp to ensure it works perfectly in the Farcaster ecosystem.

## Pre-Testing Setup

### 1. Environment Preparation

**Local Development Server**
```bash
# Start local server for testing
python3 -m http.server 8080

# Access at: http://localhost:8080
```

**GitHub Pages Deployment**
- Ensure your app is deployed to GitHub Pages
- URL format: `https://yourusername.github.io/gm-checkin-miniapp`

### 2. Required Assets

Verify these assets exist in your repository:
- `icon-192.png` (192x192px app icon)
- `splash.png` (512x512px splash screen)
- `og-image.png` (1200x630px social image)

## Testing Phases

### Phase 1: Local Browser Testing

#### Basic Functionality Test

1. **Open in Regular Browser**
   ```
   http://localhost:8080
   ```

2. **Verify Core Features**
   - [ ] App loads without errors
   - [ ] UI displays correctly
   - [ ] Check-in button works
   - [ ] Statistics update properly
   - [ ] Local storage saves data

3. **Debug Panel Verification**
   - Environment: "Regular Browser"
   - SDK Status: "Not Loaded" (expected)
   - Ready Called: "Called" (should be true)
   - Initialization: "Complete"

#### Mobile Responsiveness

1. **Open Developer Tools**
   - Press F12 or right-click → Inspect
   - Toggle device toolbar (mobile view)

2. **Test Different Screen Sizes**
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)

3. **Verify Mobile Experience**
   - [ ] Layout adapts properly
   - [ ] Buttons are touch-friendly
   - [ ] Text is readable
   - [ ] No horizontal scrolling

### Phase 2: Farcaster Developer Tools Testing

#### Access Developer Tools

1. **Navigate to Farcaster Developer Tools**
   ```
   https://farcaster.xyz/~/settings/developer-tools
   ```

2. **Login Requirements**
   - Must be logged into Farcaster
   - Need developer access (may require approval)

#### Load MiniApp

1. **Enter App URL**
   - Input your GitHub Pages URL
   - Format: `https://yourusername.github.io/gm-checkin-miniapp`

2. **Click "Load MiniApp"**
   - Wait for loading to complete
   - Watch for any error messages

#### Critical Verification Points

**Environment Detection**
- Debug panel should show: "Farcaster MiniApp"
- Confirms iframe environment detection works

**SDK Integration**
- SDK Status: May show "Not Loaded" (this is often normal)
- Ready Called: Must show "Called" ✅
- No "Ready not called" error should appear

**Functionality Testing**
- [ ] App loads completely
- [ ] No splash screen persistence
- [ ] Check-in button responsive
- [ ] Rewards calculation works
- [ ] Data persistence functions

### Phase 3: Feature-Specific Testing

#### Check-in System

1. **First Check-in**
   - Click "Check In Now" button
   - Verify reward: 0.01 USDC
   - Check statistics update
   - Button changes to "✅ Checked In"

2. **Duplicate Check-in Prevention**
   - Try checking in again same day
   - Should show: "Already checked in today!"
   - Button remains disabled

3. **Data Persistence**
   - Refresh the page
   - Verify check-in status maintained
   - Statistics should persist

#### Streak System

1. **Simulate Multi-day Usage**
   ```javascript
   // Console command to simulate past check-ins
   const pastCheckins = [
       { date: new Date(Date.now() - 86400000).toISOString(), reward: 0.01 }, // Yesterday
       { date: new Date(Date.now() - 172800000).toISOString(), reward: 0.01 }, // 2 days ago
   ];
   localStorage.setItem('gm_checkins', JSON.stringify(pastCheckins));
   location.reload();
   ```

2. **Verify Streak Calculation**
   - Current streak should update correctly
   - Total check-ins should be accurate

#### Milestone Rewards

1. **Test 7-day Milestone**
   ```javascript
   // Simulate 6 days of check-ins
   const checkins = [];
   for(let i = 6; i >= 1; i--) {
       checkins.push({
           date: new Date(Date.now() - (i * 86400000)).toISOString(),
           reward: 0.01
       });
   }
   localStorage.setItem('gm_checkins', JSON.stringify(checkins));
   location.reload();
   // Now check in for 7th day - should get bonus
   ```

2. **Verify Milestone Bonus**
   - 7th day check-in should give 0.02 USDC
   - Notification should mention milestone bonus

### Phase 4: Error Handling Testing

#### Network Issues

1. **Offline Testing**
   - Disconnect internet
   - Verify app still loads (cached)
   - Check graceful error handling

2. **Slow Connection**
   - Throttle network in dev tools
   - Verify loading states work properly

#### Edge Cases

1. **Invalid Data**
   ```javascript
   // Test with corrupted localStorage
   localStorage.setItem('gm_checkins', 'invalid-json');
   location.reload();
   // Should handle gracefully
   ```

2. **Date Edge Cases**
   - Test around midnight
   - Verify timezone handling
   - Check date boundary conditions

### Phase 5: Performance Testing

#### Load Time Analysis

1. **Measure Load Performance**
   - Open Network tab in dev tools
   - Reload page and measure:
     - First Contentful Paint
     - Largest Contentful Paint
     - Time to Interactive

2. **Target Metrics**
   - Load time: < 2 seconds
   - First paint: < 1 second
   - Interactive: < 3 seconds

#### Memory Usage

1. **Monitor Memory**
   - Open Performance tab
   - Record memory usage over time
   - Check for memory leaks

2. **Stress Testing**
   - Simulate many check-ins
   - Verify performance remains stable

## Common Issues & Solutions

### Issue: "Ready not called" Error

**Symptoms:**
- Error message appears in Farcaster
- Splash screen persists
- App doesn't load properly

**Solution:**
- Verify SDK initialization code
- Check iframe environment detection
- Ensure postMessage fallback works

**Debug Steps:**
```javascript
// Check environment
console.log('In iframe:', window.parent !== window);

// Check SDK
console.log('SDK exists:', typeof window.sdk !== 'undefined');

// Manual ready call
if (window.parent !== window) {
    window.parent.postMessage({ type: 'miniapp-ready' }, '*');
}
```

### Issue: Assets Not Loading

**Symptoms:**
- Images don't display
- 404 errors in console
- Broken layout

**Solution:**
- Verify file paths are correct
- Ensure GitHub Pages is enabled
- Check HTTPS URLs

### Issue: Functionality Broken in Farcaster

**Symptoms:**
- Works locally but not in Farcaster
- JavaScript errors in iframe
- Features don't respond

**Solution:**
- Check console for errors
- Verify iframe permissions
- Test localStorage access

## Testing Checklist

### Pre-Deployment
- [ ] Local browser testing complete
- [ ] Mobile responsiveness verified
- [ ] All features working
- [ ] No console errors
- [ ] Assets loading properly

### Farcaster Integration
- [ ] Loads in developer tools
- [ ] No "Ready not called" error
- [ ] Environment detected correctly
- [ ] SDK integration working
- [ ] All functionality operational

### User Experience
- [ ] Intuitive interface
- [ ] Clear feedback messages
- [ ] Responsive interactions
- [ ] Error handling graceful
- [ ] Performance acceptable

### Data Integrity
- [ ] Check-ins save correctly
- [ ] Streaks calculate properly
- [ ] Rewards accurate
- [ ] Milestones trigger correctly
- [ ] Data persists across sessions

## Reporting Issues

When reporting issues, include:

1. **Environment Details**
   - Browser type and version
   - Device type (mobile/desktop)
   - Farcaster client version

2. **Steps to Reproduce**
   - Exact sequence of actions
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Debug Information**
   - Console error messages
   - Debug panel status
   - Network request failures

4. **Impact Assessment**
   - Severity level
   - User experience impact
   - Frequency of occurrence

## Success Criteria

The MiniApp is ready for production when:

- ✅ Loads successfully in Farcaster
- ✅ No "Ready not called" errors
- ✅ All core features functional
- ✅ Mobile experience excellent
- ✅ Performance meets targets
- ✅ Error handling robust
- ✅ Data integrity maintained

---

Happy testing! 🧪