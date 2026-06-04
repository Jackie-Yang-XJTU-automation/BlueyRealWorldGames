import { useState, useEffect, useRef } from 'react'
import { useDaddyRobotGame } from '../hooks/useDaddyRobotGame'
import { GameTimer } from '../components/GameTimer'
import { CommandPanel } from '../components/CommandPanel'
import { FaultPopup } from '../components/FaultPopup'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { TaskLadderPanel } from '../components/TaskLadderPanel'
import { triggerHaptic } from '../utils/haptic'
import type { GameFault } from '../types/game'

const PRESET_NAMES = ['爸爸', '妈妈', '宝宝', '爷爷', '奶奶']
const STORAGE_KEY_PLAYED = 'daddyrobot_played'
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

        <GameTopHud
          scoreItems={[{ emoji: '⭐', value: game.totalStars, color: '#DCA018', bump: game.scoreBump, label: '星星总数' }]}
          breakdownItems={[
            { emoji: '⏱', value: game.timeStars },
            { emoji: '🎯', value: game.taskStars },
            { emoji: '⚡', value: game.eventStars },
          ]}
          helpTitle="星星怎么来的？"
          helpItems={[
            '⏱ 坚持越久分越高（每秒 +10⭐）',
            '🎯 完成挑战任务加分',
            '⚡ 应对机器人故障加分',
          ]}
          showHelp={showScoreHelp}
          onToggleHelp={() => setShowScoreHelp(!showScoreHelp)}
          showPause={game.state === 'running'}
          onPause={game.handlePause}
          showEnd={game.state === 'running' && !game.currentEvent}
          onEnd={() => setShowLandConfirm(true)}
        />

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
          {game.state === 'finished' && (
            <button type="button" onClick={game.handleReset} className="btn-btv btn-btv-blue text-lg">
              🔄 重新开始
            </button>
          )}
        </div>
      </div>

      <TaskLadderPanel
        title="🤖 机器人任务"
        tasks={game.tasks}
        completedTasks={game.completedTasks}
        show={showTasks}
        onToggle={() => setShowTasks(!showTasks)}
        state={game.state}
        firstUncompletedIndex={game.firstUncompletedIndex}
        animatingTaskId={game.animatingTaskId}
        isLocked={game.isLocked}
        onConfirm={(taskId, index) => { triggerHaptic('success'); game.confirmTask(taskId, index) }}
        canConfirmTask={game.canConfirmTask}
        completionMessage="🎉 全部挑战完成！太厉害了！"
        accentColor="#CE93D8"
        accentSoft="#F3E5F5"
        accentTint="#F3E5F5"
        confirmColor="#AB47BC"
      />

      {/* 排行榜 */}
      <div className="px-4 sm:px-0 mb-6">
        <div className="bg-white rounded-[28px] border-2 border-[#F3E5F5] shadow-[0_4px_20px_rgba(171,71,188,0.05)] p-5">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3">🏆 星星排行榜</h3>
          <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
        </div>
      </div>

      {/* 停止确认弹窗 */}
      {game.state === 'paused' && !showLandConfirm && (
        <GamePauseDialog
          emoji="🤖"
          message="机器人进入待机，指挥官可以随时回来～"
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowLandConfirm(true)}
          endLabel="⏹ 关闭机器人"
        />
      )}

      {showLandConfirm && (
        <GameConfirmDialog
          id="daddyrobot-end"
          emoji="🤖"
          title="确定关闭机器人？"
          message={`已经收集了 ${game.totalStars} 颗星星，还没玩够的话可以继续指挥。`}
          cancelLabel={game.state === 'paused' ? '还没！返回暂停' : '还没！继续玩'}
          confirmLabel="是，关闭！"
          onCancel={() => setShowLandConfirm(false)}
          onConfirm={() => { setShowLandConfirm(false); game.handleLand() }}
        />
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
    <div role="dialog" aria-modal="true" aria-label="爸爸机器人结算" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white p-7 text-center shadow-2xl animate-jelly">
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
    <div role="dialog" aria-modal="true" aria-label="爸爸机器人通关" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-[#AB47BC] bg-white p-7 text-center shadow-2xl animate-jelly">
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
