import { useState, useCallback, type MouseEvent } from 'react'
import type { Game } from '../types/game'
import { isPlayableGame } from '../data/playableGames'
import { getParentPlayHint } from '../data/parentPlayHints'

interface GameCardProps {
  game: Game
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick: () => void
  /** 0-based index for staggered entrance */
  index?: number
  /** Touch-first focus used by mobile scroll position */
  isTouchFocused?: boolean
}

interface TypeStyle {
  cover: string
  chip: string
  status: string
  glow: string
  iconBg: string
}

const typeStyles: Record<string, TypeStyle> = {
  active: {
    cover: 'bg-[linear-gradient(180deg,#9EE1FE_0%,#DDF7FF_58%,#FFF3D5_100%)]',
    chip: 'bg-[#FFF0D7] text-[#B95F1E] border-[#FFD08B]',
    status: 'bg-[#5a5a87] text-white border-[#7777A2]',
    glow: 'hover:shadow-[0_14px_34px_rgba(245,134,52,0.18)]',
    iconBg: 'bg-[#FFF9EE]',
  },
  roleplay: {
    cover: 'bg-[linear-gradient(180deg,#BDEBFF_0%,#E9FAFF_58%,#F7E7FF_100%)]',
    chip: 'bg-[#F4E8FF] text-[#7B3FA1] border-[#E4C1F2]',
    status: 'bg-[#5a5a87] text-white border-[#7777A2]',
    glow: 'hover:shadow-[0_14px_34px_rgba(171,71,188,0.16)]',
    iconBg: 'bg-[#FFF7FF]',
  },
  story: {
    cover: 'bg-[linear-gradient(180deg,#9EE1FE_0%,#DDF7FF_58%,#E5F6FF_100%)]',
    chip: 'bg-[#E3F5FF] text-[#2270A8] border-[#BFE9FF]',
    status: 'bg-[#5a5a87] text-white border-[#7777A2]',
    glow: 'hover:shadow-[0_14px_34px_rgba(28,152,237,0.16)]',
    iconBg: 'bg-[#F5FBFF]',
  },
  quiet: {
    cover: 'bg-[linear-gradient(180deg,#BDEBFF_0%,#E9FAFF_58%,#EDF8EA_100%)]',
    chip: 'bg-[#EAF7E8] text-[#3F7F43] border-[#C8E8C2]',
    status: 'bg-[#5a5a87] text-white border-[#7777A2]',
    glow: 'hover:shadow-[0_14px_34px_rgba(76,175,80,0.15)]',
    iconBg: 'bg-[#F7FFF5]',
  },
}

const typeLabels: Record<string, { mark: string; text: string }> = {
  active: { mark: '跑', text: '运动型' },
  roleplay: { mark: '演', text: '扮演型' },
  story: { mark: '讲', text: '故事型' },
  quiet: { mark: '静', text: '安静型' },
}

const locationLabels: Record<Game['location'], string> = {
  indoor: '室内',
  outdoor: '户外',
  both: '室内外',
}

export function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onClick,
  index = 0,
  isTouchFocused = false,
}: GameCardProps) {
  const style = typeStyles[game.type] ?? typeStyles.quiet
  const label = typeLabels[game.type] ?? typeLabels.quiet
  const hint = getParentPlayHint(game.id)
  const [heartBounce, setHeartBounce] = useState(false)
  const playable = isPlayableGame(game.id)

  const handleFavorite = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    setHeartBounce(true)
    onToggleFavorite(game.id)
    setTimeout(() => setHeartBounce(false), 450)
  }, [game.id, onToggleFavorite])

  return (
    <div
      className={`episode-sticker-card ${isTouchFocused ? 'is-touch-focused' : ''} relative rounded-[28px] bg-[#FDFBF7] border-2 border-white shadow-[0_8px_0_rgba(174,224,250,0.45),0_12px_24px_rgba(44,67,100,0.10)] cursor-pointer group overflow-visible active:scale-[0.97] hover:-translate-y-1.5 hover:rotate-[-0.5deg] hover:border-[#ABE0FA] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-card-enter ${style.glow}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        type="button"
        aria-label={`${game.name} - ${label.text}游戏，${game.minPlayers}-${game.maxPlayers}人`}
        onClick={onClick}
        className="block w-full overflow-hidden rounded-[26px] text-left"
      >
        <div className={`episode-card-cover ${style.cover} relative flex h-[94px] items-center justify-center overflow-hidden border-b-2 border-white/90`}>
          <span className="btv-episode-pill absolute left-3 top-3 z-20">
            S1E{game.episode}
          </span>

          <div className={`relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full border-[6px] border-white ${style.iconBg} shadow-[0_7px_0_rgba(90,90,135,0.13),0_12px_20px_rgba(44,67,100,0.13)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105`}>
            <span className="text-[2.9rem] leading-none drop-shadow-[0_3px_0_rgba(255,255,255,0.82)]">
              {game.emoji}
            </span>
          </div>
        </div>

        <div className="p-3.5 pt-3 pb-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black ${style.chip}`}>
              <span className="btv-mini-mark">{label.mark}</span>
              {label.text}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black shadow-[0_2px_0_rgba(90,90,135,0.12)] ${style.status}`}>
              {playable ? '马上玩' : '规则'}
            </span>
          </div>
          <h3 className="btv-display mb-1.5 line-clamp-1 text-[16px] leading-tight text-[#5a5a87] transition-colors group-hover:text-[#4e4e7a]">
            {game.name}
          </h3>
          <p className="mb-2 min-h-[34px] text-[12px] font-extrabold leading-snug text-[#5a5a87]/58">
            {hint.kidHook}
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-black text-[#75759f]/62">
            <span className="rounded-full bg-[#E3F2FD] px-2 py-0.5">{hint.setup}</span>
            <span className="rounded-full bg-[#FFF3E0] px-2 py-0.5">{game.minPlayers}-{game.maxPlayers}人</span>
            <span className="rounded-full bg-[#EAF7E8] px-2 py-0.5">{locationLabels[game.location]}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={handleFavorite}
        aria-label={isFavorite ? '取消收藏' : '收藏游戏'}
        className={`btv-favorite-button absolute top-2.5 right-2.5 z-30 ${isFavorite ? 'is-favorite' : ''} ${heartBounce ? 'animate-heart-pop' : ''}`}
      >
        <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      </button>
    </div>
  )
}
