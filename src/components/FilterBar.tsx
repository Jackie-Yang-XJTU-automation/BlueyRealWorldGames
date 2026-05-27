import type { FilterOptions } from '../types/game'

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void
  onRandomPick: () => void
  filters: FilterOptions
}

const typeOptions = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '🏃 运动型' },
  { key: 'roleplay', label: '🎭 扮演型' },
  { key: 'quiet', label: '🧘 安静型' },
] as const

export function FilterBar({ onFilterChange, onRandomPick, filters }: FilterBarProps) {
  return (
    <div className="space-y-2.5">
      {/* 第一行：类型选择 — 更大更醒目的药丸 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {typeOptions.map(o => {
          const active = filters.type === o.key
          return (
            <button
              type="button"
              key={o.key}
              onClick={() => onFilterChange({ ...filters, type: o.key as FilterOptions['type'] })}
              className={`shrink-0 tag-btv text-[13px] py-2.5 px-4 font-extrabold transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-95 ${
                active
                  ? 'bg-btv-dark text-white shadow-[0_4px_16px_rgba(44,67,100,0.3)] scale-105'
                  : 'bg-[#F0F4FF] text-[#5a5a87]/55 hover:bg-[#E3ECFD] hover:text-[#5a5a87]/80 hover:scale-[1.03]'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {/* 第二行：场地 + 体力 + 随机 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, location: filters.location === 'all' ? 'indoor' : filters.location === 'indoor' ? 'outdoor' : 'all' })}
          className={`shrink-0 tag-btv text-xs py-2.5 px-3.5 font-extrabold transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-95 ${
            filters.location === 'indoor' ? 'bg-btv-dark text-white shadow-[0_4px_16px_rgba(44,67,100,0.3)] scale-105'
            : filters.location === 'outdoor' ? 'bg-btv-green text-white shadow-[0_4px_16px_rgba(144,199,122,0.35)] scale-105'
            : 'bg-[#F0F4FF] text-[#5a5a87]/55 hover:bg-[#E3ECFD] hover:scale-[1.03]'
          }`}
        >
          {filters.location === 'indoor' ? '🏠 室内' : filters.location === 'outdoor' ? '🌳 户外' : '🏠🌳 场地'}
        </button>

        <button
          type="button"
          onClick={() => {
            const levels: FilterOptions['energy'][] = ['all', 1, 2, 3]
            const idx = levels.indexOf(filters.energy)
            onFilterChange({ ...filters, energy: levels[(idx + 1) % levels.length] })
          }}
          className={`shrink-0 tag-btv text-xs py-2.5 px-3.5 font-extrabold transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-95 ${
            filters.energy === 1 ? 'bg-btv-green text-white shadow-[0_4px_16px_rgba(144,199,122,0.35)] scale-105'
            : filters.energy === 2 ? 'bg-btv-yellow text-white shadow-[0_4px_16px_rgba(252,216,130,0.40)] scale-105'
            : filters.energy === 3 ? 'bg-btv-red text-white shadow-[0_4px_16px_rgba(217,107,98,0.35)] scale-105'
            : 'bg-[#F0F4FF] text-[#5a5a87]/55 hover:bg-[#E3ECFD] hover:scale-[1.03]'
          }`}
        >
          {filters.energy === 1 ? '🪶 轻度' : filters.energy === 2 ? '⚡ 中等' : filters.energy === 3 ? '🔥 高能' : '🪶⚡🔥 体力'}
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={onRandomPick}
          className="shrink-0 btn-btv !py-2.5 !px-4 !text-sm !min-h-0 !font-extrabold animate-random-pulse"
        >
          🎲 随机
        </button>
      </div>
    </div>
  )
}
