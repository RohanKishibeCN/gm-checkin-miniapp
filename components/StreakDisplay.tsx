'use client'

import { Flame, Trophy, Coins } from 'lucide-react'

interface StreakDisplayProps {
  currentStreak: number
  totalCheckIns: number
  tokens: number
}

export function StreakDisplay({ currentStreak, totalCheckIns, tokens }: StreakDisplayProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Current Streak */}
      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6">
        <div className="flex items-center justify-center mb-2">
          <Flame className="w-6 h-6 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Current Streak</h2>
        </div>
        <div className="text-3xl font-bold text-orange-600">
          {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Check-ins */}
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <Trophy className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-xl font-bold text-blue-600">{totalCheckIns}</div>
        </div>

        {/* Tokens */}
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <Coins className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Tokens</div>
          <div className="text-xl font-bold text-yellow-600">{tokens}</div>
        </div>
      </div>
    </div>
  )
}