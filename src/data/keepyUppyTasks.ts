import type { TaskCard } from '../types/game'

export const keepyUppyTasks: TaskCard[] = [
  {
    id: 'warmup',
    title: '第1关 · 热身',
    description: '连续顶 5 下不落地！先找找手感～',
    completed: false
  },
  {
    id: 'one-hand',
    title: '第2关 · 独臂侠',
    description: '一只手背在身后，连续顶 3 下！',
    completed: false
  },
  {
    id: 'cross-room',
    title: '第3关 · 穿越客厅',
    description: '从沙发走到电视前，气球不能落地！',
    completed: false
  },
  {
    id: 'family-relay',
    title: '第4关 · 全家接力',
    description: '每个人至少碰到一次气球，完成一轮完整接力！',
    completed: false
  },
  {
    id: 'last-touch-champion',
    title: '第5关 · 最后一碰冠军',
    description: '竞技模式！最后一碰的人就是今天的 Keepy Uppy 冠军！',
    completed: false
  }
]
