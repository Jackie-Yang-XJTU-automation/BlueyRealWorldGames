import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CountdownOverlay } from '../components/CountdownOverlay'
import { GameConfirmDialog, GamePauseDialog, GameTopHud } from '../components/PlayableGameChrome'
import { CurrentHostCard } from '../components/CurrentHostCard'
import {
  TAXI_OPENING_ACTIONS,
  TAXI_SAFETY_TIPS,
  TAXI_START_PROMPT,
  type TaxiActionChip,
  type TaxiDriverMove,
  type TaxiPanel,
  type TaxiRound,
} from '../data/taxiGame'
import { useTaxiGame, type TaxiRideLogItem } from '../hooks/useTaxiGame'
import { triggerHaptic } from '../utils/haptic'

const PANEL_META: Record<TaxiPanel, { label: string; bg: string; text: string; border: string; road: string }> = {
  traffic: {
    label: '路口',
    bg: 'bg-[#E3F2FD]',
    text: 'text-[#1C98ED]',
    border: 'border-[#BBDEFB]',
    road: 'from-[#546E7A] to-[#37474F]',
  },
  road: {
    label: '道路',
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#4CAF50]',
    border: 'border-[#C8E6C9]',
    road: 'from-[#607D8B] to-[#455A64]',
  },
  turn: {
    label: '转弯',
    bg: 'bg-[#FFF3E0]',
    text: 'text-[#F58634]',
    border: 'border-[#FFD29A]',
    road: 'from-[#6D5B4B] to-[#4E4038]',
  },
  nav: {
    label: '导航',
    bg: 'bg-[#F3E5F5]',
    text: 'text-[#8E5AA9]',
    border: 'border-[#E1BEE7]',
    road: 'from-[#5E6D88] to-[#42516C]',
  },
  passenger: {
    label: '乘客',
    bg: 'bg-[#FFF8E1]',
    text: 'text-[#DCA018]',
    border: 'border-[#FFE082]',
    road: 'from-[#5F6F52] to-[#43513A]',
  },
  repair: {
    label: '修车',
    bg: 'bg-[#FCE4EC]',
    text: 'text-[#D96B62]',
    border: 'border-[#F8BBD0]',
    road: 'from-[#6F5A6D] to-[#514151]',
  },
  arrival: {
    label: '到站',
    bg: 'bg-[#E3F2FD]',
    text: 'text-[#1C98ED]',
    border: 'border-[#BBDEFB]',
    road: 'from-[#546E7A] to-[#37474F]',
  },
}

const REACTION_LABELS = ['坐稳了', '开始晃', '帽子飞', '全车忙', '还想坐']
const TAXI_ROLE_CARDS = [
  { emoji: '🧒', title: '孩子司机', detail: '拿方向盘' },
  { emoji: '🧑', title: '家长乘客', detail: '抱紧行李' },
  { emoji: '📱', title: 'App 路况', detail: '负责捣乱' },
]

function speakTaxi(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    return false
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 1.08
  utterance.pitch = 1.08
  window.speechSynthesis.speak(utterance)
  return true
}

function scrollGameToTop() {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  })
}

