import { useState, useCallback, useEffect, useRef } from 'react'
import { useTimer } from './useTimer'
import { useRandomEvent } from './useRandomEvent'
import { useLeaderboard } from './useLeaderboard'
import { daddyRobotTasks as initialTasks } from '../data/daddyRobotTasks'
import { daddyRobotEvents } from '../data/daddyRobotEvents'
import type { TaskCard, LeaderboardEntry, RandomEvent } from '../types/game'

const TASK_SCORES = [100, 200, 300, 500, 800]
const COMMAND_REWARD = 50
const FAULT_FIX_REWARD = 1000

interface FlyingStar {
  id: number
  x: number
  y: number
}

export function useDaddyRobotGame() {
  const { state, elapsedMs, start, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard('daddy-robot-leaderboard')

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
  const [commandCounts, setCommandCounts] = useState<Record<string, number>>({
    forward: 0, turn: 0, jump: 0, fetch: 0, dance: 0, custom: 0
  })
  const [fixedFaults, setFixedFaults] = useState(0)

  const starIdRef = useRef(0)
  const totalCommands = Object.values(commandCounts).reduce((a, b) => a + b, 0)
  const commandsUsed = Object.values(commandCounts).filter(c => c > 0).length

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
    const bonus = event.duration * (10 + Math.floor(Math.random() * 11))
    setEventStars(prev => prev + bonus)
    spawnStars(bonus)
  }, [spawnStars])

  const { currentEvent, startEvents, stopEvents, clearEvent } = useRandomEvent({
    events: daddyRobotEvents,
    onEventExpire: (event: RandomEvent) => onExpireRef.current?.(event)
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const firstUncompletedIndex = tasks.findIndex(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed).length

  const checkTaskCondition = useCallback((taskId: string): boolean => {
    switch (taskId) {
      case 'warmup': return totalCommands >= 3
      case 'variety': return commandsUsed >= 4
      case 'fix-faults': return fixedFaults >= 2
      case 'all-commands': return commandsUsed >= 6
      case 'master': return totalCommands >= 15
      default: return true
    }
  }, [totalCommands, commandsUsed, fixedFaults])

  const handleIssueCommand = useCallback((commandId: string) => {
    if (state !== 'running' || currentEvent) return
    setCommandCounts(prev => ({
      ...prev,
      [commandId]: (prev[commandId] ?? 0) + 1
    }))
    setEventStars(prev => prev + COMMAND_REWARD)
    spawnStars(COMMAND_REWARD)
  }, [state, currentEvent, spawnStars])

  const fixingRef = useRef(false)

  const handleFaultFixed = useCallback(() => {
    if (fixingRef.current) return
    fixingRef.current = true
    setFixedFaults(prev => prev + 1)
    setEventStars(prev => prev + FAULT_FIX_REWARD)
    spawnStars(FAULT_FIX_REWARD)
    clearEvent()
    setTimeout(() => {
      startEvents()
      fixingRef.current = false
    }, 500)
  }, [clearEvent, startEvents, spawnStars])

  const handleStart = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setEventStars(0)
    setTaskStars(0)
    setFixedFaults(0)
    setCommandCounts({ forward: 0, turn: 0, jump: 0, fetch: 0, dance: 0, custom: 0 })
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
    setFixedFaults(0)
    setCommandCounts({ forward: 0, turn: 0, jump: 0, fetch: 0, dance: 0, custom: 0 })
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
    setFixedFaults(0)
    setCommandCounts({ forward: 0, turn: 0, jump: 0, fetch: 0, dance: 0, custom: 0 })
    reset()
  }, [reset])

  const confirmTask = useCallback((taskId: string, index: number) => {
    if (index !== firstUncompletedIndex || animatingTaskId) return
    if (!checkTaskCondition(taskId)) return
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
  }, [firstUncompletedIndex, tasks, stop, stopEvents, animatingTaskId, checkTaskCondition, spawnStars])

  const isLocked = useCallback((index: number): boolean => {
    return index > firstUncompletedIndex
  }, [firstUncompletedIndex])

  return {
    state, elapsedMs, formatTime,
    currentEvent,
    commandCounts, commandsUsed, totalCommands, handleIssueCommand,
    fixedFaults, handleFaultFixed,
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
