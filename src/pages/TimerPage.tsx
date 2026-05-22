import { useState, useRef, useCallback, useEffect } from 'react'

const PRESETS = [
  { label: '5 分钟', seconds: 300 },
  { label: '10 分钟', seconds: 600 },
  { label: '15 分钟', seconds: 900 },
  { label: '20 分钟', seconds: 1200 },
]

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

type TimerState = 'idle' | 'running' | 'paused' | 'done'

export function TimerPage() {
  const [state, setState] = useState<TimerState>('idle')
  const [totalSeconds, setTotalSeconds] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [customMin, setCustomMin] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0
  const circumference = 2 * Math.PI * 90
  const dashOffset = circumference * (1 - progress)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setState('running')
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearTimer()
          setState('done')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  const pause = useCallback(() => {
    clearTimer()
    setState('paused')
  }, [clearTimer])

  const resume = useCallback(() => {
    setState('running')
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearTimer()
          setState('done')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setState('idle')
    setRemaining(totalSeconds)
  }, [totalSeconds, clearTimer])

  const setPreset = useCallback((seconds: number) => {
    clearTimer()
    setState('idle')
    setTotalSeconds(seconds)
    setRemaining(seconds)
    setCustomMin('')
  }, [clearTimer])

  const setCustom = useCallback(() => {
    const mins = parseInt(customMin)
    if (mins > 0 && mins <= 120) {
      const secs = mins * 60
      clearTimer()
      setState('idle')
      setTotalSeconds(secs)
      setRemaining(secs)
    }
  }, [customMin, clearTimer])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="page-title-btv text-center mb-1">⏱ 计时器</h2>
      <p className="text-center text-gray-400 font-bold text-sm mb-6">培养时间观念，玩到时间就停～</p>

      {/* 圆环计时 */}
      <div className="relative w-56 h-56 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#E3F2FD" strokeWidth="12" />
          <circle
            cx="100" cy="100" r="90" fill="none"
            stroke={state === 'done' ? '#F44336' : '#1C98ED'}
            strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`timer-text text-4xl ${state === 'done' ? 'text-btv-red' : 'text-btv-dark'}`}>
            {formatTime(remaining)}
          </span>
          <span className="text-xs text-gray-400 font-bold mt-1">
            {state === 'idle' ? '准备开始' : state === 'running' ? '进行中...' : state === 'paused' ? '已暂停' : '⏰ 时间到！'}
          </span>
        </div>
      </div>

      {/* 预设按钮 */}
      {state === 'idle' && (
        <>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {PRESETS.map(p => (
              <button
                key={p.seconds}
                onClick={() => setPreset(p.seconds)}
                className={`py-3 rounded-2xl font-extrabold text-lg border-2 transition-all ${
                  totalSeconds === p.seconds
                    ? 'bg-btv-blue text-white border-btv-blue'
                    : 'bg-white text-btv-dark border-[#E3F2FD] hover:border-btv-blue/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 自定义 */}
          <div className="flex gap-2 mb-4">
            <input
              type="number" min="1" max="120" value={customMin}
              onChange={e => setCustomMin(e.target.value)}
              placeholder="自定义分钟"
              className="flex-1 text-center font-extrabold rounded-2xl px-4 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-gray-300"
              onKeyDown={e => e.key === 'Enter' && setCustom()}
            />
            <button onClick={setCustom} className="btn-btv !text-base !px-6">
              设定
            </button>
          </div>
        </>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 justify-center">
        {state === 'idle' && (
          <button onClick={start} className="btn-btv text-xl px-12 animate-pulse-glow-btv">
            ▶ 开始计时
          </button>
        )}
        {state === 'running' && (
          <button onClick={pause} className="btn-btv btn-btv-blue">
            ⏸ 暂停
          </button>
        )}
        {state === 'paused' && (
          <>
            <button onClick={resume} className="btn-btv">
              ▶ 继续
            </button>
            <button onClick={reset} className="btn-btv btn-btv-blue">
              🔄 重来
            </button>
          </>
        )}
        {state === 'done' && (
          <button onClick={reset} className="btn-btv animate-pulse-glow-btv">
            🔄 再计一次
          </button>
        )}
      </div>

      {/* 完成弹窗 */}
      {state === 'done' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-xs w-full shadow-2xl text-center border-4 border-btv-red">
            <div className="text-8xl mb-3">⏰</div>
            <h2 className="text-2xl font-extrabold text-btv-red mb-1">时间到！</h2>
            <p className="text-gray-500 font-bold mb-4">
              计时 {formatTime(totalSeconds)} 已结束
            </p>
            <button onClick={reset} className="btn-btv w-full">
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
