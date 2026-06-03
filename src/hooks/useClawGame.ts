import { useState, useCallback } from 'react'
import { useTimer } from './useTimer'
import { useLeaderboard } from './useLeaderboard'
import { clawTasks as initialTasks } from '../data/clawTasks'
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

  const [currentTask, setCurrentTask] = useState<ClawTask | null>(null)
  const [clawResult, setClawResult] = useState<ClawResultType>(null)
  const [showResult, setShowResult] = useState(false)
  const [endReason, setEndReason] = useState<'completed' | 'quit'>('completed')
  const [streak, setStreak] = useState(0) // consecutive failures for bad-luck protection

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentRank, setCurrentRank] = useState<number | undefined>()

  const isPaused = state === 'paused'

  // Centralized task picker — the single source for random task selection
  const pickTask = useCallback(() => {
    const pool = initialTasks.filter(t => t.id !== currentTask?.id)
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setCurrentTask({ ...picked, completed: false })
  }, [currentTask?.id])

  const handleStart = useCallback((name: string, claw: string, prizes: number) => {
    setPlayerName(name)
    setClawName(claw)
    setTotalPrizes(prizes)
    setPrizesRemaining(prizes)
    setCoins(3)
    setCaught(0)
    setDropped(0)
    setFaults(0)
    setClawResult(null)
    setShowResult(false)
    setEndReason('completed')
    setStreak(0)
    setPhase('countdown')
  }, [])

  const handleCountdownComplete = useCallback(() => {
    const pool = initialTasks
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setCurrentTask({ ...picked, completed: false })
    start()
    setPhase('task')
  }, [start])

  const handleTaskComplete = useCallback(() => {
    if (isPaused) return
    setCoins(c => c + 1)
    pickTask()
  }, [isPaused, pickTask])

  const handleTaskSkip = useCallback(() => {
    if (isPaused) return
    pickTask()
  }, [isPaused, pickTask])

  const handleInsertCoin = useCallback(() => {
    if (isPaused || coins <= 0) return
    setCoins(c => c - 1)
    setPhase('claw')
  }, [isPaused, coins])

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
      pickTask()
      setPhase('task')
    }
  }, [prizesRemaining, caught, playerName, addEntry, getLeaderboard, getRank, pickTask, stop])

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
    setCurrentTask(null)
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
