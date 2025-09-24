#!/bin/bash

# GM Check-in Farcaster MiniApp 快速部署脚本
# 使用方法: chmod +x quick-deploy.sh && ./quick-deploy.sh

echo "🚀 开始部署 GM Check-in Farcaster MiniApp..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录 Vercel
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "请先登录 Vercel:"
    vercel login
fi

# 创建占位符图片（如果不存在）
echo "🖼️  检查图片资源..."
if [ ! -f "icon-192.png" ]; then
    echo "⚠️  警告: icon-192.png 不存在，请手动添加 192x192px 的应用图标"
fi

if [ ! -f "splash.png" ]; then
    echo "⚠️  警告: splash.png 不存在，请手动添加 512x512px 的启动画面"
fi

if [ ! -f "og-image.png" ]; then
    echo "⚠️  警告: og-image.png 不存在，请手动添加 1200x630px 的社交分享图片"
fi

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

# 获取部署 URL
DEPLOY_URL=$(vercel ls | grep gm-checkin | head -1 | awk '{print $2}')

if [ -z "$DEPLOY_URL" ]; then
    echo "❌ 无法获取部署 URL，请手动检查 Vercel 仪表板"
    exit 1
fi

echo "✅ 部署成功！"
echo ""
echo "📱 你的 MiniApp 地址: https://$DEPLOY_URL"
echo ""
echo "🔧 下一步操作:"
echo "1. 访问 https://farcaster.xyz/~/settings/developer-tools"
echo "2. 开启 Developer Mode"
echo "3. 在开发者工具中输入: https://$DEPLOY_URL"
echo "4. 点击 'Load MiniApp' 测试"
echo ""
echo "⚠️  重要提醒:"
echo "- 请确保已添加必要的图片资源 (icon-192.png, splash.png, og-image.png)"
echo "- 如需更新域名配置，请编辑 index-farcaster.html 中的元数据"
echo "- 设置环境变量: vercel env add DOMAIN 并输入 $DEPLOY_URL"
echo ""
echo "🎉 享受你的 Farcaster MiniApp 吧！"