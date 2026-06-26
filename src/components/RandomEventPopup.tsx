import { useState, useEffect, useRef } from 'react'
import type { RandomEvent } from '../types/game'
import { useDialogA11y } from '../hooks/useDialogA11y'

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
  const dialogRef = useRef<HTMLDivElement>(null)
  // Esc 仅在二次确认态退回上一步；绝不直接结束游戏（避免误触出局）
  useDialogA11y(dialogRef, showConfirm ? () => setShowConfirm(false) : undefined)

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
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/20 px-4 backdrop-blur-[2px] animate-event-pop-in pointer-events-auto">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[340px] overflow-y-auto rounded-[30px] border-[3px] border-[#F9D06B] bg-[#FDFBF7] p-5 text-center shadow-[0_18px_40px_rgba(44,67,100,0.18)] animate-jelly">
        <div className="mx-auto mb-3 inline-flex rotate-[-2deg] rounded-full bg-[#FFF3E0] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-btv-orange">
          意外来了
        </div>
        <div className="mb-2 text-5xl">{event.emoji}</div>
        <h2 id={titleId} className="mb-2 text-xl font-black text-btv-dark">{event.title}</h2>
        <p id={descId} className="mb-4 text-[15px] font-extrabold leading-relaxed text-[#5C728D]">
          {event.description}
        </p>
        <div className="mb-3 rounded-[20px] bg-[#FFF3E0] px-4 py-3">
          <p className="text-[12px] font-extrabold text-btv-orange">
            照着演一下，{remaining} 秒后回到原玩法
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#FFE0B2]">
            <div
              className="h-full rounded-full bg-btv-orange transition-all duration-1000 ease-linear"
              style={{ width: `${(remaining / event.duration) * 100}%` }}
            />
          </div>
        </div>
        <p className="mb-4 rounded-[18px] bg-white/82 px-4 py-2.5 text-[12px] font-extrabold leading-snug text-[#B5453C]">
          慢一点，看脚下；孩子兴奋时先停一下再继续。
        </p>
        {!showConfirm ? (
          <button type="button" onClick={() => setShowConfirm(true)} className="btn-btv btn-btv-red w-full !min-h-12 text-base">
            {endButtonLabel}
          </button>
        ) : (
          <div>
            <p className="mb-3 text-sm font-extrabold text-[#5C728D]">{confirmQuestion}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="min-h-12 flex-1 rounded-full bg-[#F0F4FF] py-3 text-sm font-extrabold text-[#5C728D] transition-colors hover:bg-[#E3ECFD]">
                {cancelLabel}
              </button>
              <button type="button" onClick={onLand} className="btn-btv btn-btv-red flex-1 !min-h-12 text-sm">
                {confirmLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
