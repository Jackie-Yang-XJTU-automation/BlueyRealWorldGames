import type { SoundCue, SoundPattern, SoundSettings, ToneStep } from '../types/sound'
import { loadFromStorage, saveToStorage } from './storage'

const SOUND_SETTINGS_KEY = 'sound-settings-v1'

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.32,
  voiceFriendly: true,
}

const PATTERNS: Record<SoundCue, SoundPattern> = {
  tap: {
    id: 'tap',
    label: '轻点',
    steps: [
      { frequency: 520, duration: 0.045, type: 'sine', gain: 0.16 },
    ],
  },
  success: {
    id: 'success',
    label: '盖章',
    steps: [
      { frequency: 520, duration: 0.07, type: 'triangle', gain: 0.18 },
      { frequency: 660, duration: 0.08, type: 'triangle', gain: 0.18 },
      { frequency: 880, duration: 0.11, type: 'triangle', gain: 0.16 },
    ],
  },
  event: {
    id: 'event',
    label: '突发状况',
    steps: [
      { frequency: 330, duration: 0.07, type: 'square', gain: 0.13 },
      { frequency: 245, duration: 0.07, type: 'square', gain: 0.12 },
      { frequency: 330, duration: 0.07, type: 'square', gain: 0.13 },
    ],
  },
  finish: {
    id: 'finish',
    label: '收尾',
    steps: [
      { frequency: 392, duration: 0.08, type: 'triangle', gain: 0.15 },
      { frequency: 523, duration: 0.08, type: 'triangle', gain: 0.16 },
      { frequency: 659, duration: 0.08, type: 'triangle', gain: 0.16 },
      { frequency: 784, duration: 0.15, type: 'triangle', gain: 0.14 },
    ],
  },
  start: {
    id: 'start',
    label: '开局',
    steps: [
      { frequency: 440, duration: 0.08, type: 'sine', gain: 0.12, slideTo: 660 },
      { frequency: 660, duration: 0.1, type: 'sine', gain: 0.14, slideTo: 880 },
    ],
  },
  pause: {
    id: 'pause',
    label: '暂停',
    steps: [
      { frequency: 440, duration: 0.07, type: 'sine', gain: 0.11 },
      { frequency: 330, duration: 0.12, type: 'sine', gain: 0.1 },
    ],
  },
  random: {
    id: 'random',
    label: '随机',
    steps: [
      { frequency: 622, duration: 0.045, type: 'triangle', gain: 0.11 },
      { frequency: 740, duration: 0.045, type: 'triangle', gain: 0.11 },
      { frequency: 587, duration: 0.08, type: 'triangle', gain: 0.12 },
    ],
  },
}

let sharedAudioContext: AudioContext | null = null
let lastPlayedAt = 0

function getWindowAudioContext(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined
  return window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
}

function getAudioContext(): AudioContext | null {
  const AudioContextCtor = getWindowAudioContext()
  if (!AudioContextCtor) return null
  if (!sharedAudioContext) sharedAudioContext = new AudioContextCtor()
  return sharedAudioContext
}

function clampVolume(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

function getMasterGain(settings: SoundSettings): number {
  const base = clampVolume(settings.volume)
  return settings.voiceFriendly ? base * 0.72 : base
}

function scheduleTone(context: AudioContext, step: ToneStep, startAt: number, masterGain: number) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const gainValue = (step.gain ?? 0.12) * masterGain
  const endAt = startAt + step.duration

  oscillator.type = step.type ?? 'sine'
  oscillator.frequency.setValueAtTime(step.frequency, startAt)
  if (step.slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(step.slideTo, endAt)
  }

  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue), startAt + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(endAt + 0.025)
}

export function getSoundSettings(): SoundSettings {
  return {
    ...DEFAULT_SOUND_SETTINGS,
    ...loadFromStorage<Partial<SoundSettings>>(SOUND_SETTINGS_KEY, {}),
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  saveToStorage(SOUND_SETTINGS_KEY, {
    ...settings,
    volume: clampVolume(settings.volume),
  })
}

export function setSoundEnabled(enabled: boolean): SoundSettings {
  const next = { ...getSoundSettings(), enabled }
  saveSoundSettings(next)
  return next
}

export function setSoundVolume(volume: number): SoundSettings {
  const next = { ...getSoundSettings(), volume: clampVolume(volume) }
  saveSoundSettings(next)
  return next
}

export function setVoiceFriendly(voiceFriendly: boolean): SoundSettings {
  const next = { ...getSoundSettings(), voiceFriendly }
  saveSoundSettings(next)
  return next
}

export async function playGameSound(cue: SoundCue = 'tap'): Promise<boolean> {
  const now = Date.now()
  if (now - lastPlayedAt < 35) return false
  lastPlayedAt = now

  const settings = getSoundSettings()
  if (!settings.enabled) return false

  const context = getAudioContext()
  if (!context) return false

  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return false
    }
  }

  const pattern = PATTERNS[cue] ?? PATTERNS.tap
  let cursor = context.currentTime + 0.01
  const masterGain = getMasterGain(settings)

  pattern.steps.forEach(step => {
    scheduleTone(context, step, cursor, masterGain)
    cursor += step.duration + 0.018
  })

  return true
}

// 播放单个指定音高（木琴/钟琴音色：基频三角波 + 一个八度正弦泛音，快速衰减）。
// 用于魔法木琴琴键这类需要"每根不同音高"的可玩元素，不走 playGameSound 的节流，
// 允许孩子快速连敲。仍然遵守音效开关与音量设置。
export async function playNote(frequency: number, duration = 0.5): Promise<boolean> {
  const settings = getSoundSettings()
  if (!settings.enabled) return false

  const context = getAudioContext()
  if (!context) return false

  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return false
    }
  }

  const masterGain = getMasterGain(settings)
  const startAt = context.currentTime + 0.01
  scheduleTone(context, { frequency, duration, type: 'triangle', gain: 0.2 }, startAt, masterGain)
  scheduleTone(context, { frequency: frequency * 2, duration: duration * 0.55, type: 'sine', gain: 0.07 }, startAt, masterGain)
  return true
}

export function getSoundPatternLabels(): { cue: SoundCue; label: string }[] {
  return Object.values(PATTERNS).map(pattern => ({
    cue: pattern.id,
    label: pattern.label,
  }))
}

