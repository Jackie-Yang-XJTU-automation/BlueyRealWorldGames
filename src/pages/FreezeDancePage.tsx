import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { CurrentHostCard } from '../components/CurrentHostCard'
import {
  FREEZE_DANCE_PHRASES,
  FREEZE_DANCE_ROLES,
  FREEZE_DANCE_SAFETY,
  FREEZE_DANCE_START_PROMPT,
} from '../data/freezeDanceMoves'
import { useFreezeDance, type FreezeDanceLogItem } from '../hooks/useFreezeDance'
import { triggerHaptic } from '../utils/haptic'

const STORAGE_KEY_PLAYED = 'freeze-dance_played'

function LogChips({ items }: { items: FreezeDanceLogItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map(item => (
        <span
          key={item.id}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-black ${
            item.result === 'froze'
              ? 'bg-[#E8F5E9] text-[#4CAF50]'
              : 'bg-[#FFF3E0] text-[#F58634]'
          }`}
        >
          <span>{item.result === 'froze' ? '🧊' : '💫'}</span>
          <span>{item.emoji} {item.label}</span>
        </span>
      ))}
    </div>
  )
}

export function FreezeDancePage() {
  const navigate = useNavigate()
  const game = useFreezeDance()
  const [showCountdown, setShowCountdown] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showHudHelp, setShowHudHelp] = useState(false)
  const [encourageIndex, setEncourageIndex] = useState(0)
  const [hasPlayedBefore] = useState(() => localStorage.getItem(STORAGE_KEY_PLAYED) === 'true')
  const encourageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const markPlayed = () => {
    if (!hasPlayedBefore) localStorage.setItem(STORAGE_KEY_PLAYED, 'true')
  }

  useEffect(() => {
    if (game.state === 'running') {
      encourageTimerRef.current = setInterval(() => {
        setEncourageIndex(index => (index + 1) % FREEZE_DANCE_PHRASES.length)
      }, 8000)
    } else if (encourageTimerRef.current) {
      clearInterval(encourageTimerRef.current)
    }
    return () => {
      if (encourageTimerRef.current) clearInterval(encourageTimerRef.current)
    }
  }, [game.state])

  const handleStartTap = () => {
    triggerHaptic('tap')
    markPlayed()
    setShowCountdown(true)
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    game.handleStart()
  }

  const handleFroze = () => {
    triggerHaptic('success')
    game.handleFroze()
  }

  const handleWobbled = () => {
    triggerHaptic('tap')
    game.handleWobbled()
  }

  const handleRestart = () => {
    triggerHaptic('tap')
    game.handleReset()
    setShowCountdown(true)
  }

  const handleConfirmEnd = () => {
    triggerHaptic('finish')
    game.handleEnd()
    setShowEndConfirm(false)
  }

  const hasStarted = game.state !== 'idle'
  const isFinished = game.state === 'finished'
  const isDancing = game.state === 'running' && game.phase === 'dancing'
  const isFrozen = game.state === 'running' && game.phase === 'frozen'

  return (
    <div className="mx-auto -mx-4 max-w-lg sm:mx-auto">
      <div className="relative -mt-8 min-h-[calc(100dvh-3.5rem)] overflow-hidden rounded-b-[40px] bg-gradient-to-b from-[#F3E5F5] via-[#E3F2FD] to-white shadow-[inset_0_-10px_30px_rgba(171,71,188,0.08)]">
        <GameTopHud
          scoreItems={hasStarted ? [{ emoji: '🧊', value: game.freezeCount, color: '#4CAF50', label: '定住次数' }] : []}
          breakdownItems={hasStarted ? [
            { emoji: '💫', value: game.wobbleCount },
            { emoji: '🎯', value: game.accuracy },
          ] : undefined}
          helpTitle="怎么玩？"
          helpItems={[
            '🎵 跟着主题跳，听到提示音就定住',
            '🧊 全员定住成功就 +1 次',
            '💫 有人动了也没关系，换姿势再来',
            ...FREEZE_DANCE_SAFETY.map(tip => `🛟 ${tip}`),
          ]}
          showHelp={showHudHelp}
          onToggleHelp={() => setShowHudHelp(!showHudHelp)}
          onBack={() => navigate('/game/freeze-dance')}
          showPause={game.state === 'running'}
          onPause={() => { triggerHaptic('tap'); game.handlePause() }}
          showEnd={game.state === 'running'}
          onEnd={() => setShowEndConfirm(true)}
          mode="host"
          hostLabel={hasStarted ? '音乐定格舞' : '准备跳舞'}
        />

        <div className="relative flex flex-col items-center px-4 pb-8">
          {game.state === 'idle' && (
            <section className="relative w-full max-w-sm rounded-[34px] border-4 border-white bg-white/90 p-5 text-center shadow-[0_16px_42px_rgba(44,67,100,0.14)]">
              <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-[30px] bg-[#F3E5F5] text-6xl shadow-inner animate-balloon-float">
                🕺
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">现实玩法 · 红绿灯木头人</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-btv-dark">音乐定格舞</h1>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {FREEZE_DANCE_ROLES.map(card => (
                  <div key={card.title} className="rounded-[22px] bg-[#F3E5F5]/72 px-2 py-3">
                    <div className="text-2xl leading-none">{card.emoji}</div>
                    <p className="mt-1 text-[12px] font-black leading-tight text-btv-dark">{card.title}</p>
                    <p className="mt-0.5 text-[10px] font-black leading-tight text-[#5C728D]">{card.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-[24px] bg-[#FFF8E1]/86 px-4 py-3 text-left">
                <p className="text-lg font-black leading-snug text-btv-dark">“音乐停，就变木头人！”</p>
                <p className="mt-1 text-sm font-black leading-snug text-[#5C728D]">{FREEZE_DANCE_START_PROMPT}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                {FREEZE_DANCE_SAFETY.map(tip => (
                  <span key={tip} className="flex min-h-[44px] items-center justify-center rounded-2xl bg-[#4CAF50]/10 px-3 text-center text-[12px] font-black leading-snug text-[#4CAF50]">
                    🛟 {tip}
                  </span>
                ))}
              </div>

              {!hasPlayedBefore && (
                <p className="mt-4 text-center text-xs font-bold text-[#5C728D]">
                  💡 不用任何道具，清出一块空地就能开始。
                </p>
              )}

              <button
                type="button"
                onClick={handleStartTap}
                className="mt-5 min-h-14 w-full rounded-full bg-btv-dark px-5 text-lg font-black text-white shadow-[0_5px_0_rgba(57,57,90,0.22)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-[0.99] animate-random-pulse"
              >
                🎵 开始跳舞
              </button>
            </section>
          )}

          {hasStarted && !isFinished && (
            <div className="relative flex w-full max-w-sm flex-col items-center gap-3">
              {/* 状态条 */}
              <div className="w-full rounded-[24px] border-2 border-white bg-white/84 p-3 shadow-[0_8px_22px_rgba(44,67,100,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#5C728D] shadow-sm">
                    ⏱ {game.formatTime(game.elapsedMs)}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">
                    第 {game.round} 轮
                  </span>
                  <span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[11px] font-black text-[#4CAF50]">
                    🧊 {game.freezeCount} 次
                  </span>
                </div>
              </div>

              {/* 跳舞阶段 */}
              {isDancing && game.state === 'running' && (
                <>
                  <CurrentHostCard
                    label="领舞主持卡"
                    stepLabel={`第 ${game.round} 轮`}
                    prompt={`现在跳：${game.currentMove.emoji} ${game.currentMove.label}`}
                    detail={game.currentMove.hint}
                    safetyNote="只在原地跳，注意脚下别撞家具。"
                    actionHint="听到“嘟嘟”提示音就马上定住！"
                    accentSoft="#F3E5F5"
                    accentColor="#AB47BC"
                  />
                  <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-[30px] border-4 border-[#E1BEE7] bg-gradient-to-b from-[#F3E5F5] to-[#FFF3E0]">
                    <span aria-hidden="true" className="text-8xl animate-balloon-float">{game.currentMove.emoji}</span>
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-4 py-1.5 text-sm font-black text-[#AB47BC] shadow-sm">
                      🎵 跳起来！
                    </span>
                  </div>
                  {/* 家长当 DJ：随时喊停；不按也会自动停 */}
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('event'); game.handleStopMusic() }}
                    className="min-h-14 w-full rounded-full bg-[#AB47BC] px-5 text-lg font-black text-white shadow-[0_5px_0_rgba(123,31,162,0.3)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-[0.99]"
                  >
                    🔇 喊停！大家定住
                  </button>
                  <p className="text-center text-[12px] font-extrabold text-[#5C728D]">
                    家长当 DJ：随时按喊停；不按也会自动停。
                  </p>
                  <p className="text-center text-[13px] font-extrabold text-[#5C728D]">
                    {FREEZE_DANCE_PHRASES[encourageIndex]}
                  </p>
                </>
              )}

              {/* 定格阶段 */}
              {isFrozen && game.currentPose && (
                <section className="w-full rounded-[32px] border-4 border-[#A5D6A7] bg-[#F1F8F2] p-4 text-center shadow-[0_16px_38px_rgba(44,67,100,0.13)]">
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#4CAF50]">🛑 音乐停！</p>
                  <div aria-hidden="true" className="mx-auto my-3 flex h-28 w-28 items-center justify-center rounded-[30px] bg-white text-7xl shadow-inner">
                    {game.currentPose.emoji}
                  </div>
                  <h2 className="text-2xl font-black leading-tight text-btv-dark">定成：{game.currentPose.label}</h2>
                  <p className="mt-1 text-sm font-black text-[#5C728D]">{game.currentPose.hint}</p>
                  {game.currentPose.safetyNote && (
                    <p className="mt-2 rounded-2xl bg-[#FFF3E0] px-3 py-2 text-[12px] font-black text-[#B5453C]">
                      🛟 {game.currentPose.safetyNote}
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleFroze}
                      className="min-h-[58px] rounded-2xl bg-[#4CAF50] text-base font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-95"
                    >
                      🧊 都定住了
                    </button>
                    <button
                      type="button"
                      onClick={handleWobbled}
                      className="min-h-[58px] rounded-2xl bg-[#F58634] text-base font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-95"
                    >
                      💫 有人动了
                    </button>
                  </div>
                  <p className="mt-3 text-[12px] font-black text-[#5C728D]">家长当裁判，点一个就进入下一轮。</p>
                </section>
              )}
            </div>
          )}

          {isFinished && (
            <section className="w-full max-w-sm rounded-[34px] border-4 border-white bg-white/90 p-5 text-center shadow-[0_16px_42px_rgba(44,67,100,0.14)]">
              <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#F3E5F5] text-5xl shadow-inner">
                🕺
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">{game.title}</p>
              <h2 className="mt-1 text-2xl font-black text-btv-dark">这一局跳完啦</h2>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-[#E8F5E9] px-2 py-3">
                  <p className="text-2xl font-black text-[#4CAF50]">{game.freezeCount}</p>
                  <p className="text-[10px] font-black text-[#5C728D]">成功定住</p>
                </div>
                <div className="rounded-2xl bg-[#FFF3E0] px-2 py-3">
                  <p className="text-2xl font-black text-[#F58634]">{game.totalRounds}</p>
                  <p className="text-[10px] font-black text-[#5C728D]">总回合</p>
                </div>
                <div className="rounded-2xl bg-[#E3F2FD] px-2 py-3">
                  <p className="text-2xl font-black text-[#1C98ED]">{game.accuracy}%</p>
                  <p className="text-[10px] font-black text-[#5C728D]">定住率</p>
                </div>
              </div>

              {game.log.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[#5C728D]">这一局玩过的姿势</p>
                  <LogChips items={game.log} />
                </div>
              )}

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="min-h-14 rounded-full bg-btv-dark px-5 py-3 text-base font-black text-white transition-transform touch-manipulation active:scale-[0.99]"
                >
                  🔄 再跳一局
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/game/freeze-dance')}
                  className="min-h-12 rounded-full bg-[#5a5a87]/10 px-5 py-3 text-sm font-black text-[#5a5a87] transition-transform touch-manipulation active:scale-[0.99]"
                >
                  回到游戏详情
                </button>
              </div>
            </section>
          )}
        </div>

        {showCountdown && <CountdownOverlay emoji="🕺" onComplete={handleCountdownComplete} />}

        {game.state === 'paused' && !showEndConfirm && (
          <GamePauseDialog
            emoji="🕺"
            title="音乐先暂停一下"
            message="大家原地休息，准备好了再继续跳。"
            onResume={() => { triggerHaptic('tap'); game.handleResume() }}
            onRestart={handleRestart}
            onEnd={() => setShowEndConfirm(true)}
            endLabel="🛑 结束跳舞"
          />
        )}

        {showEndConfirm && (
          <GameConfirmDialog
            id="freeze-dance-end"
            emoji="🕺"
            title="确定结束这一局吗？"
            message="已经定住的次数会留在这一局的记录里，还想跳可以继续。"
            cancelLabel="继续跳"
            confirmLabel="现在结束"
            onCancel={() => setShowEndConfirm(false)}
            onConfirm={handleConfirmEnd}
          />
        )}
      </div>
    </div>
  )
}
