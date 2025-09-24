# GM Check-in Farcaster MiniApp 🌅

A daily check-in habit tracker optimized for Farcaster, built with Base blockchain integration and social sharing features.

## ✨ Farcaster-Specific Features

### 🔐 Authentication
- **Quick Auth Integration**: Seamless sign-in with Farcaster identity
- **No OAuth Required**: Direct cryptographic authentication
- **User Profile Display**: Shows Farcaster username, FID, and avatar

### 📱 Social Features
- **Cast Sharing**: Share achievements directly to Farcaster feeds
- **Auto-Share Milestones**: Automatically prompt sharing for major achievements
- **Community Integration**: Built for Farcaster's social ecosystem
- **Rich Embeds**: Mini App embeds display beautifully in casts

### 🎯 MiniApp Optimizations
- **Splash Screen**: Proper loading experience with `sdk.actions.ready()`
- **Mobile-First**: Optimized for mobile Farcaster clients
- **Fast Loading**: Preconnect hints and optimized assets
- **Frame Compatibility**: Backward compatible with Farcaster Frames

## 🚀 Quick Start for Farcaster

### 1. Enable Developer Mode
1. Visit [Farcaster Developer Settings](https://farcaster.xyz/~/settings/developer-tools)
2. Toggle on "Developer Mode"
3. Access developer tools from the left sidebar

### 2. Deploy to Vercel
```bash
# Clone and setup
git clone <your-repo>
cd gm-checkin-farcaster

# Install dependencies
npm install

# Deploy to Vercel
vercel --prod
```

### 3. Configure Environment Variables
```bash
# In Vercel dashboard, add these environment variables:
DOMAIN=your-domain.vercel.app
NEYNAR_API_KEY=your_neynar_api_key (optional)
```

### 4. Update Manifest
Edit `index-farcaster.html` and update the `fc:miniapp` meta tag:
```html
<meta name="fc:miniapp" content='{"version":"1","name":"GM Check-in","icon":"https://your-domain.vercel.app/icon-192.png","splashImageUrl":"https://your-domain.vercel.app/splash.png","splashBackgroundColor":"#8A63D2","homeUrl":"https://your-domain.vercel.app/"}' />
```

## 📋 Farcaster Requirements Checklist

### ✅ Technical Requirements
- [x] **Node.js 22.11.0+**: Using latest LTS version
- [x] **MiniApp SDK**: Integrated `@farcaster/miniapp-sdk`
- [x] **Quick Auth**: Implemented authentication flow
- [x] **Ready Action**: Calls `sdk.actions.ready()` after loading
- [x] **Error Handling**: Comprehensive error handling for auth failures

### ✅ Metadata Requirements
- [x] **fc:miniapp Meta Tag**: Properly formatted JSON metadata
- [x] **OpenGraph Tags**: Rich social sharing metadata
- [x] **Icons**: Multiple sizes for different contexts
- [x] **Splash Screen**: Custom loading experience

### ✅ User Experience
- [x] **Mobile Optimized**: Responsive design for mobile clients
- [x] **Fast Loading**: Optimized assets and preconnect hints
- [x] **Social Integration**: Native sharing to Farcaster
- [x] **Offline Support**: Works without internet connection

### ✅ API Integration
- [x] **Quick Auth Endpoint**: `/api/me` for user authentication
- [x] **CORS Headers**: Proper cross-origin configuration
- [x] **JWT Validation**: Secure token verification
- [x] **User Resolution**: FID to user profile mapping

## 🔧 Development

### Local Development
```bash
# Start local server
npm run dev

# Test with Farcaster developer tools
# Visit localhost:8000 in Farcaster client
```

### Testing Authentication
```bash
# Test Quick Auth endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/me
```

### Debugging
- Use browser dev tools to check console logs
- Verify `sdk.actions.ready()` is called
- Check network tab for API requests
- Test in Farcaster mobile client

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Deploy with environment variables
vercel --prod

# Set environment variables in Vercel dashboard:
# - DOMAIN: your-domain.vercel.app
# - NEYNAR_API_KEY: (optional for enhanced profiles)
```

### Other Platforms
- **Netlify**: Use `netlify.toml` for configuration
- **Railway**: Deploy with `railway up`
- **Cloudflare Pages**: Use Workers for API endpoints

## 📊 Analytics & Monitoring

### Farcaster Analytics
- Track Mini App opens and interactions
- Monitor cast shares and engagement
- Analyze user retention and streaks

### Performance Monitoring
- Monitor API response times
- Track authentication success rates
- Monitor error rates and types

## 🔒 Security

### Authentication Security
- JWT tokens are verified server-side
- No sensitive data stored in localStorage
- CORS properly configured for Farcaster domains

### Data Privacy
- User data stored locally when possible
- Minimal data collection
- Transparent about blockchain interactions

## 🎨 Customization

### Branding
- Update colors in CSS custom properties
- Replace icons and splash images
- Customize cast sharing messages

### Features
- Add new milestone rewards
- Integrate additional social features
- Extend blockchain functionality

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Enable Farcaster developer mode
3. Test in Farcaster client
4. Submit PR with Farcaster-specific testing

### Testing Checklist
- [ ] Works in Farcaster mobile client
- [ ] Quick Auth flow completes successfully
- [ ] Sharing to casts works properly
- [ ] Splash screen displays and hides correctly
- [ ] All API endpoints respond correctly

## 📚 Resources

### Farcaster Documentation
- [MiniApps Documentation](https://miniapps.farcaster.xyz/)
- [Quick Auth Guide](https://miniapps.farcaster.xyz/docs/sdk/quick-auth)
- [SDK Reference](https://miniapps.farcaster.xyz/docs/sdk)

### Base Blockchain
- [Base Documentation](https://docs.base.org/)
- [Base Mainnet RPC](https://mainnet.base.org)
- [BaseScan Explorer](https://basescan.org/)

### APIs Used
- [Farcaster API](https://api.farcaster.xyz/)
- [Neynar API](https://docs.neynar.com/) (optional)
- [Quick Auth Server](https://auth.farcaster.xyz/)

## 🐛 Troubleshooting

### Common Issues

**App doesn't load in Farcaster**
- Check that `sdk.actions.ready()` is called
- Verify meta tags are properly formatted
- Test in browser first, then Farcaster client

**Authentication fails**
- Verify API endpoint is accessible
- Check CORS headers are set correctly
- Ensure JWT verification is working

**Sharing doesn't work**
- Check cast text length limits
- Verify embed URLs are accessible
- Test share URLs manually

### Getting Help
- Check Farcaster developer Discord
- Review MiniApps documentation
- Test with Farcaster developer tools

---

**Built for the Farcaster ecosystem with ❤️**

Ready to help users build better daily habits while connecting with the Farcaster community!