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
                  ? 'bg-[#5a5a87] text-white shadow-[0_4px_0_rgba(90,90,135,0.20),0_8px_16px_rgba(44,67,100,0.16)] scale-105'
                  : 'bg-[#E8F7FF] text-[#5a5a87]/72 shadow-[0_3px_0_rgba(174,224,250,0.50)] hover:bg-[#D7F0FF] hover:text-[#5a5a87] hover:scale-[1.03]'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {/* 第二行：场地 + 体力 + 随机 */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, location: filters.location === 'all' ? 'indoor' : filters.location === 'indoor' ? 'outdoor' : 'all' })}
          className={`shrink-0 tag-btv text-xs py-2.5 px-3.5 font-extrabold transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] active:scale-95 ${
            filters.location === 'indoor' ? 'bg-[#5a5a87] text-white shadow-[0_4px_0_rgba(90,90,135,0.20),0_8px_16px_rgba(44,67,100,0.16)] scale-105'
            : filters.location === 'outdoor' ? 'bg-btv-green text-white shadow-[0_4px_0_rgba(76,175,80,0.22),0_8px_16px_rgba(76,175,80,0.14)] scale-105'
            : 'bg-[#E8F7FF] text-[#5a5a87]/72 shadow-[0_3px_0_rgba(174,224,250,0.50)] hover:bg-[#D7F0FF] hover:scale-[1.03]'
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
            filters.energy === 1 ? 'bg-btv-green text-white shadow-[0_4px_0_rgba(76,175,80,0.22),0_8px_16px_rgba(76,175,80,0.14)] scale-105'
            : filters.energy === 2 ? 'bg-btv-yellow text-[#5a5a87] shadow-[0_4px_0_rgba(252,216,130,0.38),0_8px_16px_rgba(252,216,130,0.18)] scale-105'
            : filters.energy === 3 ? 'bg-btv-red text-white shadow-[0_4px_0_rgba(217,107,98,0.22),0_8px_16px_rgba(217,107,98,0.16)] scale-105'
            : 'bg-[#E8F7FF] text-[#5a5a87]/72 shadow-[0_3px_0_rgba(174,224,250,0.50)] hover:bg-[#D7F0FF] hover:scale-[1.03]'
          }`}
        >
          {filters.energy === 1 ? '🪶 轻度' : filters.energy === 2 ? '⚡ 中等' : filters.energy === 3 ? '🔥 高能' : '🪶⚡🔥 体力'}
        </button>

        <button
          type="button"
          onClick={onRandomPick}
          className="shrink-0 btn-btv-secondary !py-2.5 !px-4 !text-sm !min-h-11 !font-extrabold animate-random-pulse"
        >
          🎲 随机开演
        </button>
      </div>
    </div>
  )
}
