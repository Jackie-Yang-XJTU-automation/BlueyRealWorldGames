import { useState, useEffect } from 'react'
import type { RandomEvent } from '../types/game'

interface RandomEventPopupProps {
  event: RandomEvent
  onLand: () => void
  endButtonLabel?: string
  confirmQuestion?: string
  cancelLabel?: string
  confirmLabel?: string
}

export function RandomEventPopup({
  event,
  onLand,
  endButtonLabel = '💥 落地了！',
  confirmQuestion = '确定气球真的落地了吗？',
  cancelLabel = '还没！',
  confirmLabel = '是，落地了！',
}: RandomEventPopupProps) {
  const [remaining, setRemaining] = useState(event.duration)
  const [showConfirm, setShowConfirm] = useState(false)
  const titleId = `random-event-${event.id}-title`
  const descId = `random-event-${event.id}-desc`

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
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4 pointer-events-auto">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[34px] border-4 border-btv-orange bg-[#FDFBF7] p-7 text-center shadow-2xl animate-jelly">
        <div className="mx-auto mb-3 inline-flex rotate-[-2deg] rounded-full bg-[#FFF3E0] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-btv-orange">
          🎬 剧情事件
        </div>
        <div className="text-7xl mb-3">{event.emoji}</div>
        <h2 id={titleId} className="text-2xl font-black text-btv-dark mb-2">{event.title}</h2>
        <p id={descId} className="text-base text-[#5a5a87]/60 mb-5 leading-relaxed font-medium">
          {event.description}
        </p>
        <div className="mb-4 rounded-2xl bg-[#FFF3E0] px-4 py-3">
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
        <p className="mb-5 rounded-2xl bg-white/80 px-4 py-3 text-[12px] font-extrabold leading-snug text-[#D96B62]/70">
          🛟 慢一点、看脚下、听家长提示；剧情好笑，安全第一。
        </p>
        {!showConfirm ? (
          <button type="button" onClick={() => setShowConfirm(true)} className="btn-btv btn-btv-red w-full text-lg">
            {endButtonLabel}
          </button>
        ) : (
          <div>
            <p className="text-sm font-extrabold text-[#5a5a87]/50 mb-3">{confirmQuestion}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">
                {cancelLabel}
              </button>
              <button type="button" onClick={onLand} className="btn-btv btn-btv-red flex-1">
                {confirmLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
