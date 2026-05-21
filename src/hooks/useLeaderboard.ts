import { useCallback } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import type { LeaderboardEntry } from '../types/game'

export function useLeaderboard() {
  const getLeaderboard = useCallback((): LeaderboardEntry[] => {
    return loadFromStorage<LeaderboardEntry[]>('keepy-uppy-leaderboard', [])
  }, [])

  const addEntry = useCallback((name: string, time: number, score: number): LeaderboardEntry[] => {
    const current = getLeaderboard()
    const entry: LeaderboardEntry = {
      name,
      time,
      score,
      date: new Date().toLocaleDateString('zh-CN')
    }
    const next = [...current, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    saveToStorage('keepy-uppy-leaderboard', next)
    return next
  }, [getLeaderboard])

  const getRank = useCallback((score: number): number => {
    const board = getLeaderboard()
    return board.filter(e => e.score > score).length + 1
  }, [getLeaderboard])

  return { getLeaderboard, addEntry, getRank }
}
