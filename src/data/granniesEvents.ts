import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 取名 / 2 慢走 / 3 喝茶 / 4 跳舞 / 5 拌嘴和好
export const granniesEvents: RandomEvent[] = [
  {
    id: 'lost-glasses',
    title: '奶奶找不到眼镜',
    description: '奶奶的眼镜"不见了"（其实在头顶），大家一起慢慢帮她找。',
    duration: 10,
    emoji: '👓',
    stages: [2, 3, 4],
  },
  {
    id: 'bus-coming',
    title: '公交车来啦',
    description: '奶奶们要赶公交，但只能用最慢的奶奶步子小跑，特别好笑。',
    duration: 10,
    emoji: '🚌',
    stages: [2, 3],
  },
  {
    id: 'granny-dance-off',
    title: '奶奶斗舞',
    description: '两位奶奶突然比谁跳得潮，其他人当评委喊"再来一个"。',
    duration: 12,
    emoji: '🕺',
    stages: [4, 5],
  },
  {
    id: 'tea-party',
    title: '临时茶话会',
    description: '大家停下来开个茶话会，每位奶奶说一句今天最开心的事。',
    duration: 12,
    emoji: '🫖',
    stages: [3, 4],
  },
  {
    id: 'squabble',
    title: '奶奶拌嘴',
    description: '为了最后一块饼干，奶奶们好笑地拌起嘴，然后想办法分着吃。',
    duration: 12,
    emoji: '🍪',
    stages: [4, 5],
  },
  {
    id: 'nap-time',
    title: '奶奶要打盹',
    description: '有人想休息，奶奶们一起坐下打个盹，养足精神再继续。',
    duration: 10,
    emoji: '😴',
  },
]
