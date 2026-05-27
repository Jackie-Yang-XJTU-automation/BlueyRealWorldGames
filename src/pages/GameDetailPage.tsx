import { useParams, useNavigate } from 'react-router-dom'
import { getGameById } from '../data/games'

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>()
  const navigate = useNavigate()
  const game = getGameById(gameId ?? '')

  if (!game) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-3">🔍</p>
        <p className="text-xl font-extrabold text-gray-400">找不到这个游戏</p>
        <button onClick={() => navigate('/')} className="btn-btv mt-6">
          回到首页
        </button>
      </div>
    )
  }

  const difficultyStars: Record<number, string> = { 1: '⭐', 2: '⭐⭐', 3: '⭐⭐⭐' }
  const energyLabels: Record<number, string> = { 1: '🪶 轻度', 2: '⚡ 中等', 3: '🔥 高能' }
  const typeLabels: Record<string, string> = {
    active: '运动型', roleplay: '角色扮演', story: '故事型', quiet: '安静型'
  }
  const locationLabels: Record<string, string> = {
    indoor: '🏠 室内', outdoor: '🌳 户外', both: '🏠🌳 室内外皆可'
  }

  const isKeepyUppy = game.id === 'keepy-uppy'
  const isShadowLands = game.id === 'shadowlands'
  const isDaddyRobot = game.id === 'daddy-robot'

  return (
    <div className="max-w-lg mx-auto">
      {/* 游戏头部 */}
      <div className="text-center mb-6">
        <div className="text-7xl mb-4 drop-shadow-lg">{game.emoji}</div>
        <h2 className="page-title-btv mb-1">{game.name}</h2>
        <p className="text-btv-blue/50 font-bold text-sm">第 {game.episode} 集 · {game.episodeName}</p>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <span className="tag-btv bg-[#E3F2FD] text-[#1565C0]">{typeLabels[game.type]}</span>
        <span className="tag-btv bg-[#E8F5E9] text-[#2E7D32]">{locationLabels[game.location]}</span>
        <span className="tag-btv bg-[#FFF3E0] text-[#E65100]">{difficultyStars[game.difficulty]} {energyLabels[game.energy]}</span>
        <span className="tag-btv bg-[#F3E5F5] text-[#7B1FA2]">{game.minPlayers}-{game.maxPlayers}人</span>
      </div>

      {/* 描述 */}
      <div className="card-btv p-5 mb-4">
        <p className="text-gray-600 leading-relaxed font-medium">{game.description}</p>
      </div>

      {/* 玩法规则 */}
      <div className="card-btv p-5 mb-4">
        <h3 className="text-lg font-extrabold text-btv-dark mb-3">📋 玩法规则</h3>
        <ol className="space-y-2">
          {game.rules.map((rule, i) => (
            <li key={i} className="flex gap-2 text-gray-600 font-medium">
              <span className="font-extrabold text-btv-blue shrink-0">{i + 1}.</span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 材料 */}
      <div className="card-btv p-5 mb-4">
        <h3 className="text-lg font-extrabold text-btv-dark mb-3">🎒 材料清单</h3>
        {game.materials.length === 0 ? (
          <p className="text-gray-400 font-medium">无需准备材料，直接开始玩！</p>
        ) : (
          <ul className="space-y-1">
            {game.materials.map((m, i) => (
              <li key={i} className="flex gap-2 text-gray-600 font-medium">
                <span>✅</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 亲子小贴士 */}
      <div className="bg-[#FFF8E1] rounded-[28px] p-5 border-2 border-[#FFD54F] mb-4">
        <h3 className="text-lg font-extrabold text-btv-dark mb-2">💡 亲子小贴士</h3>
        <p className="text-gray-600 leading-relaxed font-medium">{game.tips}</p>
      </div>

      {/* 趣味升级 */}
      <div className="card-btv p-5 mb-6">
        <h3 className="text-lg font-extrabold text-btv-dark mb-3">🎮 趣味升级</h3>
        <ul className="space-y-2">
          {game.upgrades.map((up, i) => (
            <li key={i} className="flex gap-2 text-gray-600 font-medium">
              <span>✨</span>
              <span>{up}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      {isKeepyUppy ? (
        <button
          onClick={() => navigate('/game/keepy-uppy/play')}
          className="btn-btv w-full text-2xl animate-pulse-glow-btv"
        >
          🎈 开始玩！
        </button>
      ) : isShadowLands ? (
        <button
          onClick={() => navigate('/game/shadowlands/play')}
          className="btn-btv w-full text-2xl animate-pulse-glow-btv"
        >
          ☀️ 进入影子陆地！
        </button>
      ) : isDaddyRobot ? (
        <button
          onClick={() => navigate('/game/daddy-robot/play')}
          className="btn-btv w-full text-2xl animate-pulse-glow-btv"
        >
          🤖 启动机器人！
        </button>
      ) : (
        <div className="text-center py-6 bg-[#E3F2FD] rounded-[28px] border-2 border-dashed border-btv-blue/20">
          <p className="text-btv-blue/50 font-extrabold text-lg">🚧 游戏玩法即将推出</p>
          <p className="text-btv-blue/35 text-sm mt-1 font-bold">先看看规则，现实中玩起来吧！</p>
        </div>
      )}
    </div>
  )
}
