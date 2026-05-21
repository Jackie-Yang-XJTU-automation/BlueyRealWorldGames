import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { games, getRandomGame } from '../data/games'
import { GameCard } from '../components/GameCard'
import { FilterBar } from '../components/FilterBar'
import { QRCode } from '../components/QRCode'
import { useFavorites } from '../hooks/useFavorites'
import type { FilterOptions, Game } from '../types/game'

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
      {/* 首页标题 */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4 drop-shadow-lg">🎈</div>
        <h2 className="page-title-btv mb-3">
          今天玩什么？
        </h2>
        <p className="text-btv-blue/60 font-bold text-lg">
          从 {games.length} 个 Bluey 游戏中选一个，和宝宝一起玩真的！
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="card-btv mb-8 !p-4">
        <FilterBar onFilterChange={handleFilterChange} onRandomPick={handleRandomPick} />
      </div>

      {/* 随机选中弹窗 */}
      {randomGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-btv-yellow">
            <div className="text-7xl mb-3">{randomGame.emoji}</div>
            <h3 className="text-xl font-extrabold text-btv-orange mb-2">
              🎲 命运选择了...
            </h3>
            <p className="text-3xl font-extrabold text-btv-dark mb-4">
              {randomGame.name}！
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-bold mb-5">
              <span>{randomGame.difficulty === 1 ? '⭐' : randomGame.difficulty === 2 ? '⭐⭐' : '⭐⭐⭐'}</span>
              <span className="text-gray-300">·</span>
              <span>{randomGame.minPlayers}-{randomGame.maxPlayers}人</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRandomGame(null)}
                className="flex-1 bg-gray-100 text-gray-500 font-extrabold py-3.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                再选一次
              </button>
              <button
                onClick={() => {
                  setRandomGame(null)
                  navigate(`/game/${randomGame.id}`)
                }}
                className="btn-btv flex-1"
              >
                就玩这个！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 二维码 */}
      <div className="mb-8">
        <QRCode />
      </div>

      {/* 收藏区 */}
      {favoriteGames.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setFavoritesExpanded(!favoritesExpanded)}
            className="flex items-center gap-2 text-lg font-extrabold text-red-400 mb-4 cursor-pointer"
          >
            <span>{favoritesExpanded ? '▼' : '▶'}</span>
            <span>❤️ 我的收藏 ({favoriteGames.length})</span>
          </button>
          {favoritesExpanded && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => navigate(`/game/${game.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 全部游戏 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-btv-blue/40 uppercase tracking-widest">
            {filters.type === 'all' && filters.location === 'all' && filters.energy === 'all' && filters.difficulty === 'all'
              ? `全部游戏 · ${filteredGames.length}`
              : `筛选结果 · ${filteredGames.length}`}
          </h3>
        </div>
        {filteredGames.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-3">🔍</p>
            <p className="text-xl font-extrabold text-gray-400">没有匹配的游戏</p>
            <p className="text-sm text-gray-300 mt-1 font-bold">试试调整筛选条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  )
}
