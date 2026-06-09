import { useState, useEffect, useRef } from 'react'
import { useClawGame } from '../hooks/useClawGame'
import { ClawResultPopup } from '../components/ClawResultPopup'
import { Leaderboard } from '../components/Leaderboard'
import { GameLeaderboardPanel } from '../components/GameLeaderboardPanel'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameTimer } from '../components/GameTimer'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { triggerHaptic } from '../utils/haptic'
import type { ClawTask } from '../data/clawTasks'

const PHASE_PHRASES = [
  'Bluey 说：左一点...再左一点...',
  'Bingo 的硬币已经准备好了！',
  'Bandit 爪子正在待命！',
  'Chilli 说：做家务最光荣！',
  '记住——抓住是惊喜，滑掉也没关系！',
]

type ClawActionId = 'left' | 'stop' | 'right'

const CLAW_ACTIONS = [
  { id: 'left', emoji: '⬅️', label: '左一点', hint: '爪子往左', color: '#1C98ED' },
  { id: 'stop', emoji: '✋', label: '停！', hint: '就是这里', color: '#FCD882' },
  { id: 'right', emoji: '➡️', label: '右一点', hint: '爪子往右', color: '#1C98ED' },
] satisfies Array<{
  id: ClawActionId
  emoji: string
  label: string
  hint: string
  color: string
}>

const CLAW_ACTION_HINTS: Record<ClawActionId, string> = {
  left: '左一点...慢慢移过去！',
  stop: '停！就是这里！',
  right: '右一点...再右一点！',
}

