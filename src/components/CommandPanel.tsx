interface CommandButton {
  id: string
  emoji: string
  label: string
  color: string
  bgLight: string
}

const COMMANDS: CommandButton[] = [
  { id: 'forward', emoji: '👣', label: '前进', color: '#4CAF50', bgLight: '#E8F5E9' },
  { id: 'turn', emoji: '🔄', label: '转身', color: '#1C98ED', bgLight: '#E3F2FD' },
  { id: 'jump', emoji: '🦘', label: '跳跃', color: '#F58634', bgLight: '#FFF3E0' },
  { id: 'fetch', emoji: '🤖', label: '拿取', color: '#AB47BC', bgLight: '#F3E5F5' },
  { id: 'dance', emoji: '💃', label: '跳舞', color: '#EC407A', bgLight: '#FCE4EC' },
  { id: 'custom', emoji: '🎤', label: '自定义', color: '#FCD882', bgLight: '#FFF9EE' },
]

interface CommandPanelProps {
  onCommand: (commandId: string) => void
  counts: Record<string, number>
  disabled?: boolean
}

export function CommandPanel({ onCommand, counts, disabled = false }: CommandPanelProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
      {COMMANDS.map((cmd) => {
        const count = counts[cmd.id] ?? 0
        return (
          <button
            key={cmd.id}
            type="button"
            onClick={() => onCommand(cmd.id)}
            disabled={disabled}
            className="relative flex flex-col items-center justify-center gap-0.5 rounded-2xl p-3.5 min-h-[76px]
                       text-white font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.15),0_4px_14px_rgba(0,0,0,0.08)]
                       transition-all duration-150
                       active:scale-95 active:shadow-[0_2px_0_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.06)] active:translate-y-0.5
                       disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-[0_4px_0_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] disabled:translate-y-0
                       touch-action-manipulation select-none
                       enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_6px_0_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.12)]"
            style={{ backgroundColor: cmd.color }}
          >
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-white/25 text-white text-[10px] font-extrabold
                               rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
            <span className="text-2xl leading-none drop-shadow-sm">{cmd.emoji}</span>
            <span className="text-[13px] tracking-wide">{cmd.label}</span>
          </button>
        )
      })}
    </div>
  )
}
