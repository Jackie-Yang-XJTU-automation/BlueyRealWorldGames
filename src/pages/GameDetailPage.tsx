import { useParams, useNavigate } from 'react-router-dom'
import { getGameById } from '../data/games'
import { getPlayableGame } from '../data/playableGames'

const difficultyStars: Record<number, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' }
const energyLabels: Record<number, { emoji: string; text: string }> = {
  1: { emoji: '🪶', text: '轻度' },
  2: { emoji: '⚡', text: '中等' },
  3: { emoji: '🔥', text: '高能' },
}
const typeLabels: Record<string, { emoji: string; text: string }> = {
  active: { emoji: '🏃', text: '运动型' },
  roleplay: { emoji: '🎭', text: '角色扮演' },
  story: { emoji: '📖', text: '故事型' },
  quiet: { emoji: '🧘', text: '安静型' },
}
const locationLabels: Record<string, { emoji: string; text: string }> = {
  indoor: { emoji: '🏠', text: '室内' },
  outdoor: { emoji: '🌳', text: '户外' },
  both: { emoji: '🏠🌳', text: '室内外皆可' },
}

const heroGradients: Record<string, string> = {
  active: 'from-[#FFF3E0] via-[#FFE0B2] to-[#FFF8E1]',
  roleplay: 'from-[#F3E5F5] via-[#E1BEE7] to-[#FCE4EC]',
  story: 'from-[#E3F2FD] via-[#BBDEFB] to-[#F1F8FE]',
  quiet: 'from-[#E8F5E9] via-[#C8E6C9] to-[#F1F8F2]',
}

