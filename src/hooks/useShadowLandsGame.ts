import { useState, useCallback, useEffect, useRef } from 'react'
import { useTimer } from './useTimer'
import { useRandomEvent } from './useRandomEvent'
import { useLeaderboard } from './useLeaderboard'
import { shadowLandsTasks as initialTasks } from '../data/shadowLandsTasks'
import { shadowLandsEvents } from '../data/shadowLandsEvents'
import type { TaskCard, LeaderboardEntry, RandomEvent } from '../types/game'

const TASK_SCORES = [100, 200, 300, 500, 800]

interface FlyingStar {
  id: number
  x: number
  y: number
}

export function useShadowLandsGame() {
  const { state, elapsedMs, start, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard('shadowlands-leaderboard')

  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks)
  const [showResult, setShowResult] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentRank, setCurrentRank] = useState<number | undefined>()
  const [eventStars, setEventStars] = useState(0)
  const [taskStars, setTaskStars] = useState(0)
  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([])
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null)
  const [scoreBump, setScoreBump] = useState(false)

  const starIdRef = useRef(0)

  const timeStars = state === 'idle' ? 0 : Math.floor(elapsedMs / 1000) * 10
  const totalStars = timeStars + taskStars + eventStars

  const spawnStars = useCallback((count: number) => {
    const numStars = Math.min(Math.ceil(count / 50), 12)
    for (let i = 0; i < numStars; i++) {
      const id = starIdRef.current++
      const x = (Math.random() - 0.5) * 160
      const y = -(80 + Math.random() * 120)
      setTimeout(() => {
        setFlyingStars(prev => [...prev, { id, x, y }])
        setTimeout(() => {
          setFlyingStars(prev => prev.filter(s => s.id !== id))
        }, 1000)
      }, i * 60)
    }
    setScoreBump(true)
    setTimeout(() => setScoreBump(false), 400)
  }, [])

  const onExpireRef = useRef<((event: RandomEvent) => void) | undefined>(undefined)
  onExpireRef.current = useCallback((event: RandomEvent) => {
    const bonus = event.duration * (20 + Math.floor(Math.random() * 21))
    setEventStars(prev => prev + bonus)
    spawnStars(bonus)
  }, [spawnStars])

  const { currentEvent, startEvents, stopEvents } = useRandomEvent({
    events: shadowLandsEvents,
    onEventExpire: (event: RandomEvent) => onExpireRef.current?.(event)
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const firstUncompletedIndex = tasks.findIndex(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed).length

  const handleStart = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setEventStars(0)
    setTaskStars(0)
    start()
    startEvents()
  }, [start, startEvents])

  const handleLand = useCallback(() => {
    if (state !== 'running') return
    stop()
    stopEvents()
    setShowResult(true)
    const rank = getRank(totalStars)
    setCurrentRank(rank)
  }, [state, stop, stopEvents, totalStars, getRank])

  const handleSaveScore = useCallback(() => {
    const name = playerName.trim() || '神秘玩家'
    const updated = addEntry(name, elapsedMs, totalStars)
    setLeaderboard(updated)
    setShowResult(false)
    setShowVictory(false)
    setPlayerName('')
    setTaskStars(0)
    setEventStars(0)
    setTasks(initialTasks)
    reset()
  }, [playerName, elapsedMs, totalStars, addEntry, reset])

  const handleReset = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setPlayerName('')
    setCurrentRank(undefined)
    setTasks(initialTasks)
    setTaskStars(0)
    setEventStars(0)
    reset()
  }, [reset])

  const confirmTask = useCallback((taskId: string, index: number) => {
    if (index !== firstUncompletedIndex || animatingTaskId) return
    setAnimatingTaskId(taskId)
    const earned = TASK_SCORES[index]

    setTimeout(() => {
      const newTasks = tasks.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      )
      setTasks(newTasks)
      setAnimatingTaskId(null)
      setTaskStars(prev => prev + earned)
      spawnStars(earned)

      const allDone = newTasks.every(t => t.completed)
      if (allDone) {
        setTimeout(() => {
          stop()
          stopEvents()
          setShowVictory(true)
        }, 600)
      }
    }, 500)
  }, [firstUncompletedIndex, tasks, stop, stopEvents, animatingTaskId, spawnStars])

  const isLocked = useCallback((index: number): boolean => {
    return index > firstUncompletedIndex
  }, [firstUncompletedIndex])

  return {
    state, elapsedMs, formatTime,
    currentEvent,
    tasks, completedTasks, firstUncompletedIndex, animatingTaskId,
    totalStars, timeStars, taskStars, eventStars, scoreBump,
    flyingStars,
    showResult, showVictory,
    playerName, setPlayerName,
    leaderboard, currentRank,
    handleStart, handleLand, handleSaveScore, handleReset,
    confirmTask, isLocked,
  }
}
