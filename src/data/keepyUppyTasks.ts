import type { TaskCard } from '../types/game'

export const keepyUppyTasks: TaskCard[] = [
  {
    id: 'warmup',
    emoji: '🎈',
    title: '第1关 · 红气球醒醒',
    description: '全家一起轻轻顶 5 下，先让气球慢慢飞起来～',
    stageLabel: '入戏热身',
    stageGoal: '让孩子理解气球不能落地',
    safetyNote: '先清出一小块空地。',
    completed: false
  },
  {
    id: 'one-hand',
    emoji: '🤏',
    title: '第2关 · 轻轻碰挑战',
    description: '只能用小小力气碰气球，连续 3 下都不能拍太重。',
    stageLabel: '掌握规则',
    stageGoal: '练习控制力度，不把气球打飞',
    safetyNote: '气球飞远就慢慢走过去。',
    completed: false
  },
  {
    id: 'cross-room',
    emoji: '🛋️',
    title: '第3关 · 客厅小旅行',
    description: '选两个安全地点，把气球从起点送到终点，中间不奔跑。',
    stageLabel: '协作升级',
    stageGoal: '把单人顶球变成路线合作',
    safetyNote: '起点终点避开桌角和门口。',
    completed: false
  },
  {
    id: 'family-relay',
    emoji: '👨‍👩‍👧',
    title: '第4关 · 全家接力',
    description: '按顺序喊名字，每个人都碰一次气球，完成一轮接力！',
    stageLabel: '剧情冲突',
    stageGoal: '模拟剧里全家一起救气球的混乱',
    safetyNote: '只喊名字，不抢球位。',
    completed: false
  },
  {
    id: 'last-touch-champion',
    emoji: '🏆',
    title: '第5关 · Wackadoo 大挑战',
    description: '连续顶 10 下不落地，最后一起喊 Wackadoo！',
    stageLabel: '高潮挑战',
    stageGoal: '完成一轮可庆祝的 finale',
    safetyNote: '数数可以慢，不要为了连击冲撞。',
    completed: false
  }
]
