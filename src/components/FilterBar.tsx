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
    <div className="space-y-2">
      {/* 第一行：类型 */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {typeOptions.map(o => (
          <button
            key={o.key}
            onClick={() => onFilterChange({ ...filters, type: o.key as FilterOptions['type'] })}
            className={`shrink-0 tag-btv text-xs py-2 px-3.5 transition-all ${
              filters.type === o.key
                ? 'bg-btv-blue text-white shadow-sm'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 第二行：场地 + 体力 + 随机 */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onFilterChange({ ...filters, location: filters.location === 'all' ? 'indoor' : filters.location === 'indoor' ? 'outdoor' : 'all' })}
          className={`shrink-0 tag-btv text-xs py-2 px-3 transition-all ${
            filters.location === 'indoor' ? 'bg-btv-blue text-white shadow-sm'
            : filters.location === 'outdoor' ? 'bg-btv-green text-white shadow-sm'
            : 'bg-gray-100 text-gray-500'
          }`}
        >
          {filters.location === 'indoor' ? '🏠 室内' : filters.location === 'outdoor' ? '🌳 户外' : '🏠🌳 场地'}
        </button>

        <button
          onClick={() => {
            const levels: FilterOptions['energy'][] = ['all', 1, 2, 3]
            const idx = levels.indexOf(filters.energy)
            onFilterChange({ ...filters, energy: levels[(idx + 1) % levels.length] })
          }}
          className={`shrink-0 tag-btv text-xs py-2 px-3 transition-all ${
            filters.energy === 1 ? 'bg-btv-green text-white shadow-sm'
            : filters.energy === 2 ? 'bg-btv-yellow text-white shadow-sm'
            : filters.energy === 3 ? 'bg-btv-red text-white shadow-sm'
            : 'bg-gray-100 text-gray-500'
          }`}
        >
          {filters.energy === 1 ? '🪶 轻度' : filters.energy === 2 ? '⚡ 中等' : filters.energy === 3 ? '🔥 高能' : '🪶⚡🔥 体力'}
        </button>

        <div className="flex-1" />

        <button onClick={onRandomPick} className="shrink-0 btn-btv !py-2.5 !px-4 !text-sm !min-h-0 !font-extrabold">
          🎲 随机
        </button>
      </div>
    </div>
  )
}
