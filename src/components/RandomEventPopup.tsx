import { useState, useEffect } from 'react'
import type { RandomEvent } from '../types/game'

interface RandomEventPopupProps {
  event: RandomEvent
  onLand: () => void
}

export function RandomEventPopup({ event, onLand }: RandomEventPopupProps) {
  const [remaining, setRemaining] = useState(event.duration)
  const [showConfirm, setShowConfirm] = useState(false)

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
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="btn-btv btn-btv-red w-full text-lg">
            💥 落地了！
          </button>
        ) : (
          <div>
            <p className="text-sm font-extrabold text-[#5a5a87]/50 mb-3">确定气球真的落地了吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">
                还没！
              </button>
              <button onClick={onLand} className="btn-btv btn-btv-red flex-1">
                是，落地了！
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
