import { getPlayableGame } from '../data/playableGames'
import type { Game } from '../types/game'
import type {
  PlayDayBucket,
  PlayHistoryEntry,
  PlayHistorySummary,
  PlayLaunchSource,
  PlayNeed,
  PlayPlace,
} from '../types/playExperience'
import { loadFromStorage, saveToStorage } from './storage'

const PLAY_HISTORY_KEY = 'play-history-v1'
const MAX_HISTORY_ENTRIES = 80
const DIRECT_ROUTE_DEDUPE_MS = 45_000

function createEntryId(gameId: string, date: Date): string {
  return `${date.getTime()}-${gameId}-${Math.floor(Math.random() * 1000)}`
}

function parseTime(value: string): number {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function daysAgo(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() - amount)
  return next
}

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toDayLabel(dateKey: string, today = new Date()): string {
  const todayKey = toDateKey(today)
  const yesterdayKey = toDateKey(daysAgo(today, 1))
  if (dateKey === todayKey) return '今天'
  if (dateKey === yesterdayKey) return '昨天'
  const [, month, day] = dateKey.split('-')
  return `${Number(month)}月${Number(day)}日`
}

export function loadPlayHistory(): PlayHistoryEntry[] {
  return loadFromStorage<PlayHistoryEntry[]>(PLAY_HISTORY_KEY, [])
    .filter(entry => entry.gameId && entry.gameName && entry.route && entry.launchedAt)
    .sort((a, b) => parseTime(b.launchedAt) - parseTime(a.launchedAt))
    .slice(0, MAX_HISTORY_ENTRIES)
}

export function savePlayHistory(entries: PlayHistoryEntry[]): void {
  saveToStorage(
    PLAY_HISTORY_KEY,
    entries
      .filter(entry => entry.gameId && entry.gameName)
      .sort((a, b) => parseTime(b.launchedAt) - parseTime(a.launchedAt))
      .slice(0, MAX_HISTORY_ENTRIES),
  )
}

export function recordGameLaunch(
  game: Game,
  source: PlayLaunchSource,
  options: {
    contextNeed?: PlayNeed
    contextPlace?: PlayPlace
    note?: string
    route?: string
    now?: Date
  } = {},
): PlayHistoryEntry {
  const now = options.now ?? new Date()
  const route = options.route ?? getPlayableGame(game.id)?.route ?? `/game/${game.id}`
  const entries = loadPlayHistory()
  const latest = entries[0]

  if (
    latest &&
    latest.gameId === game.id &&
    source === 'direct-route' &&
    parseTime(now.toISOString()) - parseTime(latest.launchedAt) < DIRECT_ROUTE_DEDUPE_MS
  ) {
    return latest
  }

  const entry: PlayHistoryEntry = {
    id: createEntryId(game.id, now),
    gameId: game.id,
    gameName: game.name,
    gameEmoji: game.emoji,
    route,
    launchedAt: now.toISOString(),
    source,
    contextNeed: options.contextNeed,
    contextPlace: options.contextPlace,
    note: options.note,
  }

  savePlayHistory([entry, ...entries])
  return entry
}

export function clearPlayHistory(): void {
  savePlayHistory([])
}

export function getPlayHistorySummary(entries = loadPlayHistory(), now = new Date()): PlayHistorySummary {
  const todayStart = startOfLocalDay(now).getTime()
  const weekStart = startOfLocalDay(daysAgo(now, 6)).getTime()
  const todayEntries = entries.filter(entry => parseTime(entry.launchedAt) >= todayStart)
  const weekEntries = entries.filter(entry => parseTime(entry.launchedAt) >= weekStart)
  const gameCounts = new Map<string, number>()

  weekEntries.forEach(entry => {
    gameCounts.set(entry.gameId, (gameCounts.get(entry.gameId) ?? 0) + 1)
  })

  const favoriteGameIds = [...gameCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([gameId]) => gameId)

  const recentGameIds = [...new Set(entries.slice(0, 10).map(entry => entry.gameId))]

  return {
    totalLaunches: entries.length,
    launchesToday: todayEntries.length,
    launchesThisWeek: weekEntries.length,
    uniqueGamesThisWeek: new Set(weekEntries.map(entry => entry.gameId)).size,
    favoriteGameIds,
    recentGameIds,
    lastPlayedAt: entries[0]?.launchedAt,
  }
}

export function groupPlayHistoryByDay(entries = loadPlayHistory(), now = new Date()): PlayDayBucket[] {
  const groups = new Map<string, PlayHistoryEntry[]>()

  entries.forEach(entry => {
    const date = new Date(entry.launchedAt)
    const key = toDateKey(date)
    groups.set(key, [...(groups.get(key) ?? []), entry])
  })

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, dayEntries]) => ({
      dateKey,
      label: toDayLabel(dateKey, now),
      entries: dayEntries.sort((a, b) => parseTime(b.launchedAt) - parseTime(a.launchedAt)),
    }))
}

export function getRecentGameSet(entries = loadPlayHistory(), maxAgeDays = 3, now = new Date()): Set<string> {
  const cutoff = startOfLocalDay(daysAgo(now, maxAgeDays - 1)).getTime()
  return new Set(
    entries
      .filter(entry => parseTime(entry.launchedAt) >= cutoff)
      .map(entry => entry.gameId),
  )
}

export function formatPlayTime(value: string, now = new Date()): string {
  const time = parseTime(value)
  if (!time) return '刚才'
  const diff = now.getTime() - time
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return '刚才'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  const date = new Date(value)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

