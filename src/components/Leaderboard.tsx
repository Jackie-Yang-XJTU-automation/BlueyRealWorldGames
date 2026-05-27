import type { LeaderboardEntry } from '../types/game'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentRank?: number
}

export function Leaderboard({ entries, currentRank }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-2">🏆</p>
        <p className="text-[#5a5a87]/50 font-bold text-lg">还没有记录</p>
        <p className="text-[#5a5a87]/35 text-sm mt-1">快来挑战第一个纪录吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-extrabold text-btv-dark mb-3">
        🏆 家庭排行榜
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
            <span className="text-2xl font-extrabold w-10 text-center">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>
            <div>
              <p className="font-extrabold text-btv-dark">{entry.name}</p>
              <p className="text-xs text-[#5a5a87]/50 font-bold">{entry.date}</p>
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
        <div className="text-center py-2 text-sm text-[#5a5a87]/50 font-bold">
          你排在第 {currentRank} 名
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
