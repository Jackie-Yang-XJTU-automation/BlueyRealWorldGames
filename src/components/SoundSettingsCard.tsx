import { getSoundPatternLabels } from '../utils/soundEffects'
import { useSoundSettings } from '../hooks/useSoundSettings'

export function SoundSettingsCard() {
  const { settings, toggleEnabled, setVolume, toggleVoiceFriendly, preview } = useSoundSettings()

  return (
    <div className="rounded-[22px] border-t-2 border-[#E3F2FD] bg-[#FDFBF7] px-3 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-black text-[#5C728D]">声音提示</p>
          <p className="text-[10px] font-extrabold text-[#5C728D]">轻音效，辅助家长主持</p>
        </div>
        <button
          type="button"
          onClick={() => { toggleEnabled(); preview(settings.enabled ? 'pause' : 'start') }}
          className={`min-h-10 rounded-full px-3 text-[11px] font-black transition-transform active:scale-95 ${
            settings.enabled ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F0F4FF] text-[#5C728D]'
          }`}
          aria-pressed={settings.enabled}
        >
          {settings.enabled ? '开' : '关'}
        </button>
      </div>

      <label className="mb-2 block">
        <span className="mb-1 block text-[10px] font-black text-[#5C728D]">音量 {Math.round(settings.volume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.volume}
          onChange={event => setVolume(Number(event.target.value))}
          onPointerUp={() => preview('tap')}
          className="w-full accent-[#5a5a87]"
          aria-label="调整音效音量"
        />
      </label>

      <button
        type="button"
        onClick={() => { toggleVoiceFriendly(); preview('success') }}
        className="mb-2 min-h-10 w-full rounded-full bg-white px-3 text-[11px] font-black text-[#5C728D] shadow-sm transition-transform active:scale-95"
        aria-pressed={settings.voiceFriendly}
      >
        {settings.voiceFriendly ? '播报友好：音效更轻' : '音效更明显'}
      </button>

      <div className="flex flex-wrap gap-1.5">
        {getSoundPatternLabels().map(item => (
          <button
            key={item.cue}
            type="button"
            onClick={() => preview(item.cue)}
            className="min-h-9 rounded-full bg-[#E3F2FD] px-2.5 text-[10px] font-black text-[#5C728D] transition-transform active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

