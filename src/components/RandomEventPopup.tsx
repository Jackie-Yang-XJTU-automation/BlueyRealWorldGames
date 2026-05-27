import { useState, useEffect } from 'react'
import type { RandomEvent } from '../types/game'

interface RandomEventPopupProps {
  event: RandomEvent
  onLand: () => void
}

export function RandomEventPopup({ event, onLand }: RandomEventPopupProps) {
  const [remaining, setRemaining] = useState(event.duration)

  useEffect(() => {
    setRemaining(event.duration)
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
  }, [event])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4 pointer-events-auto">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-btv-orange">
        <div className="text-7xl mb-3">{event.emoji}</div>
        <h2 className="text-xl font-extrabold text-btv-orange mb-2">
          ⚡ 突发状况！
        </h2>
        <h3 className="text-xl font-extrabold text-btv-dark mb-2">{event.title}</h3>
        <p className="text-base text-[#5a5a87]/60 mb-5 leading-relaxed font-medium">
          {event.description}
        </p>
        <div className="bg-[#FFF3E0] rounded-2xl px-4 py-3 mb-5">
          <p className="text-sm text-btv-orange font-extrabold">
            ⏱ 剩余 {remaining} 秒自动恢复
          </p>
          <div className="w-full h-2.5 bg-[#FFE0B2] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-btv-orange rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(remaining / event.duration) * 100}%` }}
            />
          </div>
        </div>
        <button onClick={onLand} className="btn-btv btn-btv-red w-full text-lg">
          💥 落地了！
        </button>
      </div>
    </div>
  )
}
