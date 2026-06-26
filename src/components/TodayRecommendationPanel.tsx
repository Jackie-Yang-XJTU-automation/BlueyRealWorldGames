import type { RecommendationContext, TodayRecommendation } from '../types/playExperience'
import { MOMENT_LABELS, NEED_LABELS, PLACE_LABELS } from '../data/recommendationRules'

interface TodayRecommendationPanelProps {
  recommendations: TodayRecommendation[]
  context: RecommendationContext
  launchesToday: number
  onContextChange: (patch: Partial<RecommendationContext>) => void
  onOpenRecommendation: (recommendation: TodayRecommendation) => void
  onRefresh: () => void
}

const NEED_SEQUENCE = ['quick', 'quiet', 'burn-energy', 'pretend', 'no-materials', 'teamwork', 'wind-down', 'surprise'] as const
const PLACE_SEQUENCE = ['living-room', 'bedroom', 'kitchen-table', 'outside', 'anywhere'] as const
const MINUTE_SEQUENCE = [5, 10, 15, 20] as const

function nextValue<T extends string | number>(items: readonly T[], value: T): T {
  const index = items.indexOf(value)
  return items[(index + 1) % items.length]
}

function freshnessLabel(value: TodayRecommendation['freshness']): string {
  if (value === 'fresh') return '今天换口味'
  if (value === 'familiar') return '熟悉好开局'
  return '先让它休息'
}

export function TodayRecommendationPanel({
  recommendations,
  context,
  launchesToday,
  onContextChange,
  onOpenRecommendation,
  onRefresh,
}: TodayRecommendationPanelProps) {
  const primary = recommendations[0]
  const secondary = recommendations.slice(1, 4)
  const need = NEED_LABELS[context.need]
  const place = PLACE_LABELS[context.place]
  const moment = MOMENT_LABELS[context.moment]

  if (!primary) return null

  return (
    <section aria-label="今日游戏推荐" className="mb-5 overflow-hidden rounded-[30px] border-4 border-white bg-[#FDFBF7] shadow-[0_8px_0_rgba(174,224,250,0.45),0_16px_34px_rgba(44,67,100,0.09)]">
      <div className="relative bg-gradient-to-br from-[#E3F2FD] via-[#FFF9EE] to-[#FDFBF7] px-4 pb-4 pt-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="btv-display text-[12px] uppercase tracking-widest text-[#F58634]">今日推荐</p>
            <h2 className="mt-0.5 text-2xl font-black leading-tight text-btv-dark">先玩这一局</h2>
            <p className="mt-1 text-[12px] font-extrabold leading-snug text-[#5C728D]">
              {moment.emoji} {moment.label} · {need.label} · {place.label}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F58634] text-xl text-white shadow-[0_4px_0_rgba(245,134,52,0.25)] transition-transform active:translate-y-0.5 active:scale-95"
            aria-label="换一组今日推荐"
            title="换一组"
          >
            🎲
          </button>
        </div>

        <button
          type="button"
          onClick={() => onOpenRecommendation(primary)}
          className="group grid w-full grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-[26px] border-2 border-white bg-white/88 p-3 text-left shadow-[0_7px_0_rgba(90,90,135,0.08),0_12px_24px_rgba(44,67,100,0.08)] transition-transform active:translate-y-0.5 active:scale-[0.99]"
        >
          <span className="flex h-[76px] w-[76px] items-center justify-center rounded-[24px] bg-[#ABE0FA] text-5xl shadow-inner transition-transform group-active:rotate-3">
            {primary.game.emoji}
          </span>
          <span className="min-w-0">
            <span className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[#FFF3E0] px-2.5 py-1 text-[10px] font-black text-[#F58634]">
                {primary.rule.emoji} {primary.rule.title}
              </span>
              <span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[10px] font-black text-[#4CAF50]">
                {freshnessLabel(primary.freshness)}
              </span>
            </span>
            <span className="block text-xl font-black leading-tight text-btv-dark">{primary.game.name}</span>
            <span className="mt-1 block text-[13px] font-extrabold leading-snug text-[#5C728D]">
              {primary.childLine}
            </span>
            <span className="mt-2 block rounded-2xl bg-[#FFF9EE] px-3 py-2 text-[12px] font-black leading-snug text-[#5C728D]">
              {primary.parentLine}
            </span>
          </span>
        </button>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onContextChange({ need: nextValue(NEED_SEQUENCE, context.need) })}
            className="min-h-[68px] rounded-[20px] bg-white/78 px-2 py-2 text-center shadow-sm transition-transform active:scale-95"
          >
            <span className="block text-lg">{need.emoji}</span>
            <span className="block text-[11px] font-black leading-tight text-[#5a5a87]">{need.label}</span>
            <span className="mt-0.5 block text-[9px] font-extrabold leading-tight text-[#5C728D]">换状态</span>
          </button>
          <button
            type="button"
            onClick={() => onContextChange({ place: nextValue(PLACE_SEQUENCE, context.place), hasOutdoorSpace: context.place !== 'outside' })}
            className="min-h-[68px] rounded-[20px] bg-white/78 px-2 py-2 text-center shadow-sm transition-transform active:scale-95"
          >
            <span className="block text-lg">{place.emoji}</span>
            <span className="block text-[11px] font-black leading-tight text-[#5a5a87]">{place.label}</span>
            <span className="mt-0.5 block text-[9px] font-extrabold leading-tight text-[#5C728D]">换场地</span>
          </button>
          <button
            type="button"
            onClick={() => onContextChange({ availableMinutes: nextValue(MINUTE_SEQUENCE, context.availableMinutes) })}
            className="min-h-[68px] rounded-[20px] bg-white/78 px-2 py-2 text-center shadow-sm transition-transform active:scale-95"
          >
            <span className="block text-lg">⏱️</span>
            <span className="block text-[11px] font-black leading-tight text-[#5a5a87]">{context.availableMinutes} 分钟</span>
            <span className="mt-0.5 block text-[9px] font-extrabold leading-tight text-[#5C728D]">换时长</span>
          </button>
        </div>
      </div>

      <div className="grid gap-2 px-3 pb-3 pt-2 sm:grid-cols-3">
        {secondary.map(item => (
          <button
            key={item.game.id}
            type="button"
            onClick={() => onOpenRecommendation(item)}
            className="flex min-h-[72px] items-center gap-2 rounded-[22px] border-2 border-[#E3F2FD] bg-white px-2.5 py-2 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#E3F2FD] text-2xl">
              {item.game.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-black text-btv-dark">{item.game.name}</span>
              <span className="block text-[10px] font-extrabold leading-snug text-[#5C728D]">{item.rule.title}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="border-t-2 border-[#E3F2FD] bg-white/68 px-4 py-2 text-[11px] font-black text-[#5C728D]">
        今天已打开 {launchesToday} 次。推荐只存在本机，离线也能用。
      </div>
    </section>
  )
}

