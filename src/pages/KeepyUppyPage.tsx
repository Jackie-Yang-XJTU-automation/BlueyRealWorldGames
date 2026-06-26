import { useState, useEffect, useRef } from 'react'
import { useKeepyUppyGame } from '../hooks/useKeepyUppyGame'
import { GameTimer } from '../components/GameTimer'
import { RandomEventPopup } from '../components/RandomEventPopup'
import { GameLeaderboardPanel } from '../components/GameLeaderboardPanel'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { TaskLadderPanel } from '../components/TaskLadderPanel'
import { CurrentHostCard } from '../components/CurrentHostCard'
import { triggerHaptic } from '../utils/haptic'

const BALLOON_COLORS = ['#D96B62', '#F58634', '#FCD882', '#4CAF50', '#1C98ED', '#AB47BC', '#EC407A']
const KEEPY_PHRASES = [
  '主持人说：别让气球碰到地板！',
  '小帮手在给你加油呢～',
  '家长觉得你能坚持更久！',
  '大人一手拿锅铲也在帮你顶！',
  '记住，这可是今天最重要的红气球！',
]

const PRESET_NAMES = ['爸爸', '妈妈', '宝宝', '爷爷', '奶奶']
const STORAGE_KEY_PLAYED = 'keepyuppy_played'