export function ClawGamePage() {
  const game = useClawGame()
  const [showCountdown, setShowCountdown] = useState(false)
  const [showLandConfirm, setShowLandConfirm] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showProgressBoard, setShowProgressBoard] = useState(true)
  const [showScoreHelp, setShowScoreHelp] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const phraseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [taskKey, setTaskKey] = useState(0)
  const [coinBump, setCoinBump] = useState(false)
  const [prizeBump, setPrizeBump] = useState(false)
  const [activeAction, setActiveAction] = useState<ClawActionId | null>(null)
  const [clawHint, setClawHint] = useState('左...左...再左一点点...停！就是那个！抓！')
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (game.currentTask) setTaskKey(k => k + 1)
  }, [game.currentTask?.id])

  const prevCoins = useRef(game.coins)
  useEffect(() => {
    if (game.coins > prevCoins.current) {
      setCoinBump(true)
      const t = setTimeout(() => setCoinBump(false), 400)
      prevCoins.current = game.coins
      return () => clearTimeout(t)
    }
    prevCoins.current = game.coins
  }, [game.coins])

  const prevPrizes = useRef(game.prizesRemaining)
  useEffect(() => {
    if (game.prizesRemaining < prevPrizes.current) {
      setPrizeBump(true)
      const t = setTimeout(() => setPrizeBump(false), 400)
      prevPrizes.current = game.prizesRemaining
      return () => clearTimeout(t)
    }
    prevPrizes.current = game.prizesRemaining
  }, [game.prizesRemaining])

  useEffect(() => {
    if (game.state === 'running' && !game.isPaused) {
      phraseTimerRef.current = setInterval(() => {
        setPhraseIndex(i => (i + 1) % PHASE_PHRASES.length)
      }, 8000)
    } else {
      if (phraseTimerRef.current) clearInterval(phraseTimerRef.current)
    }
    return () => {
      if (phraseTimerRef.current) clearInterval(phraseTimerRef.current)
    }
  }, [game.state, game.isPaused])

  const prevPhase = useRef(game.phase)
  useEffect(() => {
    if (game.phase === 'task' && prevPhase.current !== 'task') triggerHaptic('tap')
    if (game.clawResult && prevPhase.current === 'claw') triggerHaptic('event')
    if (game.phase === 'finished') triggerHaptic('finish')
    prevPhase.current = game.phase
  }, [game.phase, game.clawResult])

  const isRunning = game.state === 'running'
  const isPaused = game.isPaused
  const isFinished = game.phase === 'finished'

  useEffect(() => () => {
    if (actionTimerRef.current) clearTimeout(actionTimerRef.current)
  }, [])

  const handleClawAction = (actionId: ClawActionId) => {
    if (!isRunning || isPaused) return
    setActiveAction(actionId)
    setClawHint(CLAW_ACTION_HINTS[actionId])
    triggerHaptic('tap')
    if (actionTimerRef.current) clearTimeout(actionTimerRef.current)
    actionTimerRef.current = setTimeout(() => setActiveAction(null), 450)
  }

  const handleQuickStart = () => {
    game.handleStart('宝宝', '爸爸', 5)
    setShowCountdown(true)
  }

  const handlePauseEndCancel = () => {
    setShowLandConfirm(false)
  }

  const handleEndConfirm = () => {
    setShowLandConfirm(false)
    game.handleEndGame()
  }

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      <div className={`relative bg-gradient-to-b from-[#E3F2FD] via-[#F3E5F5] to-[#FCE4EC] -mt-8 rounded-b-[40px] shadow-[inset_0_-8px_30px_rgba(44,67,100,0.06)] overflow-hidden ${isPaused ? 'pointer-events-none' : ''}`}>

        {/* === COUNTDOWN === */}
        {showCountdown && (
          <CountdownOverlay emoji="🕹️" onComplete={() => { setShowCountdown(false); game.handleCountdownComplete() }} />
        )}

        {/* === IDLE SCREEN === */}
        {game.state === 'idle' && (
          <div className="relative z-10 pt-10 pb-12 px-4 text-center">
            <div className="text-8xl mb-4 drop-shadow-[0_6px_16px_rgba(0,0,0,0.06)]">🕹️</div>
            <h1 className="text-[28px] font-black text-btv-dark mb-1">抓娃娃机</h1>
            <p className="text-sm text-btv-text-muted mb-2">The Claw · S1E19</p>
            <p className="text-xs text-[#5a5a87]/40 mb-8">准备好 5 个小玩具 · 一位当爪子的家长 · 做任务换硬币</p>

            <button type="button"
              onClick={handleQuickStart}
              className="btn-btv btn-game-action animate-random-pulse text-lg">
              🕹️ 开始抓娃娃！
            </button>

            <button type="button" onClick={() => window.history.back()}
              className="block mx-auto mt-4 min-h-11 px-3 text-xs font-bold text-[#5a5a87]/40 hover:text-[#5a5a87]/60">
              ← 返回首页
            </button>
          </div>
        )}

        {/* === GAME ACTIVE === */}
        {game.state !== 'idle' && (
          <>
            <GameTopHud
              scoreItems={[
                { emoji: '🪙', value: game.coins, color: '#F39C62', bump: coinBump, label: '硬币' },
                { emoji: '🎁', value: game.prizesRemaining, color: '#90C79A', bump: prizeBump, label: '剩余奖品' },
              ]}
              breakdownItems={[
                { emoji: '🎉', value: game.caught },
                { emoji: '😬', value: game.dropped },
                { emoji: '⚡', value: game.faults },
              ]}
              helpTitle="怎么玩？"
              helpItems={[
                '💰 完成 5 级任务挣硬币',
                '🪙 每个任务 +2 枚硬币',
                '🪙 投币指挥爪子抓奖品',
                '🎉 抓住全部奖品就通关！',
              ]}
              showHelp={showScoreHelp}
              onToggleHelp={() => setShowScoreHelp(!showScoreHelp)}
              showPause={isRunning && !isPaused && !isFinished}
              onPause={game.handlePause}
              showEnd={!isPaused && !isFinished}
              onEnd={() => setShowLandConfirm(true)}
            />

            {/* Central game area */}
            <div className="relative flex flex-col items-center px-4 pb-4">
              {/* Phase-specific visual centerpiece */}
              <div className="relative w-full max-w-sm pt-2">
                <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-[#FCD882]/20 blur-3xl animate-pulse-glow-btv" />

                {game.phase === 'task' && game.currentTask && (
                  <div key={taskKey} className="relative mx-auto w-full rounded-[32px] bg-white/75 border-4 border-white shadow-[0_12px_34px_rgba(44,67,100,0.12)] p-5 text-center animate-jelly">
                    <div className="text-5xl mb-2">{game.currentTask.emoji}</div>
                    <div className="mb-2 flex flex-wrap justify-center gap-1.5">
                      <span className="rounded-full bg-[#FFF9EE] px-2.5 py-1 text-[10px] font-extrabold text-[#F39C62]">
                        {game.currentTask.stageLabel}
                      </span>
                      <span className="rounded-full bg-[#E3F2FD] px-2.5 py-1 text-[10px] font-extrabold text-[#5a5a87]/55">
                        +2🪙
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-btv-dark mb-1">{game.currentTask.title}</h3>
                    <p className="text-[13px] text-[#5a5a87]/55 leading-relaxed">{game.currentTask.description}</p>
                    <p className="mt-2 text-[11px] font-extrabold text-[#5a5a87]/42">目标：{game.currentTask.stageGoal}</p>
                    <p className="mt-1 text-[11px] font-bold text-[#D96B62]/65">安全：{game.currentTask.safetyNote}</p>
                  </div>
                )}

                {game.phase === 'task' && !game.currentTask && game.taskLadder.length > 0 && (
                  <div className="relative mx-auto w-full rounded-[32px] bg-white/75 border-4 border-white shadow-[0_12px_34px_rgba(44,67,100,0.12)] p-5 text-center animate-jelly">
                    <div className="text-5xl mb-2">{game.needsBonusCoin ? '🪙' : '🏁'}</div>
                    <h3 className="text-base font-extrabold text-btv-dark mb-1">
                      {game.needsBonusCoin ? '硬币补给任务' : '任务阶梯完成！'}
                    </h3>
                    <p className="text-[13px] text-[#5a5a87]/55 leading-relaxed">
                      {game.needsBonusCoin
                        ? '硬币用完了，和家长击掌一圈，大声说“爪子加油”，再得 1 枚硬币。'
                        : '现在用剩下的硬币继续指挥爪子，抓完奖品就通关。'}
                    </p>
                  </div>
                )}

                {game.phase === 'claw' && (
                  <div className="relative mx-auto w-full rounded-[32px] bg-white/75 border-4 border-white shadow-[0_12px_34px_rgba(44,67,100,0.12)] p-5 text-center">
                    <div className="text-6xl mb-2 animate-balloon-wobble">🕹️</div>
                    <h3 className="text-base font-extrabold text-btv-dark mb-1">{game.clawName}爪子已就位</h3>
                    <p className="text-[13px] text-[#5a5a87]/45 mb-3">看着桌上真实的奖品，喊出你的指令</p>

                    <div className="flex justify-center gap-1.5 mb-4" aria-label="奖品进度">
                      {Array.from({ length: game.totalPrizes }).map((_, i) => (
                        <span
                          key={i}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-lg transition-all ${
                            i < game.caught
                              ? 'bg-[#E8F5E9] border-[#90C79A] opacity-45 grayscale'
                              : i === game.caught
                                ? 'bg-[#FFF9EE] border-[#FCD882] scale-110 shadow-[0_2px_10px_rgba(252,216,130,0.45)]'
                                : 'bg-white/70 border-[#E3F2FD]'
                          }`}
                        >
                          {i < game.caught ? '✓' : '🧸'}
                        </span>
                      ))}
                    </div>

                    {/* Direction buttons */}
                    <div className="flex items-center gap-2 mb-3">
                      {CLAW_ACTIONS.map(action => (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => handleClawAction(action.id)}
                          disabled={isPaused}
                          aria-label={action.label}
                          className={`flex-1 min-h-[58px] rounded-2xl text-white font-extrabold active:scale-95 active:brightness-90 transition-all shadow-[0_3px_0_rgba(0,0,0,0.15)] ${
                            activeAction === action.id ? 'scale-105 ring-4 ring-white/70 brightness-110' : ''
                          }`}
                          style={{ backgroundColor: action.color, color: action.id === 'stop' ? '#2C4364' : 'white', minHeight: 58 }}
                        >
                          <span className="block text-xl leading-none">{action.emoji}</span>
                          <span className="block text-[10px] mt-1 opacity-75">{action.hint}</span>
                        </button>
                      ))}
                    </div>

                    {/* Grab button */}
                    <button type="button" onClick={game.handleClawGrab} disabled={isPaused}
                      className="w-full min-h-14 bg-[#D96B62] text-white rounded-2xl text-xl font-extrabold active:scale-95 active:brightness-90 transition-all shadow-[0_3px_0_rgba(0,0,0,0.15),0_4px_14px_rgba(217,107,98,0.35)] animate-random-pulse"
                      style={{ minHeight: 56 }}>
                      🎯 抓！
                    </button>

                    <p className="text-[11px] text-[#5a5a87]/35 font-bold mt-3">孩子喊左/右/停 → 家长伸手抓 → 点「抓！」</p>
                  </div>
                )}

                {game.phase === 'finished' && (
                  <div className="relative mx-auto w-full rounded-[32px] bg-white/75 border-4 border-white shadow-[0_12px_34px_rgba(44,67,100,0.12)] p-6 text-center">
                    <div className="text-6xl mb-2">{game.endReason === 'completed' ? '🏆' : '👋'}</div>
                    <h3 className="text-xl font-extrabold text-btv-dark mb-1">
                      {game.endReason === 'completed' ? '游戏结束！' : '提前结束'}
                    </h3>
                    <p className="text-sm text-[#5a5a87]/50 mb-4">
                      {game.endReason === 'completed' ? '所有奖品都被抓走了！' : `抓到了 ${game.caught} 个奖品！`}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-[#E8F5E9]/80 rounded-2xl p-3">
                        <div className="text-2xl font-black text-[#90C79A]">{game.caught}</div>
                        <div className="text-[10px] text-[#5C728D] font-bold">🎉 抓住</div>
                      </div>
                      <div className="bg-[#FFF8E1]/80 rounded-2xl p-3">
                        <div className="text-2xl font-black text-[#FCD882]">{game.dropped}</div>
                        <div className="text-[10px] text-[#5C728D] font-bold">😬 滑掉</div>
                      </div>
                      <div className="bg-[#FCE4EC]/80 rounded-2xl p-3">
                        <div className="text-2xl font-black text-[#D96B62]">{game.faults}</div>
                        <div className="text-[10px] text-[#5C728D] font-bold">⚡ 故障</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={game.handleReset}
                        className="flex-1 min-h-12 bg-[#F0F4FF] text-[#5a5a87] font-extrabold rounded-full active:scale-95 transition-transform">
                        🔄 再来一局
                      </button>
                      <button type="button" onClick={() => setShowLeaderboard(true)}
                        className="flex-1 min-h-12 bg-btv-dark text-white font-extrabold rounded-full active:scale-95 transition-transform">
                        📊 排行榜
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {game.state !== 'finished' && (
                <div className="-mt-1 mb-2">
                  <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
                </div>
              )}

              {game.phase === 'claw' && (
                <div className="w-full max-w-sm rounded-3xl bg-white/85 border-2 border-[#E3F2FD] px-4 py-3 mb-3 shadow-[0_4px_16px_rgba(44,67,100,0.06)]">
                  <p className="text-sm font-extrabold text-btv-dark text-center leading-snug" aria-live="polite">
                    {clawHint}
                  </p>
                </div>
              )}

              {/* Encourage phrase */}
              {isRunning && !isPaused && game.phase !== 'finished' && (
                <p className="text-[13px] font-extrabold text-[#5a5a87]/50 text-center mt-2 mb-1">
                  {PHASE_PHRASES[phraseIndex]}
                </p>
              )}
              {game.state === 'paused' && (
                <p className="text-[13px] font-extrabold text-[#5a5a87]/40 text-center mt-2 mb-1">
                  ⏸ 爪子先休息，大家也可以动一动～
                </p>
              )}

              {/* Phase action buttons */}
              {game.phase === 'task' && isRunning && !isPaused && (
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mb-4">
                  <button type="button" onClick={game.handleInsertCoin} disabled={game.coins <= 0}
                    className={`min-h-[56px] rounded-2xl text-base font-extrabold active:scale-95 transition-all shadow-[0_3px_0_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 ${
                      game.coins > 0
                        ? 'bg-[#F39C62] text-white'
                        : 'bg-[#F0F4FF] text-[#5a5a87]/25 cursor-not-allowed'
                    }`}
                    style={{ minHeight: 56 }}>
                    🪙 投币抓娃娃
                  </button>
                  {(game.currentTask || game.needsBonusCoin) && (
                    <button type="button" onClick={game.handleTaskComplete}
                      className="min-h-[56px] rounded-2xl bg-[#90C79A] text-white text-base font-extrabold active:scale-95 transition-all shadow-[0_3px_0_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
                      style={{ minHeight: 56 }}>
                      {game.currentTask ? '✅ 完成 +2🪙' : '✋ 加油 +1🪙'}
                    </button>
                  )}
                  {game.currentTask && (
                    <button type="button" onClick={game.handleTaskSkip}
                      className="col-span-2 min-h-11 rounded-full border-2 border-[#E3F2FD] bg-transparent text-[#5C728D] text-sm font-extrabold active:scale-95 transition-transform">
                      🔄 换同一关任务
                    </button>
                  )}
                  {!game.currentTask && !game.needsBonusCoin && (
                    <p className="col-span-2 rounded-2xl bg-white/70 px-4 py-3 text-center text-[12px] font-extrabold text-[#5a5a87]/45">
                      任务都完成啦，用硬币继续抓奖品。
                    </p>
                  )}
                </div>
              )}

              {game.phase === 'claw' && isRunning && !isPaused && (
                <div className="flex gap-3 w-full px-1 mt-3 justify-center">
                  <p className="text-[11px] text-[#5a5a87]/30 font-bold text-center">
                    孩子在现实中指挥，家长手动抓取，按「抓！」看结果
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ClawProgressBoard
        caught={game.caught}
        totalPrizes={game.totalPrizes}
        coins={game.coins}
        tasks={game.taskLadder}
        completedTasks={game.completedTasks}
        needsBonusCoin={game.needsBonusCoin}
        currentTaskTitle={game.currentTask?.title}
        show={showProgressBoard}
        onToggle={() => setShowProgressBoard(!showProgressBoard)}
      />

      <GameLeaderboardPanel
        title="🏆 抓娃娃排行榜"
        entries={game.leaderboard}
        currentRank={game.currentRank}
        accentTint="#E3F2FD"
      />

      {/* === RESULT POPUP === */}
      {game.showResult && game.clawResult && (
        <ClawResultPopup result={game.clawResult} onContinue={game.handleContinue} />
      )}

      {isPaused && !showLandConfirm && (
        <GamePauseDialog
          emoji="🕹️"
          message="爪子先休息，奖品不会跑掉～"
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowLandConfirm(true)}
        />
      )}

      {showLandConfirm && (
        <GameConfirmDialog
          id="claw-end"
          emoji="🕹️"
          title="确定要结束吗？"
          message={`已经抓了 ${game.caught} 个奖品，确定现在结束？`}
          cancelLabel={isPaused ? '还没！返回暂停' : '还没！继续玩'}
          confirmLabel="是，结束！🛑"
          onCancel={handlePauseEndCancel}
          onConfirm={handleEndConfirm}
        />
      )}

      {/* === LEADERBOARD === */}
      {showLeaderboard && (
        <div role="dialog" aria-modal="true" aria-labelledby="claw-leaderboard-title" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/20 backdrop-blur-sm px-6">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 id="claw-leaderboard-title" className="text-lg font-extrabold text-btv-dark">🏆 家庭排行榜</h3>
              <button type="button" onClick={() => setShowLeaderboard(false)}
                className="min-w-[44px] min-h-[44px] rounded-full bg-[#E3F2FD] text-[#5a5a87] font-bold text-sm active:scale-95">
                ✕
              </button>
            </div>
            <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
          </div>
        </div>
      )}
    </div>
  )
}

function ClawProgressBoard({
  caught,
  totalPrizes,
  coins,
  tasks,
  completedTasks,
  needsBonusCoin,
  currentTaskTitle,
  show,
  onToggle,
}: {
  caught: number
  totalPrizes: number
  coins: number
  tasks: ClawTask[]
  completedTasks: number
  needsBonusCoin: boolean
  currentTaskTitle?: string
  show: boolean
  onToggle: () => void
}) {
  const prizeProgress = totalPrizes > 0 ? Math.round((caught / totalPrizes) * 100) : 0
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
  const currentTaskIndex = tasks.findIndex(task => !task.completed)

  return (
    <div className="px-4 sm:px-0 mt-5 mb-6">
      <div className="bg-white rounded-[28px] border-2 border-[#E3F2FD] shadow-[0_4px_20px_rgba(28,152,237,0.06)] overflow-hidden">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-h-14 items-center justify-between w-full px-5 py-3.5 bg-gradient-to-r from-[#FFF9EE] via-[#F3E5F5] to-[#E3F2FD] border-b-2 border-[#F9D06B]/20"
        >
          <h3 className="text-sm font-extrabold text-btv-dark flex items-center gap-2">
            🕹️ 抓娃娃进度
            <span className="text-[11px] font-bold text-[#5a5a87]/35 bg-white/70 rounded-full px-2 py-0.5">
              任务 {completedTasks}/{tasks.length || 5}
            </span>
          </h3>
          <span className={`text-[#5a5a87]/35 font-bold transition-transform duration-300 ${show ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {show && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-[#E3F2FD] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F39C62] via-[#FCD882] to-[#90C79A] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${prizeProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-extrabold text-[#5a5a87]/25">奖品 {prizeProgress}%</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-[#FFF9EE] border border-[#FCD882]/45 px-3 py-3 text-center">
                <p className="text-xl leading-none mb-1">💰</p>
                <p className="text-[10px] font-extrabold text-[#5a5a87]/40">硬币</p>
                <p className="text-base font-extrabold text-[#F39C62]">{coins}</p>
              </div>
              <div className="rounded-2xl bg-[#E8F5E9]/70 border border-[#90C79A]/35 px-3 py-3 text-center">
                <p className="text-xl leading-none mb-1">🎁</p>
                <p className="text-[10px] font-extrabold text-[#5a5a87]/40">已抓</p>
                <p className="text-base font-extrabold text-[#90C79A]">{caught}</p>
              </div>
              <div className="rounded-2xl bg-[#F0F7FF] border border-[#BBDEFB]/70 px-3 py-3 text-center">
                <p className="text-xl leading-none mb-1">🎯</p>
                <p className="text-[10px] font-extrabold text-[#5a5a87]/40">目标</p>
                <p className="text-base font-extrabold text-btv-blue">{totalPrizes}</p>
              </div>
            </div>

            {tasks.length > 0 && (
              <div className="rounded-2xl bg-[#FFF9EE]/70 border border-[#FCD882]/35 px-3 py-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-extrabold text-[#5a5a87]/35 uppercase tracking-widest">五级任务阶梯</p>
                  <span className="text-[10px] font-extrabold text-[#F39C62]">{taskProgress}%</span>
                </div>
                <div className="space-y-1.5">
                  {tasks.map((task, index) => {
                    const isCurrent = index === currentTaskIndex
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
                          task.completed
                            ? 'border-[#90C79A]/35 bg-[#E8F5E9]/70'
                            : isCurrent
                              ? 'border-[#FCD882] bg-white shadow-[0_1px_8px_rgba(252,216,130,0.24)]'
                              : 'border-[#E3F2FD] bg-white/55 opacity-60'
                        }`}
                      >
                        <span className="text-base">{task.completed ? '✅' : task.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-extrabold text-btv-dark">{task.title}</p>
                          <p className="text-[10px] font-bold text-[#5a5a87]/35">{task.stageLabel}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-[#F0F4FF]/55 border border-[#E3F2FD] px-4 py-3">
              <p className="text-[11px] font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-1">当前节奏</p>
              <p className="text-sm font-extrabold text-btv-dark">
                {tasks.length === 0
                  ? '准备奖品和家长爪子，开始后做任务挣硬币。'
                  : currentTaskTitle
                    ? `先完成「${currentTaskTitle}」，挣 2 枚硬币再抓。`
                    : needsBonusCoin
                      ? '硬币用完了，做一个击掌加油任务补币。'
                      : '任务完成后，用剩下的硬币继续抓奖品。'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
