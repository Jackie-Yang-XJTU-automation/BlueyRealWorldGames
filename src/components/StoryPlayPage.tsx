import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CountdownOverlay } from './CountdownOverlay'
import { GameLeaderboardPanel } from './GameLeaderboardPanel'
import { GameTimer } from './GameTimer'
import { LottieCelebration } from './LottieCelebration'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from './PlayableGameChrome'
import { CurrentHostCard } from './CurrentHostCard'
import { RandomEventPopup } from './RandomEventPopup'
import { TaskLadderPanel } from './TaskLadderPanel'
import type { StoryPlayConfig } from '../data/storyPlayConfigs'
import { useStoryPlayGame } from '../hooks/useStoryPlayGame'
import { triggerHaptic } from '../utils/haptic'

interface StoryPlayPageProps {
  config: StoryPlayConfig
}

export function StoryPlayPage({ config }: StoryPlayPageProps) {
  const game = useStoryPlayGame(config)
  const [showTasks, setShowTasks] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [showScoreHelp, setShowScoreHelp] = useState(false)
  const [encourageIndex, setEncourageIndex] = useState(0)
  const [hasPlayedBefore] = useState(() => localStorage.getItem(`${config.id}_played`) === 'true')
  const encourageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentTask = game.tasks[game.firstUncompletedIndex]
  const currentTaskHint = currentTask ? getTaskRequirementHint(config, currentTask.id) : ''
  const currentTaskReady = currentTask ? game.canConfirmTask(currentTask.id) : false
  const surface = getStorySurface(config.id)

  const markPlayed = () => {
    if (!hasPlayedBefore) localStorage.setItem(`${config.id}_played`, 'true')
  }

  useEffect(() => {
    if (game.state === 'running') {
      encourageTimerRef.current = setInterval(() => {
        setEncourageIndex(index => (index + 1) % config.runningNudge.length)
      }, 8500)
    } else if (encourageTimerRef.current) {
      clearInterval(encourageTimerRef.current)
    }
    return () => {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
  }, [game.state, config.runningNudge.length])

  const prevStateRef = useRef(game.state)
  const prevEventRef = useRef(game.currentEvent)
  useEffect(() => {
    if (game.state === 'running' && prevStateRef.current !== 'running') triggerHaptic('tap')
    if (game.currentEvent && !prevEventRef.current) triggerHaptic('event')
    if ((game.showResult || game.showVictory) && prevStateRef.current === 'running') triggerHaptic('finish')
    prevStateRef.current = game.state
    prevEventRef.current = game.currentEvent
  }, [game.state, game.currentEvent, game.showResult, game.showVictory])

  const handleAction = (actionId: string, success?: boolean) => {
    triggerHaptic(success ? 'success' : 'tap')
    game.handleAction(actionId)
  }

  return (
    <div className="max-w-lg mx-auto -mx-4 sm:mx-auto">
      <div className="relative -mt-8 overflow-hidden rounded-b-[40px] bg-gradient-to-b from-[#E3F2FD] via-[#FDFBF7] to-white shadow-[inset_0_-8px_30px_rgba(28,152,237,0.08)]">
        <GameTopHud
          scoreItems={[{ emoji: '⭐', value: game.totalStars, color: '#DCA018', bump: game.scoreBump, label: '家庭记录' }]}
          breakdownItems={[
            { emoji: '⏱', value: game.timeStars },
            { emoji: '🎯', value: game.taskStars },
            { emoji: '🎬', value: game.eventStars },
          ]}
          helpTitle="记录怎么来的？"
          helpItems={[
            '⏱ 玩得越久记录越多',
            '🎯 完成当前步骤会盖章',
            '🎬 好笑动作和意外会留下记录',
          ]}
          showHelp={showScoreHelp}
          onToggleHelp={() => setShowScoreHelp(!showScoreHelp)}
          showPause={game.state === 'running'}
          onPause={game.handlePause}
          showEnd={game.state === 'running' && !game.currentEvent}
          onEnd={() => setShowEndConfirm(true)}
          hostLabel={surface.hostLabel}
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
            <div className="absolute inset-x-8 top-8 h-24 rounded-full blur-3xl" style={{ backgroundColor: `${config.accentColor}28` }} />
            <div className={`relative mx-auto rounded-[32px] border-4 border-white bg-white/86 text-center shadow-[0_12px_34px_rgba(44,67,100,0.12)] ${game.state === 'running' ? 'p-3' : 'p-4'}`}>
              <div
                className={`mx-auto grid place-items-center shadow-inner transition-all duration-300 ${game.state === 'running' ? 'mb-2 h-20 w-20 rounded-[22px] text-5xl' : 'mb-3 h-28 w-28 rounded-[28px] text-6xl'}`}
                style={{ backgroundColor: config.accentSoft }}
              >
                {config.emoji}
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">现实游戏主持</p>
              <h1 className={`font-black text-btv-dark ${game.state === 'running' ? 'text-xl' : 'text-2xl'}`}>{config.title}</h1>
              {game.state !== 'running' && (
                <p className="mt-1 text-xs font-extrabold text-[#5C728D]">{config.subtitle}</p>
              )}
              <p className={`text-sm font-extrabold leading-relaxed text-[#5C728D] ${game.state === 'running' ? 'mt-2' : 'mt-3'}`}>
                {game.latestAction}
              </p>
            </div>
          </div>

          <div className="-mt-1 mb-3">
            <GameTimer state={game.state} elapsedMs={game.elapsedMs} formatTime={game.formatTime} />
          </div>

          {game.state === 'running' && currentTask && !game.currentEvent && (
            <CurrentHostCard
              label={surface.hostLabel}
              stepLabel={`第 ${game.firstUncompletedIndex + 1} 步 / ${game.tasks.length}`}
              prompt={currentTask.hostPrompt ?? currentTask.title}
              detail={currentTask.stageGoal ?? currentTask.description}
              safetyNote={currentTask.safetyNote}
              actionHint={currentTaskHint}
              accentSoft={config.accentSoft}
              accentColor={config.accentColor}
              confirmColor={config.confirmColor}
              canConfirm={currentTaskReady}
              onConfirm={() => { triggerHaptic('success'); game.confirmTask(currentTask.id, game.firstUncompletedIndex) }}
              confirmLabel="演完了，盖章"
              blockedLabel="先照主持卡演一遍"
            />
          )}

          {game.state === 'running' && !game.currentEvent && (
            <p className="mb-3 text-center text-[13px] font-extrabold text-[#5C728D]">
              {config.runningNudge[encourageIndex]}
            </p>
          )}
          {game.state === 'paused' && (
            <p className="mb-3 text-center text-[13px] font-extrabold text-[#5C728D]">
              ⏸ {config.pauseMessage}
            </p>
          )}

          {game.state === 'running' && !game.currentEvent && (
            <div className="mb-4 w-full max-w-sm rounded-[28px] border-2 border-white bg-white/76 p-3 shadow-[0_8px_22px_rgba(44,67,100,0.08)]">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full px-3 py-1 text-xs font-black text-btv-dark" style={{ backgroundColor: config.accentSoft }}>
                  {surface.title}
                </span>
                <span className="text-[11px] font-extrabold text-[#5C728D]">{surface.hint}</span>
              </div>
              <div className={surface.layout === 'map' ? 'grid grid-cols-3 gap-2.5' : 'grid grid-cols-2 gap-2.5 sm:grid-cols-3'}>
                {config.actions.map((action, index) => {
                  const count = game.actionCounts[action.id] ?? 0
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleAction(action.id, action.success)}
                      aria-label={`${surface.title}：${action.label}`}
                      className={`relative flex min-h-[78px] flex-col items-center justify-center gap-0.5 p-3 font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.15),0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-150 touch-action-manipulation active:translate-y-0.5 active:scale-95 ${
                        surface.layout === 'map' ? 'rounded-[26px]' : 'rounded-2xl'
                      }`}
                      style={{ backgroundColor: action.color }}
                    >
                      {surface.layout === 'map' && (
                        <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[10px] text-white">
                          {index + 1}
                        </span>
                      )}
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
                  <p className="max-w-sm text-center text-xs font-bold text-[#5C728D]">
                    💡 {config.safeTip}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => { markPlayed(); setShowCountdown(true) }}
                  className="btn-btv btn-game-action animate-random-pulse"
                >
                  {config.startLabel}
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
        title={config.taskTitle}
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
        blockedLabel="先做完这一步"
        completionMessage={config.completionMessage}
        accentColor={config.accentColor}
        accentSoft={config.accentSoft}
        accentTint={config.accentTint}
        confirmColor={config.confirmColor}
      />

      <GameLeaderboardPanel
        title={`📒 ${config.title}家庭记录`}
        entries={game.leaderboard}
        currentRank={game.currentRank}
        accentTint={config.accentTint}
      />

      {game.state === 'paused' && !showEndConfirm && (
        <GamePauseDialog
          emoji={config.emoji}
          message={config.pauseMessage}
          onResume={game.handleResume}
          onRestart={game.handleReset}
          onEnd={() => setShowEndConfirm(true)}
          endLabel={`🛑 ${config.endLabel}`}
        />
      )}

      {showEndConfirm && (
        <GameConfirmDialog
          id={`${config.id}-end`}
          emoji={config.emoji}
          title={config.endTitle}
          message={config.endMessage}
          cancelLabel={game.state === 'paused' ? '返回暂停' : '继续玩'}
          confirmLabel={config.endLabel}
          onCancel={() => setShowEndConfirm(false)}
          onConfirm={() => { setShowEndConfirm(false); game.handleEnd() }}
        />
      )}

      {game.showResult && (
        <ScoreDialog
          config={config}
          game={game}
          title={config.resultTitle}
          subtitle={config.resultSubtitle}
        />
      )}

      {game.showVictory && (
        <ScoreDialog
          config={config}
          game={game}
          title={config.victoryTitle}
          subtitle={config.victorySubtitle}
          victory
        />
      )}

      {game.currentEvent && game.state === 'running' && (
        <RandomEventPopup
          event={game.currentEvent}
          onLand={game.handleEnd}
          endButtonLabel={config.eventEndLabel}
          confirmQuestion={config.eventConfirmQuestion}
          confirmLabel={config.eventConfirmLabel}
        />
      )}

      {showCountdown && (
        <CountdownOverlay emoji={config.emoji} onComplete={() => { setShowCountdown(false); game.handleStart() }} />
      )}
    </div>
  )
}

function getTaskRequirementHint(config: StoryPlayConfig, taskId: string): string {
  const requirement = config.taskRequirements[taskId]
  if (!requirement) return ''

  const parts = Object.entries(requirement.counts ?? {}).map(([actionId, min]) => {
    const action = config.actions.find(item => item.id === actionId)
    return `${action?.label ?? actionId} ${min} 次`
  })
  if (requirement.totalActions) parts.push(`任意动作共 ${requirement.totalActions} 次`)

  return parts.join('、')
}

function getStorySurface(id: string): { title: string; hint: string; hostLabel: string; layout: 'grid' | 'map' } {
  switch (id) {
    case 'magic-statue':
      return { title: '雕像回合控制台', hint: '看、定住、偷偷动', hostLabel: '雕像主持卡', layout: 'grid' }
    case 'hotel':
      return { title: '客房服务票', hint: '入住到送餐', hostLabel: '客房主持卡', layout: 'grid' }
    case 'spy-game':
      return { title: '秘密任务盘', hint: '线索和暗号', hostLabel: '间谍主持卡', layout: 'grid' }
    case 'shops':
      return { title: '今日订单票', hint: '开店到包装', hostLabel: '订单主持卡', layout: 'grid' }
    case 'pirates':
      return { title: '船舱路线图', hint: '船、灯塔、回港', hostLabel: '航海主持卡', layout: 'map' }
    case 'featherwand':
      return { title: '变身魔法台', hint: '挥棒、变身、换人', hostLabel: '魔法主持卡', layout: 'grid' }
    case 'grannies':
      return { title: '奶奶日常台', hint: '慢走、喝茶、跳舞', hostLabel: '奶奶主持卡', layout: 'grid' }
    default:
      return { title: '现实动作台', hint: '照着演一轮', hostLabel: '现实主持卡', layout: 'grid' }
  }
}

function ScoreDialog({
  config,
  game,
  title,
  subtitle,
  victory = false,
}: {
  config: StoryPlayConfig
  game: ReturnType<typeof useStoryPlayGame>
  title: string
  subtitle: string
  victory?: boolean
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label={`${config.title}结算`} className="fixed inset-0 z-[400] flex items-center justify-center px-4 backdrop-blur-sm animate-event-pop-in" style={{ backgroundColor: `${config.accentColor}26` }}>
      <div className={`max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white p-7 text-center shadow-2xl animate-jelly ${victory ? 'border-4' : ''}`} style={{ borderColor: victory ? config.accentColor : undefined }}>
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
        <NameInput config={config} game={game} />
        <div className="flex gap-3">
          <button type="button" onClick={game.handleReset} className="flex-1 rounded-full bg-[#F0F4FF] py-3.5 font-extrabold text-[#5C728D] transition-colors active:scale-95">跳过</button>
          <button type="button" onClick={game.handleSaveScore} className="btn-btv flex-1">{config.saveLabel}</button>
        </div>
      </div>
    </div>
  )
}

function NameInput({
  config,
  game,
}: {
  config: StoryPlayConfig
  game: ReturnType<typeof useStoryPlayGame>
}) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={game.playerName}
        onChange={event => game.setPlayerName(event.target.value)}
        placeholder={config.namePlaceholder}
        maxLength={10}
        className="w-full rounded-full border-2 border-[#E3F2FD] px-5 py-3 text-center text-lg font-extrabold text-btv-dark outline-none placeholder-[#5a5a87]/25 focus:border-btv-blue"
        onKeyDown={event => event.key === 'Enter' && game.handleSaveScore()}
      />
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {config.presetNames.map(name => (
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
