import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useMagicXylophoneGame, type MagicActionId } from '../hooks/useMagicXylophoneGame'
import { GameTimer } from '../components/GameTimer'
import { Leaderboard } from '../components/Leaderboard'
import { LottieCelebration } from '../components/LottieCelebration'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { TaskLadderPanel } from '../components/TaskLadderPanel'
import { triggerHaptic } from '../utils/haptic'
import type { RandomEvent } from '../types/game'

const PRESET_NAMES = ['爸爸', '妈妈', '宝宝', 'Bluey', 'Bingo']
const STORAGE_KEY_PLAYED = 'magicxylophone_played'
const MAGIC_PHRASES = [
  'Bluey 说：做个 Ding！',
  'Bingo 说：记得轮到我哦～',
  'Bandit 爸爸正在努力不动！',
  'Chilli 妈妈提醒：安全姿势最重要。',
  '魔法越会轮流，游戏越好玩！'
]

const XYLOPHONE_BARS = ['#EC407A', '#F44336', '#F58634', '#FCD882', '#4CAF50', '#1C98ED', '#AB47BC']

const MAGIC_ACTIONS: Array<{
  id: MagicActionId
  emoji: string
  label: string
  hint: string
  color: string
}> = [
  { id: 'freeze', emoji: '🧊', label: 'Freeze', hint: '冻住', color: '#1C98ED' },
  { id: 'unfreeze', emoji: '✨', label: 'Unfreeze', hint: '解冻', color: '#4CAF50' },
  { id: 'pose', emoji: '🗿', label: '摆姿势', hint: '安全好笑', color: '#F58634' },
  { id: 'switch', emoji: '🔁', label: '换魔法师', hint: '轮流', color: '#AB47BC' },
  { id: 'rescue', emoji: '🧡', label: 'Bingo 救援', hint: '偷偷救人', color: '#EC407A' },
  { id: 'water', emoji: '💦', label: '爸爸喷泉', hint: '水管恶作剧', color: '#90C79A' },
]

