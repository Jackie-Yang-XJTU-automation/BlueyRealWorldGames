interface HudScoreItem {
  emoji: string
  value: number | string
  color?: string
  bump?: boolean
  label?: string
}

interface HudBreakdownItem {
  emoji: string
  value: number | string
}

interface GameTopHudProps {
  scoreItems: HudScoreItem[]
  breakdownItems?: HudBreakdownItem[]
  helpTitle: string
  helpItems: string[]
  showHelp: boolean
  onToggleHelp: () => void
  onBack?: () => void
  showPause?: boolean
  onPause?: () => void
  showEnd?: boolean
  onEnd?: () => void
}

export function GameTopHud({
  scoreItems,
  breakdownItems = [],
  helpTitle,
  helpItems,
  showHelp,
  onToggleHelp,
  onBack,
  showPause = false,
  onPause,
  showEnd = false,
  onEnd,
}: GameTopHudProps) {
  return (
    <div className="relative z-10 pt-4 pb-3 px-4">
      <div className="grid grid-cols-[52px_minmax(0,1fr)_88px] items-center gap-2">
        <button
          type="button"
          onClick={onBack ?? (() => window.history.back())}
          aria-label="返回上一页"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/65 text-lg font-extrabold text-[#5a5a87]/55 transition-colors hover:text-[#5a5a87]/75 active:scale-95"
        >
          ←
        </button>

        <div className="relative mx-auto flex min-h-11 max-w-full min-w-0 items-center gap-1 rounded-full border border-[#F9D06B]/35 bg-white/85 py-1.5 pl-3 pr-1.5 shadow-[0_2px_12px_rgba(44,67,100,0.06)] backdrop-blur-sm">
          {scoreItems.map((item, index) => (
            <div key={`${item.emoji}-${index}`} className="flex min-w-0 items-center gap-0.5" aria-label={item.label}>
              {index > 0 && <span className="mx-0.5 text-[#5a5a87]/15">·</span>}
              <span className="text-sm leading-none sm:text-base">{item.emoji}</span>
              <span
                className={`timer-text text-lg font-extrabold transition-all duration-300 sm:text-xl ${item.bump ? 'animate-score-bump' : ''}`}
                style={{ color: item.color ?? '#DCA018' }}
              >
                {item.value}
              </span>
            </div>
          ))}

          <button
            type="button"
            onClick={onToggleHelp}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0F4FF] text-[12px] font-extrabold text-[#5a5a87]/45 transition-colors hover:bg-[#E3ECFD] active:scale-95"
            aria-label="查看分数说明"
          >
            ?
          </button>

          {showHelp && (
            <div className="absolute right-0 top-full z-[100] mt-2 max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-[#E3F2FD] bg-white px-4 py-3 text-left shadow-lg animate-jelly">
              <p className="mb-1 text-[11px] font-bold text-[#5a5a87]/50">{helpTitle}</p>
              {helpItems.map(item => (
                <p key={item} className="text-xs font-extrabold leading-snug text-[#5a5a87]/65 sm:whitespace-nowrap">
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex h-11 items-center justify-end gap-1">
          {showPause && (
            <button
              type="button"
              onClick={onPause}
              aria-label="暂停"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-lg font-extrabold text-[#5a5a87] transition-transform active:scale-95"
            >
              ⏸
            </button>
          )}
          {showEnd && (
            <button
              type="button"
              onClick={onEnd}
              aria-label="结束"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D96B62]/10 text-lg font-extrabold text-[#D96B62] transition-transform active:scale-95"
            >
              🛑
            </button>
          )}
        </div>
      </div>

      {breakdownItems.length > 0 && (
        <div className="mt-1.5 flex justify-center gap-3 whitespace-nowrap text-[10px] font-bold text-[#5a5a87]/35">
          {breakdownItems.map((item, index) => (
            <span key={`${item.emoji}-${index}`} className="contents">
              {index > 0 && <span className="text-[#5a5a87]/15">+</span>}
              <span>{item.emoji}{item.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

interface GamePauseDialogProps {
  emoji: string
  title?: string
  message?: string
  onResume: () => void
  onRestart: () => void
  onEnd?: () => void
  endLabel?: string
}

export function GamePauseDialog({
  emoji,
  title = '已暂停',
  message = '休息一下，随时继续～',
  onResume,
  onRestart,
  onEnd,
  endLabel = '🛑 结束',
}: GamePauseDialogProps) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="game-pause-title" aria-describedby="game-pause-desc" className="fixed inset-0 z-[400] flex items-center justify-center bg-white/70 px-6 backdrop-blur-sm">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[280px] overflow-y-auto rounded-[32px] border-4 border-[#BBDEFB] bg-white p-8 text-center shadow-xl animate-jelly">
        <div className="mb-4 text-5xl">{emoji}</div>
        <h2 id="game-pause-title" className="mb-1 text-xl font-extrabold text-btv-dark">{title}</h2>
        <p id="game-pause-desc" className="mb-6 text-sm font-bold text-[#5a5a87]/45">{message}</p>
        <button
          type="button"
          onClick={onResume}
          className="mb-3 min-h-12 w-full rounded-full bg-btv-dark text-base font-extrabold text-white transition-transform active:scale-95 animate-random-pulse"
        >
          ▶ 继续玩
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="mb-3 min-h-12 w-full rounded-full bg-[#5a5a87]/10 text-base font-extrabold text-[#5a5a87] transition-transform active:scale-95"
        >
          🔄 重来
        </button>
        {onEnd && (
          <button
            type="button"
            onClick={onEnd}
            className="min-h-11 w-full rounded-full bg-transparent text-sm font-extrabold text-[#D96B62] transition-transform active:scale-95"
          >
            {endLabel}
          </button>
        )}
      </div>
    </div>
  )
}

interface GameConfirmDialogProps {
  id: string
  emoji: string
  title: string
  message: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function GameConfirmDialog({
  id,
  emoji,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: GameConfirmDialogProps) {
  const titleId = `${id}-title`
  const descId = `${id}-desc`

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/20 px-6 backdrop-blur-sm animate-event-pop-in">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-btv-red bg-white p-8 text-center shadow-2xl animate-jelly">
        <div className="mb-3 text-5xl">{emoji}</div>
        <h2 id={titleId} className="mb-2 text-xl font-extrabold text-btv-dark">{title}</h2>
        <p id={descId} className="mb-6 text-sm font-bold text-[#5a5a87]/55">{message}</p>
        <button
          type="button"
          onClick={onCancel}
          className="mb-2 min-h-12 w-full rounded-full bg-btv-dark text-base font-extrabold text-white transition-transform active:scale-95"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-12 w-full rounded-full bg-transparent text-sm font-extrabold text-[#D96B62] transition-transform active:scale-95"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
