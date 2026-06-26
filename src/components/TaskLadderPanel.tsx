import type { TaskCard, TimerState } from '../types/game'

const DEFAULT_TASK_SCORES = [100, 200, 300, 500, 800]
const STEP_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

interface TaskLadderPanelProps {
  title: string
  tasks: TaskCard[]
  completedTasks: number
  show: boolean
  onToggle: () => void
  state: TimerState
  firstUncompletedIndex: number
  animatingTaskId?: string | null
  isLocked: (index: number) => boolean
  onConfirm: (taskId: string, index: number) => void
  canConfirmTask?: (taskId: string) => boolean
  taskScores?: number[]
  completionMessage: string
  accentColor?: string
  accentSoft?: string
  accentTint?: string
  confirmColor?: string
  completeLabel?: string
  blockedLabel?: string
  showRewards?: boolean
}

export function TaskLadderPanel({
  title,
  tasks,
  completedTasks,
  show,
  onToggle,
  state,
  firstUncompletedIndex,
  animatingTaskId = null,
  isLocked,
  onConfirm,
  canConfirmTask,
  taskScores = DEFAULT_TASK_SCORES,
  completionMessage,
  accentColor = '#F9D06B',
  accentSoft = '#FFF9EE',
  accentTint = '#E3F2FD',
  confirmColor = '#90C79A',
  completeLabel = '完成',
  blockedLabel = '未好',
  showRewards = true,
}: TaskLadderPanelProps) {
  if (state === 'idle' || (state === 'running' && !show)) return null

  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
  const currentTask = tasks[firstUncompletedIndex]
  const currentReady = currentTask && canConfirmTask ? canConfirmTask(currentTask.id) : true
  const showFullProgress = state === 'paused' || state === 'finished' || completedTasks === tasks.length
  const showCompactRewards = showRewards && showFullProgress

  return (
    <div className="px-4 sm:px-0 mt-5 mb-6">
      <div className="overflow-hidden rounded-[30px] border-2 bg-white shadow-[0_8px_26px_rgba(44,67,100,0.08)]" style={{ borderColor: `${accentTint}` }}>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={show}
          className="flex min-h-14 w-full cursor-pointer items-center justify-between border-b-2 px-5 py-3.5"
          style={{
            background: `linear-gradient(90deg, ${accentSoft}, #FFFFFF 48%, ${accentTint})`,
            borderColor: `${accentColor}33`,
          }}
        >
          <h3 className="flex items-center gap-2 text-sm font-black text-btv-dark">
            <span className="rounded-full bg-white/70 px-2 py-1 shadow-sm">{title}</span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-extrabold text-[#5C728D]">
              {completedTasks}/{tasks.length}
            </span>
          </h3>
          <span className={`text-[#5C728D] font-bold transition-transform duration-300 ${show ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {show && (
          <div className="space-y-3.5 p-4">
            {showFullProgress && (
              <div className="mb-1 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: accentTint }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${confirmColor}, ${accentColor})`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-extrabold text-[#5C728D]">{progress}%</span>
              </div>
            )}

            {currentTask && !currentTask.completed && (
              <div
                className="relative overflow-hidden rounded-[26px] border-2 bg-white p-4 shadow-[0_8px_22px_rgba(44,67,100,0.08)]"
                style={{ borderColor: accentColor, background: `linear-gradient(180deg, #FFFFFF, ${accentSoft})` }}
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-35" style={{ backgroundColor: accentColor }} />
                <div className="relative">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-btv-dark px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      🎬 第 {firstUncompletedIndex + 1} 步
                    </span>
                    {currentTask.stageLabel && (
                      <span className="rounded-full bg-white/82 px-2.5 py-1 text-[10px] font-extrabold text-[#5C728D]">
                        {currentTask.stageLabel}
                      </span>
                    )}
                    {showCompactRewards && (
                      <span className="rounded-full bg-[#FFF9EE] px-2.5 py-1 text-[10px] font-extrabold text-[#DCA018]">
                        +{taskScores[firstUncompletedIndex] ?? taskScores[taskScores.length - 1]}⭐
                      </span>
                    )}
                  </div>

                  {currentTask.hostPrompt && (
                    <div className="mb-3 rounded-[22px] bg-btv-dark px-4 py-3 text-white shadow-[0_4px_0_rgba(44,67,100,0.12)]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">对孩子说</p>
                      <p className="mt-1 text-base font-black leading-snug">“{currentTask.hostPrompt}”</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-[0_3px_0_rgba(44,67,100,0.10)]">
                      {currentTask.emoji ?? STEP_EMOJIS[firstUncompletedIndex]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-black leading-snug text-btv-dark">{currentTask.title}</p>
                      <p className="mt-1 text-[13px] font-bold leading-relaxed text-[#5C728D]">{currentTask.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {currentTask.stageGoal && (
                      <p className="rounded-2xl bg-white/70 px-3 py-2 text-[12px] font-extrabold leading-snug text-[#5C728D]">
                        🎯 {currentTask.stageGoal}
                      </p>
                    )}
                    {currentTask.safetyNote && (
                      <p className="rounded-2xl bg-[#FFF3E0] px-3 py-2 text-[12px] font-extrabold leading-snug text-[#B5453C]">
                        🛟 {currentTask.safetyNote}
                      </p>
                    )}
                  </div>

                  {state === 'running' && (
                    <button
                      type="button"
                      onClick={() => onConfirm(currentTask.id, firstUncompletedIndex)}
                      disabled={!currentReady}
                      className="btn-task-confirm mt-3 w-full rounded-full px-4 py-3 text-sm font-black text-white transition-transform active:scale-95 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: currentReady ? confirmColor : '#F0F4FF',
                        color: currentReady ? '#FFFFFF' : 'rgba(90,90,135,0.42)',
                        boxShadow: currentReady ? `0 4px 12px ${confirmColor}66` : 'none',
                      }}
                    >
                      {currentReady ? `✅ ${completeLabel}，盖章！` : blockedLabel}
                    </button>
                  )}
                </div>
              </div>
            )}

            {showFullProgress && (
            <div className="rounded-[24px] border border-[#E3F2FD] bg-[#FDFBF7] p-2.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">本局印章回放</p>
                <p className="text-[11px] font-extrabold text-[#5C728D]">已经演过的步骤</p>
              </div>

              <div className="space-y-2">
                {tasks.map((task, index) => {
              const locked = isLocked(index)
              const isCurrent = index === firstUncompletedIndex
              const isAnimating = animatingTaskId === task.id

              return (
                <div
                  key={task.id}
                      className={`relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border-2 px-3 py-3 text-left transition-all duration-500 ${
                    isAnimating ? 'animate-task-slide-out bg-[#E8F5E9] border-[#A5D6A7]'
                        : task.completed ? 'border-[#90C79A]/35 bg-[#E8F5E9]/70'
                        : locked ? 'border-[#E3F2FD] bg-white/70'
                        : isCurrent ? 'shadow-[0_2px_12px_rgba(44,67,100,0.08)]'
                    : ''
                  }`}
                  style={{
                        backgroundColor: task.completed ? undefined : locked ? '#FFFFFF' : isCurrent ? accentSoft : `${accentTint}55`,
                        borderColor: task.completed ? undefined : locked ? 'rgba(187,222,251,0.9)' : isCurrent ? accentColor : 'rgba(90,90,135,0.08)',
                  }}
                >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                        {task.completed ? '✅' : locked ? '🔒' : task.emoji ?? STEP_EMOJIS[index]}
                      </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {task.stageLabel && (
                            <span className="rounded-full bg-white/76 px-2 py-0.5 text-[10px] font-extrabold text-[#5C728D]">
                          {task.stageLabel}
                        </span>
                      )}
                          {task.completed && (
                            <span className="rotate-[-2deg] rounded-full border border-[#90C79A]/40 bg-white px-2 py-0.5 text-[10px] font-black text-[#4CAF50]">
                              已盖章
                            </span>
                          )}
                          {isCurrent && !task.completed && (
                            <span className="rounded-full bg-btv-dark px-2 py-0.5 text-[10px] font-black text-white">
                              正在上演
                            </span>
                          )}
                          {showRewards && !locked && !task.completed && (
                        <span className="rounded-full bg-[#FFF9EE] px-2 py-0.5 text-[10px] font-extrabold text-[#DCA018]">
                          +{taskScores[index] ?? taskScores[taskScores.length - 1]}⭐
                        </span>
                      )}
                    </div>
                        <p className={`mt-1 text-[13px] font-black leading-snug ${locked ? 'text-[#5C728D]' : 'text-btv-dark'}`}>
                      {task.title}
                    </p>
                        {!locked && (
                          <p className="mt-0.5 text-xs font-bold leading-relaxed text-[#5C728D]">
                            {task.description}
                          </p>
                        )}
                  </div>

                  {isAnimating && <span className="mt-2 shrink-0 text-lg">✅</span>}
                </div>
              )
                })}
              </div>
            </div>
            )}

            {completedTasks === tasks.length && tasks.length > 0 && (
              <div className="text-center py-3 rounded-2xl" style={{ backgroundColor: `${confirmColor}22` }}>
                <p className="text-sm font-extrabold text-btv-green">{completionMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
