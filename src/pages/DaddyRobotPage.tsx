import { useState, useEffect, useRef } from 'react'
import { useDaddyRobotGame } from '../hooks/useDaddyRobotGame'
import { GameTimer } from '../components/GameTimer'
import { CommandPanel } from '../components/CommandPanel'
import { FaultPopup } from '../components/FaultPopup'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import type { GameFault } from '../types/game'

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
  const [encourageIndex, setEncourageIndex] = useState(0)
  const encourageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  return (
    <div className="max-w-lg mx-auto">
      {/* 标题 + 积分 */}
      <div className="text-center mb-6">
        <h2 className="page-title-btv mb-1">
          爸爸机器人 <span className="text-[#AB47BC]">Daddy Robot!</span>
        </h2>
        <p className="text-[#AB47BC]/40 font-bold text-xs">Bluey · 第 4 集</p>

        <div className="inline-flex items-center gap-2 mt-3 bg-white rounded-full px-5 py-2.5 shadow-md border-2 border-[#AB47BC] relative">
          <span className="text-2xl">⭐</span>
          <span className={`text-3xl font-extrabold text-yellow-500 timer-text transition-all duration-300 ${game.scoreBump ? 'animate-score-bump' : ''}`}>
            {game.totalStars}
          </span>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 text-[10px] font-bold text-gray-300 whitespace-nowrap">
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

      {/* 指令面板 + 计时器 */}
      <div className="mb-6">
        <CommandPanel
          onCommand={game.handleIssueCommand}
          counts={game.commandCounts}
          disabled={game.state !== 'running' || !!game.currentEvent}
        />

        <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-3 justify-center mb-6">
        {game.state === 'idle' && (
          <button onClick={game.handleStart} className="btn-btv btn-game-action animate-pulse-glow-btv">
            🤖 启动爸爸机器人！
          </button>
        )}
        {game.state === 'running' && !game.currentEvent && (
          <button onClick={game.handleLand} className="btn-btv btn-btv-red btn-game-action">
            ⏹ 停止游戏！
          </button>
        )}
        {(game.state === 'finished' || game.state === 'paused') && (
          <button onClick={game.handleReset} className="btn-btv btn-btv-blue text-lg">
            🔄 重新开始
          </button>
        )}
      </div>

      {/* 状态提示 */}
      {game.state === 'running' && !game.currentEvent && (
        <p className="text-center text-[#AB47BC]/70 text-sm font-extrabold animate-pulse mb-3">
          {ROBOT_PHRASES[encourageIndex]}
        </p>
      )}
      {game.state === 'running' && game.currentEvent && (
        <p className="text-center text-[#AB47BC] text-sm font-extrabold animate-pulse mb-3">
          🤖 机器人出故障了！快修好它！
        </p>
      )}

      {/* 任务卡片 */}
      <div className="card-btv mb-6">
        <button onClick={() => setShowTasks(!showTasks)} className="flex items-center justify-between w-full cursor-pointer">
          <h3 className="text-lg font-extrabold text-btv-dark">
            🤖 机器人任务 ({game.completedTasks}/{game.tasks.length})
          </h3>
          <span className="text-gray-300 font-bold">{showTasks ? '▲' : '▼'}</span>
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
                    : locked ? 'bg-gray-50 border-gray-100 opacity-40'
                    : isCurrent ? 'bg-[#FFF8E1] border-[#FFD54F] animate-pulse-glow-btv'
                    : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <span className="text-xl shrink-0">
                    {locked ? '🔒' : ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'][i]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-extrabold truncate ${locked ? 'text-gray-300' : 'text-btv-dark'}`}>
                        {task.title}
                      </p>
                      {!locked && (
                        <span className="text-xs font-extrabold text-yellow-500 shrink-0 ml-2">
                          +{TASK_SCORES[i]}⭐
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${locked ? 'text-gray-300' : 'text-gray-400'}`}>
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

      {/* 结算弹窗 */}
      {game.showResult && <ResultModal game={game} />}

      {/* 通关弹窗 */}
      {game.showVictory && <VictoryModal game={game} />}

      {/* 故障弹窗 */}
      {game.currentEvent && game.state === 'running' && (
        <FaultPopup
          fault={game.currentEvent as GameFault}
          onFixed={game.handleFaultFixed}
        />
      )}
    </div>
  )
}

/* ---- 子组件 ---- */

function ResultModal({ game }: { game: ReturnType<typeof useDaddyRobotGame> }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
          {game.totalStars > 5000 ? '机器人大师！' : game.totalStars > 2000 ? '干得好，指挥官！' : '继续操控！'}
        </h2>
        <p className="text-sm text-gray-400 font-bold mb-3">Bandit 机器人向你致敬 🤖</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF8E1] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-yellow-500 timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-gray-400 mb-4">
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
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-gray-300"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
        </div>
        <div className="flex gap-3">
          <button onClick={game.handleReset} className="flex-1 bg-gray-100 text-gray-500 font-extrabold py-3.5 rounded-full hover:bg-gray-200 transition-colors">跳过</button>
          <button onClick={game.handleSaveScore} className="btn-btv flex-1">保存成绩！</button>
        </div>
      </div>
    </div>
  )
}

function VictoryModal({ game }: { game: ReturnType<typeof useDaddyRobotGame> }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-[#AB47BC]">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">全指令通关！</p>
        <p className="text-sm text-gray-400 font-bold mb-4">Bluey 和 Bingo 为你欢呼！</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF8E1] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-yellow-500 timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-gray-400 mb-3">
          <span>⏱ {game.timeStars}⭐</span>
          <span>🎯 {game.taskStars}⭐</span>
          <span>⚡ {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-4">{game.formatTime(game.elapsedMs)}</p>
        <p className="text-lg font-extrabold text-btv-green mb-5">你是最棒的机器人指挥官！</p>

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下冠军的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#AB47BC] focus:border-[#CE93D8] outline-none text-btv-dark placeholder-gray-300"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
        </div>
        <div className="flex gap-3">
          <button onClick={game.handleReset} className="flex-1 bg-gray-100 text-gray-500 font-extrabold py-3.5 rounded-full hover:bg-gray-200 transition-colors">跳过</button>
          <button onClick={game.handleSaveScore} className="btn-btv flex-1 animate-pulse-glow-btv">🏆 记录辉煌！</button>
        </div>
      </div>
    </div>
  )
}
