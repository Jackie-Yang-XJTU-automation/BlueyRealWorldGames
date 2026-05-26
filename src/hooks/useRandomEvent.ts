import { useState, useRef, useCallback } from 'react'
import type { RandomEvent } from '../types/game'
import { keepyUppyEvents } from '../data/keepyUppyEvents'

interface UseRandomEventOptions {
  onEventExpire?: (event: RandomEvent) => void
  events?: RandomEvent[]
}

export function useRandomEvent(options?: UseRandomEventOptions) {
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const usedRef = useRef<Set<string>>(new Set())
  const onExpireRef = useRef(options?.onEventExpire)
  onExpireRef.current = options?.onEventExpire
  const pool = options?.events ?? keepyUppyEvents

  const clearEvent = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCurrentEvent(null)
  }, [])

  const triggerEvent = useCallback(() => {
    const available = pool.filter(e => !usedRef.current.has(e.id))
    if (available.length === 0) {
      usedRef.current.clear()
      const event = pool[Math.floor(Math.random() * pool.length)]
      usedRef.current.add(event.id)
      setCurrentEvent(event)
      timeoutRef.current = setTimeout(() => {
        setCurrentEvent(null)
        timeoutRef.current = null
        onExpireRef.current?.(event)
        scheduleNext()
      }, event.duration * 1000)
      return
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
  }, [pool])

  const scheduleNext = useCallback(() => {
    const delay = 15000 + Math.random() * 25000
    scheduleRef.current = setTimeout(triggerEvent, delay)
  }, [triggerEvent])

  const startEvents = useCallback(() => {
    usedRef.current.clear()
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

  return { currentEvent, startEvents, stopEvents, clearEvent }
}
