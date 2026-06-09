import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameFault } from '../types/game'

interface FaultPopupProps {
  fault: GameFault
  onFixed: () => void
}

export function FaultPopup({ fault, onFixed }: FaultPopupProps) {
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(fault.duration)
  const [isFixed, setIsFixed] = useState(false)
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onFixedRef = useRef(onFixed)
  onFixedRef.current = onFixed
  const progressRef = useRef(progress)
  progressRef.current = progress
  const isFixedRef = useRef(isFixed)
  isFixedRef.current = isFixed

  useEffect(() => {
    setProgress(0)
    setIsFixed(false)
  }, [fault.id])

  useEffect(() => {
    setRemaining(fault.duration)
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [fault])

  const addProgress = useCallback((amount: number = 1) => {
    setProgress(prev => {
      const next = prev + amount
      if (next >= fault.totalRequired && !isFixedRef.current) {
        setIsFixed(true)
        setTimeout(() => onFixedRef.current(), 400)
        return fault.totalRequired
      }
      return next
    })
  }, [fault.totalRequired])

  const addProgressRef = useRef(addProgress)
  addProgressRef.current = addProgress

  // longpress
  const startHold = useCallback(() => {
    if (fault.interactionType !== 'longpress') return
    holdRef.current = setInterval(() => addProgressRef.current(1), 500)
  }, [fault.interactionType])

  const stopHold = useCallback(() => {
    if (holdRef.current) {
      clearInterval(holdRef.current)
      holdRef.current = null
    }
  }, [])

  useEffect(() => () => stopHold(), [stopHold])

  const [showTapHint, setShowTapHint] = useState(false)

  // Show tap hint after 1.5s if shake/voice sensor hasn't kicked in
  useEffect(() => {
    if (fault.interactionType !== 'shake' && fault.interactionType !== 'voice') return
    setShowTapHint(false)
    const timer = setTimeout(() => setShowTapHint(true), 1500)
    return () => clearTimeout(timer)
  }, [fault.interactionType, fault.id])

  // shake via devicemotion — only works on HTTPS (secure context)
  useEffect(() => {
    if (fault.interactionType !== 'shake') return
    if (!window.isSecureContext) return
    if (typeof DeviceMotionEvent === 'undefined') return

    const lastShake = { time: 0 }
    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return
      const total = Math.sqrt((acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2)
      const now = Date.now()
      if (total > 20 && now - lastShake.time > 300) {
        lastShake.time = now
        addProgressRef.current(1)
      }
    }

    const startListen = async () => {
      try {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          const result = await (DeviceMotionEvent as any).requestPermission()
          if (result !== 'granted') return
        }
      } catch { /* iOS denied or not iOS */ }
      window.addEventListener('devicemotion', handler)
    }
    startListen()

    return () => window.removeEventListener('devicemotion', handler)
  }, [fault.interactionType])

  // voice via AudioContext — only works on HTTPS
  useEffect(() => {
    if (fault.interactionType !== 'voice') return
    if (!window.isSecureContext) return

    let ctx: AudioContext | null = null
    let interval: ReturnType<typeof setInterval> | null = null

    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        ctx.createMediaStreamSource(stream).connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)
        interval = setInterval(() => {
          analyser!.getByteFrequencyData(data)
          const avg = data.reduce((a, b) => a + b, 0) / data.length
          if (avg > 50) addProgressRef.current(1)
        }, 300)
      })
      .catch(() => {})

    return () => {
      interval && clearInterval(interval)
      ctx?.close()
    }
  }, [fault.interactionType])

  const progressPct = (progress / fault.totalRequired) * 100
  const titleId = `fault-${fault.id}-title`
  const descId = `fault-${fault.id}-desc`

  const renderInteraction = () => {
    switch (fault.interactionType) {
      case 'tap':
        return (
          <button
            onClick={() => addProgress(1)}
            className="w-full h-28 rounded-3xl text-white text-2xl font-extrabold shadow-lg
                       transition-all duration-100 active:scale-95 touch-action-manipulation select-none"
            style={{ backgroundColor: fault.emoji === '🦠' ? '#E53935' : '#F58634' }}
          >
            {fault.emoji === '🦠' ? '🦠 消灭病毒！' : '⚡ 快速点击修复！'}
          </button>
        )

      case 'longpress':
        return (
          <button
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onContextMenu={e => e.preventDefault()}
            className="w-full h-28 rounded-3xl text-white text-2xl font-extrabold shadow-lg
                       transition-all duration-100 active:scale-95 touch-action-manipulation select-none
                       flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#4CAF50' }}
          >
            <span className="text-3xl">🔋</span>
            <span>按住充电！</span>
          </button>
        )

      case 'shake':
        return (
          <div className="space-y-3">
            <button
              onClick={() => addProgress(1)}
              className="w-full h-28 rounded-3xl text-white text-2xl font-extrabold shadow-lg
                         transition-all duration-100 active:scale-95 touch-action-manipulation select-none
                         flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: '#7E57C2' }}
            >
              <span className="text-3xl">🌀</span>
              <span>快速点击修复！</span>
            </button>
            {showTapHint && (
              <p className="text-xs text-[#5a5a87]/50 font-bold">
                💡 摇晃功能需要 HTTPS 连接，当前请点击按钮修复
              </p>
            )}
          </div>
        )

      case 'voice':
        return (
          <div className="space-y-3">
            <button
              onClick={() => addProgress(1)}
              className="w-full h-28 rounded-3xl text-white text-2xl font-extrabold shadow-lg
                         transition-all duration-100 active:scale-95 touch-action-manipulation select-none
                         flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: '#EF5350' }}
            >
              <span className="text-3xl">🔊</span>
              <span>快速点击修复！</span>
            </button>
            {showTapHint && (
              <p className="text-xs text-[#5a5a87]/50 font-bold">
                💡 声控需要麦克风权限和 HTTPS，当前请点击按钮修复
              </p>
            )}
          </div>
        )
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
      <div className={`max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 bg-white p-7 text-center shadow-2xl transition-colors duration-300 animate-jelly ${
        isFixed ? 'border-btv-green' : 'border-[#AB47BC]'
      }`}>
        <div className={`mx-auto mb-3 inline-flex rotate-[-2deg] rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
          isFixed ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F3E5F5] text-[#AB47BC]'
        }`}>
          {isFixed ? '维修完成' : '🎬 剧情故障'}
        </div>
        <div className="text-7xl mb-3">
          {isFixed ? '✅' : fault.emoji}
        </div>
        <h2 className="text-xl font-extrabold text-[#AB47BC] mb-2">
          {isFixed ? '修复成功！' : '🤖 机器人故障！'}
        </h2>
        <h3 id={titleId} className="text-xl font-extrabold text-btv-dark mb-2">{fault.title}</h3>
        <p id={descId} className="text-base text-[#5a5a87]/60 mb-5 leading-relaxed font-medium">
          {fault.description}
        </p>

        {!isFixed && (
          <>
            <div className="mb-4">
              {renderInteraction()}
            </div>
            <p className="mb-3 rounded-2xl bg-white/80 px-4 py-3 text-[12px] font-extrabold leading-snug text-[#D96B62]/70">
              🛟 机器人只能慢慢走，不冲撞家具；修理动作要轻轻来。
            </p>
            <div className="bg-[#FFF3E0] rounded-2xl px-4 py-3 mb-3">
              <p className="text-sm text-btv-orange font-extrabold">
                {fault.interactionType === 'longpress'
                  ? '🔌 修复进度'
                  : '🔧 修复进度'} {progress}/{fault.totalRequired}
              </p>
              <div className="w-full h-2.5 bg-[#FFE0B2] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%`, backgroundColor: '#AB47BC' }}
                />
              </div>
            </div>
            <div className="bg-[#F3E5F5] rounded-2xl px-4 py-3">
              <p className="text-sm text-[#AB47BC] font-extrabold">
                ⏱ 剩余 {remaining} 秒自动恢复
              </p>
              <div className="w-full h-2.5 bg-[#E1BEE7] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#AB47BC] rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(remaining / fault.duration) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        {isFixed && (
          <div className="text-5xl font-extrabold text-btv-green animate-score-bump">
            +1000 ⭐
          </div>
        )}
      </div>
    </div>
  )
}
