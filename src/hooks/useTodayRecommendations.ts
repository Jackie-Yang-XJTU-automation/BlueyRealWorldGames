import { useCallback, useMemo, useState } from 'react'
import { games } from '../data/games'
import { getPlayableGame, isPlayableGame } from '../data/playableGames'
import {
  DEFAULT_RECOMMENDATION_CONTEXT,
  getDefaultContextForNow,
  getSeedForToday,
  RECOMMENDATION_RULES,
} from '../data/recommendationRules'
import type { Game } from '../types/game'
import type {
  PlayHistoryEntry,
  PlayLaunchSource,
  RecommendationContext,
  RecommendationRule,
  TodayRecommendation,
} from '../types/playExperience'
import {
  getPlayHistorySummary,
  getRecentGameSet,
  loadPlayHistory,
  recordGameLaunch,
} from '../utils/playHistory'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const CONTEXT_KEY = 'today-recommendation-context-v1'

function rotateScore(seed: number, gameId: string, ruleId: string): number {
  let value = seed
  const input = `${gameId}-${ruleId}`
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) % 9973
  }
  return (value % 13) / 10
}

function getFreshness(game: Game, history: PlayHistoryEntry[]): TodayRecommendation['freshness'] {
  const recent = history.slice(0, 8).filter(entry => entry.gameId === game.id)
  if (recent.length === 0) return 'fresh'
  if (recent.length >= 3) return 'rest'
  return 'familiar'
}

function scoreRuleForGame(
  game: Game,
  rule: RecommendationRule,
  context: RecommendationContext,
  history: PlayHistoryEntry[],
  seed: number,
): number {
  if (rule.avoidGameIds?.includes(game.id)) return -1000

  let score = rule.priority
  const recentSet = getRecentGameSet(history)
  const summary = getPlayHistorySummary(history)

  if (rule.preferredGameIds.includes(game.id)) score += 34
  score += rule.typeBoosts?.[game.type] ?? 0
  score += rule.locationBoosts?.[game.location] ?? 0
  score += rule.energyBoosts?.[game.energy] ?? 0
  score += rule.needBoosts?.[context.need] ?? 0
  score += rule.placeBoosts?.[context.place] ?? 0
  score += rule.momentBoosts?.[context.moment] ?? 0

  if (context.wantsLowNoise && game.energy === 1) score += 10
  if (context.wantsLowNoise && game.energy === 3) score -= 18
  if (context.hasOutdoorSpace && game.location !== 'indoor') score += 8
  if (!context.hasOutdoorSpace && game.location === 'outdoor') score -= 16
  if (context.availableMinutes <= 5 && game.difficulty === 1) score += 8
  if (context.availableMinutes <= 5 && game.difficulty === 3) score -= 8
  if (context.availableMinutes >= 15 && game.difficulty >= 2) score += 5
  if (!isPlayableGame(game.id)) score -= 40

  if (recentSet.has(game.id)) score -= 16
  if (summary.favoriteGameIds.includes(game.id)) score += 6
  if (summary.launchesToday === 0 && rule.mood === 'rescue') score += 6
  score += rotateScore(seed, game.id, rule.id)

  return score
}

function buildReason(game: Game, rule: RecommendationRule, context: RecommendationContext): string {
  const parts = [rule.why]
  if (context.need === 'quick') parts.push('这一局能快速开始。')
  if (context.need === 'wind-down') parts.push('适合慢慢收尾。')
  if (context.need === 'burn-energy') parts.push('能把身体电量放到安全规则里。')
  if (context.place === 'kitchen-table') parts.push('桌边道具更容易组织。')
  if (context.place === 'outside' && game.location !== 'indoor') parts.push('户外空间会让路线和角色更成立。')
  return parts.slice(0, 2).join(' ')
}

function getContextInitialValue(): RecommendationContext {
  return {
    ...DEFAULT_RECOMMENDATION_CONTEXT,
    ...getDefaultContextForNow(),
    ...loadFromStorage<Partial<RecommendationContext>>(CONTEXT_KEY, {}),
  }
}

export function useTodayRecommendations() {
  const [context, setContextState] = useState<RecommendationContext>(getContextInitialValue)
  const [history, setHistory] = useState<PlayHistoryEntry[]>(() => loadPlayHistory())
  const [manualShuffle, setManualShuffle] = useState(0)

  const playableGames = useMemo(() => games.filter(game => isPlayableGame(game.id)), [])
  const seed = getSeedForToday() + manualShuffle * 37

  const recommendations = useMemo<TodayRecommendation[]>(() => {
    const scored = playableGames.flatMap(game => (
      RECOMMENDATION_RULES.map(rule => ({
        game,
        rule,
        score: scoreRuleForGame(game, rule, context, history, seed),
      }))
    ))

    const bestByGame = new Map<string, { game: Game; rule: RecommendationRule; score: number }>()
    scored.forEach(item => {
      const current = bestByGame.get(item.game.id)
      if (!current || item.score > current.score) bestByGame.set(item.game.id, item)
    })

    return [...bestByGame.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item, index) => {
        const playable = getPlayableGame(item.game.id)
        return {
          game: item.game,
          rule: item.rule,
          score: Math.round(item.score),
          rank: index + 1,
          route: playable?.route ?? `/game/${item.game.id}`,
          label: playable?.label ?? `打开${item.game.name}`,
          reason: buildReason(item.game, item.rule, context),
          parentLine: item.rule.parentLine,
          childLine: item.rule.childLine,
          setupLine: item.rule.setupLine,
          safetyLine: item.rule.safetyLine,
          freshness: getFreshness(item.game, history),
        }
      })
  }, [context, history, playableGames, seed])

  const summary = useMemo(() => getPlayHistorySummary(history), [history])

  const setContext = useCallback((patch: Partial<RecommendationContext>) => {
    setContextState(current => {
      const next = { ...current, ...patch }
      saveToStorage(CONTEXT_KEY, next)
      return next
    })
  }, [])

  const refreshRecommendations = useCallback(() => {
    setManualShuffle(value => value + 1)
  }, [])

  const markLaunched = useCallback((
    game: Game,
    source: PlayLaunchSource,
    note?: string,
  ) => {
    recordGameLaunch(game, source, {
      contextNeed: context.need,
      contextPlace: context.place,
      note,
    })
    setHistory(loadPlayHistory())
  }, [context.need, context.place])

  const refreshHistory = useCallback(() => {
    setHistory(loadPlayHistory())
  }, [])

  return {
    context,
    recommendations,
    primaryRecommendation: recommendations[0],
    summary,
    history,
    setContext,
    refreshRecommendations,
    markLaunched,
    refreshHistory,
  }
}

