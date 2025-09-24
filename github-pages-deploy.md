# GitHub Pages 部署指南

由于你的 Node.js 版本较低，我们使用 GitHub Pages 来部署 Farcaster MiniApp，这是最简单的方法。

## 快速部署步骤

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称：`gm-checkin-farcaster`
4. 设置为 Public（公开）
5. 勾选 "Add a README file"
6. 点击 "Create repository"

### 2. 上传文件

将以下文件上传到你的 GitHub 仓库：

**主要文件：**
- `simple-deploy.html` （重命名为 `index.html`）
- `manifest-farcaster.json`

**可选文件：**
- `README.md`

### 3. 启用 GitHub Pages

1. 在你的仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 选择 "/ (root)" 文件夹
6. 点击 "Save"

### 4. 获取部署链接

几分钟后，你的应用将在以下地址可用：
```
https://你的用户名.github.io/gm-checkin-farcaster
```

## 在 Farcaster 中测试

### 1. 使用 Farcaster 开发者工具

1. 访问 [Farcaster Developer Tools](https://warpcast.com/~/developers)
2. 选择 "MiniApp Testing"
3. 输入你的 GitHub Pages URL
4. 点击 "Test MiniApp"

### 2. 创建 Frame

你也可以创建一个 Frame 来分享：

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://你的用户名.github.io/gm-checkin-farcaster/preview.png" />
<meta property="fc:frame:button:1" content="开始签到" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://你的用户名.github.io/gm-checkin-farcaster" />
```

## 本地测试（可选）

如果你想在本地测试，可以使用 Python 的简单服务器：

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然后访问 `http://localhost:8000/simple-deploy.html`

## 功能特性

这个简化版本包含：

✅ **完整的 Farcaster MiniApp 支持**
- 正确的 meta 标签配置
- Frame 集成支持
- 响应式设计

✅ **USDC 奖励系统**
- 每日签到奖励 0.01 USDC
- 里程碑奖励（7天、30天、100天）
- 奖励统计和追踪

✅ **用户体验**
- 现代化 UI 设计
- 移动端优化
- 实时状态更新
- 本地数据存储

✅ **社交功能**
- Farcaster 认证集成
- 用户信息显示
- 分享功能准备

## 下一步

1. 完成 GitHub Pages 部署
2. 在 Farcaster 开发者工具中测试
3. 根据测试结果进行调整
4. 准备正式发布

## 注意事项

- 这是一个演示版本，实际的 USDC 奖励需要连接真实的智能合约
- 用户数据目前存储在本地，生产环境需要后端数据库
- 认证流程是模拟的，实际部署需要真实的 Farcaster 认证

需要我帮你完成任何步骤吗？