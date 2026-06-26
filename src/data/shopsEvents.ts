import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 主题 / 2 角色 / 3 上架 / 4 开门 / 5 卖出
export const shopsEvents: RandomEvent[] = [
  {
    id: 'role-switch-temptation',
    title: '有人又想换角色',
    description: '店长说：“这一轮先玩完，下一轮你来换。”然后继续开门。',
    duration: 10,
    emoji: '🔁',
    stages: [2, 3],
  },
  {
    id: 'kitten-cant-talk',
    title: '小猫不能说话',
    description: '小猫顾客只能喵喵叫，店主要猜它想买什么。',
    duration: 12,
    emoji: '🐱',
    stages: [4, 5],
  },
  {
    id: 'no-currency',
    title: '忘了准备钱',
    description: '立刻撕一张纸或拿三片树叶当 Dollarbucks，不再重新大准备。',
    duration: 10,
    emoji: '💵',
    stages: [3, 4],
  },
  {
    id: 'doorbell-arrives',
    title: '门铃到了',
    description: '助手负责“叮咚”，每来一个顾客都按一次。',
    duration: 10,
    emoji: '🔔',
    stages: [4, 5],
  },
  {
    id: 'customer-impatient',
    title: '顾客快等不住了',
    description: '店主用一句话安抚顾客：“马上开张，谢谢你等我。”',
    duration: 10,
    emoji: '😬',
    stages: [3, 4],
  },
  {
    id: 'assistant-needed',
    title: '缺一个助手',
    description: '让一个玩家当 10 秒助手，帮忙包装或递商品。',
    duration: 10,
    emoji: '🧑‍🍳',
  },
]
