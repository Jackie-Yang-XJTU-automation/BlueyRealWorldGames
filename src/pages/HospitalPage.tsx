import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameLeaderboardPanel } from '../components/GameLeaderboardPanel'
import { GameTimer } from '../components/GameTimer'
import { LottieCelebration } from '../components/LottieCelebration'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { RandomEventPopup } from '../components/RandomEventPopup'
import { TaskLadderPanel } from '../components/TaskLadderPanel'
import { CurrentHostCard } from '../components/CurrentHostCard'
import { useHospitalGame, type HospitalActionId } from '../hooks/useHospitalGame'
import { triggerHaptic } from '../utils/haptic'

const PRESET_NAMES = ['医生', '护士', '病人', '助手', '家长']
const STORAGE_KEY_PLAYED = 'hospital_played'
const HOSPITAL_PHRASES = [
  '医生说：病人请安心躺好。',
  '小护士正在准备想象 X 光。',
  '病人可以随时说暂停，医院会认真听。',
  '如果肚子里有奇怪东西，也许妙招会有用。',
  '护士的第二次检查可能才是关键。',
]

const HOSPITAL_ACTIONS: Array<{
  id: HospitalActionId
  emoji: string
  label: string
  hint: string
  color: string
}> = [
  { id: 'checkup', emoji: '🩺', label: '检查', hint: '问哪里疼', color: '#1C98ED' },
  { id: 'xray', emoji: '📋', label: 'X 光', hint: '看肚子', color: '#5a5a87' },
  { id: 'diagnose', emoji: '🔎', label: '结果', hint: '奇怪东西', color: '#F58634' },
  { id: 'nurse', emoji: '🩹', label: '护士', hint: '安慰病人', color: '#EC407A' },
  { id: 'operation', emoji: '🐙', label: '手术', hint: '轻轻假装', color: '#AB47BC' },
  { id: 'cheese', emoji: '💡', label: '妙招', hint: '请出来', color: '#4CAF50' },
]

