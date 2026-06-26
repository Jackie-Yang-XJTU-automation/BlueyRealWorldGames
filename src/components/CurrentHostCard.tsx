interface CurrentHostCardProps {
  label?: string
  stepLabel?: string
  prompt: string
  detail?: string
  safetyNote?: string
  actionHint?: string
  accentSoft?: string
  accentColor?: string
  confirmColor?: string
  canConfirm?: boolean
  onConfirm?: () => void
  confirmLabel?: string
  blockedLabel?: string
}

export function CurrentHostCard({
  label = '现在对孩子说',
  stepLabel,
  prompt,
  detail,
  safetyNote,
  actionHint,
  accentSoft = '#E3F2FD',
  accentColor = '#8CBAE6',
  confirmColor = '#4CAF50',
  canConfirm = true,
  onConfirm,
  confirmLabel = '完成这一步，盖章',
  blockedLabel = '先做完这一步',
}: CurrentHostCardProps) {
  return (
    <div
      className="mb-3 w-full max-w-sm rounded-[24px] border-2 border-white bg-white/90 p-3 text-left shadow-[0_7px_18px_rgba(44,67,100,0.08)]"
      style={{ boxShadow: `0 7px 18px ${accentColor}1F` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#5C728D]"
          style={{ backgroundColor: accentSoft }}
        >
          {label}
        </span>
        {stepLabel && (
          <span className="text-[11px] font-extrabold text-[#5C728D]">
            {stepLabel}
          </span>
        )}
      </div>
      <p className="text-base font-black leading-snug text-btv-dark">“{prompt}”</p>
      {detail && (
        <p className="mt-1 text-[12px] font-extrabold leading-relaxed text-[#5C728D]">
          {detail}
        </p>
      )}
      {safetyNote && (
        <p className="mt-2 rounded-2xl bg-[#FFF3E0] px-3 py-2 text-[12px] font-extrabold leading-snug text-[#B5453C]">
          🛟 {safetyNote}
        </p>
      )}
      {actionHint && (
        <p className="mt-2 rounded-2xl bg-white px-3 py-2 text-[12px] font-extrabold leading-snug text-[#5C728D]">
          ✅ 盖章前做：{actionHint}
        </p>
      )}
      {onConfirm && canConfirm && (
        <button
          type="button"
          onClick={onConfirm}
          className="mt-3 min-h-12 w-full rounded-full px-4 py-3 text-sm font-black text-white transition-transform touch-action-manipulation active:scale-95"
          style={{
            backgroundColor: confirmColor,
            boxShadow: `0 4px 12px ${confirmColor}66`,
          }}
        >
          ✅ {confirmLabel}
        </button>
      )}
      {onConfirm && !canConfirm && (
        <div className="mt-3 rounded-full bg-[#F0F4FF] px-4 py-3 text-center text-sm font-black text-[#5C728D]">
          {blockedLabel}
        </div>
      )}
    </div>
  )
}
