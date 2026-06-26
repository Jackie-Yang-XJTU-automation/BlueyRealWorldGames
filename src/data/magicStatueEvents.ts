import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 摆姿势 / 2 验货 / 3 偷动 / 4 门铃 / 5 小发现
export const magicStatueEvents: RandomEvent[] = [
  {
    id: 'customer-looks-back',
    title: '顾客突然回头！',
    description: '顾客慢慢转身检查，雕像立刻定住，店主要认真夸：“它一直都这样！”',
    duration: 10,
    emoji: '👀',
    stages: [2, 3, 4],
  },
  {
    id: 'statue-sneeze',
    title: '雕像打喷嚏',
    description: '雕像可以轻轻“阿嚏”一下，但身体还要尽量保持不动。',
    duration: 8,
    emoji: '🤧',
    stages: [1, 2, 3, 4],
  },
  {
    id: 'shopkeeper-sale',
    title: '店主促销',
    description: '店主给雕像编一个新功能：会跳舞、会讲笑话，或者会保护早餐。',
    duration: 12,
    emoji: '🏷️',
    stages: [2, 3],
  },
  {
    id: 'bathroom-break',
    title: '大人要暂停',
    description: '所有雕像解冻，原地伸懒腰。家长说：“休息也算守规则。”',
    duration: 10,
    emoji: '⏸️',
  },
  {
    id: 'leaf-bug',
    title: '小发现来了',
    description: '最小的玩家发现一个小东西，大家停 5 秒听他说，不能只顾着追游戏。',
    duration: 12,
    emoji: '🍃',
    stages: [4, 5],
  },
  {
    id: 'refund',
    title: '顾客要求退款',
    description: '顾客发现雕像会动，店主道歉并提出换一个更好笑的雕像。',
    duration: 12,
    emoji: '💸',
    stages: [3, 4],
  },
]
