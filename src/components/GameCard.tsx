import { useState, useCallback } from 'react'
import type { Game } from '../types/game'
import { isPlayableGame } from '../data/playableGames'

interface GameCardProps {
  game: Game
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick: () => void
  /** 0-based index for staggered entrance */
  index?: number
}

const typeStyles: Record<string, { gradient: string; dot: string; glow: string; tape: string }> = {
  active: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#FFE0B2_0%,#FFF3E0_60%,#FFF8E1_100%)]',
    dot: 'bg-[#FF9800]',
    glow: 'hover:shadow-[0_14px_36px_rgba(255,152,0,0.15)]',
    tape: 'bg-[#FFF3E0] text-orange-600 border-orange-200',
  },
  roleplay: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#E1BEE7_0%,#F3E5F5_60%,#FCE4EC_100%)]',
    dot: 'bg-[#9C27B0]',
    glow: 'hover:shadow-[0_14px_36px_rgba(156,39,176,0.13)]',
    tape: 'bg-[#F3E5F5] text-purple-600 border-purple-200',
  },
  story: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#BBDEFB_0%,#E3F2FD_60%,#F1F8FE_100%)]',
    dot: 'bg-[#2196F3]',
    glow: 'hover:shadow-[0_14px_36px_rgba(33,150,243,0.13)]',
    tape: 'bg-[#E3F2FD] text-blue-600 border-blue-200',
  },
  quiet: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#C8E6C9_0%,#E8F5E9_60%,#F1F8F2_100%)]',
    dot: 'bg-[#4CAF50]',
    glow: 'hover:shadow-[0_14px_36px_rgba(76,175,80,0.12)]',
    tape: 'bg-[#E8F5E9] text-green-600 border-green-200',
  },
}

const typeLabels: Record<string, { emoji: string; text: string; pill: string }> = {
  active: { emoji: '🏃', text: '运动型', pill: 'bg-orange-100 text-orange-600' },
  roleplay: { emoji: '🎭', text: '扮演型', pill: 'bg-purple-100 text-purple-600' },
  story: { emoji: '📖', text: '故事型', pill: 'bg-blue-100 text-blue-600' },
  quiet: { emoji: '🧘', text: '安静型', pill: 'bg-green-100 text-green-600' },
}

const difficultyStars: Record<number, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' }

export function GameCard({ game, isFavorite, onToggleFavorite, onClick, index = 0 }: GameCardProps) {
  const style = typeStyles[game.type] ?? typeStyles.quiet
  const label = typeLabels[game.type] ?? typeLabels.quiet
  const [heartBounce, setHeartBounce] = useState(false)
  const playable = isPlayableGame(game.id)

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setHeartBounce(true)
    onToggleFavorite(game.id)
    setTimeout(() => setHeartBounce(false), 450)
  }, [game.id, onToggleFavorite])

  return (
    <div
      className={`episode-sticker-card relative rounded-[26px] bg-white border-2 border-[#E3F2FD] hover:border-[#BBDEFB] shadow-[0_7px_18px_rgba(44,67,100,0.10)] cursor-pointer group overflow-visible active:scale-[0.97] hover:-translate-y-1.5 hover:rotate-[-0.5deg] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-card-enter ${style.glow}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="pointer-events-none absolute -top-2 left-4 z-20 rotate-[-4deg] rounded-full border border-white/80 bg-[#F9D06B]/90 px-2.5 py-1 text-[10px] font-black text-btv-dark shadow-sm">
        S1E{game.episode}
      </div>

      <button
        type="button"
        aria-label={`${game.name} - ${label.text}游戏，${game.minPlayers}-${game.maxPlayers}人`}
        onClick={onClick}
        className="block w-full overflow-hidden rounded-[24px] text-left"
      >
        <div className={`${style.gradient} relative flex h-[106px] items-center justify-center overflow-hidden border-b border-white/70`}>
          <div className={`absolute left-3 top-3 h-3 w-3 rounded-full ${style.dot} opacity-20`} />
          <div className={`absolute bottom-3 right-4 h-8 w-8 rounded-full ${style.dot} opacity-10`} />
          <div className="absolute inset-x-4 bottom-2 h-3 rounded-full bg-white/30 blur-sm" />

          <span className="text-[4.25rem] drop-shadow-[0_5px_9px_rgba(44,67,100,0.12)] group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
            {game.emoji}
          </span>
        </div>

        <div className="p-3.5 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-extrabold ${label.pill}`}>
            {label.emoji} {label.text}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${style.tape}`}>
              {playable ? '可开演' : '规则卡'}
            </span>
          </div>
          <h3 className="mb-1.5 line-clamp-1 text-[15px] font-black leading-tight text-btv-dark transition-colors group-hover:text-[#1A2D4A]">
            {game.name}
          </h3>
          <p className="mb-2 line-clamp-2 min-h-[32px] text-[11px] font-bold leading-snug text-[#5a5a87]/48">
            {game.episodeName} · {game.location === 'outdoor' ? '去户外找场地' : game.location === 'both' ? '室内外都能玩' : '客厅就能开演'}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#5a5a87]/45">
            <span aria-label={`难度 ${game.difficulty}`}>{difficultyStars[game.difficulty]}</span>
            <span className="text-[#5a5a87]/20">·</span>
            <span>{game.minPlayers}-{game.maxPlayers}人</span>
          </div>
        </div>
      </button>

      {/* 收藏按钮 */}
      <button
        type="button"
        onClick={handleFavorite}
        aria-label={isFavorite ? '取消收藏' : '收藏游戏'}
        className={`absolute top-2.5 right-2.5 z-30 flex h-[44px] min-h-[44px] w-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/92 text-lg shadow-[0_3px_10px_rgba(44,67,100,0.13)] transition-transform hover:scale-110 active:scale-90 ${heartBounce ? 'animate-heart-pop' : ''}`}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
