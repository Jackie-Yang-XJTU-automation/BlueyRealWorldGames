import { useCallback } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import type { LeaderboardEntry } from '../types/game'

export function useLeaderboard(storageKey = 'keepy-uppy-leaderboard') {
  const getLeaderboard = useCallback((): LeaderboardEntry[] => {
    return loadFromStorage<LeaderboardEntry[]>(storageKey, [])
  }, [storageKey])

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
    saveToStorage(storageKey, next)
    return next
  }, [getLeaderboard, storageKey])

  const getRank = useCallback((score: number): number => {
    const board = getLeaderboard()
    return board.filter(e => e.score > score).length + 1
  }, [getLeaderboard])

  return { getLeaderboard, addEntry, getRank }
}
