import type { GameFault } from '../types/game'

export const daddyRobotEvents: GameFault[] = [
  {
    id: 'spray-bottle-short',
    title: '💦 喷水短路！',
    description: 'Chilli 妈妈的喷水瓶命中机器人！快速点修理键，让爸爸机器人慢慢恢复。',
    duration: 14,
    emoji: '💦',
    interactionType: 'tap',
    totalRequired: 8
  },
  {
    id: 'wheelie-bin-program',
    title: '🗑️ 垃圾桶程序启动！',
    description: '爸爸机器人开始重新计算：谁制造了玩具乱糟糟？按住停止按钮，取消垃圾桶路线。',
    duration: 16,
    emoji: '🗑️',
    interactionType: 'longpress',
    totalRequired: 6
  },
  {
    id: 'syntax-error',
    title: '📟 Syntax Error！',
    description: '机器人把小朋友认成吸尘器、脏衣服和小豚鼠。快速修正程序，让他听清楚指令。',
    duration: 16,
    emoji: '📟',
    interactionType: 'tap',
    totalRequired: 9
  },
  {
    id: 'riverdance-overload',
    title: '🕺 跳舞过载！',
    description: '爸爸机器人跳得太夸张了！轻轻晃动或点击修复键，让他慢慢停下来。',
    duration: 14,
    emoji: '🕺',
    interactionType: 'shake',
    totalRequired: 7
  },
  {
    id: 'mummy-robot-distraction',
    title: '🤖 妈妈机器人上线！',
    description: 'Mummy Robot 正在吸引爸爸机器人注意。小声说“关机”，或点击修复键，偷偷完成关闭。',
    duration: 16,
    emoji: '🤖',
    interactionType: 'voice',
    totalRequired: 7
  },
  {
    id: 'crayon-operation',
    title: '🖍️ 蜡笔手术时间！',
    description: '机器人躺下维修，孩子当工程师，快速点修理键完成温柔手术。',
    duration: 12,
    emoji: '🖍️',
    interactionType: 'tap',
    totalRequired: 6
  }
]
