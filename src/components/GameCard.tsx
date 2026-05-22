import type { Game } from '../types/game'

interface GameCardProps {
  game: Game
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick: () => void
}

const typeStyles: Record<string, { bg: string; dot: string }> = {
  active: { bg: 'bg-[#FFF3E0]', dot: 'bg-[#FF9800]' },
  roleplay: { bg: 'bg-[#F3E5F5]', dot: 'bg-[#9C27B0]' },
  story: { bg: 'bg-[#E3F2FD]', dot: 'bg-[#2196F3]' },
  quiet: { bg: 'bg-[#E8F5E9]', dot: 'bg-[#4CAF50]' },
}

const typeLabels: Record<string, { emoji: string; text: string; pill: string }> = {
  active: { emoji: '🏃', text: '运动型', pill: 'bg-orange-100 text-orange-600' },
  roleplay: { emoji: '🎭', text: '扮演型', pill: 'bg-purple-100 text-purple-600' },
  story: { emoji: '📖', text: '故事型', pill: 'bg-blue-100 text-blue-600' },
  quiet: { emoji: '🧘', text: '安静型', pill: 'bg-green-100 text-green-600' },
}

const difficultyStars: Record<number, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' }

export function GameCard({ game, isFavorite, onToggleFavorite, onClick }: GameCardProps) {
  const style = typeStyles[game.type] ?? typeStyles.quiet
  const label = typeLabels[game.type] ?? typeLabels.quiet

  return (
    <div
      className="rounded-2xl bg-white border-2 border-[#E3F2FD] shadow-sm cursor-pointer group overflow-hidden active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      {/* 彩色顶部区 - 放 emoji */}
      <div className={`${style.bg} h-20 flex items-center justify-center relative`}>
        <span className="text-5xl drop-shadow-sm">{game.emoji}</span>
        {/* 收藏 */}
        <button
          onClick={e => {
            e.stopPropagation()
            onToggleFavorite(game.id)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-base shadow-sm active:scale-90 transition-transform"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 底部信息 */}
      <div className="p-3">
        <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1.5 ${label.pill}`}>
          {label.emoji} {label.text}
        </span>
        <h3 className="text-sm font-extrabold text-btv-dark leading-tight mb-1 line-clamp-1">
          {game.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
          <span>{difficultyStars[game.difficulty]}</span>
          <span className="text-gray-300">·</span>
          <span>{game.minPlayers}-{game.maxPlayers}人</span>
        </div>
      </div>
    </div>
  )
}
