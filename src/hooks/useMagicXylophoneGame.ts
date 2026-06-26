import { useCallback, useEffect, useRef, useState } from 'react'
import { useTimer } from './useTimer'
import { useRandomEvent } from './useRandomEvent'
import { useLeaderboard } from './useLeaderboard'
import { magicXylophoneTasks as initialTasks } from '../data/magicXylophoneTasks'
import { magicXylophoneEvents } from '../data/magicXylophoneEvents'
import type { LeaderboardEntry, RandomEvent, TaskCard } from '../types/game'

export type MagicActionId = 'freeze' | 'unfreeze' | 'pose' | 'switch' | 'rescue' | 'water'

const TASK_SCORES = [100, 200, 300, 500, 800]
const ACTION_REWARD = 60
const RESCUE_REWARD = 120
const EVENT_REWARD = 500
const WIZARDS = ['小魔法师', '小救援员', '家长魔法师', '轮到的人']
const POSE_PROMPTS = [
  '像花园小矮人一样定住',
  '竖起大拇指，露出最夸张的笑',
  '一只脚轻轻点地，像在跳舞前一秒',
  '张开双手，像被魔法吹起来',
  '假装头上戴着鹿角帽',
  '做一个“我什么都不知道”的表情'
]

interface FlyingStar {
  id: number
  x: number
  y: number
}

function freshActionCounts(): Record<MagicActionId, number> {
  return {
    freeze: 0,
    unfreeze: 0,
    pose: 0,
    switch: 0,
    rescue: 0,
    water: 0
  }
}

export function useMagicXylophoneGame() {
  const { state, elapsedMs, start, pause, resume, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard('magic-xylophone-leaderboard')

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
  const [actionCounts, setActionCounts] = useState<Record<MagicActionId, number>>(freshActionCounts)
  const [isFrozen, setIsFrozen] = useState(false)
  const [wizardIndex, setWizardIndex] = useState(0)
  const [posePrompt, setPosePrompt] = useState(POSE_PROMPTS[0])
  const [latestAction, setLatestAction] = useState('找一个小物品当木琴，准备做第一个 Ding！')

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
        setTimeout(() => {
          setFlyingStars(prev => prev.filter(s => s.id !== id))
        }, 1000)
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
    events: magicXylophoneEvents,
    onEventExpire: (event: RandomEvent) => onExpireRef.current?.(event)
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  const firstUncompletedIndex = tasks.findIndex(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed).length
  const currentWizard = WIZARDS[wizardIndex % WIZARDS.length]

  const canConfirmTask = useCallback((taskId: string) => {
    switch (taskId) {
      case 'freeze-unfreeze':
        return actionCounts.freeze >= 1 && actionCounts.unfreeze >= 1
      case 'take-turns':
        return actionCounts.switch >= 2
      case 'silly-poses':
        return actionCounts.pose >= 3
      case 'bingo-rescue':
        return actionCounts.rescue >= 1
      case 'team-magic':
        return totalActions >= 12
      default:
        return false
    }
  }, [actionCounts, totalActions])

  const addActionReward = useCallback((reward: number) => {
    setEventStars(prev => prev + reward)
    spawnStars(reward)
  }, [spawnStars])

  const handleMagicAction = useCallback((action: MagicActionId) => {
    if (state !== 'running' || currentEvent) return

    setActionCounts(prev => ({
      ...prev,
      [action]: prev[action] + 1
    }))

    if (action === 'freeze') {
      setIsFrozen(true)
      setLatestAction(`${currentWizard} 做了 Ding！有人被冻住啦。`)
      addActionReward(ACTION_REWARD)
      return
    }

    if (action === 'unfreeze') {
      setIsFrozen(false)
      setLatestAction('Unfreeze！大家又能动了。')
      addActionReward(ACTION_REWARD)
      return
    }

    if (action === 'pose') {
      const nextPrompt = POSE_PROMPTS[Math.floor(Math.random() * POSE_PROMPTS.length)]
      setPosePrompt(nextPrompt)
      setLatestAction(`摆姿势挑战：${nextPrompt}`)
      addActionReward(ACTION_REWARD)
      return
    }

    if (action === 'switch') {
      setWizardIndex(index => (index + 1) % WIZARDS.length)
      setLatestAction('把木琴交给下一位魔法师，轮流才好玩。')
      addActionReward(ACTION_REWARD)
      return
    }

    if (action === 'rescue') {
      setIsFrozen(false)
      setLatestAction('小救援员成功！被冻住的人偷偷眨眨眼。')
      addActionReward(RESCUE_REWARD)
      return
    }

    setLatestAction('水管恶作剧！大人假装被喷到，夸张地甩甩头。')
    addActionReward(RESCUE_REWARD)
  }, [state, currentEvent, currentWizard, addActionReward])

  const handleStart = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setCurrentRank(undefined)
    setEventStars(0)
    setTaskStars(0)
    setActionCounts(freshActionCounts())
    setTasks(initialTasks)
    setIsFrozen(false)
    setWizardIndex(0)
    setPosePrompt(POSE_PROMPTS[0])
    setLatestAction('魔法木琴启动！先冻住一个人试试。')
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
    setIsFrozen(false)
    setWizardIndex(0)
    setPosePrompt(POSE_PROMPTS[0])
    setLatestAction('找一个小物品当木琴，准备做第一个 Ding！')
    stopEvents()
    reset()
  }, [reset, stopEvents])

  const handleSaveScore = useCallback(() => {
    const name = playerName.trim() || '神秘魔法师'
    const updated = addEntry(name, elapsedMs, totalStars)
    setLeaderboard(updated)
    handleReset()
  }, [playerName, elapsedMs, totalStars, addEntry, handleReset])

  const confirmTask = useCallback((taskId: string, index: number) => {
    if (index !== firstUncompletedIndex || animatingTaskId || !canConfirmTask(taskId)) return
    setAnimatingTaskId(taskId)
    const earned = TASK_SCORES[index]

    setTimeout(() => {
      const newTasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
      setTasks(newTasks)
      setAnimatingTaskId(null)
      setTaskStars(prev => prev + earned)
      spawnStars(earned)

      const allDone = newTasks.every(task => task.completed)
      if (allDone) {
        setTimeout(() => {
          stop()
          stopEvents()
          setShowVictory(true)
          setCurrentRank(getRank(totalStars + earned))
        }, 600)
      }
    }, 500)
  }, [firstUncompletedIndex, animatingTaskId, canConfirmTask, tasks, spawnStars, stop, stopEvents, getRank, totalStars])

  const isLocked = useCallback((index: number) => {
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
    actionCounts, totalActions, isFrozen, currentWizard, posePrompt, latestAction,
    handleMagicAction, handleStart, handlePause, handleResume, handleEnd, handleReset, handleSaveScore,
    confirmTask, canConfirmTask, isLocked
  }
}
