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
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="px-4 sm:px-0 mt-5 mb-6">
      <div className="bg-white rounded-[28px] border-2 shadow-[0_4px_20px_rgba(28,152,237,0.06)] overflow-hidden" style={{ borderColor: `${accentTint}` }}>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={show}
          className="flex min-h-14 items-center justify-between w-full px-5 py-3.5 border-b-2 cursor-pointer"
          style={{
            background: `linear-gradient(90deg, ${accentSoft}, #FFFFFF 54%, ${accentTint})`,
            borderColor: `${accentColor}33`,
          }}
        >
          <h3 className="text-sm font-extrabold text-btv-dark flex items-center gap-2">
            {title}
            <span className="text-[11px] font-bold text-[#5a5a87]/35 bg-white/70 rounded-full px-2 py-0.5">
              {completedTasks}/{tasks.length}
            </span>
          </h3>
          <span className={`text-[#5a5a87]/35 font-bold transition-transform duration-300 ${show ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {show && (
          <div className="p-4 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: accentTint }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${confirmColor}, ${accentColor})`,
                  }}
                />
              </div>
              <span className="text-[10px] font-extrabold text-[#5a5a87]/25">{progress}%</span>
            </div>

            {tasks.map((task, index) => {
              const locked = isLocked(index)
              const isCurrent = index === firstUncompletedIndex
              const isAnimating = animatingTaskId === task.id
              const ready = canConfirmTask ? canConfirmTask(task.id) : true

              if (task.completed && !isAnimating) return null

              return (
                <div
                  key={task.id}
                  className={`w-full text-left px-4 py-3 rounded-2xl flex items-start gap-3 border-2 overflow-hidden transition-all duration-500 ${
                    isAnimating ? 'animate-task-slide-out bg-[#E8F5E9] border-[#A5D6A7]'
                    : locked ? 'opacity-40'
                    : isCurrent ? 'shadow-[0_2px_12px_rgba(44,67,100,0.08)]'
                    : ''
                  }`}
                  style={{
                    backgroundColor: locked ? `${accentTint}44` : isCurrent ? accentSoft : `${accentTint}55`,
                    borderColor: locked ? 'rgba(90,90,135,0.08)' : isCurrent ? accentColor : 'rgba(90,90,135,0.08)',
                  }}
                >
                  <span className="mt-0.5 text-lg shrink-0">{locked ? '🔒' : task.emoji ?? STEP_EMOJIS[index]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {task.stageLabel && (
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-extrabold text-[#5a5a87]/42">
                          {task.stageLabel}
                        </span>
                      )}
                      {showRewards && !locked && (
                        <span className="rounded-full bg-[#FFF9EE] px-2 py-0.5 text-[10px] font-extrabold text-[#DCA018]">
                          +{taskScores[index] ?? taskScores[taskScores.length - 1]}⭐
                        </span>
                      )}
                    </div>
                    <p className={`mt-1 font-extrabold text-[13px] leading-snug ${locked ? 'text-[#5a5a87]/25' : 'text-btv-dark'}`}>
                      {task.title}
                    </p>
                    <p className={`mt-0.5 text-xs font-medium leading-relaxed ${locked ? 'text-[#5a5a87]/25' : 'text-[#5a5a87]/55'}`}>
                      {task.description}
                    </p>
                    {isCurrent && task.stageGoal && (
                      <p className="mt-1.5 text-[11px] font-extrabold leading-snug text-[#5a5a87]/42">
                        目标：{task.stageGoal}
                      </p>
                    )}
                    {isCurrent && task.safetyNote && (
                      <p className="mt-1 text-[11px] font-bold leading-snug text-[#D96B62]/65">
                        安全：{task.safetyNote}
                      </p>
                    )}
                  </div>

                  {isCurrent && state === 'running' && !isAnimating && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onConfirm(task.id, index)
                      }}
                      disabled={!ready}
                      className="mt-1 shrink-0 rounded-full font-extrabold text-sm flex items-center justify-center transition-transform min-w-[58px] h-11 px-3 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: ready ? confirmColor : '#F0F4FF',
                        color: ready ? '#FFFFFF' : 'rgba(90,90,135,0.34)',
                        boxShadow: ready ? `0 2px 8px ${confirmColor}66` : 'none',
                      }}
                    >
                      {ready ? completeLabel : blockedLabel}
                    </button>
                  )}
                  {isAnimating && <span className="mt-2 shrink-0 text-lg">✅</span>}
                </div>
              )
            })}

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
