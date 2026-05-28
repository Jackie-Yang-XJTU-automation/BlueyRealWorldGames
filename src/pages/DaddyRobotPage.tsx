import { useState, useEffect, useRef } from 'react'
import { useDaddyRobotGame } from '../hooks/useDaddyRobotGame'
import { GameTimer } from '../components/GameTimer'
import { CommandPanel } from '../components/CommandPanel'
import { FaultPopup } from '../components/FaultPopup'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { triggerHaptic } from '../utils/haptic'
import type { GameFault } from '../types/game'

const PRESET_NAMES = ['爸爸', '妈妈', '宝宝', '爷爷', '奶奶']
const STORAGE_KEY_PLAYED = 'daddyrobot_played'
const TASK_SCORES = [100, 200, 300, 500, 800]
const ROBOT_PHRASES = [
  'Bandit 机器人正在等待指令！',
  '按下按钮告诉机器人做什么～',
  '机器人最喜欢执行你的命令！',
  'Bingo 说：我也想当机器人！',
  '记住，机器人会严格执行指令哦！',
]

export function DaddyRobotPage() {
  const game = useDaddyRobotGame()
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
        setEncourageIndex(i => (i + 1) % ROBOT_PHRASES.length)
      }, 8000)
    } else {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
    return () => {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
  }, [game.state])

  const prevStateRef = useRef(game.state)
  const prevEventRef = useRef(game.currentEvent)
  useEffect(() => {
    if (game.state === 'running' && prevStateRef.current !== 'running') triggerHaptic('tap')
    if (game.currentEvent && !prevEventRef.current) triggerHaptic('event')
    if ((game.showResult || game.showVictory) && prevStateRef.current === 'running') triggerHaptic('finish')
    prevStateRef.current = game.state
    prevEventRef.current = game.currentEvent
  }, [game.state, game.currentEvent, game.showResult, game.showVictory])

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      {/* 机器人指挥中心背景 */}
      <div className="relative bg-gradient-to-b from-[#EDE7F6] via-[#F3E5F5] to-[#FCE4EC] -mt-8 rounded-b-[40px] shadow-[inset_0_-8px_30px_rgba(171,71,188,0.08)] overflow-hidden">

        {/* 顶部 HUD：星星 + 计时器 */}
        <div className="relative z-10 pt-4 pb-3 px-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-[11px] font-extrabold text-[#5a5a87]/40 hover:text-[#5a5a87]/60 transition-colors bg-white/60 rounded-full px-3 py-1.5"
            >
              ← 返回
            </button>

            <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-sm rounded-full pl-3 pr-1.5 py-1.5 shadow-[0_2px_12px_rgba(44,67,100,0.06)] border border-[#CE93D8]/30 relative">
              <span className="text-lg">⭐</span>
              <span className={`text-xl font-extrabold text-[#DCA018] timer-text transition-all duration-300 ${game.scoreBump ? 'animate-score-bump' : ''}`}>
                {game.totalStars}
              </span>
              <button
                type="button"
                onClick={() => setShowScoreHelp(!showScoreHelp)}
                className="w-7 h-7 rounded-full bg-[#F0F4FF] text-[#5a5a87]/40 text-[11px] font-extrabold flex items-center justify-center hover:bg-[#E3ECFD] transition-colors"
              >?</button>
              {showScoreHelp && (
                <div className="absolute top-full mt-2 right-0 z-[100] bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-[#E3F2FD] text-left whitespace-nowrap animate-jelly">
                  <p className="text-[11px] font-bold text-[#5a5a87]/50 mb-1">星星怎么来的？</p>
                  <p className="text-xs font-extrabold text-[#5a5a87]/65">⏱ 坚持越久分越高（每秒 +10⭐）</p>
                  <p className="text-xs font-extrabold text-[#5a5a87]/65">🎯 完成挑战任务加分</p>
                  <p className="text-xs font-extrabold text-[#5a5a87]/65">⚡ 应对机器人故障加分</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-1.5 text-[10px] font-bold text-[#5a5a87]/30 whitespace-nowrap">
            <span>⏱{game.timeStars}</span><span className="text-[#5a5a87]/15">+</span>
            <span>🎯{game.taskStars}</span><span className="text-[#5a5a87]/15">+</span>
            <span>⚡{game.eventStars}</span>
          </div>
        </div>

        {/* 飞行星星 */}
        {game.flyingStars.map(star => (
          <div
            key={star.id}
            className="fixed z-30 pointer-events-none text-2xl font-extrabold text-[#DCA018] drop-shadow-lg"
            style={{
              left: '50%', top: '45%',
              '--fly-x': `${star.x}px`, '--fly-y': `${star.y}px`,
              animation: 'star-fly-up 0.9s ease-out forwards',
            } as React.CSSProperties}
          >⭐</div>
        ))}

        {/* 机器人状态屏幕 */}
        <div className="relative flex flex-col items-center py-2">
          <div className="relative">
            {/* 科技感光晕 */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-25 animate-pulse-glow-btv"
              style={{
                background: 'radial-gradient(circle, #AB47BC 0%, #CE93D8 40%, transparent 70%)',
                transform: 'scale(1.8)',
              }}
            />
            {/* 机器人 emoji */}
            <div
              className={`relative text-[9rem] select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-transform duration-500 ${
                game.state === 'running' ? 'animate-balloon-float'
                : game.state === 'finished' ? 'animate-balloon-wobble'
                : 'animate-balloon-float'
              }`}
              style={{ filter: 'drop-shadow(0 12px 20px #AB47BC44)' }}
            >🤖</div>
          </div>

          {/* 计时器 */}
          <div className="-mt-2">
            <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
          </div>
        </div>

        {/* 指令面板 */}
        <div className="px-4 mb-3">
          <CommandPanel
            onCommand={game.handleIssueCommand}
            counts={game.commandCounts}
            disabled={game.state !== 'running' || !!game.currentEvent}
          />
        </div>

        {/* 机器人对话气泡 */}
        {game.state === 'running' && !game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="relative bg-white/85 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-[0_2px_12px_rgba(171,71,188,0.08)] border border-[#CE93D8]/30 max-w-xs">
              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white/85 border-l border-t border-[#CE93D8]/30 rotate-45" />
              <p className="text-[13px] font-extrabold text-[#7B1FA2]/55 text-center leading-snug">
                {ROBOT_PHRASES[encourageIndex]}
              </p>
            </div>
          </div>
        )}
        {game.state === 'running' && game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="bg-[#F3E5F5]/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 border-2 border-[#AB47BC]/30 shadow-[0_2px_12px_rgba(171,71,188,0.12)]">
              <p className="text-[13px] font-extrabold text-[#AB47BC] text-center">🤖 机器人出故障了！快修好它！</p>
            </div>
          </div>
        )}
        {game.state === 'paused' && (
          <div className="flex justify-center px-6 mb-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-[#E3F2FD]">
              <p className="text-[13px] font-extrabold text-[#5a5a87]/35 text-center">⏸ 休息一下，随时继续～</p>
            </div>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex justify-center gap-3 pb-4 px-4">
          {game.state === 'idle' && (
            <div className="flex flex-col items-center gap-2">
              {!hasPlayedBefore && (
                <p className="text-center text-[#5a5a87]/40 text-xs font-bold">
                  💡 给爸爸机器人发指令，完成所有任务获取星星！
                </p>
              )}
              <button
                type="button"
                onClick={() => { markPlayed(); setShowCountdown(true) }}
                className="btn-btv btn-game-action animate-random-pulse"
                style={{ background: '#AB47BC', boxShadow: '0 4px 14px rgba(171,71,188,0.35)' }}
              >
                🤖 启动爸爸机器人！
              </button>
            </div>
          )}
          {game.state === 'running' && (
            <div className="flex gap-3">
              <button type="button" onClick={game.handlePause} className="btn-btv-secondary !text-lg !min-h-0 !py-3 !px-5">
                ⏸ 暂停
              </button>
              {!game.currentEvent && (
                <button
                  type="button"
                  onClick={() => setShowLandConfirm(true)}
                  className="btn-btv btn-btv-red btn-game-action"
                >
                  ⏹ 停止游戏！
                </button>
              )}
            </div>
          )}
          {game.state === 'paused' && (
            <div className="flex gap-3">
              <button type="button" onClick={game.handleResume} className="btn-btv btn-game-action animate-random-pulse">
                ▶ 继续玩
              </button>
              <button type="button" onClick={game.handleReset} className="btn-btv btn-btv-blue text-lg">
                🔄 重来
              </button>
            </div>
          )}
          {game.state === 'finished' && (
            <button type="button" onClick={game.handleReset} className="btn-btv btn-btv-blue text-lg">
              🔄 重新开始
            </button>
          )}
        </div>
      </div>

      {/* 任务公告板 */}
      <div className="px-4 sm:px-0 mt-5 mb-6">
        <div className="bg-white rounded-[28px] border-2 border-[#F3E5F5] shadow-[0_4px_20px_rgba(171,71,188,0.05)] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTasks(!showTasks)}
            className="flex items-center justify-between w-full px-5 py-3.5 bg-gradient-to-r from-[#F3E5F5] to-[#EDE7F6] border-b-2 border-[#CE93D8]/15 cursor-pointer"
          >
            <h3 className="text-sm font-extrabold text-btv-dark flex items-center gap-2">
              🤖 机器人任务
              <span className="text-[11px] font-bold text-[#5a5a87]/35 bg-white/60 rounded-full px-2 py-0.5">
                {game.completedTasks}/{game.tasks.length}
              </span>
            </h3>
            <span className={`text-[#5a5a87]/25 font-bold transition-transform duration-300 ${showTasks ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showTasks && (
            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-[#F3E5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#AB47BC] to-[#CE93D8] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(game.completedTasks / game.tasks.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-extrabold text-[#5a5a87]/25">
                  {Math.round((game.completedTasks / game.tasks.length) * 100)}%
                </span>
              </div>

              {game.tasks.map((task, i) => {
                const locked = game.isLocked(i)
                const isCurrent = i === game.firstUncompletedIndex
                const isAnimating = game.animatingTaskId === task.id

                if (task.completed && !isAnimating) return null

                return (
                  <div key={task.id}
                    className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 border-2 overflow-hidden transition-all duration-500 ${
                      isAnimating ? 'animate-task-slide-out bg-[#E8F5E9] border-[#A5D6A7]'
                      : locked ? 'bg-[#F3E5F5]/20 border-[#5a5a87]/6 opacity-35'
                      : isCurrent ? 'bg-[#F3E5F5]/40 border-[#CE93D8] shadow-[0_2px_12px_rgba(171,71,188,0.12)]'
                      : 'bg-[#F3E5F5]/20 border-[#5a5a87]/6'
                    }`}
                  >
                    <span className="text-lg shrink-0">
                      {locked ? '🔒' : ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'][i]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-extrabold truncate text-[13px] ${locked ? 'text-[#5a5a87]/20' : 'text-btv-dark'}`}>
                          {task.title}
                        </p>
                        {!locked && (
                          <span className="text-[11px] font-extrabold text-[#DCA018] shrink-0 ml-2 bg-[#FFF9EE] rounded-full px-2 py-0.5">
                            +{TASK_SCORES[i]}⭐
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-medium mt-0.5 ${locked ? 'text-[#5a5a87]/20' : 'text-[#5a5a87]/40'}`}>
                        {task.description}
                      </p>
                    </div>
                    {isCurrent && game.state === 'running' && !isAnimating && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); triggerHaptic('success'); game.confirmTask(task.id, i) }}
                        className="btn-task-confirm shrink-0 rounded-full bg-[#AB47BC] text-white font-extrabold text-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-[0_2px_8px_rgba(171,71,188,0.4)]"
                      >✓</button>
                    )}
                    {isAnimating && <span className="shrink-0 text-lg">✅</span>}
                  </div>
                )
              })}

              {game.completedTasks === game.tasks.length && (
                <div className="text-center py-3 bg-[#E8F5E9]/50 rounded-2xl">
                  <p className="text-sm font-extrabold text-btv-green">🎉 全部挑战完成！太厉害了！</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 排行榜 */}
      <div className="px-4 sm:px-0 mb-6">
        <div className="bg-white rounded-[28px] border-2 border-[#F3E5F5] shadow-[0_4px_20px_rgba(171,71,188,0.05)] p-5">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3">🏆 星星排行榜</h3>
          <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
        </div>
      </div>

      {/* 停止确认弹窗 */}
      {showLandConfirm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-btv-red animate-jelly">
            <div className="text-7xl mb-3">🤖</div>
            <h2 className="text-2xl font-extrabold text-btv-dark mb-1">确定关闭机器人？</h2>
            <p className="text-[#5a5a87]/50 font-bold text-sm mb-5">还没玩够的话，继续玩！</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLandConfirm(false)} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">
                还没！继续玩
              </button>
              <button type="button" onClick={() => { setShowLandConfirm(false); game.handleLand() }} className="btn-btv btn-btv-red flex-1">
                是，关闭！
              </button>
            </div>
          </div>
        </div>
      )}

      {game.showResult && <ResultModal game={game} />}
      {game.showVictory && <VictoryModal game={game} />}

      {game.currentEvent && game.state === 'running' && (
        <FaultPopup fault={game.currentEvent as GameFault} onFixed={game.handleFaultFixed} />
      )}

      {showCountdown && (
        <CountdownOverlay emoji="🤖" onComplete={() => { setShowCountdown(false); game.handleStart() }} />
      )}
    </div>
  )
}

/* ---- 子组件 ---- */

function ResultModal({ game }: { game: ReturnType<typeof useDaddyRobotGame> }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
          {game.totalStars > 5000 ? '机器人大师！' : game.totalStars > 2000 ? '干得好，指挥官！' : '继续操控！'}
        </h2>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-3">Bandit 机器人向你致敬 🤖</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF9EE] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-[#DCA018] timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-[#5a5a87]/50 mb-4">
          <span>⏱ 时长 {game.timeStars}⭐</span>
          <span>🎯 任务 {game.taskStars}⭐</span>
          <span>⚡ 事件 {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-3">{game.formatTime(game.elapsedMs)}</p>
        {game.currentRank && game.currentRank <= 3 && (
          <p className="text-base font-extrabold text-[#DCA018] mb-3">🏆 星星排名第 {game.currentRank} 名！</p>
        )}

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下你的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-[#5a5a87]/25"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
          <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
            {PRESET_NAMES.map(name => (
              <button key={name} type="button"
                onClick={() => game.setPlayerName(name)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5a5a87]/55 hover:bg-[#E3ECFD] active:scale-95 transition-all"
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/55 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1">保存成绩！</button>
        </div>
      </div>
    </div>
  )
}

function VictoryModal({ game }: { game: ReturnType<typeof useDaddyRobotGame> }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-[#AB47BC] animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">全指令通关！</p>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-4">Bluey 和 Bingo 为你欢呼！</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF9EE] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-[#DCA018] timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-[#5a5a87]/50 mb-3">
          <span>⏱ {game.timeStars}⭐</span>
          <span>🎯 {game.taskStars}⭐</span>
          <span>⚡ {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-4">{game.formatTime(game.elapsedMs)}</p>
        <p className="text-lg font-extrabold text-btv-green mb-5">你是最棒的机器人指挥官！</p>

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下冠军的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#AB47BC] focus:border-[#CE93D8] outline-none text-btv-dark placeholder-[#5a5a87]/25"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
          <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
            {PRESET_NAMES.map(name => (
              <button key={name} type="button"
                onClick={() => game.setPlayerName(name)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5a5a87]/55 hover:bg-[#E3ECFD] active:scale-95 transition-all"
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/55 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1 animate-random-pulse">🏆 记录辉煌！</button>
        </div>
      </div>
    </div>
  )
}
