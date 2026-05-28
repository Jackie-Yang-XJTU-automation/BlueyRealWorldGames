import type { TimerState } from '../types/game'

interface GameTimerProps {
  state: TimerState
  elapsedMs: number
  formatTime: (ms: number) => string
}

export function GameTimer({ state, elapsedMs, formatTime }: GameTimerProps) {
  return (
    <div className="inline-flex items-center bg-white/75 backdrop-blur-sm rounded-full px-6 py-2.5 shadow-[0_2px_12px_rgba(44,67,100,0.05)] border border-[#E3F2FD]/50">
      <span
        className={`timer-text text-4xl tracking-tighter ${
          state === 'running'
            ? 'text-btv-orange'
            : state === 'finished'
              ? 'text-btv-red'
              : state === 'paused'
                ? 'text-[#5a5a87]/35'
                : 'text-[#5a5a87]/20'
        }`}
      >
        {state === 'idle' ? '0.00' : formatTime(elapsedMs)}
      </span>
    </div>
  )
}
