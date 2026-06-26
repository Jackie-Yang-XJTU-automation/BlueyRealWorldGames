import type { GameFault } from '../types/game'

export const daddyRobotEvents: GameFault[] = [
  {
    id: 'spray-bottle-short',
    title: '💦 喷水短路！',
    description: '机器人短路了！孩子说“慢慢重启”，家长点修理键配合恢复。',
    duration: 12,
    emoji: '💦',
    interactionType: 'tap',
    totalRequired: 8
  },
  {
    id: 'wheelie-bin-program',
    title: '🗑️ 垃圾桶程序启动！',
    description: '机器人要去收玩具。孩子按住停止，先指挥他慢慢停在原地。',
    duration: 14,
    emoji: '🗑️',
    interactionType: 'longpress',
    totalRequired: 6
  },
  {
    id: 'syntax-error',
    title: '📟 Syntax Error！',
    description: '机器人听错了！孩子重新说一个短指令，家长点修正程序。',
    duration: 12,
    emoji: '📟',
    interactionType: 'tap',
    totalRequired: 9
  },
  {
    id: 'riverdance-overload',
    title: '🕺 跳舞过载！',
    description: '机器人跳舞过载！大家说“慢动作”，让他一点点停下来。',
    duration: 12,
    emoji: '🕺',
    interactionType: 'shake',
    totalRequired: 7
  },
  {
    id: 'mummy-robot-distraction',
    title: '🤖 备用机器人上线！',
    description: '备用机器人来帮忙。孩子小声说“关机”，家长配合慢慢关灯。',
    duration: 12,
    emoji: '🤖',
    interactionType: 'voice',
    totalRequired: 7
  },
  {
    id: 'crayon-operation',
    title: '🖍️ 蜡笔手术时间！',
    description: '机器人躺下维修，孩子当工程师，点修理键完成温柔手术。',
    duration: 12,
    emoji: '🖍️',
    interactionType: 'tap',
    totalRequired: 6
  }
]
