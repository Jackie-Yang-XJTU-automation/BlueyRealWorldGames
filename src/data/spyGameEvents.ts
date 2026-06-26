import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 基地 / 2 样本 / 3 药水 / 4 分工 / 5 控制
export const spyGameEvents: RandomEvent[] = [
  {
    id: 'guard-patrol',
    title: '守卫巡逻',
    description: '一个大人当笨笨守卫走过来，间谍全员冻结 5 秒。',
    duration: 10,
    emoji: '🕶️',
    stages: [1, 2, 3],
  },
  {
    id: 'sample-mixup',
    title: '样本拿错了',
    description: '一个样本失效了，间谍要重新找一个安全小物带回基地。',
    duration: 12,
    emoji: '🧪',
    stages: [2, 3],
  },
  {
    id: 'sparkleshot-needed',
    title: '请药水师回来',
    description: '控制按钮等药水师来按，大家先邀请他回来。',
    duration: 12,
    emoji: '✨',
    stages: [3, 4],
  },
  {
    id: 'wrong-grownup',
    title: '控制错大人',
    description: '家长故意让另一个大人或玩具执行指令，孩子要重新校准装置。',
    duration: 12,
    emoji: '🎛️',
    stages: [4, 5],
  },
  {
    id: 'bbq-smoke',
    title: '烧烤冒烟',
    description: '间谍任务暂停，所有人原地扇一扇风，提醒大人看好假装香肠。',
    duration: 10,
    emoji: '🌭',
  },
  {
    id: 'secret-code',
    title: '只能用暗号',
    description: '接下来 10 秒只能用手势或动物叫传递线索。',
    duration: 10,
    emoji: '🤫',
    stages: [1, 2, 3],
  },
]
