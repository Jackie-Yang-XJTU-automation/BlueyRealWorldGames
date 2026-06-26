import type { TaskCard } from '../types/game'

export const shadowLandsTasks: TaskCard[] = [
  {
    id: 'warmup',
    emoji: '🌳',
    title: '第1步 · 找到安全岛',
    description: '找到 3 个影子或垫子安全岛，每个站 3 秒。',
    hostPrompt: '阳光或地板是鳄鱼水，我们只踩影子或安全岛。',
    stageLabel: '入戏热身',
    stageGoal: '先造出能连续前进的安全陆地',
    safetyNote: '没有合适影子时，用垫子、纸片或毛巾当安全岛。',
    completed: false
  },
  {
    id: 'one-leg',
    emoji: '🦶',
    title: '第2步 · 影子边界',
    description: '在同一个影子或安全岛里保持 10 秒，脚尖不要掉进鳄鱼水。',
    hostPrompt: '这一段陆地很窄，慢慢走，不抢路。',
    stageLabel: '掌握规则',
    stageGoal: '练习观察边界和慢慢移动',
    safetyNote: '可以双脚站稳，不强制单脚。',
    completed: false
  },
  {
    id: 'shadow-chain',
    emoji: '🔗',
    title: '第3步 · 影子接力',
    description: '连续走过 5 个不同安全岛，中间不能掉进鳄鱼水。',
    hostPrompt: '大家排成影子小队，喊名字一个接一个过去。',
    stageLabel: '协作升级',
    stageGoal: '家长当侦察员，孩子决定下一步',
    safetyNote: '用小步跨或慢慢走，不跑跳。',
    completed: false
  },
  {
    id: 'crocodile-river',
    emoji: '🐊',
    title: '第4步 · 穿越鳄鱼河',
    description: '从起点到终点，规划路线穿越鳄鱼河。',
    hostPrompt: '前面是鳄鱼河，只能走影子桥或垫子桥通过。',
    stageLabel: '玩法转折',
    stageGoal: '保留剧里“不能走捷径”的规则冲突',
    safetyNote: '路线太远就重新摆安全岛。',
    completed: false
  },
  {
    id: 'shadow-champion',
    emoji: '☀️',
    title: '第5步 · 影子冠军',
    description: '在最小的安全岛里保持 15 秒，然后全家上岸庆祝。',
    hostPrompt: '最后冲刺，等云影或家长摆好的桥出现再安全通过。',
    stageLabel: '高潮挑战',
    stageGoal: '完成一轮紧张但安全的收尾路线',
    safetyNote: '安全岛太小就换成大一点的。',
    completed: false
  }
]
