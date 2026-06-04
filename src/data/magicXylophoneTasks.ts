import type { TaskCard } from '../types/game'

export const magicXylophoneTasks: TaskCard[] = [
  {
    id: 'freeze-unfreeze',
    emoji: '🧊',
    title: '第1关 · 做个 Ding',
    description: '冻住一个人，再把他解冻。先试试魔法灵不灵！',
    stageLabel: '入戏热身',
    stageGoal: '理解冻住/解冻的核心规则',
    safetyNote: '冻住时只定格，不推不拉。',
    completed: false
  },
  {
    id: 'take-turns',
    emoji: '🔁',
    title: '第2关 · 轮流魔法师',
    description: '把木琴交给别人 2 次，让每个人都有魔法。',
    stageLabel: '掌握规则',
    stageGoal: '练习轮流和等待',
    safetyNote: '木琴道具轻轻传，不抢夺。',
    completed: false
  },
  {
    id: 'silly-poses',
    emoji: '🗿',
    title: '第3关 · 傻傻雕像',
    description: '冻住后摆出 3 个安全又好笑的姿势。',
    stageLabel: '协作升级',
    stageGoal: '让被冻住的人负责表演，全家一起看',
    safetyNote: '姿势要稳，双脚能站住。',
    completed: false
  },
  {
    id: 'bingo-rescue',
    emoji: '🧡',
    title: '第4关 · Bingo 救援',
    description: '有人被冻住时，让另一个玩家偷偷救援一次。',
    stageLabel: '剧情冲突',
    stageGoal: '复刻 Bingo 解围的剧情笑点',
    safetyNote: '救援只用口令或轻拍肩膀。',
    completed: false
  },
  {
    id: 'team-magic',
    emoji: '🎵',
    title: '第5关 · 全家合作',
    description: '完成 12 次魔法动作，用团队合作打败爸爸！',
    stageLabel: '高潮挑战',
    stageGoal: '全家轮流做魔法 finale',
    safetyNote: '结束前一起确认客厅安全。',
    completed: false
  }
]