function ActionChips({ items }: { items: TaxiActionChip[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map(item => (
        <span
          key={`${item.emoji}-${item.label}`}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-white bg-white/82 px-3 text-[12px] font-black text-[#5C728D] shadow-sm"
        >
          <span className="text-base">{item.emoji}</span>
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  )
}

function TaxiSceneCard({ round }: { round: TaxiRound }) {
  const meta = PANEL_META[round.panel]

  return (
    <div className={`relative h-48 w-full overflow-hidden rounded-[30px] border-4 ${meta.border} ${meta.bg} shadow-[inset_0_-12px_22px_rgba(255,255,255,0.45)]`}>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3">
        <span className={`rounded-full bg-white/82 px-3 py-1 text-[11px] font-black ${meta.text}`}>{meta.label}</span>
        <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-black text-[#5C728D]">{round.title}</span>
      </div>

      <div className="absolute left-1/2 top-[45%] z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[34px] bg-white/78 text-6xl shadow-[0_12px_24px_rgba(44,67,100,0.13)]">
        {round.emoji}
      </div>

      <div className={`absolute -bottom-7 left-1/2 h-24 w-[125%] -translate-x-1/2 rounded-t-[48%] bg-gradient-to-b ${meta.road}`} />
      <div className="absolute bottom-8 left-1/2 h-2 w-[82%] -translate-x-1/2 rounded-full bg-white/82" />
      <div className="absolute bottom-8 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-[#FFC107]" />
      <div className="absolute bottom-8 left-[26%] h-2 w-10 -translate-x-1/2 rounded-full bg-[#FFC107]" />
      <div className="absolute bottom-8 left-[74%] h-2 w-10 -translate-x-1/2 rounded-full bg-[#FFC107]" />

      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#FFC107] px-4 py-1.5 text-sm font-black text-[#5a5a87] shadow-sm">
        <span>🚕</span>
        <span>出租车</span>
      </div>
    </div>
  )
}

function VoiceButton({
  label = '播报',
  onSpeak,
}: {
  label?: string
  onSpeak: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSpeak}
      aria-label={label}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#5a5a87] px-4 text-sm font-black text-white shadow-[0_4px_0_rgba(57,57,90,0.18)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-[0.99]"
    >
      <span>🔊</span>
      <span>{label}</span>
    </button>
  )
}

function TaxiStatusStrip({
  current,
  total,
  reactionLevel,
  progressPercent,
  timeLabel,
  voiceStatus,
}: {
  current: number
  total: number
  reactionLevel: number
  progressPercent: number
  timeLabel: string
  voiceStatus: string
}) {
  return (
    <div className="w-full max-w-sm rounded-[24px] border-2 border-white bg-white/84 p-3 shadow-[0_8px_22px_rgba(44,67,100,0.08)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#5C728D] shadow-sm">
          ⏱ {timeLabel}
        </span>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">
          路况 {current}/{total}
        </span>
      </div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className="truncate rounded-full bg-white/72 px-2.5 py-1 text-[11px] font-black text-[#5C728D] shadow-sm">
          🔊 {voiceStatus}
        </span>
        <span className="rounded-full bg-[#FFF3E0] px-2.5 py-1 text-[11px] font-black text-[#F58634]">
          乘客：{REACTION_LABELS[reactionLevel - 1]}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#E3F2FD]/80">
        <div
          className="h-full rounded-full bg-[#F58634] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-1" aria-label={`乘客摇晃程度 ${reactionLevel} 格`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full ${index < reactionLevel ? 'bg-[#F58634]' : 'bg-[#E3F2FD]'}`}
          />
        ))}
      </div>
    </div>
  )
}

function TaxiRoundPanel({
  round,
  onChoose,
  onSpeak,
}: {
  round: TaxiRound
  onChoose: (move: TaxiDriverMove) => void
  onSpeak: () => void
}) {
  const meta = PANEL_META[round.panel]

  return (
    <section className="w-full max-w-sm text-center">
      <CurrentHostCard
        label="出租车主持卡"
        stepLabel={round.title}
        prompt={round.speakText}
        detail={round.driverPrompt}
        safetyNote={round.safetyNote}
        accentSoft="#FFF3E0"
        accentColor="#F58634"
      />

      <TaxiSceneCard round={round} />

      <div className="mt-4 flex flex-col items-center gap-3">
        <VoiceButton onSpeak={onSpeak} />
      </div>

      <div className="mt-4 rounded-[24px] bg-[#E3F2FD]/55 px-3 py-3">
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[#5C728D]">路况回合盘</p>
        <ActionChips items={round.parentMoves} />
      </div>

      <div className="mt-3 grid gap-2">
        {round.driverMoves.map(move => (
          <button
            key={move.id}
            type="button"
            onClick={() => onChoose(move)}
            className="flex min-h-[62px] items-center gap-3 rounded-[22px] border-2 border-[#E3F2FD] bg-white px-3 py-2 text-left shadow-[0_4px_0_rgba(90,90,135,0.07)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-[0.99]"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] ${meta.bg} text-2xl`}>
              {move.emoji}
            </span>
            <span className="block min-w-0 text-lg font-black leading-tight text-btv-dark">{move.label}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 rounded-2xl bg-[#4CAF50]/10 px-3 py-2 text-[12px] font-black leading-relaxed text-[#4CAF50]">
        {round.safetyNote}
      </p>
    </section>
  )
}

function TaxiResultPanel({
  round,
  move,
  isLastRound,
  onContinue,
  onSpeak,
}: {
  round: TaxiRound
  move: TaxiDriverMove
  isLastRound: boolean
  onContinue: () => void
  onSpeak: () => void
}) {
  return (
    <section aria-live="polite" className="w-full max-w-sm rounded-[32px] border-4 border-[#FFD29A] bg-[#FFFDF7] p-4 text-center shadow-[0_16px_38px_rgba(44,67,100,0.13)]">
      <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-[30px] bg-[#FFF3E0] text-5xl shadow-inner">
        {move.emoji}
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">{round.title}</p>
      <h2 className="mt-1 text-2xl font-black leading-tight text-btv-dark">{move.result}</h2>

      <div className="mt-4 rounded-[24px] bg-[#E3F2FD]/55 px-3 py-3">
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-[#5C728D]">刚才这样演</p>
        <ActionChips items={round.parentMoves} />
      </div>

      <div className="mt-4 flex justify-center">
        <VoiceButton label="再播一次" onSpeak={onSpeak} />
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-4 min-h-14 w-full rounded-full bg-btv-dark px-5 text-base font-black text-white shadow-[0_4px_0_rgba(57,57,90,0.2)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-[0.99]"
      >
        {isLastRound ? '🏁 到站收车' : '➡️ 下一路况'}
      </button>
    </section>
  )
}

function RideLogChips({ items }: { items: TaxiRideLogItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map(item => (
        <span key={item.id} className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-3 py-1.5 text-[12px] font-black text-[#F58634]">
          <span>{item.emoji}</span>
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  )
}

export function TaxiPage() {
  const navigate = useNavigate()
  const game = useTaxiGame()
  const [showCountdown, setShowCountdown] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showHudHelp, setShowHudHelp] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('点喇叭可播报')

  const handleSpeak = (text: string) => {
    triggerHaptic('tap')
    const didSpeak = speakTaxi(text)
    setVoiceStatus(didSpeak ? '已播报这一句' : '本机不支持语音，直接念大字')
  }

  const handleStartTap = () => {
    triggerHaptic('tap')
    setShowCountdown(true)
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setVoiceStatus('点喇叭可播报')
    game.handleStart()
    scrollGameToTop()
  }

  const handleChoose = (move: TaxiDriverMove) => {
    triggerHaptic('event')
    game.handleChoose(move)
    scrollGameToTop()
  }

  const handleContinue = () => {
    triggerHaptic(game.isLastRound ? 'finish' : 'success')
    setVoiceStatus('点喇叭可播报')
    game.handleContinue()
    scrollGameToTop()
  }

  const handlePause = () => {
    triggerHaptic('tap')
    game.handlePause()
  }

  const handleResume = () => {
    triggerHaptic('tap')
    game.handleResume()
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
  const finishText = game.rideLog.length > 0
    ? `这趟车遇到 ${game.rideLog.map(item => item.label).join('、')}。`
    : '这趟车还没遇到路况。'

  return (
    <div className="mx-auto -mx-4 max-w-lg sm:mx-auto">
      <div className="relative -mt-8 min-h-[calc(100dvh-3.5rem)] overflow-hidden rounded-b-[40px] bg-gradient-to-b from-[#CDEEFF] via-[#FFF8E1] to-white shadow-[inset_0_-10px_30px_rgba(28,152,237,0.08)]">
        <GameTopHud
          scoreItems={[]}
          helpTitle="安全提示"
          helpItems={TAXI_SAFETY_TIPS}
          showHelp={showHudHelp}
          onToggleHelp={() => setShowHudHelp(!showHudHelp)}
          onBack={() => navigate('/game/taxi')}
          showPause={game.state === 'running'}
          onPause={handlePause}
          showEnd={game.state === 'running'}
          onEnd={() => setShowEndConfirm(true)}
          mode="host"
          hostLabel={hasStarted ? '出租车乘客模拟' : '司机准备'}
        />

        <div className="relative flex flex-col items-center px-4 pb-8">
          {game.state === 'idle' && (
            <section className="relative w-full max-w-sm rounded-[34px] border-4 border-white bg-white/90 p-5 text-center shadow-[0_16px_42px_rgba(44,67,100,0.14)]">
              <TaxiSceneCard
                round={{
                  id: 'opening',
                  panel: 'traffic',
                  emoji: '🚕',
                  title: '开车前',
                  callout: '出租车乘客模拟',
                  speakText: TAXI_START_PROMPT,
                  parentMoves: TAXI_OPENING_ACTIONS,
                  driverPrompt: '',
                  safetyNote: '',
                  driverMoves: [],
                }}
              />

              <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-[#5C728D]">出租车回合 · 家长报路况</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-btv-dark">出租车乘客模拟</h1>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {TAXI_ROLE_CARDS.map(card => (
                  <div key={card.title} className="rounded-[22px] bg-[#E3F2FD]/72 px-2 py-3">
                    <div className="text-2xl leading-none">{card.emoji}</div>
                    <p className="mt-1 text-[12px] font-black leading-tight text-btv-dark">{card.title}</p>
                    <p className="mt-0.5 text-[10px] font-black leading-tight text-[#5C728D]">{card.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-[24px] bg-[#FFF8E1]/86 px-4 py-3 text-left">
                <p className="text-lg font-black leading-snug text-btv-dark">“手机报路况，大家马上演！”</p>
                <p className="mt-1 text-sm font-black leading-snug text-[#5C728D]">红灯停，减速带颠，急转弯一起歪。</p>
              </div>

              <div className="mt-4">
                <ActionChips items={TAXI_OPENING_ACTIONS} />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <VoiceButton label="播开场" onSpeak={() => handleSpeak(TAXI_START_PROMPT)} />
                <span className="rounded-full bg-[#5a5a87]/8 px-3 py-2 text-[11px] font-black text-[#5C728D]">
                  {voiceStatus}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {TAXI_SAFETY_TIPS.map(tip => (
                  <span key={tip} className="flex min-h-[54px] items-center justify-center rounded-2xl bg-[#4CAF50]/10 px-2 text-center text-[11px] font-black leading-snug text-[#4CAF50]">
                    {tip}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handleStartTap}
                className="mt-5 min-h-14 w-full rounded-full bg-btv-dark px-5 text-lg font-black text-white shadow-[0_5px_0_rgba(57,57,90,0.22)] transition-transform touch-manipulation active:translate-y-0.5 active:scale-[0.99] animate-random-pulse"
              >
                🚕 开车出发
              </button>
            </section>
          )}

          {hasStarted && (
            <div className="relative flex w-full flex-col items-center gap-3">
              {!isFinished && (
                <TaxiStatusStrip
                  current={game.roundIndex + 1}
                  total={game.totalRounds}
                  reactionLevel={game.passengerReactionLevel}
                  progressPercent={game.progressPercent}
                  timeLabel={game.formatTime(game.elapsedMs)}
                  voiceStatus={voiceStatus}
                />
              )}

              {game.state === 'running' && !game.selectedMove && (
                <TaxiRoundPanel
                  round={game.currentRound}
                  onChoose={handleChoose}
                  onSpeak={() => handleSpeak(game.currentRound.speakText)}
                />
              )}

              {game.state === 'running' && game.selectedMove && (
                <TaxiResultPanel
                  round={game.currentRound}
                  move={game.selectedMove}
                  isLastRound={game.isLastRound}
                  onContinue={handleContinue}
                  onSpeak={() => handleSpeak(game.selectedMove?.result ?? game.currentRound.speakText)}
                />
              )}

              {isFinished && (
                <section className="w-full max-w-sm rounded-[34px] border-4 border-white bg-white/90 p-5 text-center shadow-[0_16px_42px_rgba(44,67,100,0.14)]">
                  <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#FFF3E0] text-5xl shadow-inner">
                    {game.endReason === 'completed' ? '🏁' : '🚕'}
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#5C728D]">
                    {game.driverTitle}
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-btv-dark">
                    {game.endReason === 'completed' ? '乘客还想再坐' : '出租车先靠站'}
                  </h2>
                  <p className="mt-3 rounded-[24px] bg-[#E3F2FD]/68 px-4 py-3 text-left text-base font-black leading-relaxed text-[#5C728D]">
                    {finishText}
                  </p>

                  {game.rideLog.length > 0 && (
                    <div className="mt-4">
                      <RideLogChips items={game.rideLog} />
                    </div>
                  )}

                  <div className="mt-5 grid gap-2">
                    <button
                      type="button"
                      onClick={handleStartTap}
                      className="min-h-14 rounded-full bg-btv-dark px-5 py-3 text-base font-black text-white transition-transform touch-manipulation active:scale-[0.99]"
                    >
                      🔄 再开一局
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/game/taxi')}
                      className="min-h-12 rounded-full bg-[#5a5a87]/10 px-5 py-3 text-sm font-black text-[#5a5a87] transition-transform touch-manipulation active:scale-[0.99]"
                    >
                      回到游戏详情
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {showCountdown && <CountdownOverlay emoji="🚕" onComplete={handleCountdownComplete} />}

        {game.state === 'paused' && !showEndConfirm && (
          <GamePauseDialog
            emoji="🚕"
            title="出租车靠边停一下"
            message="乘客整理行李，司机等一下再开。"
            onResume={handleResume}
            onRestart={handleRestart}
            onEnd={() => setShowEndConfirm(true)}
            endLabel="🛑 收车"
          />
        )}

        {showEndConfirm && (
          <GameConfirmDialog
            id="taxi-end"
            emoji="🚕"
            title="确定让出租车收车吗？"
            message="这趟出租车可以先靠站，已经玩过的路况会留在回放里。"
            cancelLabel="继续开"
            confirmLabel="现在收车"
            onCancel={() => setShowEndConfirm(false)}
            onConfirm={handleConfirmEnd}
          />
        )}
      </div>
    </div>
  )
}
