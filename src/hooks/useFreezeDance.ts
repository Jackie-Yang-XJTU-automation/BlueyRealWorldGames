import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DANCE_MOVES,
  FREEZE_POSES,
  danceDurationForRound,
  freezeDanceTitle,
  pickNext,
  type DanceMove,
  type FreezePose,
} from '../data/freezeDanceMoves'
import { playGameSound } from '../utils/soundEffects'
import { useTimer } from './useTimer'

export type FreezeDancePhase = 'dancing' | 'frozen'
export type FreezeDanceEndReason = 'ended' | null

export interface FreezeDanceLogItem {
  id: string
  emoji: string
  label: string
  result: 'froze' | 'wobbled'
}

// 音乐定格舞状态机：跳舞阶段自动计时，时间到自动"喊停"进入定格阶段，
// 家长判定全员是否定住，再进入下一回合。计时与音效都收在 hook 内，页面只渲染。
export function useFreezeDance() {
  const { state, elapsedMs, start, pause, resume, stop, reset, formatTime } = useTimer()

  const [phase, setPhase] = useState<FreezeDancePhase>('dancing')
  const [currentMove, setCurrentMove] = useState<DanceMove>(() => DANCE_MOVES[0])
  const [currentPose, setCurrentPose] = useState<FreezePose | null>(null)
  const [round, setRound] = useState(0)
  const [freezeCount, setFreezeCount] = useState(0)
  const [wobbleCount, setWobbleCount] = useState(0)
  const [log, setLog] = useState<FreezeDanceLogItem[]>([])
  const [endReason, setEndReason] = useState<FreezeDanceEndReason>(null)

  const danceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevMoveRef = useRef<string | undefined>(undefined)
  const prevPoseRef = useRef<string | undefined>(undefined)
  const roundRef = useRef(0)

  const clearDanceTimer = useCallback(() => {
    if (danceTimerRef.current) {
      clearTimeout(danceTimerRef.current)
      danceTimerRef.current = null
    }
  }, [])

  // 进入定格阶段（喊停）：随机出一个定格主题，播提示音
  const enterFrozen = useCallback(() => {
    clearDanceTimer()
    const pose = pickNext(FREEZE_POSES, prevPoseRef.current)
    prevPoseRef.current = pose.id
    setCurrentPose(pose)
    setPhase('frozen')
    playGameSound('event') // 音乐停！提示音
  }, [clearDanceTimer])

  // 自动喊停：跳舞一段随机时长后进入定格阶段（家长没手动喊停时的兜底 DJ）
  const scheduleFreeze = useCallback((roundNum: number) => {
    clearDanceTimer()
    danceTimerRef.current = setTimeout(enterFrozen, danceDurationForRound(roundNum))
  }, [clearDanceTimer, enterFrozen])

  // 家长手动喊停：跳舞阶段随时按下，立刻进入定格（把节奏掌控权交给主持人）
  const handleStopMusic = useCallback(() => {
    if (state !== 'running' || phase !== 'dancing') return
    enterFrozen()
  }, [state, phase, enterFrozen])

  const startDanceRound = useCallback((roundNum: number) => {
    const move = pickNext(DANCE_MOVES, prevMoveRef.current)
    prevMoveRef.current = move.id
    roundRef.current = roundNum
    setRound(roundNum)
    setCurrentMove(move)
    setCurrentPose(null)
    setPhase('dancing')
    scheduleFreeze(roundNum)
  }, [scheduleFreeze])

  const resetDance = useCallback(() => {
    clearDanceTimer()
    prevMoveRef.current = undefined
    prevPoseRef.current = undefined
    roundRef.current = 0
    setRound(0)
    setFreezeCount(0)
    setWobbleCount(0)
    setLog([])
    setCurrentPose(null)
    setPhase('dancing')
    setCurrentMove(DANCE_MOVES[0])
    setEndReason(null)
  }, [clearDanceTimer])

  const handleStart = useCallback(() => {
    resetDance()
    start()
    playGameSound('start')
    startDanceRound(1)
  }, [resetDance, start, startDanceRound])

  // 家长判定：全员定住成功
  const handleFroze = useCallback(() => {
    if (state !== 'running' || phase !== 'frozen' || !currentPose) return
    setFreezeCount(count => count + 1)
    setLog(items => [...items, {
      id: `${currentPose.id}-${items.length}`,
      emoji: currentPose.emoji,
      label: currentPose.label,
      result: 'froze',
    }])
    playGameSound('success')
    startDanceRound(roundRef.current + 1)
  }, [state, phase, currentPose, startDanceRound])

  // 家长判定：有人动了，换个姿势继续（不记成功）
  const handleWobbled = useCallback(() => {
    if (state !== 'running' || phase !== 'frozen' || !currentPose) return
    setWobbleCount(count => count + 1)
    setLog(items => [...items, {
      id: `${currentPose.id}-${items.length}`,
      emoji: currentPose.emoji,
      label: currentPose.label,
      result: 'wobbled',
    }])
    playGameSound('tap')
    startDanceRound(roundRef.current + 1)
  }, [state, phase, currentPose, startDanceRound])

  const handlePause = useCallback(() => {
    if (state !== 'running') return
    clearDanceTimer()
    pause()
    playGameSound('pause')
  }, [state, clearDanceTimer, pause])

  const handleResume = useCallback(() => {
    if (state !== 'paused') return
    resume()
    // 恢复时若还在跳舞阶段，重新安排一次喊停；定格阶段则保持等待判定
    if (phase === 'dancing') scheduleFreeze(roundRef.current)
  }, [state, resume, phase, scheduleFreeze])

  const handleEnd = useCallback(() => {
    clearDanceTimer()
    setEndReason('ended')
    stop()
    playGameSound('finish')
  }, [clearDanceTimer, stop])

  const handleReset = useCallback(() => {
    resetDance()
    reset()
  }, [resetDance, reset])

  // 卸载时清掉计时器
  useEffect(() => clearDanceTimer, [clearDanceTimer])

  const totalRounds = freezeCount + wobbleCount
  const accuracy = totalRounds > 0 ? Math.round((freezeCount / totalRounds) * 100) : 0
  const title = freezeDanceTitle(freezeCount)

  return {
    state,
    elapsedMs,
    formatTime,
    phase,
    currentMove,
    currentPose,
    round,
    freezeCount,
    wobbleCount,
    totalRounds,
    accuracy,
    title,
    log,
    endReason,
    handleStart,
    handleStopMusic,
    handleFroze,
    handleWobbled,
    handlePause,
    handleResume,
    handleEnd,
    handleReset,
  }
}
