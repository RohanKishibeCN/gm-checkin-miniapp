/**
 * 创建占位符图片的脚本
 * 运行: node create-images.js
 */

const fs = require('fs');
const path = require('path');

// 创建 SVG 占位符图片
function createSVGIcon(width, height, text, filename) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8A63D2;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#9D7ADB;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gradient)" rx="20"/>
    <text x="50%" y="40%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.15}" font-weight="bold">GM</text>
    <text x="50%" y="55%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.08}">Check-in</text>
    <text x="50%" y="75%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.12}">🌅</text>
</svg>`;

    fs.writeFileSync(filename, svg);
    console.log(`✅ 创建了 ${filename} (${width}x${height})`);
}

// 创建 HTML 占位符图片
function createHTMLImage(width, height, text, filename) {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, #8A63D2, #9D7ADB);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: white;
        }
        .logo { font-size: ${Math.min(width, height) * 0.15}px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { font-size: ${Math.min(width, height) * 0.08}px; margin-bottom: 20px; }
        .emoji { font-size: ${Math.min(width, height) * 0.12}px; }
        .description { font-size: ${Math.min(width, height) * 0.06}px; text-align: center; margin-top: 20px; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="logo">GM Check-in</div>
    <div class="subtitle">Daily Habit Tracker</div>
    <div class="emoji">🌅</div>
    <div class="description">Build habits • Earn USDC • On Base</div>
</body>
</html>`;

    fs.writeFileSync(filename.replace('.png', '.html'), html);
    console.log(`✅ 创建了 ${filename.replace('.png', '.html')} (${width}x${height}) - 请手动转换为 PNG`);
}

console.log('🖼️  创建 GM Check-in MiniApp 占位符图片...\n');

// 创建应用图标 (192x192)
createSVGIcon(192, 192, 'GM\nCheck-in', 'icon-192.svg');

// 创建启动画面 (512x512)
createSVGIcon(512, 512, 'GM\nCheck-in', 'splash.svg');

// 创建社交分享图片模板 (1200x630)
createHTMLImage(1200, 630, 'GM Check-in', 'og-image.png');

console.log('\n📝 下一步操作:');
console.log('1. 将 SVG 文件转换为 PNG 格式:');
console.log('   - icon-192.svg → icon-192.png');
console.log('   - splash.svg → splash.png');
console.log('2. 将 og-image.html 在浏览器中打开并截图保存为 og-image.png');
console.log('3. 或者使用在线工具如 https://convertio.co/svg-png/ 进行转换');
console.log('\n💡 提示: 你也可以使用自己设计的图片替换这些占位符');
console.log('🎨 建议使用 Figma、Canva 或其他设计工具创建更精美的图片');

// 创建图片要求说明文件
const imageRequirements = `# 📸 GM Check-in MiniApp 图片资源要求

## 必需的图片文件

### 1. icon-192.png
- **尺寸**: 192x192 像素
- **格式**: PNG
- **用途**: 应用图标，显示在 Farcaster 中
- **设计要求**: 
  - 清晰的应用标识
  - 适合小尺寸显示
  - 与品牌色彩一致

### 2. splash.png
- **尺寸**: 512x512 像素
- **格式**: PNG
- **用途**: 启动画面背景
- **设计要求**:
  - 吸引人的视觉效果
  - 体现应用主题
  - 与 splashBackgroundColor (#8A63D2) 协调

### 3. og-image.png
- **尺寸**: 1200x630 像素
- **格式**: PNG
- **用途**: 社交媒体分享预览图
- **设计要求**:
  - 包含应用名称和简短描述
  - 视觉吸引力强
  - 文字清晰可读

## 设计建议

### 色彩方案
- 主色: #8A63D2 (紫色)
- 辅色: #9D7ADB (浅紫色)
- 背景: 渐变或纯色
- 文字: 白色或深色

### 设计元素
- 🌅 日出图标 (代表早晨签到)
- 💰 USDC 符号 (代表奖励)
- 🔥 火焰图标 (代表连续签到)
- 📱 现代简洁的设计风格

### 工具推荐
- **在线工具**: Canva, Figma
- **专业软件**: Adobe Photoshop, Sketch
- **AI 工具**: Midjourney, DALL-E
- **图标库**: Heroicons, Feather Icons

## 快速创建方法

### 方法 1: 使用 Canva
1. 访问 canva.com
2. 搜索对应尺寸的模板
3. 自定义颜色和文字
4. 下载 PNG 格式

### 方法 2: 使用 Figma
1. 创建对应尺寸的画布
2. 添加渐变背景
3. 添加文字和图标
4. 导出为 PNG

### 方法 3: 使用 AI 工具
提示词示例:
"Create a modern app icon for a daily habit tracker called 'GM Check-in', purple gradient background, sunrise emoji, clean typography, 192x192 pixels"

## 验证清单

部署前请确保:
- [ ] 所有图片文件存在且命名正确
- [ ] 图片尺寸符合要求
- [ ] 图片质量清晰
- [ ] 设计风格一致
- [ ] 在不同背景下都清晰可见

完成后，你的 MiniApp 将在 Farcaster 中呈现专业的视觉效果！🎨`;

fs.writeFileSync('IMAGE-REQUIREMENTS.md', imageRequirements);
console.log('\n📋 已创建 IMAGE-REQUIREMENTS.md 文件，包含详细的图片要求说明');