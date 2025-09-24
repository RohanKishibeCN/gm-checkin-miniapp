# 🚀 Farcaster 测试网部署完整指南

## 📋 部署前准备

### 1. 确保文件完整性
确保你有以下关键文件：
- `index-farcaster.html` - 主页面
- `app-farcaster-complete.js` - 应用逻辑
- `styles.css` - 样式文件
- `api/me.js` - 认证 API
- `vercel.json` - 部署配置
- `manifest-farcaster.json` - PWA 配置

### 2. 创建必要的图片资源
在项目根目录创建以下图片（可以先用占位符）：

```bash
# 创建图片目录和占位符
mkdir -p public
# 你需要准备这些图片：
# - icon-192.png (192x192px) - 应用图标
# - splash.png (512x512px) - 启动画面
# - og-image.png (1200x630px) - 社交分享图片
```

## 🌐 步骤 1: 部署到 Vercel

### A. 安装 Vercel CLI
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login
```

### B. 初始化项目
```bash
# 在项目目录中运行
vercel

# 按照提示操作：
# ? Set up and deploy "~/your-project"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账户]
# ? Link to existing project? [N/y] n
# ? What's your project's name? gm-checkin-farcaster
# ? In which directory is your code located? ./
```

### C. 配置环境变量
```bash
# 设置域名环境变量
vercel env add DOMAIN
# 输入: your-project-name.vercel.app

# 设置 Neynar API Key（可选，用于获取用户详细信息）
vercel env add NEYNAR_API_KEY
# 输入: your_neynar_api_key_here
```

### D. 部署到生产环境
```bash
# 部署到生产环境
vercel --prod

# 记录部署后的 URL，例如：
# https://gm-checkin-farcaster.vercel.app
```

## 🔧 步骤 2: 更新配置文件

### A. 更新 HTML 元数据
编辑 `index-farcaster.html`，将所有 `your-domain.com` 替换为你的实际域名：

```html
<!-- 更新 Farcaster MiniApp 元数据 -->
<meta name="fc:miniapp" content='{"version":"1","name":"GM Check-in","icon":"https://your-project-name.vercel.app/icon-192.png","splashImageUrl":"https://your-project-name.vercel.app/splash.png","splashBackgroundColor":"#8A63D2","homeUrl":"https://your-project-name.vercel.app/"}' />

<!-- 更新 OpenGraph 元数据 -->
<meta property="og:image" content="https://your-project-name.vercel.app/og-image.png">
<meta property="og:url" content="https://your-project-name.vercel.app/">

