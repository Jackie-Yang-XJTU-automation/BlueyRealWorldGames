import { useState, useRef, useCallback, useEffect } from 'react'
import type { RandomEvent } from '../types/game'
import { keepyUppyEvents } from '../data/keepyUppyEvents'

interface UseRandomEventOptions {
  onEventExpire?: (event: RandomEvent) => void
  events?: RandomEvent[]
  // 返回当前任务步骤号（1-based）；返回 null 表示当前没有明确步骤（如全部完成）。
  // 提供后，调度器只会触发标注了该步骤的事件（或未标注步骤的通用事件），
  // 避免随机事件与当前任务推进逻辑冲突（REQUIREMENTS G2）。
  getStage?: () => number | null
}

export function useRandomEvent(options?: UseRandomEventOptions) {
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const usedRef = useRef<Set<string>>(new Set())
  const onExpireRef = useRef(options?.onEventExpire)
  onExpireRef.current = options?.onEventExpire
  const getStageRef = useRef(options?.getStage)
  getStageRef.current = options?.getStage
  const pool = options?.events ?? keepyUppyEvents

  // 按当前任务步骤过滤事件：未标注 stages 的为通用事件，任意步骤可用；
  // 标注了 stages 的只在命中当前步骤时可用。
  const getStageEvents = useCallback((): RandomEvent[] => {
    const stage = getStageRef.current ? getStageRef.current() : null
    return pool.filter(event => !event.stages || (stage !== null && event.stages.includes(stage)))
  }, [pool])

  const clearEvent = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCurrentEvent(null)
  }, [])

  const triggerEvent = useCallback(() => {
    if (timeoutRef.current !== null) return

    const stageEvents = getStageEvents()
    // 当前步骤没有合适的事件时，本轮不打扰，稍后再尝试，保持主线干净。
    if (stageEvents.length === 0) {
      scheduleNext()
      return
    }

    let available = stageEvents.filter(e => !usedRef.current.has(e.id))
    if (available.length === 0) {
      // 当前阶段的事件都放过一轮了，清掉这些已用记录后允许重复。
      stageEvents.forEach(e => usedRef.current.delete(e.id))
      available = stageEvents
    }

    const event = available[Math.floor(Math.random() * available.length)]
    usedRef.current.add(event.id)
    setCurrentEvent(event)

    timeoutRef.current = setTimeout(() => {
      setCurrentEvent(null)
      timeoutRef.current = null
      onExpireRef.current?.(event)
      scheduleNext()
    }, event.duration * 1000)
  }, [getStageEvents])

  const scheduleNext = useCallback(() => {
    const delay = 15000 + Math.random() * 25000
    scheduleRef.current = setTimeout(triggerEvent, delay)
  }, [triggerEvent])

  const startEvents = useCallback(() => {
    usedRef.current.clear()
    if (scheduleRef.current) {
      clearTimeout(scheduleRef.current)
      scheduleRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      setCurrentEvent(null)
    }
    const initialDelay = 10000 + Math.random() * 15000
    scheduleRef.current = setTimeout(triggerEvent, initialDelay)
  }, [triggerEvent])

  const stopEvents = useCallback(() => {
    if (scheduleRef.current) {
      clearTimeout(scheduleRef.current)
      scheduleRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCurrentEvent(null)
  }, [])

  useEffect(() => {
    return () => {
      if (scheduleRef.current) clearTimeout(scheduleRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { currentEvent, startEvents, stopEvents, clearEvent }
}
