import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 找棒 / 2 第一变身 / 3 变速 / 4 换魔法师 / 5 解咒
export const featherwandEvents: RandomEvent[] = [
  {
    id: 'wand-backfire',
    title: '魔法棒失控了！',
    description: '魔法棒打了个喷嚏，把魔法师自己也变成了动物，大家一起笑一笑。',
    duration: 10,
    emoji: '🤧',
    stages: [2, 3, 4],
  },
  {
    id: 'double-spell',
    title: '双重魔法',
    description: '这次魔法同时打到两个人，他们要变成同一种动物，配合演出来。',
    duration: 12,
    emoji: '✨',
    stages: [2, 3, 4],
  },
  {
    id: 'freeze-spell',
    title: '定身咒',
    description: '魔法棒让所有人定住 5 秒，定得最稳的人下一轮可以当魔法师。',
    duration: 8,
    emoji: '🧊',
    stages: [3, 4],
  },
  {
    id: 'grow-shrink',
    title: '变大变小',
    description: '魔法棒让大家先慢慢变成巨人，再缩成小不点，全程在原地做。',
    duration: 12,
    emoji: '🔮',
    stages: [3, 4],
  },
  {
    id: 'wand-lost',
    title: '魔法棒不见了',
    description: '魔法棒滚到一边，大家一起用"魔法雷达"慢慢找回来。',
    duration: 10,
    emoji: '🔍',
    stages: [1, 2, 3, 4],
  },
  {
    id: 'gentle-break',
    title: '需要暂停',
    description: '有人想休息，魔法师挥棒解除所有魔法，大家变回自己歇一会儿。',
    duration: 10,
    emoji: '⏸️',
  },
]
