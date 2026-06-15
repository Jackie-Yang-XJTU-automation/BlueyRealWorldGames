import { useCallback, useEffect, useRef, useState } from 'react'
import { hospitalEvents } from '../data/hospitalEvents'
import { hospitalTasks as initialTasks } from '../data/hospitalTasks'
import type { LeaderboardEntry, RandomEvent, TaskCard } from '../types/game'
import { useLeaderboard } from './useLeaderboard'
import { useRandomEvent } from './useRandomEvent'
import { useTimer } from './useTimer'

export type HospitalActionId = 'checkup' | 'xray' | 'diagnose' | 'nurse' | 'operation' | 'cheese'

const TASK_SCORES = [100, 200, 300, 500, 800]
const ACTION_REWARD = 70
const EVENT_REWARD = 420

interface FlyingStar {
  id: number
  x: number
  y: number
}

function freshActionCounts(): Record<HospitalActionId, number> {
  return {
    checkup: 0,
    xray: 0,
    diagnose: 0,
    nurse: 0,
    operation: 0,
    cheese: 0,
  }
}

export function useHospitalGame() {
  const { state, elapsedMs, start, pause, resume, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard('hospital-leaderboard')

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
  const [actionCounts, setActionCounts] = useState<Record<HospitalActionId, number>>(freshActionCounts)
  const [latestAction, setLatestAction] = useState('病人 Telemachus 正在候诊，医生和护士准备入场。')

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
    events: hospitalEvents,
    onEventExpire: event => onExpireRef.current?.(event),
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const firstUncompletedIndex = tasks.findIndex(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed).length

  const canConfirmTask = useCallback((taskId: string) => {
    switch (taskId) {
      case 'patient-check-in':
        return actionCounts.checkup >= 2
      case 'xray-diagnosis':
        return actionCounts.xray >= 1 && actionCounts.diagnose >= 1
      case 'nurse-teamwork':
        return actionCounts.nurse >= 2
      case 'silly-operation':
        return actionCounts.operation >= 2
      case 'cheese-cure':
        return totalActions >= 10 && actionCounts.cheese >= 1
      default:
        return false
    }
  }, [actionCounts, totalActions])

  const addActionReward = useCallback(() => {
    setEventStars(prev => prev + ACTION_REWARD)
    spawnStars(ACTION_REWARD)
  }, [spawnStars])

  const handleAction = useCallback((action: HospitalActionId) => {
    if (state !== 'running' || currentEvent) return

    setActionCounts(prev => ({ ...prev, [action]: prev[action] + 1 }))
    addActionReward()

    const nextText: Record<HospitalActionId, string> = {
      checkup: '医生检查肚子：这里有一点“哎哟”，病人表现得很勇敢。',
      xray: '护士举起 X 光板：肚子里好像有一只猫！',
      diagnose: '医生认真诊断：猫可能是从肚脐眼进去的。',
      nurse: 'Nurse Bingo 贴好空气创可贴，还轻轻安慰病人。',
      operation: '手术开始，先拿出一只假装章鱼，大家都愣住了。',
      cheese: '奶酪登场！老鼠跑出来，猫追着它离开肚子。',
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
    setLatestAction('Hospital 开诊！先让病人安心躺好。')
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
    setLatestAction('病人 Telemachus 正在候诊，医生和护士准备入场。')
    stopEvents()
    reset()
  }, [reset, stopEvents])

  const handleSaveScore = useCallback(() => {
    const name = playerName.trim() || '勇敢病人'
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
