interface ClawResultPopupProps {
  result: 'caught' | 'dropped' | 'fault'
  onContinue: () => void
}

const RESULT_CONFIG = {
  caught: {
    emoji: '🎉',
    title: '抓住了！',
    description: '爪子紧紧抓住了奖品！\n全家人一起欢呼吧！',
    actionLabel: '🏆 胜利仪式',
    bg: 'bg-[#E8F5E9]',
    border: 'border-[#90C79A]',
    btnBg: 'bg-[#90C79A]',
    btnColor: 'text-white',
  },
  dropped: {
    emoji: '😬',
    title: '滑掉了！',
    description: '爪子碰到了...但又松开了！\n没关系，再做任务挣硬币吧～',
    actionLabel: '好的，继续！',
    bg: 'bg-[#FFF8E1]',
    border: 'border-[#FCD882]',
    btnBg: 'bg-[#FCD882]',
    btnColor: 'text-[#2C4364]',
  },
  fault: {
    emoji: '⚡',
    title: '机器故障！',
    description: '爪子机器卡住了！\n快挠痒家长 5 秒来修复！\n\n补偿：+1 🪙 硬币',
    actionLabel: '修好了！继续',
    bg: 'bg-[#FCE4EC]',
    border: 'border-[#D96B62]',
    btnBg: 'bg-[#D96B62]',
    btnColor: 'text-white',
  },
} as const

export function ClawResultPopup({ result, onContinue }: ClawResultPopupProps) {
  const config = RESULT_CONFIG[result]

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#1C98ED]/20 backdrop-blur-sm px-6" role="dialog" aria-modal="true">
      <div className={`${config.bg} border-4 ${config.border} rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center animate-jelly`}>
        <div className="text-7xl mb-3">{config.emoji}</div>
        <h2 className="text-[22px] font-extrabold text-btv-dark mb-2">{config.title}</h2>
        <p className="text-sm text-[#5a5a87] mb-6 whitespace-pre-line leading-relaxed">
          {config.description}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className={`w-full min-h-12 ${config.btnBg} ${config.btnColor} rounded-full text-base font-extrabold active:scale-95 transition-transform`}
        >
          {config.actionLabel}
        </button>
      </div>
    </div>
  )
}
