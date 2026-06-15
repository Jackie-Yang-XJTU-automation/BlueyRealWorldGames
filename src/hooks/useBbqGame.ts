import { useCallback, useEffect, useRef, useState } from 'react'
import { bbqEvents } from '../data/bbqEvents'
import { bbqTasks as initialTasks } from '../data/bbqTasks'
import type { LeaderboardEntry, RandomEvent, TaskCard } from '../types/game'
import { useLeaderboard } from './useLeaderboard'
import { useRandomEvent } from './useRandomEvent'
import { useTimer } from './useTimer'

export type BbqActionId = 'gather' | 'order' | 'cook' | 'salad' | 'dressing' | 'thanks'

const TASK_SCORES = [100, 200, 300, 500, 800]
const ACTION_REWARD = 65
const EVENT_REWARD = 420

interface FlyingStar {
  id: number
  x: number
  y: number
}

function freshActionCounts(): Record<BbqActionId, number> {
  return {
    gather: 0,
    order: 0,
    cook: 0,
    salad: 0,
    dressing: 0,
    thanks: 0,
  }
}

export function useBbqGame() {
  const { state, elapsedMs, start, pause, resume, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard('bbq-leaderboard')

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
  const [actionCounts, setActionCounts] = useState<Record<BbqActionId, number>>(freshActionCounts)
  const [latestAction, setLatestAction] = useState('后院烧烤准备开始，Bingo 带着放松椅来了。')

  const starIdRef = useRef(0)
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
    events: bbqEvents,
    onEventExpire: event => onExpireRef.current?.(event),
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const firstUncompletedIndex = tasks.findIndex(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed).length

  const canConfirmTask = useCallback((taskId: string) => {
    switch (taskId) {
      case 'set-the-table':
        return actionCounts.gather >= 3
      case 'take-orders':
        return actionCounts.order >= 2
      case 'colour-capsicum':
        return actionCounts.salad >= 2
      case 'dressing-chaos':
        return actionCounts.cook >= 2 && actionCounts.dressing >= 1
      case 'thank-the-salad':
        return totalActions >= 10 && actionCounts.thanks >= 1
      default:
        return false
    }
  }, [actionCounts, totalActions])

  const addActionReward = useCallback(() => {
    setEventStars(prev => prev + ACTION_REWARD)
    spawnStars(ACTION_REWARD)
  }, [spawnStars])

  const handleAction = useCallback((action: BbqActionId) => {
    if (state !== 'running' || currentEvent) return

    setActionCounts(prev => ({ ...prev, [action]: prev[action] + 1 }))
    addActionReward()

    const nextText: Record<BbqActionId, string> = {
      gather: 'Bingo 找到一个安全食材，道具碗里又多了一样东西。',
      order: '客人点单成功：香肠、沙拉，还有“我最喜欢的颜色”。',
      cook: 'Bluey 翻动假装香肠，厨师大声宣布“马上就好”。',
      salad: '彩椒沙拉更新！绿色、黄色、红色都可以用安全物品代替。',
      dressing: '沙拉酱登场，今天是泥巴口味，但只许假装倒。',
      thanks: '大家认真感谢做饭和摆桌的人，Bingo 终于被看见了。',
    }
    setLatestAction(nextText[action])
  }, [state, currentEvent, addActionReward])

  const handleStart = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setCurrentRank(undefined)
    setEventStars(0)
    setTaskStars(0)
    setTasks(initialTasks)
    setActionCounts(freshActionCounts())
    setLatestAction('BBQ 开摊！先摆桌，再让客人点单。')
    start()
    startEvents()
  }, [start, startEvents])

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
    setTasks(initialTasks)
    setTaskStars(0)
    setEventStars(0)
    setActionCounts(freshActionCounts())
    setLatestAction('后院烧烤准备开始，Bingo 带着放松椅来了。')
    stopEvents()
    reset()
  }, [reset, stopEvents])

  const handleSaveScore = useCallback(() => {
    const name = playerName.trim() || '沙拉大厨'
    const updated = addEntry(name, elapsedMs, totalStars)
    setLeaderboard(updated)
    handleReset()
  }, [playerName, elapsedMs, totalStars, addEntry, handleReset])

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
