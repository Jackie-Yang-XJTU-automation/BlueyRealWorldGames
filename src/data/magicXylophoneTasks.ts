import type { TaskCard } from '../types/game'

export const magicXylophoneTasks: TaskCard[] = [
  {
    id: 'freeze-unfreeze',
    emoji: '🧊',
    title: '第1步 · 做个 Ding',
    description: '冻住一个人，再把他解冻。先试试魔法灵不灵！',
    hostPrompt: 'Ding 就冻住，再 Ding 才能动。',
    stageLabel: '入戏热身',
    stageGoal: '理解冻住/解冻的核心规则',
    safetyNote: '冻住时只定格，不推不拉。',
    completed: false
  },
  {
    id: 'take-turns',
    emoji: '🔁',
    title: '第2步 · 轮流魔法师',
    description: '把木琴交给别人 2 次，让每个人都有魔法。',
    hostPrompt: '现在把魔法交给下一个人，每个人都要轮到。',
    stageLabel: '掌握规则',
    stageGoal: '练习轮流和等待',
    safetyNote: '木琴道具轻轻传，不抢夺。',
    completed: false
  },
  {
    id: 'silly-poses',
    emoji: '🗿',
    title: '第3步 · 傻傻雕像',
    description: '冻住后摆出 3 个安全又好笑的姿势。',
    hostPrompt: '被冻住的人摆一个安全又好笑的姿势，大家只看不推。',
    stageLabel: '协作升级',
    stageGoal: '让被冻住的人负责表演，全家一起看',
    safetyNote: '姿势要稳，双脚能站住。',
    completed: false
  },
  {
    id: 'bingo-rescue',
    emoji: '🧡',
    title: '第4步 · 偷偷救援',
    description: '有人被冻住时，让另一个玩家偷偷救援一次。',
    hostPrompt: '小救援员要偷偷救人，被冻住的人只能眨眨眼。',
    stageLabel: '玩法转折',
    stageGoal: '练习“被冻住也能求救”的小笑点',
    safetyNote: '救援只用口令或轻拍肩膀。',
    completed: false
  },
  {
    id: 'team-magic',
    emoji: '🎵',
    title: '第5步 · 全家合作',
    description: '完成 12 次魔法动作，用团队合作让大人也笑出来！',
    hostPrompt: '最后一轮，全家轮流做魔法师，把每个人都救回来。',
    stageLabel: '高潮挑战',
    stageGoal: '全家轮流做魔法收尾大演出',
    safetyNote: '结束前一起确认客厅安全。',
    completed: false
  }
]
