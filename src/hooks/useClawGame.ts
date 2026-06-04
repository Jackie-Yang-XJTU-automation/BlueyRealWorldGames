import { useState, useCallback, useEffect } from 'react'
import { useTimer } from './useTimer'
import { useLeaderboard } from './useLeaderboard'
import { buildClawTaskLadder, clawTasks } from '../data/clawTasks'
import type { ClawTask } from '../data/clawTasks'
import type { LeaderboardEntry } from '../types/game'

export type ClawPhase = 'idle' | 'countdown' | 'task' | 'claw' | 'result' | 'finished'
export type ClawResultType = 'caught' | 'dropped' | 'fault' | null

const STORAGE_KEY = 'claw-game-leaderboard'

export const CLAW_PROBABILITIES = {
  caught: 0.50,
  dropped: 0.35,
  fault: 0.15,
}

function rollResult(): 'caught' | 'dropped' | 'fault' {
  const r = Math.random()
  if (r < CLAW_PROBABILITIES.caught) return 'caught'
  if (r < CLAW_PROBABILITIES.caught + CLAW_PROBABILITIES.dropped) return 'dropped'
  return 'fault'
}

export function useClawGame() {
  const { state, elapsedMs, start, pause, resume, reset, stop, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard(STORAGE_KEY)

  const [phase, setPhase] = useState<ClawPhase>('idle')
  const [playerName, setPlayerName] = useState('')
  const [clawName, setClawName] = useState('爸爸')
  const [totalPrizes, setTotalPrizes] = useState(5)

  const [coins, setCoins] = useState(0)
  const [prizesRemaining, setPrizesRemaining] = useState(5)
  const [caught, setCaught] = useState(0)
  const [dropped, setDropped] = useState(0)
  const [faults, setFaults] = useState(0)

  const [taskLadder, setTaskLadder] = useState<ClawTask[]>([])
  const [clawResult, setClawResult] = useState<ClawResultType>(null)
  const [showResult, setShowResult] = useState(false)
  const [endReason, setEndReason] = useState<'completed' | 'quit'>('completed')
  const [streak, setStreak] = useState(0) // consecutive failures for bad-luck protection

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentRank, setCurrentRank] = useState<number | undefined>()

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const isPaused = state === 'paused'
  const currentTaskIndex = taskLadder.findIndex(task => !task.completed)
  const currentTask = currentTaskIndex >= 0 ? taskLadder[currentTaskIndex] : null
  const completedTasks = taskLadder.filter(task => task.completed).length
  const allTasksDone = taskLadder.length > 0 && completedTasks === taskLadder.length
  const needsBonusCoin = allTasksDone && coins <= 0 && prizesRemaining > 0

  const replaceCurrentTask = useCallback(() => {
    if (!currentTask) return
    const pool = clawTasks.filter(task => task.stage === currentTask.stage && task.id !== currentTask.id)
    if (pool.length === 0) return
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setTaskLadder(prev => prev.map((task, index) => (
      index === currentTaskIndex ? { ...picked, completed: false } : task
    )))
  }, [currentTask, currentTaskIndex])

  const handleStart = useCallback((name: string, claw: string, prizes: number) => {
    setPlayerName(name)
    setClawName(claw)
    setTotalPrizes(prizes)
    setPrizesRemaining(prizes)
    setCoins(0)
    setCaught(0)
    setDropped(0)
    setFaults(0)
    setTaskLadder([])
    setClawResult(null)
    setShowResult(false)
    setEndReason('completed')
    setStreak(0)
    setPhase('countdown')
  }, [])

  const handleCountdownComplete = useCallback(() => {
    setTaskLadder(buildClawTaskLadder())
    start()
    setPhase('task')
  }, [start])

  const handleTaskComplete = useCallback(() => {
    if (isPaused) return

    if (currentTask) {
      setTaskLadder(prev => prev.map((task, index) => (
        index === currentTaskIndex ? { ...task, completed: true } : task
      )))
      setCoins(c => c + 2)
      return
    }

    if (needsBonusCoin) {
      setCoins(c => c + 1)
    }
  }, [isPaused, currentTask, currentTaskIndex, needsBonusCoin])

  const handleTaskSkip = useCallback(() => {
    if (isPaused) return
    replaceCurrentTask()
  }, [isPaused, replaceCurrentTask])

  const handleInsertCoin = useCallback(() => {
    if (isPaused || coins <= 0 || phase !== 'task') return
    setCoins(c => c - 1)
    setPhase('claw')
  }, [isPaused, coins, phase])

  const handleClawGrab = useCallback(() => {
    if (isPaused) return

    // Bad-luck protection: boost catch rate after 2+ consecutive non-catches
    let result = rollResult()
    if (streak >= 2 && result !== 'caught') {
      result = 'caught'
    }

    if (result === 'caught') {
      setCaught(c => c + 1)
      setPrizesRemaining(p => p - 1)
      setStreak(0)
    } else if (result === 'dropped') {
      setDropped(d => d + 1)
      setStreak(s => s + 1)
    } else {
      setFaults(f => f + 1)
      setCoins(c => c + 1)
      setStreak(0)
    }

    setClawResult(result)
    setPhase('result')
    setShowResult(true)
  }, [isPaused, streak])

  const handleContinue = useCallback(() => {
    setShowResult(false)
    setClawResult(null)

    if (prizesRemaining <= 0) {
      stop()
      setEndReason('completed')
      const entryScore = caught
      addEntry(playerName, 0, entryScore)
      setLeaderboard(getLeaderboard())
      setCurrentRank(getRank(entryScore))
      setPhase('finished')
    } else {
      setPhase('task')
    }
  }, [prizesRemaining, caught, playerName, addEntry, getLeaderboard, getRank, stop])

  const handlePause = useCallback(() => pause(), [pause])
  const handleResume = useCallback(() => resume(), [resume])

  const handleEndGame = useCallback(() => {
    stop()
    setEndReason('quit')
    const entryScore = caught
    addEntry(playerName, 0, entryScore)
    setLeaderboard(getLeaderboard())
    setCurrentRank(getRank(entryScore))
    setPhase('finished')
  }, [playerName, caught, addEntry, getLeaderboard, getRank, stop])

  const handleReset = useCallback(() => {
    reset()
    setPhase('idle')
    setPlayerName('')
    setCoins(0)
    setPrizesRemaining(5)
    setCaught(0)
    setDropped(0)
    setFaults(0)
    setTaskLadder([])
    setClawResult(null)
    setShowResult(false)
    setEndReason('completed')
    setStreak(0)
  }, [reset])

  return {
    state,
    elapsedMs,
    phase,
    formatTime,
    playerName,
    clawName,
    totalPrizes,
    coins,
    prizesRemaining,
    caught,
    dropped,
    faults,
    taskLadder,
    completedTasks,
    allTasksDone,
    needsBonusCoin,
    currentTask,
    clawResult,
    showResult,
    endReason,
    leaderboard,
    currentRank,
    isPaused,
    handleStart,
    handleCountdownComplete,
    handleTaskComplete,
    handleTaskSkip,
    handleInsertCoin,
    handleClawGrab,
    handleContinue,
    handlePause,
    handleResume,
    handleEndGame,
    handleReset,
    setPlayerName,
    setClawName,
    setTotalPrizes,
  }
}
