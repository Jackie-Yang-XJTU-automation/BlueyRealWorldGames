import { playGameSound } from './soundEffects'

// 触觉反馈 — 在关键交互时刻调用，儿童感知到振动更有"玩真的"感觉
export function triggerHaptic(pattern: 'tap' | 'success' | 'event' | 'finish' = 'tap') {
  playGameSound(pattern)
  if (typeof navigator === 'undefined' || !navigator.vibrate) return

  switch (pattern) {
    case 'tap':
      navigator.vibrate(15) // 轻点
      break
    case 'success':
      navigator.vibrate([30, 50, 30]) // 咚咚
      break
    case 'event':
      navigator.vibrate([60, 80, 60, 80, 60]) // 警报感
      break
    case 'finish':
      navigator.vibrate([40, 60, 40, 60, 100]) // 庆祝
      break
  }
}
