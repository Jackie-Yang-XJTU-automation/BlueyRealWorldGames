import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getGameById } from '../data/games'
import { getPlayableGame } from '../data/playableGames'
import { DeliveryReadinessCard } from '../components/DeliveryReadinessCard'
import {
  clearPlayHistory,
  formatPlayTime,
  getPlayHistorySummary,
  groupPlayHistoryByDay,
  loadPlayHistory,
} from '../utils/playHistory'
import type { PlayHistoryEntry, PlayLaunchSource } from '../types/playExperience'

const SOURCE_LABELS: Record<PlayLaunchSource, string> = {
  today: '今日推荐',
  scenario: '场景救场',
  random: '随机救场',
  favorite: '收藏夹',
  card: '陪玩卡',
  detail: '详情页',
  'direct-route': '直接打开',
  tool: '工具箱',
}

function StatCard({ emoji, value, label }: { emoji: string; value: number | string; label: string }) {
  return (
    <div className="rounded-[24px] border-2 border-white bg-white/82 px-3 py-3 text-center shadow-[0_4px_0_rgba(174,224,250,0.35)]">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-2xl font-black text-btv-dark">{value}</div>
      <div className="mt-0.5 text-[11px] font-black text-[#5C728D]">{label}</div>
    </div>
  )
}

function EntryCard({ entry, onOpen }: { entry: PlayHistoryEntry; onOpen: (entry: PlayHistoryEntry) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="grid w-full grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 rounded-[24px] border-2 border-[#E3F2FD] bg-white px-3 py-3 text-left shadow-[0_4px_0_rgba(174,224,250,0.30)] transition-transform active:scale-[0.99]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#E3F2FD] text-3xl">
        {entry.gameEmoji}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-black text-btv-dark">{entry.gameName}</span>
        <span className="mt-0.5 block truncate text-[11px] font-extrabold text-[#5C728D]">
          {SOURCE_LABELS[entry.source]}{entry.note ? ` · ${entry.note}` : ''}
        </span>
      </span>
      <span className="rounded-full bg-[#FFF3E0] px-2.5 py-1 text-[10px] font-black text-[#F58634]">
        {formatPlayTime(entry.launchedAt)}
      </span>
    </button>
  )
}

function EmptyLog() {
  return (
    <div className="rounded-[30px] border-4 border-dashed border-[#BBDEFB] bg-white/70 px-5 py-10 text-center">
      <div className="text-6xl">📒</div>
      <h2 className="mt-3 text-2xl font-black text-btv-dark">还没有家庭足迹</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm font-extrabold leading-relaxed text-[#5C728D]">
        从首页打开今日推荐、随机救场或任意陪玩卡后，这里会留下本机记录，方便下次继续。
      </p>
      <Link to="/" className="btn-btv mt-5 inline-flex !min-h-12 items-center justify-center !px-6 !py-3 !text-sm">
        回首页选一局
      </Link>
    </div>
  )
}

export function FamilyPlayLogPage() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState(() => loadPlayHistory())
  const [confirmClear, setConfirmClear] = useState(false)
  const summary = useMemo(() => getPlayHistorySummary(entries), [entries])
  const buckets = useMemo(() => groupPlayHistoryByDay(entries), [entries])
  const favoriteGames = useMemo(() => (
    summary.favoriteGameIds
      .map(id => getGameById(id))
      .filter((game): game is NonNullable<typeof game> => Boolean(game))
  ), [summary.favoriteGameIds])

  const handleOpenEntry = (entry: PlayHistoryEntry) => {
    const game = getGameById(entry.gameId)
    const playable = game ? getPlayableGame(game.id) : undefined
    navigate(playable?.route ?? entry.route)
  }

  const handleClear = () => {
    clearPlayHistory()
    setEntries([])
    setConfirmClear(false)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <section className="mb-5 rounded-b-[38px] border-4 border-white bg-gradient-to-br from-[#E3F2FD] via-[#FFF9EE] to-[#FDFBF7] px-4 pb-5 pt-4 shadow-[0_10px_28px_rgba(44,67,100,0.09)]">
        <p className="btv-display text-[12px] uppercase tracking-widest text-[#F58634]">家庭记录</p>
        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black leading-tight text-btv-dark">这周玩过什么</h1>
            <p className="mt-1 max-w-lg text-sm font-extrabold leading-relaxed text-[#5C728D]">
              这里不是排行榜，只是给家长回看：今天开过哪一局、孩子最近喜欢什么、下次可以接着玩什么。
            </p>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="min-h-11 rounded-full border-2 border-[#D96B62]/20 bg-[#D96B62]/8 px-4 text-sm font-black text-[#D96B62] transition-transform active:scale-95"
            >
              清空足迹
            </button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard emoji="☀️" value={summary.launchesToday} label="今天打开" />
          <StatCard emoji="📅" value={summary.launchesThisWeek} label="本周开局" />
          <StatCard emoji="🎲" value={summary.uniqueGamesThisWeek} label="不同玩法" />
          <StatCard emoji="📒" value={summary.totalLaunches} label="本机足迹" />
        </div>
      </section>

      {favoriteGames.length > 0 && (
        <section className="mb-5 rounded-[30px] border-4 border-white bg-[#FDFBF7] p-4 shadow-[0_8px_0_rgba(174,224,250,0.42),0_14px_30px_rgba(44,67,100,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="btv-display text-[12px] uppercase tracking-widest text-[#F58634]">最近常玩</p>
              <h2 className="text-xl font-black text-btv-dark">孩子可能还想要</h2>
            </div>
            <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-[11px] font-black text-[#4CAF50]">
              本周
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {favoriteGames.map(game => (
              <button
                key={game.id}
                type="button"
                onClick={() => navigate(getPlayableGame(game.id)?.route ?? `/game/${game.id}`)}
                className="flex min-w-[150px] items-center gap-2 rounded-full border-2 border-[#E3F2FD] bg-white py-2 pl-2 pr-3 text-left shadow-sm transition-transform active:scale-95"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ABE0FA] text-xl">{game.emoji}</span>
                <span className="truncate text-[13px] font-black text-btv-dark">{game.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mb-5">
        <DeliveryReadinessCard />
      </div>

      {entries.length === 0 ? (
        <EmptyLog />
      ) : (
        <section aria-label="足迹列表" className="space-y-4">
          {buckets.map(bucket => (
            <div key={bucket.dateKey}>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-black text-[#5C728D]">
                <span className="h-[2px] w-7 rounded-full bg-[#5a5a87]/12" />
                {bucket.label}
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px]">{bucket.entries.length}</span>
              </h2>
              <div className="grid gap-2">
                {bucket.entries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} onOpen={handleOpenEntry} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {confirmClear && (
        <div role="dialog" aria-modal="true" aria-labelledby="clear-log-title" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/24 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[34px] border-4 border-[#D96B62] bg-[#FDFBF7] p-7 text-center shadow-2xl animate-jelly">
            <div className="text-5xl">🧹</div>
            <h2 id="clear-log-title" className="mt-3 text-2xl font-black text-btv-dark">清空本机足迹？</h2>
            <p className="mt-2 text-sm font-extrabold leading-relaxed text-[#5C728D]">
              只会清掉这个页面的打开记录，不会删除收藏或各游戏自己的家庭记录。
            </p>
            <button type="button" onClick={() => setConfirmClear(false)} className="btn-btv mt-5 w-full !min-h-12 !py-3 !text-base">
              先留着
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 min-h-12 w-full rounded-full border-2 border-[#D96B62]/20 bg-[#D96B62]/8 text-sm font-black text-[#D96B62] transition-transform active:scale-95"
            >
              确认清空
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
