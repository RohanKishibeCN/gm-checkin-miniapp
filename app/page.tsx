'use client'

import { useState, useEffect } from 'react'
import { CheckInButton } from '@/components/CheckInButton'
import { StreakDisplay } from '@/components/StreakDisplay'
import { Sun, Moon, Star } from 'lucide-react'

interface CheckInData {
  lastCheckIn: string | null
  currentStreak: number
  totalCheckIns: number
  tokens: number
}

export default function Home() {
  const [checkInData, setCheckInData] = useState<CheckInData>({
    lastCheckIn: null,
    currentStreak: 0,
    totalCheckIns: 0,
    tokens: 0
  })

  const [canCheckIn, setCanCheckIn] = useState(true)

  useEffect(() => {
    // 从 localStorage 加载数据
    const savedData = localStorage.getItem('gmCheckInData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setCheckInData(data)
      
      // 检查是否可以打卡（每天只能打卡一次）
      if (data.lastCheckIn) {
        const lastCheckIn = new Date(data.lastCheckIn)
        const today = new Date()
        const isToday = lastCheckIn.toDateString() === today.toDateString()
        setCanCheckIn(!isToday)
      }
    }
  }, [])

  const handleCheckIn = () => {
    const now = new Date()
    const today = now.toDateString()
    
    let newStreak = 1
    let tokensEarned = 10 // 基础奖励
    
    if (checkInData.lastCheckIn) {
      const lastCheckIn = new Date(checkInData.lastCheckIn)
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      
      // 如果昨天打过卡，连续天数+1
      if (lastCheckIn.toDateString() === yesterday.toDateString()) {
        newStreak = checkInData.currentStreak + 1
      }
    }
    
    // 计算奖励
    if (newStreak === 7) {
      tokensEarned += 50 // 7天奖励
    } else if (newStreak === 15) {
      tokensEarned += 100 // 15天奖励
    } else if (newStreak === 30) {
      tokensEarned += 200 // 30天奖励
    }
    
    const newData = {
      lastCheckIn: now.toISOString(),
      currentStreak: newStreak,
      totalCheckIns: checkInData.totalCheckIns + 1,
      tokens: checkInData.tokens + tokensEarned
    }
    
    setCheckInData(newData)
    setCanCheckIn(false)
    
    // 保存到 localStorage
    localStorage.setItem('gmCheckInData', JSON.stringify(newData))
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { greeting: 'Good Morning', icon: Sun }
    if (hour < 18) return { greeting: 'Good Afternoon', icon: Sun }
    return { greeting: 'Good Evening', icon: Moon }
  }

  const { greeting, icon: TimeIcon } = getTimeOfDay()

  return (
    <main className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <TimeIcon className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">{greeting}!</h1>
          </div>
          <p className="text-gray-600">Ready to say GM?</p>
        </div>

        {/* Streak Display */}
        <StreakDisplay 
          currentStreak={checkInData.currentStreak}
          totalCheckIns={checkInData.totalCheckIns}
          tokens={checkInData.tokens}
        />

        {/* Check-in Button */}
        <div className="mb-8">
          <CheckInButton 
            canCheckIn={canCheckIn}
            onCheckIn={handleCheckIn}
          />
        </div>

        {/* Status */}
        <div className="text-sm text-gray-500">
          {canCheckIn ? (
            <p>✨ Ready for today's check-in!</p>
          ) : (
            <p>✅ Already checked in today. Come back tomorrow!</p>
          )}
        </div>

        {/* Milestone Progress */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Milestone Rewards</h3>
          <div className="space-y-2 text-xs">
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              checkInData.currentStreak >= 7 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <span>🎯 7 Days</span>
              <span>{checkInData.currentStreak >= 7 ? '✅ +50 tokens' : '+50 tokens'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              checkInData.currentStreak >= 15 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <span>🔥 15 Days</span>
              <span>{checkInData.currentStreak >= 15 ? '✅ +100 tokens' : '+100 tokens'}</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              checkInData.currentStreak >= 30 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <span>⭐ 30 Days</span>
              <span>{checkInData.currentStreak >= 30 ? '✅ +200 tokens' : '+200 tokens'}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}