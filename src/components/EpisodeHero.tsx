import type { Game } from '../types/game'

interface EpisodeHeroProps {
  game: Game
  gameCount: number
  playableCount: number
  familyImage: string
  onRandomPick: () => void
  onOpenGame: (game: Game) => void
  playLabel?: string
}

const typeLabels: Record<string, { emoji: string; text: string }> = {
  active: { emoji: '🏃', text: '运动型' },
  roleplay: { emoji: '🎭', text: '扮演型' },
  story: { emoji: '📖', text: '故事型' },
  quiet: { emoji: '🧘', text: '安静型' },
}

const locationLabels: Record<string, { emoji: string; text: string }> = {
  indoor: { emoji: '🏠', text: '室内' },
  outdoor: { emoji: '🌳', text: '户外' },
  both: { emoji: '🏠🌳', text: '室内外' },
}

export function EpisodeHero({
  game,
  gameCount,
  playableCount,
  familyImage,
  onRandomPick,
  onOpenGame,
  playLabel,
}: EpisodeHeroProps) {
  const type = typeLabels[game.type] ?? typeLabels.quiet
  const location = locationLabels[game.location] ?? locationLabels.indoor

  return (
    <section className="episode-hero relative mb-5 overflow-hidden rounded-[34px] border-4 border-white/80 bg-[#FDFBF7] px-4 pb-5 pt-4 shadow-[0_18px_45px_rgba(44,67,100,0.14)]">
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,#8CBAE6,#B3E5FC_64%,transparent)]" />
      <div className="absolute -left-7 top-6 h-16 w-24 rounded-full bg-white/80 shadow-[32px_-10px_0_8px_rgba(255,255,255,0.78),72px_2px_0_2px_rgba(255,255,255,0.72)]" />
      <div className="absolute -right-9 top-10 h-14 w-24 rounded-full bg-white/70 shadow-[-34px_-10px_0_4px_rgba(255,255,255,0.66)]" />

      <div className="relative grid gap-4 sm:grid-cols-[1fr_180px] sm:items-end">
        <div>
          <div className="mb-3 inline-flex rotate-[-2deg] items-center gap-2 rounded-full bg-[#FFF9EE] px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#F39C62] shadow-[0_3px_0_rgba(243,156,98,0.18)]">
            <span>🎬 今日开演</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[#5a5a87]/55">S1E{game.episode}</span>
          </div>

          <h1 className="mb-2 text-[2.15rem] font-black leading-[1.02] tracking-tight text-btv-dark sm:text-[3.25rem]">
            今天开演哪一集？
          </h1>
          <p className="mb-4 max-w-sm text-sm font-extrabold leading-relaxed text-[#5a5a87]/58">
            App 当主持，家长和孩子在客厅、院子、公园里把 Bluey 的游戏真的玩出来。
          </p>

          <div className="rounded-[26px] border-2 border-[#E3F2FD] bg-white/88 p-3.5 shadow-[0_8px_22px_rgba(44,67,100,0.08)]">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#E3F2FD] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#5a5a87]/55">
                今日推荐
              </span>
              <span className="text-[11px] font-extrabold text-[#5a5a87]/38">
                {playableCount}/{gameCount} 深度可玩
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenGame(game)}
              className="group flex w-full items-center gap-3 rounded-[22px] bg-[#FFF9EE] p-3 text-left transition-all active:scale-[0.98]"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-white text-5xl shadow-[0_5px_0_rgba(44,67,100,0.10)] transition-transform group-hover:-rotate-3 group-hover:scale-105">
                {game.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-black leading-tight text-btv-dark">{game.name}</span>
                <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-extrabold text-[#5a5a87]/52">
                  <span>{type.emoji} {type.text}</span>
                  <span>{location.emoji} {location.text}</span>
                  <span>👥 {game.minPlayers}-{game.maxPlayers}人</span>
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[210px] sm:max-w-none">
          <img
            src={familyImage}
            alt="Bluey 全家准备一起玩"
            className="relative z-10 mx-auto w-40 drop-shadow-[0_12px_24px_rgba(44,67,100,0.22)] sm:w-48"
          />
          <div className="absolute bottom-1 left-1/2 h-8 w-44 -translate-x-1/2 rounded-full bg-[#90C79A]/40 blur-xl" />
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={() => onOpenGame(game)}
          className="btn-btv !min-h-12 !px-4 !py-3 !text-base"
        >
          {playLabel ?? '打开这一集'}
        </button>
        <button
          type="button"
          onClick={onRandomPick}
          className="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[#F39C62] text-xl font-black text-white shadow-[0_4px_14px_rgba(243,156,98,0.32)] transition-transform active:scale-95"
          aria-label="随机抽一集"
          title="随机抽一集"
        >
          🎲
        </button>
      </div>
    </section>
  )
}
