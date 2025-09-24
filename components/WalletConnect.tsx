'use client'

import { useAccount, useConnect } from 'wagmi'
import { Wallet } from 'lucide-react'

export function WalletConnect() {
  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()

  if (isConnected) {
    return (
      <div className="streak-card text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">Connected</span>
        </div>
        <p className="text-xs text-gray-500 font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>
    )
  }

  return (
    <div className="streak-card text-center">
      <button
        onClick={() => connect({ connector: connectors[0] })}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Connect to start earning rewards
      </p>
    </div>
  )
}