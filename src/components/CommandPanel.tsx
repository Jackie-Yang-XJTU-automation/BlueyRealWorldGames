interface CommandButton {
  id: string
  emoji: string
  label: string
  color: string
}

const COMMANDS: CommandButton[] = [
  { id: 'forward', emoji: '👣', label: '前进', color: '#4CAF50' },
  { id: 'turn', emoji: '🔄', label: '转身', color: '#1C98ED' },
  { id: 'jump', emoji: '🦘', label: '跳跃', color: '#F58634' },
  { id: 'fetch', emoji: '🤖', label: '拿取', color: '#AB47BC' },
  { id: 'dance', emoji: '💃', label: '跳舞', color: '#EC407A' },
  { id: 'custom', emoji: '🎤', label: '自定义', color: '#FCD882' },
]

interface CommandPanelProps {
  onCommand: (commandId: string) => void
  counts: Record<string, number>
  disabled: boolean
}

export function CommandPanel({ onCommand, counts, disabled }: CommandPanelProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
      {COMMANDS.map((cmd) => {
        const count = counts[cmd.id] ?? 0
        return (
          <button
            key={cmd.id}
            onClick={() => onCommand(cmd.id)}
            disabled={disabled}
            className="relative flex flex-col items-center justify-center gap-1 rounded-2xl p-4 min-h-[80px]
                       text-white font-extrabold shadow-md transition-all duration-150
                       active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed
                       touch-action-manipulation select-none"
            style={{ backgroundColor: cmd.color }}
          >
            {count > 0 && (
              <span className="absolute top-2 right-2 bg-white/30 text-white text-xs font-extrabold
                               rounded-full w-6 h-6 flex items-center justify-center">
                {count}
              </span>
            )}
            <span className="text-3xl leading-none">{cmd.emoji}</span>
            <span className="text-sm">{cmd.label}</span>
          </button>
        )
      })}
    </div>
  )
}
