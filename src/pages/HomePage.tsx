import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { games, getRandomGame } from '../data/games'
import { getPlayableGame, isPlayableGame } from '../data/playableGames'
import { EpisodeHero } from '../components/EpisodeHero'
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
  const spotlightGame = useMemo(() => {
    const playableGames = games.filter(game => isPlayableGame(game.id))
    return playableGames[new Date().getDate() % playableGames.length]
  }, [])

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

  const handleOpenGame = useCallback((game: Game) => {
    const playable = getPlayableGame(game.id)
    navigate(playable?.route ?? `/game/${game.id}`)
  }, [navigate])

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
  }, [])

  // Escape 键关闭弹窗
  useEffect(() => {
    if (!randomGame) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRandomGame(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [randomGame])

  return (
    <div>
      <EpisodeHero
        game={spotlightGame}
        gameCount={games.length}
        playableCount={games.filter(game => isPlayableGame(game.id)).length}
        familyImage={blueyFamily}
        onRandomPick={handleRandomPick}
        onOpenGame={handleOpenGame}
        playLabel={getPlayableGame(spotlightGame.id)?.label}
      />

      {/* 筛选栏 */}
      <div className="mb-5 rounded-[28px] border-2 border-white/90 bg-[#FDFBF7]/86 p-3.5 shadow-[0_6px_0_rgba(174,224,250,0.42),0_10px_24px_rgba(44,67,100,0.08)]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="btv-display text-[13px] uppercase text-[#5a5a87]/72">游戏剧集库</h2>
          <span className="btv-display rounded-full bg-[#ABE0FA] px-2.5 py-1 text-[10px] text-[#5a5a87] shadow-[0_2px_0_rgba(90,90,135,0.12)]">
            {filteredGames.length} 集
          </span>
        </div>
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onRandomPick={handleRandomPick} />
      </div>

      {/* 随机选中弹窗 */}
      {randomGame && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="随机选中游戏"
          className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setRandomGame(null) }}
        >
          <div className="relative overflow-visible bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center border-4 border-btv-yellow animate-jelly">
            {/* 庆祝星星 */}
            <div className="absolute -top-3 -left-3 text-2xl animate-decor-float" style={{ animationDelay: '0s' }}>✨</div>
            <div className="absolute -top-2 -right-3 text-xl animate-decor-float" style={{ animationDelay: '0.3s' }}>🌟</div>
            <div className="absolute -bottom-1 -left-2 text-2xl animate-decor-float" style={{ animationDelay: '0.6s' }}>💫</div>

            <div className="text-8xl mb-3 drop-shadow-lg">{randomGame.emoji}</div>
            <h3 className="text-lg font-extrabold text-btv-orange mb-1">🎲 今天抽中了...</h3>
            <p className="text-3xl font-extrabold text-btv-dark mb-4">{randomGame.name}！</p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#5a5a87]/45 font-bold mb-6">
              <span>{randomGame.difficulty === 1 ? '⭐' : randomGame.difficulty === 2 ? '⭐⭐' : '⭐⭐⭐'}</span>
              <span className="text-[#5a5a87]/20">·</span>
              <span>{randomGame.minPlayers}-{randomGame.maxPlayers}人</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRandomGame(null)}
                className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/55 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] hover:text-[#5a5a87]/80 transition-all active:scale-95"
              >
                再选一次
              </button>
              <button
                type="button"
                onClick={() => { setRandomGame(null); handleOpenGame(randomGame) }}
                className="btn-btv flex-1"
              >
                {isPlayableGame(randomGame.id) ? '直接开演！' : '打开规则'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 收藏区 */}
      {favoriteGames.length > 0 && (
        <section aria-label="我的最爱" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setFavoritesExpanded(!favoritesExpanded)}
              className="flex items-center gap-2 rounded-full bg-white/72 py-1 pr-3 font-extrabold text-[#5a5a87] shadow-[0_3px_0_rgba(174,224,250,0.44)] transition-transform active:scale-95"
            >
              <span className={`ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#FCD882] btv-display text-xs text-[#5a5a87] transition-transform duration-300 ${favoritesExpanded ? 'rotate-0' : '-rotate-90'}`}>
                ▼
              </span>
              <span className="btv-display text-sm">♥ 我的收藏夹 · {favoriteGames.length}</span>
            </button>
          </div>
          {favoritesExpanded && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {favoriteGames.map(game => (
                <div
                  key={game.id}
                  onClick={() => handleOpenGame(game)}
                  className="shrink-0 flex items-center gap-2 rounded-full border-2 border-white bg-[#FDFBF7] py-2 pl-2.5 pr-2 cursor-pointer shadow-[0_4px_0_rgba(174,224,250,0.50),0_8px_15px_rgba(44,67,100,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-95"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ABE0FA] text-base shadow-[0_2px_0_rgba(90,90,135,0.12)]">{game.emoji}</span>
                  <span className="btv-display text-[13px] text-[#5a5a87]">{game.name}</span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleToggleFavorite(game.id)
                    }}
                    className="flex h-[44px] min-h-[44px] w-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#FCE9E4] btv-display text-sm text-[#D96B62] transition-colors hover:bg-[#FFD8CF]"
                    aria-label={`从收藏中移除${game.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 全部游戏 */}
      <section aria-label="全部游戏">
        <h3 className="btv-display mb-3 flex items-center gap-2 text-sm uppercase text-[#5a5a87]/60">
          <span className="h-[2px] w-7 rounded-full bg-[#5a5a87]/12" />
          全部剧集游戏
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] shadow-[0_2px_0_rgba(174,224,250,0.45)]">{filteredGames.length}</span>
        </h3>
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-7xl mb-4">🔍</p>
            <p className="text-xl font-extrabold text-[#5a5a87]/45">没有符合的游戏</p>
            <p className="text-sm text-[#5a5a87]/30 mt-1.5 font-bold">试试换个类型或场地看看？</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredGames.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={isFavorite(game.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => navigate(`/game/${game.id}`)}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* 二维码 */}
      <div className="mt-8">
        <QRCode />
      </div>
    </div>
  )
}