<!-- 更新 Twitter Card -->
<meta name="twitter:image" content="https://your-project-name.vercel.app/og-image.png">
```

### B. 重新部署
```bash
# 更新配置后重新部署
vercel --prod
```

## 📱 步骤 3: 在 Farcaster 中测试

### A. 启用开发者模式
1. 访问 [Farcaster 设置页面](https://farcaster.xyz/~/settings/developer-tools)
2. 开启 "Developer Mode"
3. 从左侧边栏点击 "Developer Tools"

### B. 加载你的 MiniApp
1. 在开发者工具的输入框中输入你的 Vercel URL：
   ```
   https://your-project-name.vercel.app
   ```
2. 点击 "Load MiniApp"
3. 观察应用在 Farcaster 环境中的表现

### C. 测试核心功能
- ✅ 应用是否正常加载
- ✅ 用户认证是否工作
- ✅ 签到功能是否正常
- ✅ 分享功能是否正确打开 Warpcast
- ✅ USDC 奖励显示是否正确

## 🔍 步骤 4: 移动端测试

### A. 在移动设备上测试
1. 在手机上打开 Farcaster 应用
2. 如果你有开发者权限，可以在移动端访问开发者工具
3. 或者通过分享链接的方式在移动端测试

### B. 测试响应式设计
- 检查在不同屏幕尺寸下的显示效果
- 测试触摸交互是否流畅
- 验证所有按钮是否容易点击

## 🎯 步骤 5: 性能优化和调试

### A. 使用浏览器开发者工具
```javascript
// 在控制台中检查应用状态
console.log('App loaded:', !!window.gmApp);
console.log('Farcaster detected:', window.gmApp?.isInFarcaster());
console.log('User authenticated:', window.gmApp?.farcasterState?.isAuthenticated);
```

### B. 检查网络请求
- 打开 Network 标签
- 检查 `/api/me` 请求是否成功
- 验证所有静态资源是否正确加载

### C. 性能测试
```bash
# 使用 Lighthouse 测试性能
npx lighthouse https://your-project-name.vercel.app --view
```

## 🐛 常见问题和解决方案

### 问题 1: 应用无法在 Farcaster 中加载
**解决方案:**
- 检查 `fc:miniapp` 元数据格式是否正确
- 确保所有 URL 使用 HTTPS
- 验证 `sdk.actions.ready()` 是否被调用

### 问题 2: 认证失败
**解决方案:**
- 检查 `/api/me` 端点是否可访问
- 验证 CORS 头是否正确设置
- 确保环境变量 `DOMAIN` 设置正确

### 问题 3: 分享功能不工作
**解决方案:**
- 检查 Warpcast URL 格式
- 验证文本编码是否正确
- 测试弹出窗口是否被阻止

### 问题 4: 图片资源无法加载
**解决方案:**
- 确保所有图片文件已上传到 Vercel
- 检查图片 URL 路径是否正确
- 验证图片格式和大小

## 📊 监控和分析

### A. Vercel 分析
- 在 Vercel 仪表板中查看访问统计
- 监控 API 请求成功率
- 检查错误日志

### B. 用户行为分析
```javascript
// 添加简单的分析代码
function trackEvent(eventName, data) {
    console.log('Event:', eventName, data);
    // 可以集成 Google Analytics 或其他分析工具
}

// 在关键操作中调用
trackEvent('checkin_completed', { streak: currentStreak });
trackEvent('milestone_achieved', { milestone: milestoneDay });
```

## 🎉 步骤 6: 发布到 Farcaster 社区

### A. 创建介绍 Cast
```text
🌅 GM! 我刚刚发布了一个新的 Farcaster MiniApp - GM Check-in！

✨ 每日签到赚取真实 USDC 奖励
🔥 建立连续签到习惯
💰 基于 Base 区块链
📱 完美适配 Farcaster

试试看：https://your-project-name.vercel.app

#Farcaster #MiniApp #Base #USDC #Habits
```

### B. 收集用户反馈
- 在 Farcaster 上分享你的 MiniApp
- 收集用户使用反馈
- 根据反馈持续改进

## 🔄 持续部署和更新

### A. 自动部署
```bash
# 设置 Git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 连接到 GitHub
git remote add origin https://github.com/yourusername/gm-checkin-farcaster.git
git push -u origin main

# Vercel 会自动检测 Git 推送并重新部署
```

### B. 版本管理
```json
// 在 package.json 中更新版本
{
  "version": "2.1.0",
  "scripts": {
    "deploy": "vercel --prod",
    "dev": "vercel dev"
  }
}
```

## 📋 部署检查清单

### ✅ 部署前检查
- [ ] 所有文件已准备就绪
- [ ] 图片资源已创建
- [ ] 环境变量已配置
- [ ] 域名已更新到配置文件中

### ✅ 部署后检查
- [ ] 应用可以通过 HTTPS 访问
- [ ] 在浏览器中功能正常
- [ ] 在 Farcaster 开发者工具中正常加载
- [ ] 认证流程工作正常
- [ ] 分享功能正常

### ✅ 测试检查
- [ ] 桌面端测试通过
- [ ] 移动端测试通过
- [ ] 性能测试达标
- [ ] 错误处理正常

## 🎯 下一步

部署成功后，你可以：

1. **优化用户体验**: 根据用户反馈改进界面和功能
2. **添加新功能**: 实现真实的 USDC 奖励分发
3. **扩展社交功能**: 添加排行榜、好友系统等
4. **集成更多区块链功能**: 添加 NFT 奖励、DeFi 集成等

## 🚀 开始部署

现在就开始部署吧！按照上面的步骤，你很快就能在 Farcaster 上看到你的 GM Check-in MiniApp 运行了！

有任何问题随时告诉我，我会帮你解决！🎉