const heroAccents: Record<string, string> = {
  active: 'bg-[#FF9800]/10',
  roleplay: 'bg-[#9C27B0]/10',
  story: 'bg-[#2196F3]/10',
  quiet: 'bg-[#4CAF50]/10',
}

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const game = getGameById(gameId ?? '')

  if (!game) {
    return (
      <div className="text-center py-20">
        <p className="text-7xl mb-4">🔍</p>
        <p className="text-xl font-extrabold text-[#5a5a87]/45">找不到这个游戏</p>
        <p className="text-sm text-[#5a5a87]/30 mt-1 font-bold">它可能躲到沙发底下去了...</p>
        <button type="button" onClick={() => navigate('/')} className="btn-btv mt-8">
          回到首页
        </button>
      </div>
    )
  }

  const type = typeLabels[game.type] ?? typeLabels.quiet
  const location = locationLabels[game.location] ?? locationLabels.indoor
  const energy = energyLabels[game.energy] ?? energyLabels[1]
  const heroGradient = heroGradients[game.type] ?? heroGradients.quiet
  const heroAccent = heroAccents[game.type] ?? heroAccents.quiet

  const playable = getPlayableGame(game.id)
  const isPlayable = !!playable
  const playLabel = playable?.label

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      {/* 英雄区 — 满幅彩色渐变 */}
      <div className={`relative bg-gradient-to-b ${heroGradient} -mt-8 pt-10 pb-8 px-4 rounded-b-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden`}>
        {/* 装饰圆 */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${heroAccent}`} />
        <div className={`absolute -bottom-6 -left-8 w-28 h-28 rounded-full ${heroAccent}`} />

        <div className="relative text-center">
          {/* 集数标签 */}
          <span className="inline-block text-[11px] font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-2">
            第 {game.episode} 集 · {game.episodeName}
          </span>

          {/* Emoji */}
          <div className="text-8xl mb-3 drop-shadow-[0_6px_16px_rgba(0,0,0,0.06)] animate-jelly">
            {game.emoji}
          </div>

          {/* 游戏名 */}
          <h2 className="text-[2.25rem] sm:text-[2.75rem] font-black text-btv-dark tracking-tight leading-none mb-3">
            {game.name}
          </h2>

          {/* 快速数据条 */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            <span className="tag-btv bg-white/80 text-[#5a5a87]/70 text-[12px] font-extrabold shadow-sm">
              {type.emoji} {type.text}
            </span>
            <span className="tag-btv bg-white/80 text-[#5a5a87]/70 text-[12px] font-extrabold shadow-sm">
              {location.emoji} {location.text}
            </span>
            <span className="tag-btv bg-white/80 text-[#5a5a87]/70 text-[12px] font-extrabold shadow-sm">
              {energy.emoji} {energy.text}
            </span>
            <span className="tag-btv bg-white/80 text-[#5a5a87]/70 text-[12px] font-extrabold shadow-sm">
              {difficultyStars[game.difficulty]}
            </span>
            <span className="tag-btv bg-white/80 text-[#5a5a87]/70 text-[12px] font-extrabold shadow-sm">
              👥 {game.minPlayers}-{game.maxPlayers}人
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-0">
        {/* 简介 — 引用风格 */}
        <div className="text-center py-6 relative">
          <span className="absolute top-0 left-[15%] text-5xl text-[#5a5a87]/8 font-serif select-none pointer-events-none leading-none">"</span>
          <p className="text-[15px] leading-relaxed font-bold text-[#5a5a87]/65 relative z-10 px-2">
            {game.description}
          </p>
          <span className="absolute bottom-0 right-[15%] text-5xl text-[#5a5a87]/8 font-serif select-none pointer-events-none leading-none rotate-180">"</span>
        </div>

        {/* 玩法规则 — 步骤卡片 */}
        <div className="mb-5">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#5a5a87]/15 rounded-full" />
            怎么玩
            <span className="flex-1 h-[2px] bg-[#5a5a87]/15 rounded-full" />
          </h3>
          <div className="space-y-2.5">
            {game.rules.map((rule, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-white rounded-2xl p-3.5 border border-[#E3F2FD] shadow-[0_2px_8px_rgba(28,152,237,0.04)] hover:border-[#BBDEFB] hover:shadow-[0_4px_14px_rgba(28,152,237,0.08)] transition-all duration-300 animate-card-enter"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-[#E3F2FD] text-[#2C4364] flex items-center justify-center text-xs font-extrabold">
                  {i + 1}
                </span>
                <span className="text-[13px] leading-relaxed font-bold text-[#5a5a87]/75 pt-0.5">{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 材料 + 贴士 — 并排卡片（桌面）/ 上下（手机） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* 材料 */}
          <div className="bg-white rounded-2xl p-4 border border-[#E3F2FD] shadow-[0_2px_8px_rgba(28,152,237,0.04)]">
            <h4 className="text-xs font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-2.5">🎒 材料清单</h4>
            {game.materials.length === 0 ? (
              <p className="text-[13px] font-bold text-[#90C79A] flex items-center gap-1.5">
                <span className="text-base">✨</span> 无需准备，随时开玩！
              </p>
            ) : (
              <ul className="space-y-1.5">
                {game.materials.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] font-bold text-[#5a5a87]/65">
                    <span className="w-5 h-5 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[10px] shrink-0">✓</span>
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 贴士 — 温暖便签风格 */}
          <div className="relative bg-[#FFFDF5] rounded-2xl p-4 border-2 border-[#F9D06B]/30 shadow-[0_2px_8px_rgba(249,208,107,0.12)]" style={{ transform: 'rotate(0.3deg)' }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-[#F9D06B]/30" />
            <h4 className="text-xs font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-2.5">💡 亲子小贴士</h4>
            <p className="text-[13px] leading-relaxed font-bold text-[#5a5a87]/65">{game.tips}</p>
          </div>
        </div>

        {/* 趣味升级 */}
        <div className="mb-6">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#5a5a87]/15 rounded-full" />
            趣味升级
            <span className="flex-1 h-[2px] bg-[#5a5a87]/15 rounded-full" />
          </h3>
          <div className="flex flex-wrap gap-2">
            {game.upgrades.map((up, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2 border border-[#E3F2FD] shadow-[0_2px_6px_rgba(28,152,237,0.04)] hover:border-[#BBDEFB] hover:-translate-y-0.5 transition-all duration-300 animate-card-enter"
                style={{ animationDelay: `${i * 80 + 300}ms` }}
              >
                <span className="text-sm">✨</span>
                <span className="text-[12px] font-extrabold text-[#5a5a87]/65">{up}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA 按钮 */}
        <div className="pb-8">
          {isPlayable ? (
            <button
              type="button"
              onClick={() => playable && navigate(playable.route)}
              className="btn-btv w-full text-2xl animate-random-pulse"
            >
              {playLabel}
            </button>
          ) : (
            <div className="text-center py-8 bg-gradient-to-b from-[#E3F2FD] to-[#F0F4FF] rounded-[28px] border-2 border-dashed border-btv-blue/15">
              <p className="text-4xl mb-2">🚧</p>
              <p className="text-lg font-extrabold text-[#5a5a87]/40">玩法即将推出</p>
              <p className="text-sm text-[#5a5a87]/25 mt-0.5 font-bold">先看看规则，现实中玩起来吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
