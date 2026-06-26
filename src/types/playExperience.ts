import type { EnergyLevel, Game, GameType, Location } from './game'

export type PlayMoment =
  | 'wake-up'
  | 'morning'
  | 'after-lunch'
  | 'late-afternoon'
  | 'evening'
  | 'bedtime'

export type PlayPlace = 'living-room' | 'bedroom' | 'kitchen-table' | 'outside' | 'anywhere'

export type PlayNeed =
  | 'quick'
  | 'quiet'
  | 'burn-energy'
  | 'pretend'
  | 'no-materials'
  | 'teamwork'
  | 'wind-down'
  | 'surprise'

export type RecommendationMood =
  | 'rescue'
  | 'gentle'
  | 'wiggly'
  | 'story'
  | 'cozy'
  | 'helper'

export interface RecommendationContext {
  moment: PlayMoment
  place: PlayPlace
  need: PlayNeed
  availableMinutes: 5 | 10 | 15 | 20
  hasOutdoorSpace: boolean
  wantsLowNoise: boolean
}

export interface RecommendationRule {
  id: string
  title: string
  emoji: string
  mood: RecommendationMood
  priority: number
  preferredGameIds: string[]
  avoidGameIds?: string[]
  typeBoosts?: Partial<Record<GameType, number>>
  locationBoosts?: Partial<Record<Location, number>>
  energyBoosts?: Partial<Record<EnergyLevel, number>>
  needBoosts?: Partial<Record<PlayNeed, number>>
  momentBoosts?: Partial<Record<PlayMoment, number>>
  placeBoosts?: Partial<Record<PlayPlace, number>>
  parentLine: string
  childLine: string
  setupLine: string
  safetyLine: string
  why: string
}

export interface TodayRecommendation {
  game: Game
  rule: RecommendationRule
  score: number
  rank: number
  route: string
  label: string
  reason: string
  parentLine: string
  childLine: string
  setupLine: string
  safetyLine: string
  freshness: 'fresh' | 'familiar' | 'rest'
}

export type PlayLaunchSource =
  | 'today'
  | 'scenario'
  | 'random'
  | 'favorite'
  | 'card'
  | 'detail'
  | 'direct-route'
  | 'tool'

export interface PlayHistoryEntry {
  id: string
  gameId: string
  gameName: string
  gameEmoji: string
  route: string
  launchedAt: string
  source: PlayLaunchSource
  contextNeed?: PlayNeed
  contextPlace?: PlayPlace
  note?: string
}

export interface PlayHistorySummary {
  totalLaunches: number
  launchesToday: number
  launchesThisWeek: number
  uniqueGamesThisWeek: number
  favoriteGameIds: string[]
  recentGameIds: string[]
  lastPlayedAt?: string
}

export interface PlayDayBucket {
  dateKey: string
  label: string
  entries: PlayHistoryEntry[]
}

export interface DeliveryReadinessItem {
  id: string
  emoji: string
  title: string
  detail: string
  status: 'ready' | 'watch' | 'manual'
}

