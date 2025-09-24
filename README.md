# GM Check-in MiniApp

<<<<<<< HEAD
🌅 每日签到赚取 USDC 奖励的 Farcaster MiniApp

## 🚀 功能特性

### 💰 USDC 奖励系统
- **每日签到奖励**: 0.01 USDC
- **里程碑奖励**: 连续签到达到 7天、30天、100天 额外获得 0.01 USDC
- **实时统计**: 总签到次数、总奖励、连续签到天数

### 🔗 Farcaster 集成
- **Quick Auth 认证**: 使用 Farcaster 账户快速登录
- **MiniApp 支持**: 完整的 Farcaster MiniApp 元数据配置
- **Frame 兼容**: 支持 Farcaster Frame 分享
- **社交功能**: 用户信息展示和社交分享

### 📱 用户体验
- **响应式设计**: 完美适配移动端和桌面端
- **现代化 UI**: 渐变背景、毛玻璃效果、流畅动画
- **PWA 支持**: 可安装到主屏幕，离线使用
- **实时反馈**: 签到状态、奖励通知、加载动画

### 🛠 技术特性
- **单文件应用**: 无需构建工具，直接部署
- **本地存储**: 用户数据持久化保存
- **错误处理**: 完善的异常处理和用户提示
- **性能优化**: 轻量级代码，快速加载

## 🌐 在线体验

访问：[https://rohankishibecn.github.io/gm-checkin-miniapp](https://rohankishibecn.github.io/gm-checkin-miniapp)

## 📱 在 Farcaster 中使用

### 方法一：直接访问
在 Warpcast 中分享链接，用户可以直接打开 MiniApp

### 方法二：Frame 集成
```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://rohankishibecn.github.io/gm-checkin-miniapp/preview.png" />
<meta property="fc:frame:button:1" content="开始签到" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://rohankishibecn.github.io/gm-checkin-miniapp" />
```

## 🧪 本地开发

### 启动本地服务器
```bash
# Python 3
python3 -m http.server 8080

# Python 2  
python -m SimpleHTTPServer 8080

# Node.js (如果已安装)
npx serve .
```

然后访问 `http://localhost:8080`

### 文件结构
```
gm-checkin-miniapp/
├── index.html              # 主应用文件
├── manifest-farcaster.json # PWA 配置文件
├── README.md               # 项目说明
└── github-pages-deploy.md  # 部署指南
```

## 🔧 配置说明

### Farcaster MiniApp 配置
应用包含完整的 Farcaster MiniApp 元数据：
- 应用名称和描述
- 图标和预览图
- 功能特性声明
- Frame 集成支持

### PWA 配置
通过 `manifest-farcaster.json` 支持：
- 应用安装到主屏幕
- 离线使用能力
- 原生应用体验

## 🎯 里程碑系统

| 连续签到天数 | 奖励 | 状态 |
|-------------|------|------|
| 每日签到 | 0.01 USDC | ✅ |
| 7 天里程碑 | +0.01 USDC | 🎯 |
| 30 天里程碑 | +0.01 USDC | 🎯 |
| 100 天里程碑 | +0.01 USDC | 🎯 |

## 🔐 安全说明

- **演示版本**: 当前版本为演示，使用模拟的认证和奖励系统
- **数据存储**: 用户数据存储在浏览器本地存储中
- **生产部署**: 实际部署需要连接真实的智能合约和后端服务

## 🚀 部署历史

- **v1.0.0** (2024-09-24): 初始版本发布
  - 完整的签到功能
  - USDC 奖励系统
  - Farcaster 集成
  - 响应式设计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**Built with ❤️ for the Farcaster community**
=======
A daily check-in MiniApp built for the Farcaster ecosystem with Base chain integration.

## Features

- **Daily Check-ins**: Click the "GM!" button to check in daily
- **Streak Tracking**: Build up consecutive day streaks
- **Token Rewards**: Earn 10 tokens per check-in
- **Milestone Rewards**:
  - 7 days: +50 bonus tokens
  - 15 days: +100 bonus tokens  
  - 30 days: +200 bonus tokens
- **Persistent Data**: Your progress is saved locally
- **Responsive Design**: Works on mobile and desktop

## Design

- **Farcaster Purple Theme**: Uses the signature #8A63D2 color
- **Clean Interface**: Simple, modern card-based layout
- **Smooth Animations**: Engaging user interactions

## Technology Stack

- Pure HTML/CSS/JavaScript
- Local Storage for data persistence
- Python HTTP server for development
- Responsive CSS Grid and Flexbox

## Getting Started

1. Clone the repository
2. Navigate to the project directory
3. Start the development server:
   ```bash
   python3 -m http.server 3000
   ```
4. Open http://localhost:3000 in your browser

## Future Enhancements

- Integration with Farcaster MiniApp SDK
- Smart contract deployment on Base chain
- Web3 wallet connectivity
- Real token distribution
- Social sharing features

## License

MIT License
>>>>>>> b3933a4145ac66a094b2782445a115bbd66258f8
