import { useState, useRef, useCallback, useEffect } from 'react'
import type { TimerState } from '../types/game'

export function useTimer() {
  const [state, setState] = useState<TimerState>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const startTimeRef = useRef(0)
  const rafRef = useRef(0)

  const tick = useCallback(() => {
    setElapsedMs(Date.now() - startTimeRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
    setElapsedMs(0)
    setState('running')
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    startTimeRef.current = Date.now() - elapsedMs
    setState('running')
    rafRef.current = requestAnimationFrame(tick)
  }, [elapsedMs, tick])

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setState('finished')
  }, [])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setState('idle')
    setElapsedMs(0)
  }, [])

  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = ms / 1000
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const centiseconds = Math.floor((totalSeconds % 1) * 100)
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
    }
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return { state, elapsedMs, start, pause, resume, stop, reset, formatTime }
}
