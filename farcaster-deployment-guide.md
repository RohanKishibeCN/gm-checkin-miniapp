# Farcaster MiniApp Deployment Guide

Complete guide to deploy GM Check-in MiniApp to Farcaster ecosystem.

## Prerequisites

- GitHub account
- Basic understanding of Farcaster MiniApps
- Access to Farcaster Developer Tools

## Deployment Steps

### 1. GitHub Pages Setup

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/RohanKishibeCN/gm-checkin-miniapp.git
   cd gm-checkin-miniapp
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

3. **Wait for Deployment**
   - GitHub will automatically deploy your app
   - Usually takes 2-5 minutes
   - Your app will be available at: `https://yourusername.github.io/gm-checkin-miniapp`

### 2. Farcaster Integration

#### MiniApp Configuration

The app includes proper Farcaster meta tags:

```html
<!-- Farcaster MiniApp Meta Tags -->
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://yourusername.github.io/gm-checkin-miniapp/og-image.png" />
<meta property="fc:frame:button:1" content="Start Check-in" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://yourusername.github.io/gm-checkin-miniapp" />

<!-- MiniApp Configuration -->
<meta name="fc:miniapp" content='{
    "name": "GM Check-in",
    "description": "Daily check-in to earn USDC rewards",
    "icon": "https://yourusername.github.io/gm-checkin-miniapp/icon-192.png",
    "splashImage": "https://yourusername.github.io/gm-checkin-miniapp/splash.png",
    "version": "1.0.0"
}' />
```

#### SDK Integration

The app properly integrates with Farcaster SDK:

```javascript
// Triple insurance mechanism for SDK ready() call
function initializeFarcasterSDK() {
    // Method 1: Direct call if SDK exists
    if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
        window.sdk.actions.ready();
        return;
    }
    
    // Method 2: Wait for SDK to load
    const checkInterval = setInterval(() => {
        if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
            window.sdk.actions.ready();
            clearInterval(checkInterval);
        }
    }, 100);
    
    // Method 3: PostMessage fallback
    window.parent.postMessage({ type: 'miniapp-ready' }, '*');
}
```

### 3. Testing

#### Local Testing

1. **Start Local Server**
   ```bash
   python3 -m http.server 8080
   ```

2. **Open in Browser**
   ```
   http://localhost:8080
   ```

3. **Verify Functionality**
   - Check-in system works
   - Rewards calculation correct
   - UI responsive on mobile

#### Farcaster Testing

1. **Access Developer Tools**
   - Visit: [https://farcaster.xyz/~/settings/developer-tools](https://farcaster.xyz/~/settings/developer-tools)

2. **Load MiniApp**
   - Enter your GitHub Pages URL
   - Click "Load MiniApp"

3. **Test Features**
   - Environment detection works
   - SDK ready() called successfully
   - No "Ready not called" errors
   - All functionality works in Farcaster

### 4. Production Deployment

#### Required Assets

Create these image assets in your repository:

1. **icon-192.png** (192x192px)
   - App icon for MiniApp listing
   - Should be clear and recognizable

2. **splash.png** (512x512px)
   - Loading screen image
   - Branded with your app design

3. **og-image.png** (1200x630px)
   - Social sharing image
   - Used in Frame previews

#### Verification Checklist

- [ ] GitHub Pages deployment successful
- [ ] All image assets present
- [ ] MiniApp loads without errors
- [ ] SDK ready() called successfully
- [ ] Check-in functionality works
- [ ] Rewards system operational
- [ ] Mobile responsive design
- [ ] Debug panel shows correct status

### 5. Publishing

#### Farcaster Directory

1. **Submit to Directory**
   - Visit Farcaster MiniApp directory
   - Submit your app URL
   - Provide description and screenshots

2. **Community Sharing**
   - Share on Warpcast
   - Engage with Farcaster community
   - Gather feedback and iterate

#### Marketing

1. **Create Launch Cast**
   ```
   🌅 GM Check-in is now live!
   
   Daily check-ins to earn USDC rewards
   ✅ 0.01 USDC per check-in
   🎯 Milestone bonuses
   📱 Native Farcaster MiniApp
   
   Try it now: [your-url]
   ```

2. **Engage Community**
   - Respond to feedback
   - Share updates and improvements
   - Build user base organically

## Troubleshooting

### Common Issues

1. **"Ready not called" Error**
   - Ensure SDK initialization code is correct
   - Check console for error messages
   - Verify iframe environment detection

2. **Assets Not Loading**
   - Check image file paths
   - Ensure GitHub Pages is enabled
   - Verify HTTPS URLs

3. **Functionality Issues**
   - Test in regular browser first
   - Check localStorage permissions
   - Verify JavaScript console for errors

### Debug Information

The app includes a debug panel showing:
- Environment detection
- SDK status
- Ready() call status
- Initialization progress

Use this information to diagnose issues.

## Support

- **GitHub Issues**: Report bugs and feature requests
- **Farcaster Community**: Get help from other developers
- **Documentation**: Refer to official Farcaster docs

## Next Steps

After successful deployment:

1. **Monitor Usage**: Track user engagement
2. **Gather Feedback**: Listen to community input
3. **Iterate**: Improve based on user needs
4. **Scale**: Add new features and capabilities

---

Happy building! 🚀