import { useState, useEffect, useRef } from 'react'
import { useKeepyUppyGame } from '../hooks/useKeepyUppyGame'
import { GameTimer } from '../components/GameTimer'
import { RandomEventPopup } from '../components/RandomEventPopup'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { TaskLadderPanel } from '../components/TaskLadderPanel'
import { triggerHaptic } from '../utils/haptic'

const BALLOON_COLORS = ['#D96B62', '#F58634', '#FCD882', '#4CAF50', '#1C98ED', '#AB47BC', '#EC407A']
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
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    } else {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
    return () => {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
  }, [game.state])

  // 触觉反馈
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
      {/* 天空竞技场背景 */}
      <div className="relative bg-gradient-to-b from-[#B3E5FC] via-[#CEEDFA] to-[#E8F6FC] -mt-8 rounded-b-[40px] shadow-[inset_0_-8px_30px_rgba(135,206,235,0.15)] overflow-hidden">

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

        {/* 气球 — 核心视觉 */}
        <div className="relative flex flex-col items-center py-2">
          <div className="relative">
            {/* 呼吸光晕 */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse-glow-btv"
              style={{
                background: `radial-gradient(circle, ${balloonColor} 0%, transparent 70%)`,
                transform: 'scale(1.8)',
              }}
            />
            {/* 气球 emoji */}
            <div
              className={`relative text-[10rem] select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-transform duration-500 ${
                game.state === 'running' ? 'animate-balloon-float'
                : game.state === 'finished' ? 'animate-balloon-wobble'
                : 'animate-balloon-float'
              }`}
              style={{ filter: `drop-shadow(0 12px 20px ${balloonColor}55)` }}
            >🎈</div>
          </div>

          {/* 计时器 */}
          <div className="-mt-2">
            <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
          </div>
        </div>

        {/* Bluey 对话气泡 */}
        {game.state === 'running' && !game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="relative bg-white/85 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-[0_2px_12px_rgba(44,67,100,0.05)] border border-[#E3F2FD] max-w-xs">
              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white/85 border-l border-t border-[#E3F2FD] rotate-45" />
              <p className="text-[13px] font-extrabold text-[#5a5a87]/55 text-center leading-snug">
                {BLUEY_PHRASES[encourageIndex]}
              </p>
            </div>
          </div>
        )}
        {game.state === 'running' && game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="bg-[#FFF3E0]/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 border-2 border-[#F39C62]/30 shadow-[0_2px_12px_rgba(243,156,98,0.15)]">
              <p className="text-[13px] font-extrabold text-btv-orange text-center">⚡ 突发状况进行中...</p>
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
                  💡 和宝宝一起顶气球，坚持越久星星越多！
                </p>
              )}
              <button type="button" onClick={() => { markPlayed(); setShowCountdown(true) }} className="btn-btv btn-game-action animate-random-pulse">
                🎈 像 Bluey 一样开始！
              </button>
            </div>
          )}
          {game.state === 'running' && (
            <div className="flex gap-3">
              {!game.currentEvent && (
                <button type="button" onClick={() => setShowLandConfirm(true)} className="btn-btv btn-btv-red btn-game-action">
                  💥 落地了！
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
        title="📋 今日挑战"
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
        accentColor="#F9D06B"
        accentSoft="#FFF9EE"
        accentTint="#E3F2FD"
        confirmColor="#90C79A"
      />

      {/* 排行榜 */}
      <div className="px-4 sm:px-0 mb-6">
        <div className="bg-white rounded-[28px] border-2 border-[#E3F2FD] shadow-[0_4px_20px_rgba(28,152,237,0.06)] p-5">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3">🏆 星星排行榜</h3>
          <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
        </div>
      </div>

      {/* 落地确认弹窗 */}
      {game.state === 'paused' && !showLandConfirm && (
        <GamePauseDialog
          emoji="🎈"
          message="气球先休息，准备好了再继续顶～"
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowLandConfirm(true)}
          endLabel="💥 结束这一局"
        />
      )}

      {showLandConfirm && (
        <GameConfirmDialog
          id="keepy-end"
          emoji="🎈"
          title="确定气球落地了？"
          message={`已经坚持了 ${game.formatTime(game.elapsedMs)}，还没落地的话可以继续玩。`}
          cancelLabel={game.state === 'paused' ? '还没！返回暂停' : '还没！继续玩'}
          confirmLabel="是，落地了！"
          onCancel={() => setShowLandConfirm(false)}
          onConfirm={() => { setShowLandConfirm(false); game.handleLand() }}
        />
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
    <div role="dialog" aria-modal="true" aria-label="顶气球结算" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
          {game.totalStars > 5000 ? '太厉害了！' : game.totalStars > 2000 ? '真棒！' : '不错哦！'}
        </h2>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-3">Bandit 爸爸对你竖起大拇指 👍</p>

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

function VictoryModal({ game }: { game: ReturnType<typeof useKeepyUppyGame> }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="顶气球通关" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-[#F9D06B] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">全关卡通关！</p>
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
        <p className="text-lg font-extrabold text-btv-green mb-5">你是真正的 Keepy Uppy 冠军！</p>

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="留下冠军的名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#F9D06B] focus:border-btv-yellow outline-none text-btv-dark placeholder-[#5a5a87]/25"
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
