import { useState } from 'react'
import { Leaderboard } from './Leaderboard'
import type { LeaderboardEntry } from '../types/game'

interface GameLeaderboardPanelProps {
  title: string
  entries: LeaderboardEntry[]
  currentRank?: number
  accentTint?: string
  hideWhenEmpty?: boolean
}

export function GameLeaderboardPanel({
  title,
  entries,
  currentRank,
  accentTint = '#E3F2FD',
  hideWhenEmpty = true,
}: GameLeaderboardPanelProps) {
  const [open, setOpen] = useState(false)

  if (hideWhenEmpty && entries.length === 0 && !currentRank) return null

  return (
    <section className="px-4 sm:px-0 mb-6" aria-label={title}>
      <div className="overflow-hidden rounded-[28px] border-2 bg-white shadow-[0_4px_18px_rgba(44,67,100,0.06)]" style={{ borderColor: accentTint }}>
        <button
          type="button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          className="flex min-h-14 w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
          style={{ background: `linear-gradient(90deg, #FFFFFF, ${accentTint}66)` }}
        >
          <span>
            <span className="block text-sm font-black uppercase tracking-widest text-[#5C728D]">{title}</span>
            <span className="mt-0.5 block text-[12px] font-extrabold text-[#5C728D]">
              {entries.length > 0 ? `${entries.length} 条家庭记录` : '游戏结束后再记录这一集'}
            </span>
          </span>
          <span className={`text-[#5C728D] font-bold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {open && (
          <div className="border-t border-[#E3F2FD] p-4">
            <Leaderboard entries={entries} currentRank={currentRank} />
          </div>
        )}
      </div>
    </section>
  )
}
