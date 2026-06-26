export type SoundCue = 'tap' | 'success' | 'event' | 'finish' | 'start' | 'pause' | 'random'

export interface SoundSettings {
  enabled: boolean
  volume: number
  voiceFriendly: boolean
}

export interface ToneStep {
  frequency: number
  duration: number
  type?: OscillatorType
  gain?: number
  slideTo?: number
}

export interface SoundPattern {
  id: SoundCue
  label: string
  steps: ToneStep[]
}

