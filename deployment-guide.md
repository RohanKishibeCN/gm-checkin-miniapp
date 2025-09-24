# GM Check-in Farcaster MiniApp 部署指南

## 🚀 快速部署

### 1. Vercel 部署（推荐）

```bash
# 克隆或下载项目文件
# 安装 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel --prod

# 设置环境变量
vercel env add DOMAIN
# 输入: your-app-name.vercel.app

vercel env add NEYNAR_API_KEY
# 输入: your_neynar_api_key (可选)
```

### 2. 更新配置

部署完成后，更新以下文件中的域名：

**index-farcaster.html**:
```html
<meta name="fc:miniapp" content='{"version":"1","name":"GM Check-in","icon":"https://your-app-name.vercel.app/icon-192.png","splashImageUrl":"https://your-app-name.vercel.app/splash.png","splashBackgroundColor":"#8A63D2","homeUrl":"https://your-app-name.vercel.app/"}' />
```

**OpenGraph 元数据**:
```html
<meta property="og:image" content="https://your-app-name.vercel.app/og-image.png">
<meta property="og:url" content="https://your-app-name.vercel.app/">
```

### 3. 创建必要的图片资源

在项目根目录创建以下图片：

- `icon-192.png` (192x192px) - 应用图标
- `splash.png` (512x512px) - 启动画面
- `og-image.png` (1200x630px) - 社交分享图片

## 🔧 Farcaster 集成测试

### 1. 启用开发者模式

1. 访问 [Farcaster 设置](https://farcaster.xyz/~/settings/developer-tools)
2. 开启 "Developer Mode"
3. 从左侧边栏访问开发者工具

### 2. 测试 MiniApp

1. 在 Farcaster 开发者工具中输入你的应用 URL
2. 测试认证流程
3. 验证分享功能

### 3. 发布到 Farcaster

1. 确保应用在 HTTPS 上运行
2. 验证所有元数据正确
3. 提交到 Farcaster MiniApp 目录

## 📱 功能验证清单

### ✅ 基础功能
- [ ] 应用正常加载
- [ ] 签到功能工作
- [ ] 数据持久化
- [ ] 响应式设计

### ✅ Farcaster 集成
- [ ] Quick Auth 认证
- [ ] 用户信息显示
- [ ] Cast 分享功能
- [ ] 里程碑自动分享

### ✅ 性能优化
- [ ] 首屏加载 < 2秒
- [ ] 离线功能正常
- [ ] 错误处理完善
- [ ] 移动端优化

## 🔍 故障排除

### 认证问题
```javascript
// 检查是否在 Farcaster 环境中
console.log('In Farcaster:', app.isInFarcaster());

// 检查认证状态
console.log('Auth state:', app.farcasterState);
```

### API 问题
```javascript
// 测试 API 端点
fetch('/api/me', {
    headers: { 'Authorization': 'Bearer test-token' }
}).then(r => r.json()).then(console.log);
```

### 分享问题
```javascript
// 测试分享 URL 生成
console.log('Share URL:', app.generateCastText());
```

## 🌐 环境变量

```bash
# 必需
DOMAIN=your-app-name.vercel.app

# 可选 - 用于获取用户详细信息
NEYNAR_API_KEY=your_neynar_api_key

# 可选 - 用于区块链功能
BASE_RPC_URL=https://mainnet.base.org
PRIVATE_KEY=your_private_key_for_deployment
```

## 📊 监控和分析

### 1. 用户分析
- 跟踪签到率
- 监控用户留存
- 分析分享转化

### 2. 性能监控
- 页面加载时间
- API 响应时间
- 错误率统计

### 3. Farcaster 特定指标
- 认证成功率
- Cast 分享次数
- MiniApp 打开率

## 🔄 持续优化

### 1. 用户反馈
- 收集用户体验反馈
- 监控错误日志
- 优化交互流程

### 2. 功能迭代
- 添加新的里程碑
- 优化奖励机制
- 增强社交功能

### 3. 技术升级
- 定期更新依赖
- 优化性能
- 增强安全性

## 📞 支持

如果遇到问题，请检查：

1. **控制台错误**: 打开浏览器开发者工具查看错误
2. **网络请求**: 检查 API 调用是否成功
3. **Farcaster 文档**: 参考最新的 MiniApp 文档
4. **社区支持**: 在 Farcaster 开发者社区寻求帮助

---

🎉 **恭喜！你的 GM Check-in MiniApp 现在已经准备好在 Farcaster 上运行了！**