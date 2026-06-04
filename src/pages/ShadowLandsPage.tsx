import { useState, useEffect, useRef } from 'react'
import { useShadowLandsGame } from '../hooks/useShadowLandsGame'
import { GameTimer } from '../components/GameTimer'
import { RandomEventPopup } from '../components/RandomEventPopup'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { TaskLadderPanel } from '../components/TaskLadderPanel'
import { triggerHaptic } from '../utils/haptic'

const PRESET_NAMES = ['爸爸', '妈妈', '宝宝', '爷爷', '奶奶']
const STORAGE_KEY_PLAYED = 'shadowlands_played'
const SHADOW_PHRASES = [
  'Bluey 说：影子是安全的陆地！',
  'Bingo 踩着影子跳得好远！',
  'Bandit 爸爸说小心鳄鱼！',
  'Chilli 妈妈在树荫下给你加油！',
  '记住——有影子就不用怕鳄鱼！',
]

export function ShadowLandsPage() {
  const game = useShadowLandsGame()
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
        setEncourageIndex(i => (i + 1) % SHADOW_PHRASES.length)
      }, 8000)
    } else if (game.state === 'paused') {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
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
      {/* 阳光大草原背景 */}
      <div className="relative bg-gradient-to-b from-[#FFF8E1] via-[#FFF3E0] to-[#E8F5E9] -mt-8 rounded-b-[40px] shadow-[inset_0_-8px_30px_rgba(255,183,77,0.1)] overflow-hidden">

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
            '⚡ 应对突发状况加分',
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

        {/* 太阳 — 核心视觉 */}
        <div className="relative flex flex-col items-center py-2">
          <div className="relative">
            {/* 阳光光晕 */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-sun-glow"
              style={{
                background: 'radial-gradient(circle, #FFB300 0%, #FFD54F 40%, transparent 70%)',
                transform: 'scale(1.8)',
              }}
            />
            {/* 太阳 emoji */}
            <div
              className={`relative text-[9rem] select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-transform duration-500 ${
                game.state === 'running' ? 'animate-sun-glow'
                : game.state === 'finished' ? 'animate-shadow-dance'
                : 'animate-sun-glow'
              }`}
              style={{ filter: 'drop-shadow(0 12px 24px #FFB30066)' }}
            >☀️</div>
          </div>

          {/* 计时器 */}
          <div className="-mt-2">
            <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
          </div>
        </div>

        {/* 对话气泡 */}
        {game.state === 'running' && !game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="relative bg-white/85 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-[0_2px_12px_rgba(76,175,80,0.08)] border border-[#A5D6A7]/40 max-w-xs">
              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white/85 border-l border-t border-[#A5D6A7]/40 rotate-45" />
              <p className="text-[13px] font-extrabold text-[#2E7D32]/55 text-center leading-snug">
                {SHADOW_PHRASES[encourageIndex]}
              </p>
            </div>
          </div>
        )}
        {game.state === 'running' && game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="bg-[#FFF3E0]/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 border-2 border-[#F39C62]/40 shadow-[0_2px_12px_rgba(243,156,98,0.15)]">
              <p className="text-[13px] font-extrabold text-btv-orange text-center">⚡ 突发状况！小心鳄鱼！</p>
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
                  💡 只能走在影子里！踩到阳光就要被鳄鱼抓走啦～
                </p>
              )}
              <button
                type="button"
                onClick={() => { markPlayed(); setShowCountdown(true) }}
                className="btn-btv btn-game-action animate-random-pulse"
              >
                ☀️ 进入影子陆地！
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
                  🐊 踩到阳光了！
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
        title="🌳 影子任务"
        tasks={game.tasks}
        completedTasks={game.completedTasks}
        show={showTasks}
        onToggle={() => setShowTasks(!showTasks)}
        state={game.state}
        firstUncompletedIndex={game.firstUncompletedIndex}
        animatingTaskId={game.animatingTaskId}
        isLocked={game.isLocked}
        onConfirm={(taskId, index) => { triggerHaptic('success'); game.confirmTask(taskId, index) }}
        completionMessage="🎉 全部挑战完成！太厉害了！"
        accentColor="#81C784"
        accentSoft="#E8F5E9"
        accentTint="#E8F5E9"
        confirmColor="#4CAF50"
      />

      {/* 排行榜 */}
      <div className="px-4 sm:px-0 mb-6">
        <div className="bg-white rounded-[28px] border-2 border-[#E8F5E9] shadow-[0_4px_20px_rgba(76,175,80,0.05)] p-5">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3">🏆 星星排行榜</h3>
          <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
        </div>
      </div>

      {/* 踩到阳光确认弹窗 */}
      {game.state === 'paused' && !showLandConfirm && (
        <GamePauseDialog
          emoji="☀️"
          message="影子陆地先休息，别急着踩出去～"
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowLandConfirm(true)}
          endLabel="🐊 结束这一局"
        />
      )}

      {showLandConfirm && (
        <GameConfirmDialog
          id="shadowlands-end"
          emoji="🐊"
          title="确定踩到阳光了？"
          message={`已经坚持了 ${game.formatTime(game.elapsedMs)}，还在影子里的话可以继续玩。`}
          cancelLabel={game.state === 'paused' ? '还没！返回暂停' : '还没！继续玩'}
          confirmLabel="是，踩到了！"
          onCancel={() => setShowLandConfirm(false)}
          onConfirm={() => { setShowLandConfirm(false); game.handleLand() }}
        />
      )}

      {game.showResult && <ResultModal game={game} />}
      {game.showVictory && <VictoryModal game={game} />}

      {game.currentEvent && game.state === 'running' && (
        <RandomEventPopup
          event={game.currentEvent}
          onLand={game.handleLand}
          endButtonLabel="🐊 踩到阳光了！"
          confirmQuestion="确定真的踩到阳光了吗？"
          confirmLabel="是，踩到了！"
        />
      )}

      {showCountdown && (
        <CountdownOverlay emoji="☀️" onComplete={() => { setShowCountdown(false); game.handleStart() }} />
      )}
    </div>
  )
}

/* ---- 子组件 ---- */

function ResultModal({ game }: { game: ReturnType<typeof useShadowLandsGame> }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="影子陆地结算" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#4CAF50]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
          {game.totalStars > 5000 ? '安全着陆！' : game.totalStars > 2000 ? '好险！' : '继续加油！'}
        </h2>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-3">Chilli 妈妈在岸边对你挥手 👋</p>

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

function VictoryModal({ game }: { game: ReturnType<typeof useShadowLandsGame> }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="影子陆地通关" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#4CAF50]/20 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-[#A5D6A7] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">影子冠军！</p>
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
        <p className="text-lg font-extrabold text-btv-green mb-5">你是真正的影子陆地冠军！</p>

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下冠军的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#A5D6A7] focus:border-btv-green outline-none text-btv-dark placeholder-[#5a5a87]/25"
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
