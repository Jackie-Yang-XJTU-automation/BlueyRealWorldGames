import { useCallback, useMemo, useState } from 'react'
import { createTaxiRide, type TaxiDriverMove, type TaxiRound } from '../data/taxiGame'
import { useTimer } from './useTimer'

export type TaxiEndReason = 'completed' | 'ended' | null

export interface TaxiRideLogItem {
  id: string
  emoji: string
  label: string
  result: string
}

export function useTaxiGame() {
  const { state, elapsedMs, start, pause, resume, stop, reset, formatTime } = useTimer()
  const [rounds, setRounds] = useState<TaxiRound[]>(() => createTaxiRide())
  const [roundIndex, setRoundIndex] = useState(0)
  const [selectedMove, setSelectedMove] = useState<TaxiDriverMove | null>(null)
  const [rideLog, setRideLog] = useState<TaxiRideLogItem[]>([])
  const [endReason, setEndReason] = useState<TaxiEndReason>(null)

  const currentRound = rounds[roundIndex]
  const isLastRound = roundIndex === rounds.length - 1
  const passengerReactionLevel = Math.min(5, 1 + rideLog.length + (selectedMove ? 1 : 0))
  const progressPercent = endReason === 'completed'
    ? 100
    : Math.round(((roundIndex + (selectedMove ? 1 : 0)) / rounds.length) * 100)

  const resetRide = useCallback(() => {
    setRounds(createTaxiRide())
    setRoundIndex(0)
    setSelectedMove(null)
    setRideLog([])
    setEndReason(null)
  }, [])

  const handleStart = useCallback(() => {
    resetRide()
    start()
  }, [resetRide, start])

  const handlePause = useCallback(() => {
    if (state === 'running') pause()
  }, [pause, state])

  const handleResume = useCallback(() => {
    if (state === 'paused') resume()
  }, [resume, state])

  const handleChoose = useCallback((move: TaxiDriverMove) => {
    if (state !== 'running' || selectedMove) return

    setSelectedMove(move)
    setRideLog(log => [
      ...log,
      {
        id: `${currentRound.id}-${move.id}-${log.length}`,
        emoji: currentRound.emoji,
        label: move.logLabel,
        result: move.result,
      },
    ])
  }, [currentRound, selectedMove, state])

  const handleContinue = useCallback(() => {
    if (!selectedMove) return

    if (isLastRound) {
      setSelectedMove(null)
      setEndReason('completed')
      stop()
      return
    }

    setRoundIndex(index => index + 1)
    setSelectedMove(null)
  }, [isLastRound, selectedMove, stop])

  const handleEnd = useCallback(() => {
    setSelectedMove(null)
    setEndReason('ended')
    stop()
  }, [stop])

  const handleReset = useCallback(() => {
    resetRide()
    reset()
  }, [reset, resetRide])

  const driverTitle = useMemo(() => {
    if (rideLog.some(item => item.label.includes('急刹') || item.label.includes('定住'))) return '最稳急刹司机'
    if (rideLog.some(item => item.label.includes('减速带'))) return '减速带大师'
    if (rideLog.some(item => item.label.includes('导航'))) return '导航都怕的司机'
    if (rideLog.some(item => item.label.includes('雨'))) return '雨天稳稳司机'
    return rideLog.length >= 5 ? '乘客还想坐司机' : '新手出租车司机'
  }, [rideLog])

  return {
    state,
    elapsedMs,
    formatTime,
    roundIndex,
    totalRounds: rounds.length,
    currentRound,
    selectedMove,
    rideLog,
    endReason,
    isLastRound,
    passengerReactionLevel,
    progressPercent,
    driverTitle,
    handleStart,
    handlePause,
    handleResume,
    handleChoose,
    handleContinue,
    handleEnd,
    handleReset,
  }
}
