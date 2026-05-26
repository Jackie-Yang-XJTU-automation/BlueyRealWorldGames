import type { TaskCard } from '../types/game'

export const shadowLandsTasks: TaskCard[] = [
  {
    id: 'warmup',
    title: '第1关 · 小试身手',
    description: '找到 3 个不同的影子，每个踩 3 秒！',
    completed: false
  },
  {
    id: 'one-leg',
    title: '第2关 · 黄金独脚',
    description: '在同一个影子里单脚站立保持 10 秒不落地！',
    completed: false
  },
  {
    id: 'shadow-chain',
    title: '第3关 · 影子接力',
    description: '连续跳进 5 个不同影子，中间不能踩到阳光！',
    completed: false
  },
  {
    id: 'crocodile-river',
    title: '第4关 · 穿越鳄鱼河',
    description: '从起点到终点，规划路线踩影子穿越鳄鱼河！',
    completed: false
  },
  {
    id: 'shadow-champion',
    title: '第5关 · 影子冠军',
    description: '在最小的影子里保持 15 秒——影子越小越厉害！',
    completed: false
  }
]
