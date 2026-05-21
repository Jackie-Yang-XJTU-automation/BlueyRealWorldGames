import type { Game } from '../types/game'

interface GameCardProps {
  game: Game
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onClick: () => void
}

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]', label: '运动' },
  roleplay: { bg: 'bg-[#F3E5F5]', text: 'text-[#7B1FA2]', label: '扮演' },
  story: { bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]', label: '故事' },
  quiet: { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', label: '安静' }
}

const energyEmojis: Record<number, string> = { 1: '🪶', 2: '⚡', 3: '🔥' }
const difficultyStars: Record<number, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' }
const locationEmojis: Record<string, string> = { indoor: '🏠', outdoor: '🌳', both: '🏠🌳' }

export function GameCard({ game, isFavorite, onToggleFavorite, onClick }: GameCardProps) {
  const typeStyle = typeStyles[game.type] ?? typeStyles.quiet

  return (
    <div
      className="card-btv cursor-pointer group relative"
      onClick={onClick}
    >
      {/* 收藏按钮 */}
      <button
        onClick={e => {
          e.stopPropagation()
          onToggleFavorite(game.id)
        }}
        className="absolute top-4 right-4 text-2xl transition-transform hover:scale-125 active:scale-90 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={isFavorite ? '取消收藏' : '收藏'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      {/* emoji */}
      <div className="text-6xl mb-4 transition-transform group-hover:scale-110 duration-200">
        {game.emoji}
      </div>

      {/* 游戏名 */}
      <h3 className="text-base font-extrabold text-btv-dark mb-2 group-hover:text-btv-blue transition-colors leading-tight">
        {game.name}
      </h3>

      {/* 类型标签 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`tag-btv ${typeStyle.bg} ${typeStyle.text}`}>
          {typeStyle.label}
        </span>
        <span className="tag-btv bg-gray-100 text-gray-500">
          {locationEmojis[game.location]}
        </span>
      </div>

      {/* 难度 / 体力 / 人数 */}
      <div className="flex items-center gap-2 text-sm text-gray-400 font-bold mb-2">
        <span>{difficultyStars[game.difficulty]}</span>
        <span className="text-gray-300">·</span>
        <span>{energyEmojis[game.energy]}</span>
        <span className="text-gray-300">·</span>
        <span>{game.minPlayers}-{game.maxPlayers}人</span>
      </div>

      {/* 描述 */}
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
        {game.description}
      </p>

      {/* 集数 */}
      <div className="mt-3 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-300 font-bold">
          第 {game.episode} 集 · {game.episodeName}
        </span>
      </div>
    </div>
  )
}
