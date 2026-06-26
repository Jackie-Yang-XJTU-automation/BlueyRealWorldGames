import type { RandomEvent } from '../types/game'

export const clawEvents: RandomEvent[] = [
  {
    id: 'bandit-too-hard',
    title: '家长爪子太严格了！',
    description: '家长爪子故意慢一点，孩子要清楚说“左、右、停”，不能急着抢奖品。',
    duration: 12,
    emoji: '😏'
  },
  {
    id: 'chilli-bonus-coin',
    title: '收银员发奖金！',
    description: '夸一夸刚才认真指挥的人，机器吐出一枚“再试试”硬币。',
    duration: 10,
    emoji: '🪙'
  },
  {
    id: 'grey-dancer-safe',
    title: '最爱的奖品需要保护！',
    description: '选一个最重要的奖品放在安全区，提醒大家：不能抢别人最爱的玩具。',
    duration: 12,
    emoji: '🧸'
  },
  {
    id: 'bottomless-ice-cream',
    title: '无限冰淇淋诱惑！',
    description: '家长推出超大奖品。孩子先说一句“抓不到也没关系”，再继续投币。',
    duration: 12,
    emoji: '🍨'
  },
  {
    id: 'refund-offer',
    title: '退款换硬币？',
    description: '可以把一个普通奖品放回奖品台，大家一起决定要不要换 1 枚硬币。',
    duration: 14,
    emoji: '🔁'
  },
  {
    id: 'claw-attract-mode',
    title: '爪子进入招揽模式！',
    description: '家长用最夸张的广告声音介绍奖品，孩子当顾客评价哪一个最诱人。',
    duration: 10,
    emoji: '📣'
  },
  {
    id: 'tickle-repair',
    title: '爪子卡住了！',
    description: '轻轻挠家长爪子 5 秒完成维修，机器吐出一枚安慰硬币。',
    duration: 10,
    emoji: '⚡'
  },
  {
    id: 'winning-ceremony',
    title: '临时颁奖典礼！',
    description: '不管刚才抓没抓到，大家给指挥官和爪子各鼓掌 3 下。',
    duration: 8,
    emoji: '👏'
  }
]