export function HospitalPage() {
  const game = useHospitalGame()
  const [showTasks, setShowTasks] = useState(false)
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
        setEncourageIndex(index => (index + 1) % HOSPITAL_PHRASES.length)
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

  const handleAction = (action: HospitalActionId) => {
    triggerHaptic(action === 'cheese' ? 'success' : 'tap')
    game.handleAction(action)
  }

  const currentTask = game.tasks[game.firstUncompletedIndex]
  const currentTaskReady = currentTask ? game.canConfirmTask(currentTask.id) : false

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      <div className="relative -mt-8 overflow-hidden rounded-b-[40px] bg-gradient-to-b from-[#E3F2FD] via-[#F3E5F5] to-[#FFF9EE] shadow-[inset_0_-8px_30px_rgba(28,152,237,0.08)]">
        <GameTopHud
          scoreItems={[{ emoji: '⭐', value: game.totalStars, color: '#DCA018', bump: game.scoreBump, label: '家庭记录' }]}
          breakdownItems={[
            { emoji: '⏱', value: game.timeStars },
            { emoji: '🎯', value: game.taskStars },
            { emoji: '🎬', value: game.eventStars },
          ]}
          helpTitle="家庭记录怎么来的？"
          helpItems={[
            '⏱ 看诊时间会被记下',
            '🎯 完成当前步骤会盖章',
            '🎬 好笑动作和突发症状会留下记录',
          ]}
          showHelp={showScoreHelp}
          onToggleHelp={() => setShowScoreHelp(!showScoreHelp)}
          hostLabel="玩具医院"
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
            <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-[#BBDEFB]/40 blur-3xl" />
            <div className="relative mx-auto rounded-[32px] border-4 border-white bg-white/82 p-4 text-center shadow-[0_12px_34px_rgba(44,67,100,0.12)]">
              <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-[28px] bg-[#E3F2FD] text-6xl shadow-inner">
                🏥
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">病历卡</p>
              <h1 className="text-2xl font-black text-btv-dark">玩具医院开诊</h1>
              <p className="mt-2 text-sm font-extrabold leading-relaxed text-[#5C728D]">
                {game.latestAction}
              </p>
            </div>
          </div>

          <div className="-mt-1 mb-3">
            <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
          </div>

          {game.state === 'running' && !game.currentEvent && (
            <p className="mb-3 text-center text-[13px] font-extrabold text-[#5C728D]">
              {HOSPITAL_PHRASES[encourageIndex]}
            </p>
          )}
          {game.state === 'paused' && (
            <p className="mb-3 text-center text-[13px] font-extrabold text-[#5C728D]">
              ⏸ 医院休诊一下，病人也可以伸伸腿。
            </p>
          )}

          {game.state === 'running' && currentTask && !game.currentEvent && (
            <CurrentHostCard
              label="病历主持卡"
              stepLabel={`第 ${game.firstUncompletedIndex + 1} 步 / ${game.tasks.length}`}
              prompt={currentTask.hostPrompt ?? currentTask.title}
              detail={currentTask.stageGoal ?? currentTask.description}
              safetyNote={currentTask.safetyNote}
              accentSoft="#E3F2FD"
              accentColor="#8CBAE6"
              confirmColor="#4CAF50"
              canConfirm={currentTaskReady}
              onConfirm={() => { triggerHaptic('success'); game.confirmTask(currentTask.id, game.firstUncompletedIndex) }}
              confirmLabel="病历完成，盖章"
              blockedLabel="先完成当前看诊动作"
            />
          )}

          {game.state === 'running' && !game.currentEvent && (
            <div className="mb-4 w-full max-w-sm rounded-[28px] border-2 border-white bg-white/76 p-3 shadow-[0_8px_22px_rgba(44,67,100,0.08)]">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#E3F2FD] px-3 py-1 text-xs font-black text-btv-dark">病历检查单</span>
                <span className="text-[11px] font-extrabold text-[#5C728D]">检查 → 结果 → 妙招</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {HOSPITAL_ACTIONS.map(action => {
                  const count = game.actionCounts[action.id] ?? 0
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleAction(action.id)}
                      aria-label={`病历动作：${action.label}`}
                      className="relative flex min-h-[78px] flex-col items-center justify-center gap-0.5 rounded-2xl p-3 font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.15),0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-150 touch-action-manipulation active:translate-y-0.5 active:scale-95"
                      style={{ backgroundColor: action.color }}
                    >
                      {count > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[10px] text-white">
                          {count}
                        </span>
                      )}
                      <span className="text-2xl leading-none">{action.emoji}</span>
                      <span className="text-[13px]">{action.label}</span>
                      <span className="text-[10px] text-white">{action.hint}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex w-full justify-center px-1">
            {game.state === 'idle' && (
              <div className="flex flex-col items-center gap-2">
                {!hasPlayedBefore && (
                  <p className="text-center text-xs font-bold text-[#5C728D]">
                    💡 先约定：所有检查和手术都只是假装，病人说停就停。
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => { markPlayed(); setShowCountdown(true) }}
                  className="btn-btv btn-game-action animate-random-pulse"
                >
                  🏥 开始看诊！
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

      <TaskLadderPanel
        title="🏥 医院病历"
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
        blockedLabel="先完成当前看诊动作"
        completionMessage="🎉 病人康复出院！"
        accentColor="#8CBAE6"
        accentSoft="#F0F4FF"
        accentTint="#E3F2FD"
        confirmColor="#4CAF50"
      />

      <GameLeaderboardPanel
        title="📒 医院家庭记录"
        entries={game.leaderboard}
        currentRank={game.currentRank}
        accentTint="#E3F2FD"
      />

      {game.state === 'paused' && !showEndConfirm && (
        <GamePauseDialog
          emoji="🏥"
          message="医院暂停营业，护士正在整理 X 光。"
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowEndConfirm(true)}
          endLabel="🛑 结束看诊"
        />
      )}

      {showEndConfirm && (
        <GameConfirmDialog
          id="hospital-end"
          emoji="🏥"
          title="确定结束看诊？"
          message={`已经玩了 ${game.formatTime(game.elapsedMs)}，病人还可以继续接受治疗。`}
          cancelLabel={game.state === 'paused' ? '返回暂停' : '继续看诊'}
          confirmLabel="结束看诊"
          onCancel={() => setShowEndConfirm(false)}
          onConfirm={() => { setShowEndConfirm(false); game.handleEnd() }}
        />
      )}

      {game.showResult && (
        <ScoreDialog
          game={game}
          title="病历写好了！"
          subtitle="医生认真听，护士也帮上了大忙。"
          placeholder="给这次看诊取个名字"
          buttonLabel="保存病历"
        />
      )}
      {game.showVictory && (
        <ScoreDialog
          game={game}
          title="Wackadoo! 康复出院"
          subtitle="妙招计划成功，肚子里的奇怪东西离开了。"
          placeholder="给这次看诊取个名字"
          buttonLabel="记录出院"
          victory
        />
      )}

      {game.currentEvent && game.state === 'running' && (
        <RandomEventPopup
          event={game.currentEvent}
          onLand={game.handleEnd}
          endButtonLabel="🛑 结束看诊"
          confirmQuestion="确定要让医院收工了吗？"
          confirmLabel="是，收工"
        />
      )}

      {showCountdown && (
        <CountdownOverlay emoji="🏥" onComplete={() => { setShowCountdown(false); game.handleStart() }} />
      )}
    </div>
  )
}

function ScoreDialog({
  game,
  title,
  subtitle,
  placeholder,
  buttonLabel,
  victory = false,
}: {
  game: ReturnType<typeof useHospitalGame>
  title: string
  subtitle: string
  placeholder: string
  buttonLabel: string
  victory?: boolean
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label="医院结算" className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/20 px-4 backdrop-blur-sm animate-event-pop-in">
      <div className={`max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white p-7 text-center shadow-2xl animate-jelly ${victory ? 'border-4 border-[#8CBAE6]' : ''}`}>
        <div className="flex justify-center -mb-2 -mt-4"><LottieCelebration className="h-48 w-48" loop /></div>
        <h2 className="mb-1 text-2xl font-extrabold text-btv-dark">{title}</h2>
        <p className="mb-3 text-sm font-bold text-[#5C728D]">{subtitle}</p>
        <div className="mb-3 inline-flex items-center gap-2 rounded-2xl bg-[#FFF9EE] px-5 py-3">
          <span className="text-3xl">⭐</span>
          <span className="timer-text text-4xl font-extrabold text-[#DCA018]">{game.totalStars}</span>
        </div>
        <div className="mb-3 flex justify-center gap-4 text-xs font-bold text-[#5C728D]">
          <span>⏱ {game.timeStars}⭐</span>
          <span>🎯 {game.taskStars}⭐</span>
          <span>🎬 {game.eventStars}⭐</span>
        </div>
        <p className="timer-text mb-4 text-5xl font-extrabold text-btv-orange">{game.formatTime(game.elapsedMs)}</p>
        {game.currentRank && game.currentRank <= 3 && (
          <p className="mb-3 text-base font-extrabold text-[#DCA018]">这次可以写进家庭记录。</p>
        )}
        <NameInput game={game} placeholder={placeholder} />
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 rounded-full bg-[#F0F4FF] py-3.5 font-extrabold text-[#5C728D] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1">{buttonLabel}</button>
        </div>
      </div>
    </div>
  )
}

function NameInput({ game, placeholder }: { game: ReturnType<typeof useHospitalGame>; placeholder: string }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={game.playerName}
        onChange={event => game.setPlayerName(event.target.value)}
        placeholder={placeholder}
        maxLength={10}
        className="w-full rounded-full border-2 border-[#E3F2FD] px-5 py-3 text-center text-lg font-extrabold text-btv-dark outline-none placeholder-[#5a5a87]/25 focus:border-btv-blue"
        onKeyDown={event => event.key === 'Enter' && game.handleSaveScore()}
      />
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {PRESET_NAMES.map(name => (
          <button
            key={name}
            type="button"
            onClick={() => game.setPlayerName(name)}
            className="min-h-11 inline-flex items-center justify-center rounded-full bg-[#F0F4FF] px-3 py-1.5 text-xs font-extrabold text-[#5C728D] transition-all active:scale-95"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
