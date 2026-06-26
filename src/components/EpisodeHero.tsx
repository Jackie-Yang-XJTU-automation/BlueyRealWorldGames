import type { Game } from '../types/game'
import { getParentPlayHint } from '../data/parentPlayHints'

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
  const hint = getParentPlayHint(game.id)

  return (
    <section className="episode-hero relative mb-4 overflow-hidden rounded-[28px] border-4 border-white/80 bg-[#FDFBF7] px-4 pb-4 pt-3 shadow-[0_10px_24px_rgba(44,67,100,0.09)]">
      <div className="absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,#8CBAE6,#B3E5FC_64%,transparent)]" />
      <div className="absolute -left-10 top-5 h-12 w-24 rounded-full bg-white/76 shadow-[32px_-8px_0_7px_rgba(255,255,255,0.70),72px_2px_0_1px_rgba(255,255,255,0.62)]" />
      <div className="absolute -right-14 top-7 h-10 w-24 rounded-full bg-white/60 shadow-[-34px_-8px_0_4px_rgba(255,255,255,0.56)]" />

      <div className="relative grid gap-3 sm:grid-cols-[1fr_160px] sm:items-end">
        <div>
          <div className="btv-display mb-1.5 inline-flex rotate-[-2deg] items-center gap-2 rounded-full bg-[#FFF9EE] px-3 py-1.5 text-[11px] uppercase text-[#F39C62] shadow-[0_3px_0_rgba(243,156,98,0.18)]">
            <span>🎬 现在就玩</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[#5C728D]">现实玩法灵感</span>
          </div>

          <h1 className="btv-title-pop mb-1 text-[1.65rem] leading-[1.02] sm:text-[2.8rem]">
            周末陪玩小抄
          </h1>
          <p className="mb-2.5 max-w-sm text-[12px] font-extrabold leading-relaxed text-[#5C728D] sm:text-[13px]">
            不用熟剧情。看一眼，照着说，孩子在现实空间里玩起来。
          </p>

          <div className="rounded-[22px] border-2 border-[#E3F2FD] bg-white/88 p-2.5 shadow-[0_5px_14px_rgba(44,67,100,0.06)]">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="btv-display rounded-full bg-[#E3F2FD] px-2.5 py-1 text-[10px] uppercase text-[#5C728D]">
                今日推荐
              </span>
              <span className="text-[11px] font-extrabold text-[#5C728D]">
                {playableCount}/{gameCount} 可开演
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenGame(game)}
              className="group flex w-full items-center gap-3 rounded-[18px] bg-[#FFF9EE] p-2.5 text-left transition-all active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-white text-3xl shadow-[0_4px_0_rgba(44,67,100,0.10)] transition-transform group-hover:-rotate-3 group-hover:scale-105 sm:h-14 sm:w-14 sm:text-4xl">
                {game.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="btv-display block text-lg leading-tight text-[#5a5a87]">{game.name}</span>
                <span className="mt-0.5 block text-[12px] font-black leading-snug text-[#5C728D]">
                  {hint.kidHook}
                </span>
                <span className="mt-1 flex flex-wrap gap-1.5 text-[10px] font-extrabold text-[#5C728D]">
                  <span>{hint.setup}</span>
                  <span>{type.emoji} {type.text}</span>
                  <span>{location.emoji} {location.text}</span>
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[210px] sm:block sm:max-w-none">
          <img
            src={familyImage}
            alt="Bluey 全家准备一起玩"
            className="relative z-10 mx-auto w-32 drop-shadow-[0_12px_24px_rgba(44,67,100,0.22)] sm:w-44"
          />
          <div className="absolute bottom-1 left-1/2 h-8 w-44 -translate-x-1/2 rounded-full bg-[#90C79A]/40 blur-xl" />
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={() => onOpenGame(game)}
          className="btn-btv !min-h-12 !px-4 !py-3 !text-base"
        >
          {playLabel ?? `开演 ${game.name}`}
        </button>
        <button
          type="button"
          onClick={onRandomPick}
          className="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[#F39C62] text-xl font-black text-white shadow-[0_4px_14px_rgba(243,156,98,0.32)] transition-transform active:scale-95"
          aria-label="随机抽一个游戏"
          title="随机抽一个游戏"
        >
          🎲
        </button>
      </div>
    </section>
  )
}
