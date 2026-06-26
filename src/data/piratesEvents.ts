import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 登船 / 2 风暴 / 3 救援 / 4 海怪 / 5 逗笑
export const piratesEvents: RandomEvent[] = [
  {
    id: 'lighthouse-break',
    title: '灯塔休息',
    description: '任何觉得太刺激的人都可以去灯塔，旁白给他一个重要任务。',
    duration: 12,
    emoji: '🗼',
  },
  {
    id: 'greedy-pirate',
    title: '贪心海盗抢宝',
    description: '贪心海盗抱住软宝藏，船长要用温柔话术请他分享。',
    duration: 12,
    emoji: '💎',
    stages: [3],
  },
  {
    id: 'storm',
    title: '风暴加大',
    description: '大家坐稳，用声音喊“哗啦啦”，身体只轻轻左右摆。',
    duration: 10,
    emoji: '🌊',
    stages: [2, 3],
  },
  {
    id: 'whale-noise',
    title: '大海怪叫声',
    description: '大人做一次勇敢的鲸鱼叫，声音可以大也可以小。',
    duration: 10,
    emoji: '🐋',
    stages: [4, 5],
  },
  {
    id: 'missy-brave',
    title: '最小海盗想办法',
    description: '让最小或最犹豫的玩家说一个救援点子，大家照着演。',
    duration: 12,
    emoji: '💡',
    stages: [3, 4, 5],
  },
  {
    id: 'safe-harbour',
    title: '安全港口',
    description: '船靠岸 10 秒，所有人检查脚下和周围空间，再继续航行。',
    duration: 10,
    emoji: '⚓',
  },
]