export function KeepyUppyPage() {
  const game = useKeepyUppyGame()
  const [balloonColor] = useState(() => BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)])
  const [showTasks, setShowTasks] = useState(false)
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
        setEncourageIndex(i => (i + 1) % KEEPY_PHRASES.length)
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

  const currentTask = game.tasks[game.firstUncompletedIndex]
  const currentTaskReady = currentTask ? game.canConfirmTask(currentTask.id) : false

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      {/* 天空竞技场背景 */}
      <div className="relative bg-gradient-to-b from-[#B3E5FC] via-[#CEEDFA] to-[#E8F6FC] -mt-8 rounded-b-[40px] shadow-[inset_0_-8px_30px_rgba(135,206,235,0.15)] overflow-hidden">

        <GameTopHud
          scoreItems={[{ emoji: '⭐', value: game.totalStars, color: '#DCA018', bump: game.scoreBump, label: '家庭记录' }]}
          breakdownItems={[
            { emoji: '⏱', value: game.timeStars },
            { emoji: '🎯', value: game.taskStars },
            { emoji: '⚡', value: game.eventStars },
          ]}
          helpTitle="家庭记录怎么来的？"
          helpItems={[
            '⏱ 顶气球时间会被记下',
            '🎯 完成当前步骤会盖章',
            '⚡ 好笑规则变化会留下记录',
          ]}
          showHelp={showScoreHelp}
          onToggleHelp={() => setShowScoreHelp(!showScoreHelp)}
          hostLabel="顶气球"
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

        {/* 主持提示气泡 */}
        {game.state === 'running' && !game.currentEvent && (
          <div className="flex justify-center px-6 mb-3">
            <div className="relative bg-white/85 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-[0_2px_12px_rgba(44,67,100,0.05)] border border-[#E3F2FD] max-w-xs">
              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white/85 border-l border-t border-[#E3F2FD] rotate-45" />
              <p className="text-[13px] font-extrabold text-[#5C728D] text-center leading-snug">
                {KEEPY_PHRASES[encourageIndex]}
              </p>
            </div>
          </div>
        )}

        {game.state === 'running' && currentTask && !game.currentEvent && (
          <div className="px-4">
            <CurrentHostCard
              label="顶气球主持卡"
              stepLabel={`第 ${game.firstUncompletedIndex + 1} 步 / ${game.tasks.length}`}
              prompt={currentTask.hostPrompt ?? currentTask.title}
              detail={currentTask.stageGoal ?? currentTask.description}
              safetyNote={currentTask.safetyNote}
              accentSoft="#FFF9EE"
              accentColor="#F9D06B"
              confirmColor="#90C79A"
              canConfirm={currentTaskReady}
              onConfirm={() => { triggerHaptic('success'); game.confirmTask(currentTask.id, game.firstUncompletedIndex) }}
              confirmLabel="步骤完成，盖章"
              blockedLabel="先顶一小会儿"
            />
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
              <p className="text-[13px] font-extrabold text-[#5C728D] text-center">⏸ 休息一下，随时继续～</p>
            </div>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex justify-center gap-3 pb-4 px-4">
          {game.state === 'idle' && (
            <div className="flex flex-col items-center gap-2">
              {!hasPlayedBefore && (
                <p className="text-center text-[#5C728D] text-xs font-bold">
                  💡 和宝宝一起轻轻顶气球，手机会给出好笑规则变化。
                </p>
              )}
              <button type="button" onClick={() => { markPlayed(); setShowCountdown(true) }} className="btn-btv btn-game-action animate-random-pulse">
                🎈 开始顶气球！
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
        title="🎈 顶气球步骤"
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
        blockedLabel="先顶一小会儿"
        completionMessage="🎉 全部顶气球步骤完成！"
        accentColor="#F9D06B"
        accentSoft="#FFF9EE"
        accentTint="#E3F2FD"
        confirmColor="#90C79A"
      />

      <GameLeaderboardPanel
        title="📒 顶气球家庭记录"
        entries={game.leaderboard}
        currentRank={game.currentRank}
        accentTint="#E3F2FD"
      />

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

      {/* 庆祝弹窗 */}
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
          {game.totalStars > 5000 ? '这一集玩出来了！' : game.totalStars > 2000 ? '配合得真好！' : '气球还在旅行！'}
        </h2>
        <p className="text-sm text-[#5C728D] font-bold mb-3">你们一起守住气球，也记得慢慢来。</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF9EE] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-[#DCA018] timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-[#5C728D] mb-4">
          <span>⏱ 时长 {game.timeStars}⭐</span>
          <span>🎯 印章 {game.taskStars}⭐</span>
          <span>⚡ 事件 {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-3">{game.formatTime(game.elapsedMs)}</p>
        {game.currentRank && game.currentRank <= 3 && (
          <p className="text-base font-extrabold text-[#DCA018] mb-3">这次可以写进家庭记录。</p>
        )}

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="给这集取个名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-[#5a5a87]/25"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
          <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
            {PRESET_NAMES.map(name => (
              <button key={name} type="button"
                onClick={() => game.setPlayerName(name)}
                className="text-xs font-extrabold min-h-11 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5C728D] hover:bg-[#E3ECFD] active:scale-95 transition-all"
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5C728D] font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1">保存记录</button>
        </div>
      </div>
    </div>
  )
}

function VictoryModal({ game }: { game: ReturnType<typeof useKeepyUppyGame> }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="顶气球庆祝" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-[#F9D06B] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">这一集完成啦！</p>
        <p className="text-sm text-[#5C728D] font-bold mb-4">全家为你们的合作欢呼！</p>

        <div className="inline-flex items-center gap-2 bg-[#FFF9EE] rounded-2xl px-5 py-3 mb-3">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl font-extrabold text-[#DCA018] timer-text">{game.totalStars}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs font-bold text-[#5C728D] mb-3">
          <span>⏱ {game.timeStars}⭐</span>
          <span>🎯 {game.taskStars}⭐</span>
          <span>⚡ {game.eventStars}⭐</span>
        </div>
        <p className="text-5xl font-extrabold text-btv-orange timer-text mb-4">{game.formatTime(game.elapsedMs)}</p>
        <p className="text-lg font-extrabold text-btv-green mb-5">你们轮流、等待，还安全完成了挑战。</p>

        <div className="mb-4">
          <input type="text" value={game.playerName} onChange={e => game.setPlayerName(e.target.value)}
            placeholder="给这集取个名字" maxLength={10}
            className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#F9D06B] focus:border-btv-yellow outline-none text-btv-dark placeholder-[#5a5a87]/25"
            onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()} />
          <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
            {PRESET_NAMES.map(name => (
              <button key={name} type="button"
                onClick={() => game.setPlayerName(name)}
                className="text-xs font-extrabold min-h-11 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5C728D] hover:bg-[#E3ECFD] active:scale-95 transition-all"
              >{name}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5C728D] font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1 animate-random-pulse">记录这一集</button>
        </div>
      </div>
    </div>
  )
}
