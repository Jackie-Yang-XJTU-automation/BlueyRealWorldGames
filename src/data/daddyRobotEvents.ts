import type { GameFault } from '../types/game'

export const daddyRobotEvents: GameFault[] = [
  {
    id: 'short-circuit',
    title: '⚡ 短路了！',
    description: '机器人火花四溅！快速点击按钮修复电路！',
    duration: 15,
    emoji: '⚡',
    interactionType: 'tap',
    totalRequired: 10
  },
  {
    id: 'low-battery',
    title: '🔋 电量告急！',
    description: '机器人没电了！长按充电按钮给机器人充电！',
    duration: 18,
    emoji: '🔋',
    interactionType: 'longpress',
    totalRequired: 6
  },
  {
    id: 'virus-attack',
    title: '🦠 病毒入侵！',
    description: '电脑病毒占领了机器人！快点击屏幕上的病毒消灭它们！',
    duration: 20,
    emoji: '🦠',
    interactionType: 'tap',
    totalRequired: 12
  },
  {
    id: 'system-freeze',
    title: '🌀 程序卡死！',
    description: '机器人僵住了！用力摇晃手机把它摇醒！',
    duration: 15,
    emoji: '🌀',
    interactionType: 'shake',
    totalRequired: 8
  },
  {
    id: 'volume-overload',
    title: '🔊 音量失控！',
    description: '机器人发出超大噪音！对着手机大喊"嘘——"让它安静下来！',
    duration: 16,
    emoji: '🔊',
    interactionType: 'voice',
    totalRequired: 8
  }
]