export function MagicXylophonePage() {
  const game = useMagicXylophoneGame()
  const [showTasks, setShowTasks] = useState(true)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
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
        setEncourageIndex(i => (i + 1) % MAGIC_PHRASES.length)
      }, 8000)
    } else if (encourageTimerRef.current) {
      clearInterval(encourageTimerRef.current)
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

  const isActionDisabled = (action: MagicActionId) => {
    if (game.state !== 'running' || !!game.currentEvent) return true
    if (action === 'freeze') return game.isFrozen
    if (action === 'unfreeze' || action === 'pose' || action === 'rescue') return !game.isFrozen
    return false
  }

  const handleMagicAction = (action: MagicActionId) => {
    triggerHaptic(action === 'rescue' || action === 'water' ? 'success' : 'tap')
    game.handleMagicAction(action)
  }

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      <div className="relative bg-gradient-to-b from-[#F3E5F5] via-[#FFF3E0] to-[#E3F2FD] -mt-8 rounded-b-[40px] shadow-[inset_0_-8px_30px_rgba(171,71,188,0.08)] overflow-hidden">
        <GameTopHud
          scoreItems={[{ emoji: '⭐', value: game.totalStars, color: '#DCA018', bump: game.scoreBump, label: '星星总数' }]}
          breakdownItems={[
            { emoji: '⏱', value: game.timeStars },
            { emoji: '🎯', value: game.taskStars },
            { emoji: '✨', value: game.eventStars },
          ]}
          helpTitle="星星怎么来的？"
          helpItems={[
            '⏱ 坚持越久分越高（每秒 +10⭐）',
            '🎯 完成魔法任务加分',
            '✨ 魔法动作和突发事件加分',
          ]}
          showHelp={showScoreHelp}
          onToggleHelp={() => setShowScoreHelp(!showScoreHelp)}
          showPause={game.state === 'running'}
          onPause={game.handlePause}
          showEnd={game.state === 'running' && !game.currentEvent}
          onEnd={() => setShowEndConfirm(true)}
        />

        {game.flyingStars.map(star => (
          <div
            key={star.id}
            className="fixed z-30 pointer-events-none text-2xl font-extrabold text-[#DCA018] drop-shadow-lg"
            style={{
              left: '50%',
              top: '45%',
              '--fly-x': `${star.x}px`,
              '--fly-y': `${star.y}px`,
              animation: 'star-fly-up 0.9s ease-out forwards',
            } as CSSProperties}
          >
            ⭐
          </div>
        ))}

        <div className="relative flex flex-col items-center px-4 pb-4">
          <div className="relative w-full max-w-sm pt-2">
            <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-[#F9D06B]/25 blur-3xl animate-pulse-glow-btv" />
            <div className={`relative mx-auto w-full rounded-[32px] bg-white/75 border-4 border-white shadow-[0_12px_34px_rgba(44,67,100,0.12)] p-4 transition-transform duration-500 ${game.isFrozen ? 'scale-[0.98]' : 'animate-balloon-float'}`}>
              <div className="flex items-end justify-center gap-1.5 h-32">
                {XYLOPHONE_BARS.map((color, i) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleMagicAction(game.isFrozen ? 'unfreeze' : 'freeze')}
                    disabled={game.state !== 'running' || !!game.currentEvent}
                    aria-label={game.isFrozen ? '敲击木琴解冻' : '敲击木琴冻住'}
                    className="w-full min-w-11 max-w-11 rounded-full border-2 border-white/75 shadow-[0_5px_0_rgba(44,67,100,0.14)] transition-transform active:translate-y-1 active:shadow-[0_2px_0_rgba(44,67,100,0.14)] disabled:opacity-55"
                    style={{
                      height: `${112 - i * 8}px`,
                      backgroundColor: color,
                      transform: game.isFrozen ? 'translateY(4px)' : undefined
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-center">
                <div className="h-3 w-24 rounded-full bg-[#8D6E63] shadow-inner" />
              </div>
            </div>
          </div>

          <div className="-mt-1 mb-2">
            <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-3">
            <div className="rounded-2xl bg-white/80 border border-[#E3F2FD] px-3 py-2 text-center">
              <p className="text-[10px] font-extrabold text-[#5a5a87]/35 uppercase tracking-widest">当前魔法师</p>
              <p className="text-base font-extrabold text-btv-dark">{game.currentWizard}</p>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-center ${game.isFrozen ? 'bg-[#E3F2FD]/90 border-[#8CBAE6]' : 'bg-white/80 border-[#E3F2FD]'}`}>
              <p className="text-[10px] font-extrabold text-[#5a5a87]/35 uppercase tracking-widest">魔法状态</p>
              <p className={`text-base font-extrabold ${game.isFrozen ? 'text-[#1C98ED]' : 'text-btv-green'}`}>
                {game.isFrozen ? '有人冻住了' : '大家能动'}
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl bg-white/85 border-2 border-[#E3F2FD] px-4 py-3 mb-3 shadow-[0_4px_16px_rgba(44,67,100,0.06)]">
            <p className="text-sm font-extrabold text-btv-dark text-center leading-snug">{game.latestAction}</p>
            {game.isFrozen && (
              <p className="text-xs font-bold text-[#5a5a87]/45 text-center mt-1">
                姿势提示：{game.posePrompt}
              </p>
            )}
          </div>

          {game.state === 'running' && !game.currentEvent && (
            <p className="text-[13px] font-extrabold text-[#5a5a87]/50 text-center mb-3">
              {MAGIC_PHRASES[encourageIndex]}
            </p>
          )}
          {game.state === 'paused' && (
            <p className="text-[13px] font-extrabold text-[#5a5a87]/40 text-center mb-3">
              ⏸ 木琴先休息，大家也可以动一动～
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-sm mb-4">
            {MAGIC_ACTIONS.map(action => {
              const count = game.actionCounts[action.id] ?? 0
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleMagicAction(action.id)}
                  disabled={isActionDisabled(action.id)}
                  aria-label={`魔法动作：${action.label}`}
                  className="relative flex min-h-[78px] flex-col items-center justify-center gap-0.5 rounded-2xl p-3 text-white font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.15),0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-150 active:scale-95 active:translate-y-0.5 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed touch-action-manipulation"
                  style={{ backgroundColor: action.color }}
                >
                  {count > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-white/25 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </span>
                  )}
                  <span className="text-2xl leading-none">{action.emoji}</span>
                  <span className="text-[13px]">{action.label}</span>
                  <span className="text-[10px] text-white/75">{action.hint}</span>
                </button>
              )
            })}
          </div>

          <div className="flex justify-center gap-3 w-full px-1">
            {game.state === 'idle' && (
              <div className="flex flex-col items-center gap-2">
                {!hasPlayedBefore && (
                  <p className="text-center text-[#5a5a87]/45 text-xs font-bold">
                    💡 先约定：冻住时不推不拉，只摆安全姿势。
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => { markPlayed(); setShowCountdown(true) }}
                  className="btn-btv btn-game-action animate-random-pulse"
                >
                  🎵 开始做 Ding！
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
      </div>

      <TaskBoard game={game} showTasks={showTasks} onToggle={() => setShowTasks(!showTasks)} />

      <div className="px-4 sm:px-0 mb-6">
        <div className="bg-white rounded-[28px] border-2 border-[#E3F2FD] shadow-[0_4px_20px_rgba(28,152,237,0.06)] p-5">
          <h3 className="text-sm font-extrabold text-[#5a5a87]/35 uppercase tracking-widest mb-3">🏆 魔法排行榜</h3>
          <Leaderboard entries={game.leaderboard} currentRank={game.currentRank} />
        </div>
      </div>

      {game.state === 'paused' && !showEndConfirm && (
        <GamePauseDialog
          emoji="🎵"
          message="木琴先休息，大家也可以动一动～"
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowEndConfirm(true)}
          endLabel="🧺 收起木琴"
        />
      )}

      {showEndConfirm && (
        <GameConfirmDialog
          id="magic-end"
          emoji="🎵"
          title="确定收起木琴？"
          message="还没玩够的话，可以继续做 Ding！"
          cancelLabel={game.state === 'paused' ? '还没！返回暂停' : '继续玩'}
          confirmLabel="收起来"
          onCancel={() => setShowEndConfirm(false)}
          onConfirm={() => { setShowEndConfirm(false); game.handleEnd() }}
        />
      )}

      {game.showResult && <ResultModal game={game} />}
      {game.showVictory && <VictoryModal game={game} />}

      {game.currentEvent && game.state === 'running' && (
        <MagicEventPopup event={game.currentEvent} onEnd={game.handleEnd} />
      )}

      {showCountdown && (
        <CountdownOverlay emoji="🎵" onComplete={() => { setShowCountdown(false); game.handleStart() }} />
      )}
    </div>
  )
}

function TaskBoard({
  game,
  showTasks,
  onToggle
}: {
  game: ReturnType<typeof useMagicXylophoneGame>
  showTasks: boolean
  onToggle: () => void
}) {
  return (
    <TaskLadderPanel
      title="🎵 魔法任务"
      tasks={game.tasks}
      completedTasks={game.completedTasks}
      show={showTasks}
      onToggle={onToggle}
      state={game.state}
      firstUncompletedIndex={game.firstUncompletedIndex}
      animatingTaskId={game.animatingTaskId}
      isLocked={game.isLocked}
      onConfirm={(taskId, index) => { triggerHaptic('success'); game.confirmTask(taskId, index) }}
      canConfirmTask={game.canConfirmTask}
      completionMessage="🎉 全部魔法任务完成！"
      accentColor="#F9D06B"
      accentSoft="#FFF9EE"
      accentTint="#E3F2FD"
      confirmColor="#90C79A"
    />
  )
}

function MagicEventPopup({ event, onEnd }: { event: RandomEvent; onEnd: () => void }) {
  const [remaining, setRemaining] = useState(event.duration)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setRemaining(event.duration)
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [event])

  return (
    <div role="dialog" aria-modal="true" aria-label="魔法突发状况" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/25 backdrop-blur-sm animate-event-pop-in px-4 pointer-events-auto">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-btv-orange bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="text-7xl mb-3">{event.emoji}</div>
        <h2 className="text-xl font-extrabold text-btv-orange mb-2">⚡ 魔法突发状况！</h2>
        <h3 className="text-xl font-extrabold text-btv-dark mb-2">{event.title}</h3>
        <p className="text-base text-[#5a5a87]/60 mb-5 leading-relaxed font-medium">{event.description}</p>
        <div className="bg-[#FFF3E0] rounded-2xl px-4 py-3 mb-5">
          <p className="text-sm text-btv-orange font-extrabold">⏱ 剩余 {remaining} 秒自动恢复</p>
          <div className="w-full h-2.5 bg-[#FFE0B2] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-btv-orange rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(remaining / event.duration) * 100}%` }}
            />
          </div>
        </div>
        {!showConfirm ? (
          <button type="button" onClick={() => setShowConfirm(true)} className="btn-btv btn-btv-red w-full text-lg">
            🧺 魔法乱套了，结束
          </button>
        ) : (
          <div>
            <p className="text-sm font-extrabold text-[#5a5a87]/50 mb-3">确定要收起木琴了吗？</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/60 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors">
                继续玩
              </button>
              <button type="button" onClick={onEnd} className="btn-btv btn-btv-red flex-1">
                结束
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultModal({ game }: { game: ReturnType<typeof useMagicXylophoneGame> }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="魔法木琴结算" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/25 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
          {game.totalStars > 5000 ? '魔法大师！' : game.totalStars > 2000 ? 'Ding 得漂亮！' : '魔法开始起作用了！'}
        </h2>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-3">Bandit 爸爸终于可以动了 👍</p>
        <ScoreSummary game={game} />
        {game.currentRank && game.currentRank <= 3 && (
          <p className="text-base font-extrabold text-[#DCA018] mb-3">🏆 星星排名第 {game.currentRank} 名！</p>
        )}
        <NameInput game={game} placeholder="留下你的名字" />
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/55 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1">保存成绩！</button>
        </div>
      </div>
    </div>
  )
}

function VictoryModal({ game }: { game: ReturnType<typeof useMagicXylophoneGame> }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="魔法木琴通关" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#AB47BC]/25 backdrop-blur-sm animate-event-pop-in px-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] border-4 border-[#F9D06B] bg-white p-7 text-center shadow-2xl animate-jelly">
        <div className="flex justify-center -mt-4 -mb-2"><LottieCelebration className="w-48 h-48" loop /></div>
        <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
        <p className="text-xl font-extrabold text-btv-dark mb-1">全魔法通关！</p>
        <p className="text-sm text-[#5a5a87]/50 font-bold mb-4">Bluey 和 Bingo 都轮到啦！</p>
        <ScoreSummary game={game} />
        <p className="text-lg font-extrabold text-btv-green mb-5">你是真正的魔法木琴冠军！</p>
        <NameInput game={game} placeholder="留下冠军的名字" />
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 bg-[#F0F4FF] text-[#5a5a87]/55 font-extrabold py-3.5 rounded-full hover:bg-[#E3ECFD] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1 animate-random-pulse">🏆 记录辉煌！</button>
        </div>
      </div>
    </div>
  )
}

function ScoreSummary({ game }: { game: ReturnType<typeof useMagicXylophoneGame> }) {
  return (
    <>
      <div className="inline-flex items-center gap-2 bg-[#FFF9EE] rounded-2xl px-5 py-3 mb-3">
        <span className="text-3xl">⭐</span>
        <span className="text-4xl font-extrabold text-[#DCA018] timer-text">{game.totalStars}</span>
      </div>
      <div className="flex justify-center gap-4 text-xs font-bold text-[#5a5a87]/50 mb-3">
        <span>⏱ {game.timeStars}⭐</span>
        <span>🎯 {game.taskStars}⭐</span>
        <span>✨ {game.eventStars}⭐</span>
      </div>
      <p className="text-5xl font-extrabold text-btv-orange timer-text mb-4">{game.formatTime(game.elapsedMs)}</p>
    </>
  )
}

function NameInput({ game, placeholder }: { game: ReturnType<typeof useMagicXylophoneGame>; placeholder: string }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={game.playerName}
        onChange={e => game.setPlayerName(e.target.value)}
        placeholder={placeholder}
        maxLength={10}
        className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-[#5a5a87]/25"
        onKeyDown={e => e.key === 'Enter' && game.handleSaveScore()}
      />
      <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
        {PRESET_NAMES.map(name => (
          <button
            key={name}
            type="button"
            onClick={() => game.setPlayerName(name)}
            className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-[#F0F4FF] text-[#5a5a87]/55 hover:bg-[#E3ECFD] active:scale-95 transition-all"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
