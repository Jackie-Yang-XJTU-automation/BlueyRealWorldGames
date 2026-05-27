import { useState, useEffect, useRef } from 'react'
import { useKeepyUppyGame } from '../hooks/useKeepyUppyGame'
import { GameTimer } from '../components/GameTimer'
import { RandomEventPopup } from '../components/RandomEventPopup'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'

const BALLOON_COLORS = ['#F44336', '#F58634', '#FFC107', '#4CAF50', '#1C98ED', '#AB47BC', '#EC407A']
const TASK_SCORES = [100, 200, 300, 500, 800]
const BLUEY_PHRASES = [
  'Bluey 说：别让气球碰到地板！',
  'Bingo 在给你加油呢～',
  'Bandit 爸爸觉得你能坚持更久！',
  'Chilli 妈妈一手拿锅铲也在帮你顶！',
  '记住，这可是 Bluey 最爱的红气球！',
]

const PRESET_NAMES = ['爸爸', '妈妈', '宝宝', '爷爷', '奶奶']
const STORAGE_KEY_PLAYED = 'keepyuppy_played'

export function KeepyUppyPage() {
  const game = useKeepyUppyGame()
  const [balloonColor] = useState(() => BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)])
  const [showTasks, setShowTasks] = useState(true)
  const [showLandConfirm, setShowLandConfirm] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [showScoreHelp, setShowScoreHelp] = useState(false)
  const [hasPlayedBefore] = useState(() => localStorage.getItem(STORAGE_KEY_PLAYED) === 'true')
  const [encourageIndex, setEncourageIndex] = useState(0)
  const encourageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const markPlayed = () => {
    if (!hasPlayedBefore) localStorage.setItem(STORAGE_KEY_PLAYED, 'true')
  }

  useEffect(() => {
    if (game.state === 'running') {
      encourageTimerRef.current = setInterval(() => {
        setEncourageIndex(i => (i + 1) % BLUEY_PHRASES.length)
      }, 8000)
    } else if (game.state === 'paused') {
      // 暂停时不动，保持当前鼓励语
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    } else {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
    return () => {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
  }, [game.state])

  return (
    <div className="max-w-lg mx-auto">
      {/* 标题 + 积分 */}
      <div className="text-center mb-6">
        <h2 className="page-title-btv mb-1">
          顶气球 <span className="text-btv-blue">Keepy Uppy!</span>
        </h2>
        <p className="text-btv-blue/40 font-bold text-xs">Bluey · 第 3 集</p>

        <div className="inline-flex items-center gap-2 mt-3 bg-white rounded-full px-5 py-2.5 shadow-md border-2 border-[#FFD54F] relative">
          <span className="text-2xl">⭐</span>
          <span className={`text-3xl font-extrabold text-yellow-500 timer-text transition-all duration-300 ${game.scoreBump ? 'animate-score-bump' : ''}`}>
            {game.totalStars}
          </span>
          <button
            onClick={() => setShowScoreHelp(!showScoreHelp)}
            className="w-5 h-5 rounded-full bg-[#F0F4FF] text-[#5a5a87]/50 text-[10px] font-extrabold flex items-center justify-center hover:bg-[#E3ECFD] transition-colors"
          >?</button>
          {showScoreHelp && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-[#E3F2FD] text-left whitespace-nowrap animate-event-pop-in">
              <p className="text-xs font-bold text-[#5a5a87]/60 mb-1.5">星星怎么来的？</p>
              <p className="text-xs font-extrabold text-[#5a5a87]/70">⏱ 坚持越久分越高（每秒 +10⭐）</p>
              <p className="text-xs font-extrabold text-[#5a5a87]/70">🎯 完成挑战任务加分</p>
              <p className="text-xs font-extrabold text-[#5a5a87]/70">⚡ 应对突发状况加分</p>
            </div>
          )}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 text-[10px] font-bold text-[#5a5a87]/35 whitespace-nowrap">
            <span>⏱{game.timeStars}</span><span>+</span>
            <span>🎯{game.taskStars}</span><span>+</span>
            <span>⚡{game.eventStars}</span>
          </div>
        </div>
      </div>

      {/* 飞行星星 */}
      {game.flyingStars.map(star => (
        <div
          key={star.id}
          className="fixed z-30 pointer-events-none text-2xl font-extrabold text-yellow-500 drop-shadow-lg"
          style={{
            left: '50%', top: '45%',
            '--fly-x': `${star.x}px`, '--fly-y': `${star.y}px`,
            animation: 'star-fly-up 0.9s ease-out forwards',
          } as React.CSSProperties}
        >⭐</div>
      ))}

      {/* 气球 + 计时器 */}
      <div className="relative flex flex-col items-center mb-6">
        <div
          className={`text-9xl select-none drop-shadow-xl ${
            game.state === 'running' ? 'animate-balloon-float'
            : game.state === 'finished' ? 'animate-balloon-wobble'
            : 'animate-balloon-float'
          }`}
          style={{ filter: `drop-shadow(0 12px 20px ${balloonColor}55)` }}
        >🎈</div>

        <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-3 justify-center mb-6">
        {game.state === 'idle' && (
          <div className="flex flex-col items-center gap-2">
            {!hasPlayedBefore && (
              <p className="text-center text-[#5a5a87]/50 text-sm font-bold animate-pulse">
                💡 和宝宝一起顶气球，坚持越久星星越多！
              </p>
            )}
            <button onClick={() => { markPlayed(); setShowCountdown(true) }} className="btn-btv btn-game-action animate-pulse-glow-btv">
              🎈 像 Bluey 一样开始！
            </button>
          </div>
        )}
        {game.state === 'running' && (
          <div className="flex gap-3">
            <button onClick={game.handlePause} className="btn-btv-secondary !text-lg !min-h-0 !py-3 !px-5">
              ⏸ 暂停
            </button>
            {!game.currentEvent && (
              <button onClick={() => setShowLandConfirm(true)} className="btn-btv btn-btv-red btn-game-action">
                💥 落地了！
              </button>
            )}
          </div>
        )}
        {game.state === 'paused' && (
          <div className="flex gap-3">
            <button onClick={game.handleResume} className="btn-btv btn-game-action animate-pulse-glow-btv">
              ▶ 继续玩
            </button>
            <button onClick={game.handleReset} className="btn-btv btn-btv-blue text-lg">
              🔄 重来
            </button>
          </div>
        )}
        {game.state === 'finished' && (
          <button onClick={game.handleReset} className="btn-btv btn-btv-blue text-lg">
            🔄 重新开始
          </button>
        )}
      </div>

      {/* 加油语 / 暂停提示 */}
      {game.state === 'running' && !game.currentEvent && (
        <p className="text-center text-btv-blue/70 text-sm font-extrabold animate-pulse mb-3">
          {BLUEY_PHRASES[encourageIndex]}
        </p>
      )}
      {game.state === 'running' && game.currentEvent && (
        <p className="text-center text-btv-orange text-sm font-extrabold animate-pulse mb-3">
          ⚡ 突发状况进行中...
        </p>
      )}
      {game.state === 'paused' && (
        <p className="text-center text-[#5a5a87]/40 text-sm font-extrabold mb-3">
          ⏸ 游戏已暂停，休息一下～
        </p>
      )}

      {/* 任务卡片 */}
      <div className="card-btv mb-6">
        <button onClick={() => setShowTasks(!showTasks)} className="flex items-center justify-between w-full cursor-pointer">
          <h3 className="text-lg font-extrabold text-btv-dark">
            🎯 今日挑战 ({game.completedTasks}/{game.tasks.length})
          </h3>
          <span className="text-[#5a5a87]/25 font-bold">{showTasks ? '▲' : '▼'}</span>
        </button>

        {showTasks && (
          <div className="mt-4 space-y-2.5">
            <div className="w-full h-2.5 bg-[#E3F2FD] rounded-full overflow-hidden mb-3">
              <div className="h-full bg-btv-green rounded-full transition-all duration-500"
                style={{ width: `${(game.completedTasks / game.tasks.length) * 100}%` }} />
            </div>

            {game.tasks.map((task, i) => {
              const locked = game.isLocked(i)
              const isCurrent = i === game.firstUncompletedIndex
              const isAnimating = game.animatingTaskId === task.id

              if (task.completed && !isAnimating) return null

              return (
                <div key={task.id}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 border-2 overflow-hidden transition-all duration-500 ${
                    isAnimating ? 'animate-task-slide-out bg-[#E8F5E9] border-[#A5D6A7]'
                    : locked ? 'bg-[#F0F4FF]/50 border-[#5a5a87]/10 opacity-40'
                    : isCurrent ? 'bg-[#FFF8E1] border-[#FFD54F] animate-pulse-glow-btv'
                    : 'bg-[#F0F4FF]/50 border-[#5a5a87]/10'
                  }`}
                >
                  <span className="text-xl shrink-0">
                    {locked ? '🔒' : ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'][i]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-extrabold truncate ${locked ? 'text-[#5a5a87]/25' : 'text-btv-dark'}`}>
                        {task.title}
                      </p>
                      {!locked && (
                        <span className="text-xs font-extrabold text-yellow-500 shrink-0 ml-2">
                          +{TASK_SCORES[i]}⭐
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${locked ? 'text-[#5a5a87]/25' : 'text-[#5a5a87]/50'}`}>
                      {task.description}
                    </p>
                  </div>
                  {isCurrent && game.state === 'running' && !isAnimating && (
                    <button onClick={(e) => { e.stopPropagation(); game.confirmTask(task.id, i) }}
                      className="btn-task-confirm shrink-0 rounded-full bg-btv-green text-white font-extrabold text-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-md">
                      ✓
                    </button>
                  )}
                  {isAnimating && <span className="shrink-0 text-xl">✅</span>}
                </div>
              )
            })}

            {game.completedTasks === game.tasks.length && (
              <div className="text-center py-3 text-btv-green font-extrabold text-sm">
                🎉 全部挑战完成！
              </div>
            )}
          </div>
        )}
      </div>

      {/* 排行榜 */}
      <div className="card-btv">
        <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
      </div>

      {/* 落地确认弹窗 */}
      {showLandConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/40 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-btv-red">
            <div className="text-7xl mb-3">🎈</div>
            <h2 className="text-2xl font-extrabold text-btv-dark mb-1">确定气球落地了？</h2>
            <p className="text-[#5a5a87]/50 font-bold text-sm mb-5">还没落地的话，继续玩！</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLandConfirm(false)} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">
                还没！继续玩
              </button>
              <button onClick={() => { setShowLandConfirm(false); game.handleLand() }} className="btn-btv btn-btv-red flex-1">
                是，落地了！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 落地弹窗 */}
      {game.showResult && <ResultModal game={game} />}

      {/* 通关弹窗 */}
      {game.showVictory && <VictoryModal game={game} />}

      {/* 随机事件 */}
      {game.currentEvent && game.state === 'running' && (
        <RandomEventPopup event={game.currentEvent} onLand={game.handleLand} />
      )}

      {/* 倒计时 */}
      {showCountdown && (
        <CountdownOverlay emoji="🎈" onComplete={() => { setShowCountdown(false); game.handleStart() }} />
      )}
    </div>
  )
}

/* ---- 子组件 ---- */

function ResultModal({ game }: { game: ReturnType<typeof useKeepyUppyGame> }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
          {game.totalStars > 5000 ? '太厉害了！' : game.totalStars > 2000 ? '真棒！' : '不错哦！'}
        </h2>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-3">Bandit 爸爸对你竖起大拇指 👍</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF8E1] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-yellow-500 timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-[#5a5a87]/50 mb-4">
          <span>⏱ 时长 {game.timeStars}⭐</span>
          <span>🎯 任务 {game.taskStars}⭐</span>
          <span>⚡ 事件 {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-3">{game.formatTime(game.elapsedMs)}</p>
        {game.currentRank && game.currentRank <= 3 && (
          <p className="text-base font-extrabold text-yellow-500 mb-3">🏆 星星排名第 {game.currentRank} 名！</p>
        )}

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下你的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-[#5a5a87]/25"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
          <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
            {PRESET_NAMES.map(name => (
              <button key={name}
                onClick={() => game.setPlayerName(name)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5a5a87]/60 hover:bg-[#E3ECFD] active:scale-95 transition-all"
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">跳过</button>
          <button onClick={game.handleSaveScore} className="btn-btv flex-1">保存成绩！</button>
        </div>
      </div>
    </div>
  )
}

function VictoryModal({ game }: { game: ReturnType<typeof useKeepyUppyGame> }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-[#FFD54F]">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">全关卡通关！</p>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-4">Bluey 和 Bingo 为你欢呼！</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF8E1] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-yellow-500 timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-[#5a5a87]/50 mb-3">
          <span>⏱ {game.timeStars}⭐</span>
          <span>🎯 {game.taskStars}⭐</span>
          <span>⚡ {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-4">{game.formatTime(game.elapsedMs)}</p>
        <p className="text-lg font-extrabold text-btv-green mb-5">你是真正的 Keepy Uppy 冠军！</p>

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下冠军的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#FFD54F] focus:border-btv-yellow outline-none text-btv-dark placeholder-[#5a5a87]/25"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
          <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
            {PRESET_NAMES.map(name => (
              <button key={name}
                onClick={() => game.setPlayerName(name)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5a5a87]/60 hover:bg-[#E3ECFD] active:scale-95 transition-all"
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">跳过</button>
          <button onClick={game.handleSaveScore} className="btn-btv flex-1 animate-pulse-glow-btv">🏆 记录辉煌！</button>
        </div>
      </div>
    </div>
  )
}
