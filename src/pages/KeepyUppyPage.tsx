import { useState, useCallback, useEffect, useRef } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useRandomEvent } from '../hooks/useRandomEvent'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { keepyUppyTasks as initialTasks } from '../data/keepyUppyTasks'
import { RandomEventPopup } from '../components/RandomEventPopup'
import { Leaderboard } from '../components/Leaderboard'
import type { TaskCard, LeaderboardEntry, RandomEvent } from '../types/game'

const BALLOON_COLORS = ['#F44336', '#F58634', '#FFC107', '#4CAF50', '#1C98ED', '#AB47BC', '#EC407A']
const TASK_SCORES = [100, 200, 300, 500, 800]
const BLUEY_PHRASES = [
  'Bluey 说：别让气球碰到地板！',
  'Bingo 在给你加油呢～',
  'Bandit 爸爸觉得你能坚持更久！',
  'Chilli 妈妈一手拿锅铲也在帮你顶！',
  '记住，这可是 Bluey 最爱的红气球！',
]

interface FlyingStar {
  id: number
  x: number
  y: number
}

export function KeepyUppyPage() {
  const { state, elapsedMs, start, stop, reset, formatTime } = useTimer()
  const { getLeaderboard, addEntry, getRank } = useLeaderboard()
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks)
  const [showResult, setShowResult] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentRank, setCurrentRank] = useState<number | undefined>()
  const [balloonColor] = useState(() => BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)])
  const [showTasks, setShowTasks] = useState(true)
  const [eventStars, setEventStars] = useState(0)
  const [taskStars, setTaskStars] = useState(0)
  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([])
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null)
  const [scoreBump, setScoreBump] = useState(false)
  const [encourageIndex, setEncourageIndex] = useState(0)
  const soundEnabled = useRef(true)
  const starIdRef = useRef(0)
  const encourageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef<((event: RandomEvent) => void) | undefined>(undefined)

  // 总星星 = 时间星星 + 任务星星 + 事件星星
  const timeStars = state === 'idle' ? 0 : Math.floor(elapsedMs / 1000) * 10
  const totalStars = timeStars + taskStars + eventStars

  // 生成飞行星星动画
  const spawnStars = useCallback((count: number) => {
    const numStars = Math.min(Math.ceil(count / 50), 12)
    for (let i = 0; i < numStars; i++) {
      const id = starIdRef.current++
      const x = (Math.random() - 0.5) * 160
      const y = -(80 + Math.random() * 120)
      setTimeout(() => {
        setFlyingStars(prev => [...prev, { id, x, y }])
        setTimeout(() => {
          setFlyingStars(prev => prev.filter(s => s.id !== id))
        }, 1000)
      }, i * 60)
    }
    setScoreBump(true)
    setTimeout(() => setScoreBump(false), 400)
  }, [])

  // 事件过期回调：给额外星星
  onExpireRef.current = useCallback((event: RandomEvent) => {
    const bonus = event.duration * (20 + Math.floor(Math.random() * 21))
    setEventStars(prev => prev + bonus)
    spawnStars(bonus)
  }, [spawnStars])

  const { currentEvent, startEvents, stopEvents } = useRandomEvent({
    onEventExpire: (event: RandomEvent) => onExpireRef.current?.(event)
  })

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [getLeaderboard])

  useEffect(() => {
    if (state === 'running') {
      encourageTimerRef.current = setInterval(() => {
        setEncourageIndex(i => (i + 1) % BLUEY_PHRASES.length)
      }, 8000)
    } else {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
    return () => {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
  }, [state])

  const firstUncompletedIndex = tasks.findIndex(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed).length

  const handleStart = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setEncourageIndex(0)
    setEventStars(0)
    setTaskStars(0)
    start()
    startEvents()
  }, [start, startEvents])

  const handleLand = useCallback(() => {
    if (state !== 'running') return
    stop()
    stopEvents()
    setShowResult(true)
    const rank = getRank(totalStars)
    setCurrentRank(rank)
  }, [state, stop, stopEvents, totalStars, getRank])

  const handleSaveScore = useCallback(() => {
    const name = playerName.trim() || '神秘玩家'
    const updated = addEntry(name, elapsedMs, totalStars)
    setLeaderboard(updated)
    setShowResult(false)
    setShowVictory(false)
    setPlayerName('')
    setTaskStars(0)
    setEventStars(0)
    setTasks(initialTasks)
    reset()
  }, [playerName, elapsedMs, totalStars, addEntry, reset])

  const handleReset = useCallback(() => {
    setShowResult(false)
    setShowVictory(false)
    setPlayerName('')
    setCurrentRank(undefined)
    setTasks(initialTasks)
    setTaskStars(0)
    setEventStars(0)
    reset()
  }, [reset])

  const confirmTask = useCallback((taskId: string, index: number) => {
    if (index !== firstUncompletedIndex || animatingTaskId) return
    setAnimatingTaskId(taskId)
    const earned = TASK_SCORES[index]

    setTimeout(() => {
      const newTasks = tasks.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      )
      setTasks(newTasks)
      setAnimatingTaskId(null)
      setTaskStars(prev => prev + earned)
      spawnStars(earned)

      const allDone = newTasks.every(t => t.completed)
      if (allDone) {
        setTimeout(() => {
          stop()
          stopEvents()
          setShowVictory(true)
        }, 600)
      }
    }, 500)
  }, [firstUncompletedIndex, tasks, stop, stopEvents, animatingTaskId, spawnStars])

  const isLocked = useCallback((index: number): boolean => {
    return index > firstUncompletedIndex
  }, [firstUncompletedIndex])

  return (
    <div className="max-w-lg mx-auto">
      {/* 游戏标题 + 积分 */}
      <div className="text-center mb-6">
        <h2 className="page-title-btv mb-1">
          顶气球 <span className="text-btv-blue">Keepy Uppy!</span>
        </h2>
        <p className="text-btv-blue/40 font-bold text-xs">Bluey · 第 3 集</p>

        {/* 积分 - 星星总数 */}
        <div className="inline-flex items-center gap-2 mt-3 bg-white rounded-full px-5 py-2.5 shadow-md border-2 border-[#FFD54F] relative">
          <span className="text-2xl">⭐</span>
          <span
            className={`text-3xl font-extrabold text-yellow-500 timer-text transition-all duration-300 ${scoreBump ? 'animate-score-bump' : ''}`}
          >
            {totalStars}
          </span>
          {/* 积分明细 */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 text-[10px] font-bold text-gray-300 whitespace-nowrap">
            <span>⏱{timeStars}</span>
            <span>+</span>
            <span>🎯{taskStars}</span>
            <span>+</span>
            <span>⚡{eventStars}</span>
          </div>
        </div>
      </div>

      {/* 飞行星星 */}
      {flyingStars.map(star => (
        <div
          key={star.id}
          className="fixed z-30 pointer-events-none text-2xl font-extrabold text-yellow-500 drop-shadow-lg"
          style={{
            left: '50%',
            top: '45%',
            '--fly-x': `${star.x}px`,
            '--fly-y': `${star.y}px`,
            animation: 'star-fly-up 0.9s ease-out forwards',
          } as React.CSSProperties}
        >
          ⭐
        </div>
      ))}

      {/* 气球区域 */}
      <div className="relative flex flex-col items-center mb-6">
        <div
          className={`text-9xl select-none drop-shadow-xl ${
            state === 'running'
              ? 'animate-balloon-float'
              : state === 'finished'
                ? 'animate-balloon-wobble'
                : 'animate-balloon-float'
          }`}
          style={{ filter: `drop-shadow(0 12px 20px ${balloonColor}55)` }}
        >
          🎈
        </div>

        {/* 计时器 */}
        <div className="mt-5 bg-white rounded-3xl px-10 py-4 shadow-lg border-2 border-[#E3F2FD]">
          <span
            className={`timer-text text-5xl ${
              state === 'running'
                ? 'text-btv-orange'
                : state === 'finished'
                  ? 'text-btv-red'
                  : 'text-gray-300'
            }`}
          >
            {state === 'idle' ? '0.00' : formatTime(elapsedMs)}
          </span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-3 justify-center mb-6">
        {state === 'idle' && (
          <button onClick={handleStart} className="btn-btv text-2xl px-14 animate-pulse-glow-btv">
            🎈 像 Bluey 一样开始！
          </button>
        )}

        {state === 'running' && !currentEvent && (
          <button onClick={handleLand} className="btn-btv btn-btv-red text-xl px-10">
            💥 落地了！
          </button>
        )}

        {(state === 'finished' || state === 'paused') && (
          <button onClick={handleReset} className="btn-btv btn-btv-blue text-lg">
            🔄 重新开始
          </button>
        )}
      </div>

      {/* Bluey 加油语 */}
      {state === 'running' && !currentEvent && (
        <p className="text-center text-btv-blue/70 text-sm font-extrabold animate-pulse mb-3">
          {BLUEY_PHRASES[encourageIndex]}
        </p>
      )}
      {state === 'running' && currentEvent && (
        <p className="text-center text-btv-orange text-sm font-extrabold animate-pulse mb-3">
          ⚡ 突发状况进行中...
        </p>
      )}

      {/* 任务卡片 */}
      <div className="card-btv mb-6">
        <button
          onClick={() => setShowTasks(!showTasks)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <h3 className="text-lg font-extrabold text-btv-dark">
            🎯 今日挑战 ({completedTasks}/{tasks.length})
          </h3>
          <span className="text-gray-300 font-bold">{showTasks ? '▲' : '▼'}</span>
        </button>

        {showTasks && (
          <div className="mt-4 space-y-2.5">
            <div className="w-full h-2.5 bg-[#E3F2FD] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-btv-green rounded-full transition-all duration-500"
                style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
              />
            </div>

            {tasks.map((task, i) => {
              const locked = isLocked(i)
              const isCurrent = i === firstUncompletedIndex
              const isAnimating = animatingTaskId === task.id

              // 已完成且不在动画中 → 隐藏
              if (task.completed && !isAnimating) return null

              return (
                <div
                  key={task.id}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 border-2 overflow-hidden transition-all duration-500 ${
                    isAnimating
                      ? 'animate-task-slide-out bg-[#E8F5E9] border-[#A5D6A7]'
                      : locked
                        ? 'bg-gray-50 border-gray-100 opacity-40'
                        : isCurrent
                          ? 'bg-[#FFF8E1] border-[#FFD54F] animate-pulse-glow-btv'
                          : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <span className="text-xl shrink-0">
                    {locked ? '🔒' : ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'][i]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-extrabold truncate ${locked ? 'text-gray-300' : 'text-btv-dark'}`}>
                        {task.title}
                      </p>
                      {!locked && (
                        <span className="text-xs font-extrabold text-yellow-500 shrink-0 ml-2">
                          +{TASK_SCORES[i]}⭐
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${locked ? 'text-gray-300' : 'text-gray-400'}`}>
                      {task.description}
                    </p>
                  </div>
                  {isCurrent && state === 'running' && !isAnimating && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        confirmTask(task.id, i)
                      }}
                      className="shrink-0 w-10 h-10 rounded-full bg-btv-green text-white font-extrabold text-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-md"
                    >
                      ✓
                    </button>
                  )}
                  {isAnimating && (
                    <span className="shrink-0 text-xl">✅</span>
                  )}
                </div>
              )
            })}

            {completedTasks === tasks.length && (
              <div className="text-center py-3 text-btv-green font-extrabold text-sm">
                🎉 全部挑战完成！
              </div>
            )}
          </div>
        )}
      </div>

      {/* 排行榜 */}
      <div className="card-btv">
        <Leaderboard entries={leaderboard} currentRank={currentRank} />
      </div>

      {/* 游戏结束弹窗 - 落地 */}
      {showResult && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center">
            <div className="text-7xl mb-3">
              {totalStars > 3000 ? '🎉' : totalStars > 1000 ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-extrabold text-btv-dark mb-1">
              {totalStars > 5000 ? '太厉害了！' : totalStars > 2000 ? '真棒！' : '不错哦！'}
            </h2>
            <p className="text-sm text-gray-400 font-bold mb-3">Bandit 爸爸对你竖起大拇指 👍</p>

            <div className="inline-flex items-center gap-2 bg-[#FFF8E1] rounded-2xl px-5 py-3 mb-3">
              <span className="text-3xl">⭐</span>
              <span className="text-4xl font-extrabold text-yellow-500 timer-text">{totalStars}</span>
            </div>

            <div className="flex justify-center gap-4 text-xs font-bold text-gray-400 mb-4">
              <span>⏱ 时长 {timeStars}⭐</span>
              <span>🎯 任务 {taskStars}⭐</span>
              <span>⚡ 事件 {eventStars}⭐</span>
            </div>

            <p className="text-5xl font-extrabold text-btv-orange timer-text mb-3">
              {formatTime(elapsedMs)}
            </p>
            {currentRank && currentRank <= 3 && (
              <p className="text-base font-extrabold text-yellow-500 mb-3">
                🏆 星星排名第 {currentRank} 名！
              </p>
            )}

            <div className="mb-4">
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="留下你的名字"
                maxLength={10}
                className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#E3F2FD] focus:border-btv-blue outline-none text-btv-dark placeholder-gray-300"
                onKeyDown={e => e.key === 'Enter' && handleSaveScore()}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 bg-gray-100 text-gray-500 font-extrabold py-3.5 rounded-full hover:bg-gray-200 transition-colors">
                跳过
              </button>
              <button onClick={handleSaveScore} className="btn-btv flex-1">
                保存成绩！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通关胜利弹窗 */}
      {showVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm animate-event-pop-in px-4">
          <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border-4 border-[#FFD54F]">
            <div className="text-7xl mb-2">🏆</div>
            <h2 className="text-3xl font-extrabold text-btv-orange mb-1">Wackadoo!</h2>
            <p className="text-xl font-extrabold text-btv-dark mb-1">全关卡通关！</p>
            <p className="text-sm text-gray-400 font-bold mb-4">Bluey 和 Bingo 为你欢呼！</p>

            <div className="inline-flex items-center gap-2 bg-[#FFF8E1] rounded-2xl px-5 py-3 mb-3">
              <span className="text-3xl">⭐</span>
              <span className="text-4xl font-extrabold text-yellow-500 timer-text">{totalStars}</span>
            </div>

            <div className="flex justify-center gap-4 text-xs font-bold text-gray-400 mb-3">
              <span>⏱ {timeStars}⭐</span>
              <span>🎯 {taskStars}⭐</span>
              <span>⚡ {eventStars}⭐</span>
            </div>

            <p className="text-5xl font-extrabold text-btv-orange timer-text mb-4">
              {formatTime(elapsedMs)}
            </p>
            <p className="text-lg font-extrabold text-btv-green mb-5">
              你是真正的 Keepy Uppy 冠军！
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="留下冠军的名字"
                maxLength={10}
                className="w-full text-center text-lg font-extrabold rounded-full px-5 py-3 border-2 border-[#FFD54F] focus:border-btv-yellow outline-none text-btv-dark placeholder-gray-300"
                onKeyDown={e => e.key === 'Enter' && handleSaveScore()}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleReset} className="flex-1 bg-gray-100 text-gray-500 font-extrabold py-3.5 rounded-full hover:bg-gray-200 transition-colors">
                跳过
              </button>
              <button onClick={handleSaveScore} className="btn-btv flex-1 animate-pulse-glow-btv">
                🏆 记录辉煌！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 随机事件弹窗 */}
      {currentEvent && state === 'running' && (
        <RandomEventPopup event={currentEvent} onLand={handleLand} />
      )}

      {!soundEnabled.current && (
        <div className="text-center mt-6">
          <button className="text-sm text-btv-blue/30 font-bold underline">
            开启音效
          </button>
        </div>
      )}
    </div>
  )
}
