import { useState } from 'react'
import type { FilterOptions } from '../types/game'

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void
  onRandomPick: () => void
}

const typeLabels: Record<string, string> = {
  all: '全部类型',
  active: '运动型',
  roleplay: '角色扮演',
  story: '故事型',
  quiet: '安静型'
}

const locationLabels: Record<string, string> = {
  all: '全部场地',
  indoor: '室内',
  outdoor: '户外',
  both: '室内外'
}

export function FilterBar({ onFilterChange, onRandomPick }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    location: 'all',
    energy: 'all',
    difficulty: 'all'
  })

  const update = (key: keyof FilterOptions, value: string) => {
    const next = { ...filters, [key]: value === 'all' ? 'all' : (key === 'energy' || key === 'difficulty') ? (value === 'all' ? 'all' : Number(value)) : value } as FilterOptions
    setFilters(next)
    onFilterChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2.5 items-center justify-center px-2 py-3">
      <select
        className="bg-white rounded-full px-5 py-3 text-sm font-extrabold border-2 border-[#E3F2FD] text-btv-dark cursor-pointer hover:border-btv-blue/30 transition-colors"
        value={filters.type}
        onChange={e => update('type', e.target.value)}
      >
        {Object.entries(typeLabels).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      <select
        className="bg-white rounded-full px-5 py-3 text-sm font-extrabold border-2 border-[#E3F2FD] text-btv-dark cursor-pointer hover:border-btv-blue/30 transition-colors"
        value={filters.location}
        onChange={e => update('location', e.target.value)}
      >
        {Object.entries(locationLabels).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      <select
        className="bg-white rounded-full px-5 py-3 text-sm font-extrabold border-2 border-[#E3F2FD] text-btv-dark cursor-pointer hover:border-btv-blue/30 transition-colors"
        value={String(filters.energy)}
        onChange={e => update('energy', e.target.value)}
      >
        <option value="all">全部体力</option>
        <option value="1">🪶 轻度</option>
        <option value="2">⚡ 中等</option>
        <option value="3">🔥 高能</option>
      </select>

      <button
        onClick={onRandomPick}
        className="btn-btv text-lg px-6 !rounded-full"
      >
        🎲 随机选一个！
      </button>
    </div>
  )
}
