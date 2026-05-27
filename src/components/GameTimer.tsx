import type { TimerState } from '../types/game'

interface GameTimerProps {
  state: TimerState
  elapsedMs: number
  formatTime: (ms: number) => string
}

export function GameTimer({ state, elapsedMs, formatTime }: GameTimerProps) {
  return (
    <div className="mt-5 bg-white rounded-3xl px-10 py-4 shadow-lg border-2 border-[#E3F2FD]">
      <span
        className={`timer-text text-5xl ${
          state === 'running'
            ? 'text-btv-orange'
            : state === 'finished'
              ? 'text-btv-red'
              : state === 'paused'
                ? 'text-[#5a5a87]/40'
                : 'text-[#5a5a87]/25'
        }`}
      >
        {state === 'idle' ? '0.00' : formatTime(elapsedMs)}
      </span>
    </div>
  )
}
