'use client'

import { useState } from 'react'
import { Coffee, Sparkles } from 'lucide-react'

interface CheckInButtonProps {
  canCheckIn: boolean
  onCheckIn: () => void
}

export function CheckInButton({ canCheckIn, onCheckIn }: CheckInButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (!canCheckIn) return
    
    setIsAnimating(true)
    onCheckIn()
    
    // 重置动画状态
    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <button
      onClick={handleClick}
      disabled={!canCheckIn}
      className={`
        relative w-32 h-32 rounded-full font-bold text-xl transition-all duration-300 transform
        ${canCheckIn 
          ? 'bg-gradient-to-br from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 hover:scale-105 shadow-lg hover:shadow-xl text-white' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
        ${isAnimating ? 'animate-pulse scale-110' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center">
        {canCheckIn ? (
          <>
            <Coffee className="w-8 h-8 mb-1" />
            <span>GM!</span>
          </>
        ) : (
          <>
            <Sparkles className="w-8 h-8 mb-1" />
            <span>Done!</span>
          </>
        )}
      </div>
      
      {/* 动画效果 */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-50 animate-ping"></div>
      )}
    </button>
  )
}