import type { TaskCard } from '../types/game'

export const shadowLandsTasks: TaskCard[] = [
  {
    id: 'warmup',
    emoji: '🌳',
    title: '第1关 · 找到安全岛',
    description: '找到 3 个不同的影子，每个站 3 秒。',
    stageLabel: '入戏热身',
    stageGoal: '确认影子是安全陆地，阳光是鳄鱼水',
    safetyNote: '先选没有车和台阶的地方。',
    completed: false
  },
  {
    id: 'one-leg',
    emoji: '🦶',
    title: '第2关 · 影子边界',
    description: '在同一个影子里保持 10 秒，脚尖不要碰到阳光。',
    stageLabel: '掌握规则',
    stageGoal: '练习观察边界和慢慢移动',
    safetyNote: '可以双脚站稳，不强制单脚。',
    completed: false
  },
  {
    id: 'shadow-chain',
    emoji: '🔗',
    title: '第3关 · 影子接力',
    description: '连续跳进 5 个不同影子，中间不能踩到阳光！',
    stageLabel: '协作升级',
    stageGoal: '家长当侦察员，孩子决定下一步',
    safetyNote: '用小步跨，不跑跳。',
    completed: false
  },
  {
    id: 'crocodile-river',
    emoji: '🐊',
    title: '第4关 · 穿越鳄鱼河',
    description: '从起点到终点，规划路线踩影子穿越鳄鱼河。',
    stageLabel: '剧情冲突',
    stageGoal: '保留剧里“不能走捷径”的规则冲突',
    safetyNote: '路线太远就重新选起点。',
    completed: false
  },
  {
    id: 'shadow-champion',
    emoji: '☀️',
    title: '第5关 · 影子冠军',
    description: '在最小的安全影子里保持 15 秒，然后全家上岸庆祝。',
    stageLabel: '高潮挑战',
    stageGoal: '完成一轮紧张但安全的 finale',
    safetyNote: '影子太小就换成大一点的。',
    completed: false
  }
]
