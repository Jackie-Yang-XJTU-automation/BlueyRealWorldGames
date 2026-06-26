import type { LeaderboardEntry } from '../types/game'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentRank?: number
}

export function Leaderboard({ entries, currentRank }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-2">📒</p>
        <p className="text-[#5C728D] font-bold text-lg">还没有记录</p>
        <p className="text-[#5C728D] text-sm mt-1">游戏结束后可以记下这一局。</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-extrabold text-btv-dark mb-3">
        📒 家庭记录
      </h3>
      {entries.map((entry, i) => (
        <div
          key={`${entry.name}-${entry.date}-${i}`}
          className={`flex items-center justify-between px-5 py-3.5 rounded-2xl ${
            i === 0 ? 'bg-[#FFF9EE] border-2 border-[#F9D06B]' :
            i === 1 ? 'bg-[#F5F5F5] border border-[#E0E0E0]' :
            i === 2 ? 'bg-[#FFF3E0] border border-[#FFCC80]' :
            'bg-white border border-[#E3F2FD]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 text-center text-2xl font-extrabold" aria-hidden="true">
              📒
            </span>
            <div>
              <p className="font-extrabold text-btv-dark">{entry.name}</p>
              <p className="text-xs text-[#5C728D] font-bold">{entry.date}</p>
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            <span className="text-sm font-extrabold text-[#DCA018]">⭐{entry.score}</span>
            <p className="text-lg font-extrabold text-btv-blue timer-text">
              {formatLeaderboardTime(entry.time)}
            </p>
          </div>
        </div>
      ))}
      {currentRank && currentRank > entries.length && (
        <div className="text-center py-2 text-sm text-[#5C728D] font-bold">
          这次也可以写进家庭记录。
        </div>
      )}
    </div>
  )
}

function formatLeaderboardTime(ms: number): string {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const centiseconds = Math.floor((totalSeconds % 1) * 100)
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}秒`
}
