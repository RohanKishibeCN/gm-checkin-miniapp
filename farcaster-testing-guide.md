# 🧪 Farcaster 开发者工具测试指南

## 🚀 快速开始测试

### 1. 启动本地测试服务器

```bash
# 启动测试服务器
node test-server.js

# 服务器将在 http://localhost:3000 运行
```

### 2. 浏览器测试

1. **打开应用**: 访问 http://localhost:3000
2. **基础功能测试**:
   - ✅ 应用正常加载
   - ✅ 签到按钮可点击
   - ✅ 数据持久化工作
   - ✅ 标签页切换正常

### 3. Farcaster 开发者工具测试

#### 步骤 1: 启用开发者模式
1. 访问 [Farcaster 设置](https://farcaster.xyz/~/settings/developer-tools)
2. 开启 "Developer Mode"
3. 从左侧边栏点击 "Developer Tools"

#### 步骤 2: 测试 MiniApp
1. 在开发者工具中输入: `http://localhost:3000`
2. 点击 "Load MiniApp"
3. 观察加载过程和用户界面

#### 步骤 3: 测试认证流程
1. 检查是否显示 Farcaster 用户信息
2. 验证 FID 和用户名是否正确显示
3. 测试头像是否正常加载

#### 步骤 4: 测试分享功能
1. 完成一次签到
2. 点击 "Share as Cast" 按钮
3. 验证是否正确打开 Warpcast 撰写页面
4. 检查分享文本和嵌入链接

## 📱 移动端测试

### 使用 ngrok 进行移动测试

```bash
# 安装 ngrok (如果还没有)
npm install -g ngrok

# 在另一个终端中运行
ngrok http 3000

# 使用 ngrok 提供的 HTTPS URL 进行测试
```

### 移动端测试清单
- [ ] 触摸交互正常
- [ ] 响应式布局适配
- [ ] 滚动性能良好
- [ ] 按钮大小适合手指点击
- [ ] 文字大小清晰可读

## 🔍 关键测试点

### 1. 启动和加载
```javascript
// 在浏览器控制台检查
console.log('App initialized:', window.gmApp);
console.log('Farcaster state:', window.gmApp.farcasterState);
console.log('In Farcaster:', window.gmApp.isInFarcaster());
```

### 2. 认证状态
```javascript
// 检查认证状态
console.log('Auth token:', window.gmApp.farcasterState.quickAuthToken);
console.log('User info:', window.gmApp.farcasterState.user);
```

### 3. API 调用
```javascript
// 测试 API 端点
fetch('/api/me', {
    headers: { 'Authorization': 'Bearer test-token' }
}).then(r => r.json()).then(console.log);
```

### 4. 分享功能
```javascript
// 测试分享文本生成
console.log('Cast text:', window.gmApp.generateCastText());
console.log('Achievement text:', window.gmApp.generateAchievementText());
```

## 🎯 预期测试结果

### ✅ 成功指标

#### 基础功能
- [x] 应用在 2 秒内完全加载
- [x] 签到按钮响应迅速 (< 100ms)
- [x] 数据正确保存到 localStorage
- [x] 统计数据实时更新

#### Farcaster 集成
- [x] 用户信息正确显示
- [x] 分享按钮打开 Warpcast
- [x] 分享文本格式正确
- [x] 嵌入链接有效

#### 用户体验
- [x] 动画流畅自然
- [x] 错误处理优雅
- [x] 反馈信息清晰
- [x] 移动端体验良好

### ⚠️ 常见问题和解决方案

#### 问题 1: 认证失败
```
症状: 用户信息不显示
解决: 检查 /api/me 端点是否正常响应
```

#### 问题 2: 分享不工作
```
症状: 点击分享按钮无反应
解决: 检查 URL 编码和 Warpcast 链接格式
```

#### 问题 3: 样式问题
```
症状: 在 Farcaster 中显示异常
解决: 检查 CSS 兼容性和响应式设计
```

#### 问题 4: 性能问题
```
症状: 加载缓慢或卡顿
解决: 优化资源加载和 JavaScript 执行
```

## 📊 性能基准

### 加载性能
- **首屏渲染**: < 1.5 秒
- **完全交互**: < 2 秒
- **资源大小**: < 500KB
- **API 响应**: < 200ms

### 交互性能
- **按钮响应**: < 100ms
- **动画帧率**: 60 FPS
- **滚动流畅度**: 无卡顿
- **内存使用**: < 50MB

## 🔧 调试工具

### 浏览器开发者工具
```javascript
// 启用详细日志
localStorage.setItem('debug', 'true');

// 检查应用状态
window.gmApp.appData;
window.gmApp.farcasterState;

// 手动触发功能
window.gmApp.handleCheckIn({ currentTarget: document.getElementById('checkinBtn'), clientX: 0, clientY: 0 });
```

### 网络调试
```bash
# 检查 API 调用
curl -H "Authorization: Bearer test-token" http://localhost:3000/api/me

# 检查静态资源
curl -I http://localhost:3000/styles.css
```

## 📈 优化建议收集

### 用户体验优化
1. **加载体验**: 记录实际加载时间
2. **交互反馈**: 测试所有按钮和动画
3. **错误处理**: 故意触发错误场景
4. **可访问性**: 测试键盘导航和屏读器

### 功能优化
1. **签到流程**: 记录完整操作路径
2. **数据同步**: 测试离线/在线切换
3. **社交分享**: 验证分享内容质量
4. **里程碑系统**: 测试奖励触发

### 技术优化
1. **代码质量**: 检查控制台错误
2. **性能指标**: 使用 Lighthouse 评分
3. **兼容性**: 测试不同浏览器
4. **安全性**: 检查数据处理

## 📝 测试报告模板

```markdown
# GM Check-in MiniApp 测试报告

## 测试环境
- 浏览器: Chrome/Safari/Firefox
- 设备: Desktop/Mobile
- 网络: WiFi/4G
- Farcaster 客户端: Web/Mobile

## 功能测试结果
- [ ] 基础签到功能
- [ ] 数据持久化
- [ ] 用户界面响应
- [ ] Farcaster 认证
- [ ] 社交分享

## 性能测试结果
- 首屏加载时间: ___ 秒
- 完全交互时间: ___ 秒
- Lighthouse 评分: ___/100

## 发现的问题
1. 问题描述
   - 重现步骤
   - 预期结果
   - 实际结果

## 优化建议
1. 建议内容
   - 优先级: 高/中/低
   - 预期效果
```

## 🎉 测试完成后

1. **记录结果**: 填写测试报告
2. **收集反馈**: 记录用户体验问题
3. **性能分析**: 使用 Lighthouse 等工具
4. **优化计划**: 制定改进方案

准备好开始测试了吗？运行 `node test-server.js` 开始吧！🚀