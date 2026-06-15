import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { games } from '../data/games'
import { getPlayableGame, isPlayableGame } from '../data/playableGames'
import { getParentPlayHint } from '../data/parentPlayHints'
import { EpisodeHero } from '../components/EpisodeHero'
import { GameCard } from '../components/GameCard'
import { FilterBar } from '../components/FilterBar'
import { QRCode } from '../components/QRCode'
import { useFavorites } from '../hooks/useFavorites'
import type { FilterOptions, Game } from '../types/game'
import blueyFamily from '../assets/Family_Pose_Wave_Loop_18.png'

type ScenarioShortcut = {
  id: string
  emoji: string
  label: string
  hint: string
  match: (game: Game) => boolean
}

const SCENARIO_SHORTCUTS: ScenarioShortcut[] = [
  {
    id: 'quiet-home',
    emoji: '🏠',
    label: '家里安静玩',
    hint: '客厅可开局',
    match: game => ['magic-xylophone', 'hospital', 'claw-machine'].includes(game.id) || (game.location === 'indoor' && game.energy === 1),
  },
  {
    id: 'burn-energy',
    emoji: '⚡',
    label: '孩子很有电',
    hint: '释放体力',
    match: game => ['keepy-uppy', 'shadowlands'].includes(game.id) || game.energy === 3,
  },
  {
    id: 'parents-act',
    emoji: '🎭',
    label: '爸妈一起演',
    hint: '角色扮演',
    match: game => ['daddy-robot', 'hospital', 'bbq', 'claw-machine'].includes(game.id) || game.type === 'roleplay',
  },
  {
    id: 'quick-five',
    emoji: '⏱️',
    label: '5分钟快玩',
    hint: '先救场一局',
    match: game => ['magic-xylophone', 'hospital', 'bbq', 'daddy-robot'].includes(game.id),
  },
  {
    id: 'no-materials',
    emoji: '✨',
    label: '不用材料',
    hint: '马上开始',
    match: game => game.materials.length === 0 || ['daddy-robot', 'shadowlands'].includes(game.id),
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    label: '睡前可玩',
    hint: '低刺激收尾',
    match: game => ['hospital', 'bbq', 'magic-xylophone'].includes(game.id) || (game.energy === 1 && game.type !== 'active'),
  },
]

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
  const [showFilters, setShowFilters] = useState(false)
  const [focusedGameIds, setFocusedGameIds] = useState<string[]>([])
  const cardRefs = useRef(new Map<string, HTMLDivElement>())
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

  const sortedFilteredGames = useMemo(() => {
    return [...filteredGames].sort((a, b) => {
      const playableDelta = Number(isPlayableGame(b.id)) - Number(isPlayableGame(a.id))
      if (playableDelta !== 0) return playableDelta
      return a.episode - b.episode
    })
  }, [filteredGames])

  const favoriteGames = useMemo(() => {
    return games.filter(g => favorites.includes(g.id))
  }, [favorites])

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id)
    setFavorites(getFavorites())
  }, [toggleFavorite, getFavorites])

  const handleRandomPick = useCallback(() => {
    const playableGames = games.filter(game => isPlayableGame(game.id))
    const pool = playableGames.length > 0 ? playableGames : games
    const game = pool[Math.floor(Math.random() * pool.length)]
    setRandomGame(game)
  }, [])

  const handleOpenGame = useCallback((game: Game) => {
    const playable = getPlayableGame(game.id)
    navigate(playable?.route ?? `/game/${game.id}`)
  }, [navigate])

  const pickScenarioGame = useCallback((shortcut: ScenarioShortcut) => {
    const candidates = games.filter(shortcut.match)
    const playableCandidates = candidates.filter(game => isPlayableGame(game.id))
    const pool = playableCandidates.length > 0 ? playableCandidates : candidates
    if (pool.length === 0) return null
    return pool[(new Date().getDate() + shortcut.id.length) % pool.length]
  }, [])

  const scenarioPicks = useMemo(() => (
    SCENARIO_SHORTCUTS
      .map(shortcut => ({ shortcut, game: pickScenarioGame(shortcut) }))
      .filter((item): item is { shortcut: ScenarioShortcut; game: Game } => Boolean(item.game))
  ), [pickScenarioGame])

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
  }, [])

  const setCardRef = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) cardRefs.current.set(id, node)
    else cardRefs.current.delete(id)
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

  useEffect(() => {
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)')
    let frame = 0
    let idleTimer = 0

    const updateFocusedCard = () => {
      frame = 0
      const shouldUseTouchFocus = touchQuery.matches || window.innerWidth < 768
      if (!shouldUseTouchFocus || sortedFilteredGames.length === 0) {
        setFocusedGameIds([])
        return
      }

      const focusY = window.innerHeight * 0.48
      const visibleCards: { id: string; rect: DOMRect }[] = []
      let focusedTop = 0
      let bestDistance = Number.POSITIVE_INFINITY

      sortedFilteredGames.forEach(game => {
        const node = cardRefs.current.get(game.id)
        if (!node) return
        const rect = node.getBoundingClientRect()
        if (rect.bottom < 120 || rect.top > window.innerHeight - 24) return

        visibleCards.push({ id: game.id, rect })
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - focusY)
        if (distance < bestDistance) {
          bestDistance = distance
          focusedTop = rect.top
        }
      })

      const nextIds = visibleCards
        .filter(({ rect }) => Math.abs(rect.top - focusedTop) < 48)
        .map(({ id }) => id)

      setFocusedGameIds(current => (
        current.length === nextIds.length && current.every((id, index) => id === nextIds[index])
          ? current
          : nextIds
      ))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateFocusedCard)
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(updateFocusedCard, 120)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    touchQuery.addEventListener('change', requestUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.clearTimeout(idleTimer)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      touchQuery.removeEventListener('change', requestUpdate)
    }
  }, [sortedFilteredGames])

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

      <section aria-label="按周末场景选游戏" className="mb-5">
        <div className="mb-2 flex items-end justify-between gap-3 px-1">
          <div>
            <p className="btv-display text-sm text-[#5a5a87]">周末救场</p>
            <p className="text-xs font-extrabold text-[#5a5a87]/45">不记剧情也可以直接开演</p>
          </div>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-[#5a5a87]/45 shadow-[0_2px_0_rgba(174,224,250,0.45)]">
            家长选
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {scenarioPicks.map(({ shortcut, game }) => {
            const hint = getParentPlayHint(game.id)
            return (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => handleOpenGame(game)}
              className="group min-h-[72px] rounded-[22px] border-2 border-white bg-[#FDFBF7]/90 px-3 py-2.5 text-left shadow-[0_4px_0_rgba(174,224,250,0.40),0_8px_18px_rgba(44,67,100,0.06)] transition-all active:scale-[0.98] sm:min-h-[78px]"
            >
              <span className="mb-1 flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ABE0FA] text-lg shadow-[0_2px_0_rgba(90,90,135,0.12)]">
                  {shortcut.emoji}
                </span>
                <span className="btv-display text-[13px] leading-tight text-[#5a5a87]">{shortcut.label}</span>
              </span>
              <span className="block pl-11 text-[11px] font-extrabold leading-snug text-[#5a5a87]/46">{shortcut.hint}</span>
              <span className="mt-1 block truncate pl-11 text-[10px] font-black text-[#5a5a87]/32">
                推荐：{game.name} · {hint.setup}
              </span>
            </button>
            )
          })}
        </div>
      </section>

      {/* 筛选栏 */}
      <div className="mb-5 rounded-[28px] border-2 border-white/90 bg-[#FDFBF7]/86 p-3.5 shadow-[0_6px_0_rgba(174,224,250,0.42),0_10px_24px_rgba(44,67,100,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="btv-display text-[13px] uppercase text-[#5a5a87]/72">想找别的玩法？</h2>
            <p className="text-[11px] font-extrabold text-[#5a5a87]/40">
              常用入口在上面，筛选先收起来，避免开局前看太久。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(value => !value)}
            className="min-h-11 rounded-full bg-[#ABE0FA] px-3 text-[11px] font-black text-[#5a5a87] shadow-[0_2px_0_rgba(90,90,135,0.12)] transition-transform active:scale-95"
            aria-expanded={showFilters}
          >
            {showFilters ? '收起' : `${filteredGames.length} 集`}
          </button>
        </div>
        {showFilters && (
          <div className="mt-3">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} onRandomPick={handleRandomPick} />
          </div>
        )}
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
          <div className="relative w-full max-w-[340px] rounded-[30px] border-[3px] border-[#F9D06B] bg-[#FDFBF7] p-5 text-center shadow-[0_18px_40px_rgba(44,67,100,0.18)] animate-jelly">
            <div className="mx-auto mb-3 inline-flex rotate-[-2deg] rounded-full bg-[#FFF3E0] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-btv-orange">
              随机救场
            </div>
            <div className="mb-2 text-5xl drop-shadow-sm">{randomGame.emoji}</div>
            <h3 className="mb-1 text-[13px] font-extrabold text-btv-orange">这局开演</h3>
            <p className="mb-2 text-2xl font-black leading-tight text-btv-dark">{randomGame.name}</p>
            <p className="mx-auto mb-3 max-w-[250px] text-sm font-extrabold leading-snug text-[#5a5a87]/58">
              {getParentPlayHint(randomGame.id).kidHook}
            </p>
            <div className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-black text-[#5a5a87]/48">
              <span className="rounded-full bg-[#E3F2FD] px-2.5 py-1">{getParentPlayHint(randomGame.id).setup}</span>
              <span className="rounded-full bg-[#FFF3E0] px-2.5 py-1">{randomGame.minPlayers}-{randomGame.maxPlayers}人</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRandomGame(null)}
                className="min-h-12 flex-1 rounded-full bg-[#F0F4FF] px-3 py-3 text-sm font-extrabold text-[#5a5a87]/55 transition-all hover:bg-[#E3ECFD] hover:text-[#5a5a87]/80 active:scale-95"
              >
                再选一次
              </button>
              <button
                type="button"
                onClick={() => { setRandomGame(null); handleOpenGame(randomGame) }}
                className="btn-btv flex-1 !min-h-12 !px-3 !py-3 !text-sm"
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
          全部陪玩卡
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] shadow-[0_2px_0_rgba(174,224,250,0.45)]">{filteredGames.length}</span>
        </h3>
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-7xl mb-4">🔍</p>
            <p className="text-xl font-extrabold text-[#5a5a87]/45">没有符合的游戏</p>
            <p className="text-sm text-[#5a5a87]/30 mt-1.5 font-bold">试试换个类型或场地看看？</p>
          </div>
        ) : (
          <div className="episode-card-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedFilteredGames.map((game, i) => (
              <div key={game.id} ref={node => setCardRef(game.id, node)}>
                <GameCard
                  game={game}
                  isFavorite={isFavorite(game.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => handleOpenGame(game)}
                  index={i}
                  isTouchFocused={focusedGameIds.includes(game.id)}
                />
              </div>
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
