import type { TaskCard } from '../types/game'

export const daddyRobotTasks: TaskCard[] = [
  {
    id: 'warmup',
    emoji: '🤖',
    title: '第1关 · 启动机器人',
    description: '发 3 个简单指令，让爸爸机器人慢慢活动起来。',
    stageLabel: '入戏热身',
    stageGoal: '让孩子理解机器人会听清楚指令再行动',
    safetyNote: '机器人只能慢走，不冲撞家具。',
    completed: false
  },
  {
    id: 'variety',
    emoji: '🎮',
    title: '第2关 · 指挥大师',
    description: '使用 4 种不同指令，看看机器人会不会听错。',
    stageLabel: '掌握规则',
    stageGoal: '练习清楚表达和等待执行',
    safetyNote: '每次只说一个指令。',
    completed: false
  },
  {
    id: 'fix-faults',
    emoji: '🔧',
    title: '第3关 · 故障维修',
    description: '成功修复 2 次机器人故障，让它重新上线。',
    stageLabel: '协作升级',
    stageGoal: '孩子当工程师，家长配合表演故障',
    safetyNote: '维修只点屏幕或轻拍空气。',
    completed: false
  },
  {
    id: 'all-commands',
    emoji: '📡',
    title: '第4关 · 全能遥控',
    description: '用完所有 6 个指令按钮，让机器人进入混乱模式。',
    stageLabel: '剧情冲突',
    stageGoal: '制造 Bandit 式听错和卡顿笑点',
    safetyNote: '跳跃只做小跳或假装跳。',
    completed: false
  },
  {
    id: 'master',
    emoji: '🏁',
    title: '第5关 · 机器人大师',
    description: '发出 15 次指令，完成最后的机器人家务任务。',
    stageLabel: '高潮挑战',
    stageGoal: '把表演、指令和修理串成完整 finale',
    safetyNote: '最后一起关机休息。',
    completed: false
  }
]
