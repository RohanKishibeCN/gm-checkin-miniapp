import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      // 这里需要使用 Farcaster 开发者工具生成域名验证签名
      // 访问: https://farcaster.xyz/~/developers/mini-apps/manifest
      header: "YOUR_HEADER_HERE",
      payload: "YOUR_PAYLOAD_HERE", 
      signature: "YOUR_SIGNATURE_HERE"
    },
    miniapp: {
      version: "1",
      name: "GM Check-in",
      iconUrl: "https://your-domain.com/icon.png", // 需要替换
      homeUrl: "https://your-domain.com", // 需要替换
      imageUrl: "https://your-domain.com/og-image.png", // 需要替换
      buttonTitle: "🌅 GM Check-in",
      splashImageUrl: "https://your-domain.com/splash.png", // 需要替换
      splashBackgroundColor: "#667eea",
      description: "Check in daily with GM and earn rewards on Base chain. Build your streak and unlock special bonuses!",
      requiredChains: ["eip155:8453"], // Base chain
      requiredCapabilities: [
        "actions.ready",
        "wallet.getEthereumProvider"
      ]
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300', // 5分钟缓存
    },
  })
}