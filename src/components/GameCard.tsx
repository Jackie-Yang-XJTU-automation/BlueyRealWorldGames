import { useState, useCallback } from 'react'
import type { Game } from '../types/game'

interface GameCardProps {
  game: Game
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick: () => void
  /** 0-based index for staggered entrance */
  index?: number
}

const typeStyles: Record<string, { gradient: string; dot: string; glow: string }> = {
  active: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#FFE0B2_0%,#FFF3E0_60%,#FFF8E1_100%)]',
    dot: 'bg-[#FF9800]',
    glow: 'hover:shadow-[0_14px_36px_rgba(255,152,0,0.15)]'
  },
  roleplay: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#E1BEE7_0%,#F3E5F5_60%,#FCE4EC_100%)]',
    dot: 'bg-[#9C27B0]',
    glow: 'hover:shadow-[0_14px_36px_rgba(156,39,176,0.13)]'
  },
  story: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#BBDEFB_0%,#E3F2FD_60%,#F1F8FE_100%)]',
    dot: 'bg-[#2196F3]',
    glow: 'hover:shadow-[0_14px_36px_rgba(33,150,243,0.13)]'
  },
  quiet: {
    gradient: 'bg-[radial-gradient(ellipse_at_70%_30%,#C8E6C9_0%,#E8F5E9_60%,#F1F8F2_100%)]',
    dot: 'bg-[#4CAF50]',
    glow: 'hover:shadow-[0_14px_36px_rgba(76,175,80,0.12)]'
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

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setHeartBounce(true)
    onToggleFavorite(game.id)
    setTimeout(() => setHeartBounce(false), 450)
  }, [game.id, onToggleFavorite])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${game.name} - ${label.text}游戏，${game.minPlayers}-${game.maxPlayers}人`}
      className="rounded-[28px] bg-white border-2 border-[#E3F2FD] hover:border-[#BBDEFB] shadow-[0_6px_20px_rgba(28,152,237,0.08)] cursor-pointer group overflow-hidden active:scale-[0.97] hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-card-enter"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
    >
      {/* 彩色渐变顶部区 */}
      <div className={`${style.gradient} h-[88px] flex items-center justify-center relative overflow-hidden`}>
        {/* 装饰圆点 */}
        <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${style.dot} opacity-20`} />
        <div className={`absolute bottom-3 right-4 w-5 h-5 rounded-full ${style.dot} opacity-10`} />
        <div className={`absolute top-4 right-8 w-2 h-2 rounded-full ${style.dot} opacity-15`} />

        {/* Emoji — 悬浮弹跳 */}
        <span className="text-6xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.08)] group-hover:scale-115 group-hover:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
          {game.emoji}
        </span>

        {/* 收藏按钮 */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? '取消收藏' : '收藏游戏'}
          className={`absolute top-2.5 right-2.5 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-lg shadow-sm hover:scale-110 active:scale-90 transition-transform z-10 ${heartBounce ? 'animate-heart-pop' : ''}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 底部信息区 */}
      <div className="p-4 pt-3.5">
        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full mb-2 ${label.pill}`}>
          {label.emoji} {label.text}
        </span>
        <h3 className="text-[15px] font-extrabold text-btv-dark leading-tight mb-1.5 line-clamp-1 group-hover:text-[#1A2D4A] transition-colors">
          {game.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-[#5a5a87]/45 font-bold">
          <span>{difficultyStars[game.difficulty]}</span>
          <span className="text-[#5a5a87]/20">·</span>
          <span>{game.minPlayers}-{game.maxPlayers}人</span>
        </div>
      </div>
    </div>
  )
}
