import { useCallback, useState } from 'react'
import type { SoundCue, SoundSettings } from '../types/sound'
import {
  getSoundSettings,
  playGameSound,
  saveSoundSettings,
  setSoundEnabled,
  setSoundVolume,
  setVoiceFriendly,
} from '../utils/soundEffects'

export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(() => getSoundSettings())

  const update = useCallback((patch: Partial<SoundSettings>) => {
    setSettings(current => {
      const next = { ...current, ...patch }
      saveSoundSettings(next)
      return next
    })
  }, [])

  const toggleEnabled = useCallback(() => {
    setSettings(current => setSoundEnabled(!current.enabled))
  }, [])

  const setVolume = useCallback((volume: number) => {
    setSettings(setSoundVolume(volume))
  }, [])

  const toggleVoiceFriendly = useCallback(() => {
    setSettings(current => setVoiceFriendly(!current.voiceFriendly))
  }, [])

  const preview = useCallback((cue: SoundCue = 'success') => {
    playGameSound(cue)
  }, [])

  return {
    settings,
    update,
    toggleEnabled,
    setVolume,
    toggleVoiceFriendly,
    preview,
  }
}

