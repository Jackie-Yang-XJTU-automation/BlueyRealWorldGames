import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { games, getRandomGame } from '../data/games'
import { GameCard } from '../components/GameCard'
import { FilterBar } from '../components/FilterBar'
import { QRCode } from '../components/QRCode'
import { useFavorites } from '../hooks/useFavorites'
import type { FilterOptions, Game } from '../types/game'
import blueyFamily from '../assets/Family_Pose_Wave_Loop_18.png'

export function HomePage() {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite, getFavorites } = useFavorites()
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    location: 'all',
    energy: 'all',
    difficulty: 'all'
  })
  const [favorites, setFavorites] = useState<string[]>(getFavorites)
  const [randomGame, setRandomGame] = useState<Game | null>(null)
  const [favoritesExpanded, setFavoritesExpanded] = useState(true)

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      if (filters.type !== 'all' && g.type !== filters.type) return false
      if (filters.location !== 'all' && g.location !== filters.location) return false
      if (filters.energy !== 'all' && g.energy !== (filters.energy as number)) return false
      if (filters.difficulty !== 'all' && g.difficulty !== (filters.difficulty as number)) return false
      return true
    })
  }, [filters])

  const favoriteGames = useMemo(() => {
    return games.filter(g => favorites.includes(g.id))
  }, [favorites])

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id)
    setFavorites(getFavorites())
  }, [toggleFavorite, getFavorites])

  const handleRandomPick = useCallback(() => {
    const game = getRandomGame()
    setRandomGame(game)
  }, [])

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
  }, [])

  return (
    <div>
      {/* 标题 */}
      <div className="text-center mb-4">
        <img src={blueyFamily} alt="Bluey Family" className="w-28 sm:w-36 h-auto mx-auto mb-2 drop-shadow-lg" />
        <h2 className="page-title-btv mb-1">今天玩什么？</h2>
        <p className="text-[#5a5a87]/50 font-bold text-sm">
          For Real Life · 和宝宝一起，玩真的！
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="mb-4">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onRandomPick={handleRandomPick} />
      </div>

      {/* 随机选中弹窗 */}
      {randomGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-btv-yellow">
            <div className="text-7xl mb-3">{randomGame.emoji}</div>
            <h3 className="text-xl font-extrabold text-btv-orange mb-2">🎲 命运选择了...</h3>
            <p className="text-3xl font-extrabold text-btv-dark mb-4">{randomGame.name}！</p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#5a5a87]/50 font-bold mb-5">
              <span>{randomGame.difficulty === 1 ? '⭐' : randomGame.difficulty === 2 ? '⭐⭐' : '⭐⭐⭐'}</span>
              <span className="text-[#5a5a87]/25">·</span>
              <span>{randomGame.minPlayers}-{randomGame.maxPlayers}人</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRandomGame(null)} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">
                再选一次
              </button>
              <button onClick={() => { setRandomGame(null); navigate(`/game/${randomGame.id}`) }} className="btn-btv flex-1">
                就玩这个！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 收藏区 - 紧凑标签条 */}
      {favoriteGames.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <button
              onClick={() => setFavoritesExpanded(!favoritesExpanded)}
              className="flex items-center gap-1.5 font-extrabold text-red-400"
            >
              <span>{favoritesExpanded ? '▼' : '▶'}</span>
              <span className="text-sm">❤️ 我的最爱 ({favoriteGames.length})</span>
            </button>
          </div>
          {favoritesExpanded && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {favoriteGames.map(game => (
                <div
                  key={game.id}
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="shrink-0 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full pl-2.5 pr-1.5 py-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span className="text-xs">{game.emoji}</span>
                  <span className="text-xs font-extrabold text-red-400">{game.name}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleToggleFavorite(game.id)
                    }}
                    className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-[10px] hover:bg-red-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 全部游戏 */}
      <div>
        <h3 className="text-sm font-extrabold text-[#5a5a87]/50 uppercase tracking-wider mb-3">
          全部游戏 · {filteredGames.length}
        </h3>
        {filteredGames.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-3">🔍</p>
            <p className="text-xl font-extrabold text-[#5a5a87]/50">没有符合筛选的游戏</p>
            <p className="text-sm text-[#5a5a87]/35 mt-1 font-bold">试试换个类型或场地看看？</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={isFavorite(game.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => navigate(`/game/${game.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 二维码 - 底部 */}
      <div className="mt-8">
        <QRCode />
      </div>
    </div>
  )
}
