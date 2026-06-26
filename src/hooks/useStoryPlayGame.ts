import { useCallback, useEffect, useRef, useState } from 'react'
import type { LeaderboardEntry, RandomEvent, TaskCard } from '../types/game'
import type { StoryPlayConfig } from '../data/storyPlayConfigs'
import { useLeaderboard } from './useLeaderboard'
import { useRandomEvent } from './useRandomEvent'
import { useTimer } from './useTimer'

const TASK_SCORES = [100, 200, 300, 500, 800]
const ACTION_REWARD = 60
const EVENT_REWARD = 420

interface FlyingStar {
  id: number
  x: number
  y: number
}

function freshActionCounts(config: StoryPlayConfig): Record<string, number> {
  return Object.fromEntries(config.actions.map(action => [action.id, 0]))
}

function freshTasks(config: StoryPlayConfig): TaskCard[] {
  return config.tasks.map(task => ({ ...task, completed: false }))
}

export function useStoryPlayGame(config: StoryPlayConfig) {
  const { state, elapsedMs, start, pause, resume, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard(config.leaderboardKey)

  const [tasks, setTasks] = useState<TaskCard[]>(() => freshTasks(config))
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
  const [actionCounts, setActionCounts] = useState<Record<string, number>>(() => freshActionCounts(config))
  const [latestAction, setLatestAction] = useState(config.idlePrompt)

  const starIdRef = useRef(0)
  const stageRef = useRef(0)
  const totalActions = Object.values(actionCounts).reduce((sum, count) => sum + count, 0)
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
        setTimeout(() => setFlyingStars(prev => prev.filter(star => star.id !== id)), 1000)
      }, i * 60)
    }
    setScoreBump(true)
    setTimeout(() => setScoreBump(false), 400)
  }, [])

  const onExpireRef = useRef<((event: RandomEvent) => void) | undefined>(undefined)
  onExpireRef.current = useCallback(() => {
    setEventStars(prev => prev + EVENT_REWARD)
    spawnStars(EVENT_REWARD)
  }, [spawnStars])

  const { currentEvent, startEvents, stopEvents } = useRandomEvent({
    events: config.events,
    onEventExpire: event => onExpireRef.current?.(event),
    // 只在当前任务步骤可触发的事件里抽取，避免与当前主线冲突。
    getStage: () => (stageRef.current >= 0 ? stageRef.current + 1 : null),
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const firstUncompletedIndex = tasks.findIndex(task => !task.completed)
  stageRef.current = firstUncompletedIndex
  const completedTasks = tasks.filter(task => task.completed).length

  const canConfirmTask = useCallback((taskId: string) => {
    const requirement = config.taskRequirements[taskId]
    if (!requirement) return true

    const hasCounts = Object.entries(requirement.counts ?? {}).every(([actionId, min]) => {
      return (actionCounts[actionId] ?? 0) >= min
    })
    const hasTotal = requirement.totalActions === undefined || totalActions >= requirement.totalActions

    return hasCounts && hasTotal
  }, [actionCounts, config.taskRequirements, totalActions])

  const handleAction = useCallback((actionId: string) => {
    if (state !== 'running' || currentEvent) return
    const action = config.actions.find(item => item.id === actionId)
    if (!action) return

    setActionCounts(prev => ({ ...prev, [actionId]: (prev[actionId] ?? 0) + 1 }))
    setLatestAction(action.response)
    setEventStars(prev => prev + ACTION_REWARD)
    spawnStars(ACTION_REWARD)
  }, [state, currentEvent, config.actions, spawnStars])

  const handleStart = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setCurrentRank(undefined)
    setEventStars(0)
    setTaskStars(0)
    setTasks(freshTasks(config))
    setActionCounts(freshActionCounts(config))
    setLatestAction(config.runningNudge[0] ?? config.idlePrompt)
    start()
    startEvents()
  }, [config, start, startEvents])

  const handlePause = useCallback(() => {
    if (state !== 'running') return
    pause()
    stopEvents()
  }, [state, pause, stopEvents])

  const handleResume = useCallback(() => {
    if (state !== 'paused') return
    resume()
    startEvents()
  }, [state, resume, startEvents])

  const handleEnd = useCallback(() => {
    if (state !== 'running' && state !== 'paused') return
    stop()
    stopEvents()
    setShowResult(true)
    setCurrentRank(getRank(totalStars))
  }, [state, stop, stopEvents, getRank, totalStars])

  const handleReset = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setPlayerName('')
    setCurrentRank(undefined)
    setTasks(freshTasks(config))
    setTaskStars(0)
    setEventStars(0)
    setActionCounts(freshActionCounts(config))
    setLatestAction(config.idlePrompt)
    stopEvents()
    reset()
  }, [config, reset, stopEvents])

  const handleSaveScore = useCallback(() => {
    const name = playerName.trim() || config.presetNames[0] || '这一集'
    const updated = addEntry(name, elapsedMs, totalStars)
    setLeaderboard(updated)
    handleReset()
  }, [playerName, config.presetNames, elapsedMs, totalStars, addEntry, handleReset])

  const confirmTask = useCallback((taskId: string, index: number) => {
    if (index !== firstUncompletedIndex || animatingTaskId || !canConfirmTask(taskId)) return
    setAnimatingTaskId(taskId)
    const earned = TASK_SCORES[index]

    setTimeout(() => {
      const newTasks = tasks.map(task => task.id === taskId ? { ...task, completed: true } : task)
      setTasks(newTasks)
      setAnimatingTaskId(null)
      setTaskStars(prev => prev + earned)
      spawnStars(earned)

      if (newTasks.every(task => task.completed)) {
        setTimeout(() => {
          stop()
          stopEvents()
          setShowVictory(true)
          setCurrentRank(getRank(totalStars + earned))
        }, 600)
      }
    }, 500)
  }, [firstUncompletedIndex, animatingTaskId, canConfirmTask, tasks, spawnStars, stop, stopEvents, getRank, totalStars])

  const isLocked = useCallback((index: number) => index > firstUncompletedIndex, [firstUncompletedIndex])

  return {
    state, elapsedMs, formatTime,
    currentEvent,
    tasks, completedTasks, firstUncompletedIndex, animatingTaskId,
    totalStars, timeStars, taskStars, eventStars, scoreBump,
    flyingStars,
    showResult, showVictory,
    playerName, setPlayerName,
    leaderboard, currentRank,
    actionCounts, totalActions, latestAction,
    handleAction, handleStart, handlePause, handleResume, handleEnd, handleReset, handleSaveScore,
    confirmTask, canConfirmTask, isLocked,
  }
}
