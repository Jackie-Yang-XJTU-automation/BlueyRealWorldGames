import type { TaskCard } from '../types/game'

export type ClawStage = 1 | 2 | 3 | 4 | 5

export interface ClawTask extends TaskCard {
  id: string
  emoji: string
  title: string
  description: string
  stage: ClawStage
  stageLabel: string
  stageGoal: string
  safetyNote: string
}

export const clawTasks: ClawTask[] = [
  {
    id: 'stage1-prize-lineup',
    emoji: '🎁',
    stage: 1,
    title: '第1关 · 摆好奖品',
    description: '把 5 个小奖品排成一排，孩子指一个最想抓的目标。',
    stageLabel: '入戏热身',
    stageGoal: '把现实奖品变成娃娃机目标',
    safetyNote: '奖品只用软玩具或轻物品。',
    completed: false,
  },
  {
    id: 'stage1-coin-rules',
    emoji: '🪙',
    stage: 1,
    title: '第1关 · 硬币规则',
    description: '一起数 3 枚硬币，说清楚：做任务才能继续投币。',
    stageLabel: '入戏热身',
    stageGoal: '建立任务换硬币的核心规则',
    safetyNote: '小硬币由大人保管，避免入口。',
    completed: false,
  },
  {
    id: 'stage2-helper-job',
    emoji: '🧺',
    stage: 2,
    title: '第2关 · 帮手任务',
    description: '收好 3 个玩具或小物品，换来 2 枚爪子硬币。',
    stageLabel: '掌握规则',
    stageGoal: '把剧里的“做家务挣币”落到现实',
    safetyNote: '只收地面安全物品。',
    completed: false,
  },
  {
    id: 'stage2-soft-clean',
    emoji: '🧹',
    stage: 2,
    title: '第2关 · 轻轻整理',
    description: '用小抹布擦一块安全桌面，边擦边说“我要投币啦”。',
    stageLabel: '掌握规则',
    stageGoal: '练习完成条件和仪式感',
    safetyNote: '不用清洁剂，不擦电器。',
    completed: false,
  },
  {
    id: 'stage3-claw-command',
    emoji: '📣',
    stage: 3,
    title: '第3关 · 指挥爪子',
    description: '对家长爪子喊“左一点、右一点、停”，练习 3 次。',
    stageLabel: '协作升级',
    stageGoal: '孩子指挥，家长当爪子配合',
    safetyNote: '家长只抓奖品，不抓孩子。',
    completed: false,
  },
  {
    id: 'stage3-family-highfive',
    emoji: '✋',
    stage: 3,
    title: '第3关 · 击掌接力',
    description: '投币前和每位玩家击掌一圈，给爪子充能。',
    stageLabel: '协作升级',
    stageGoal: '让等待也变成亲子互动',
    safetyNote: '轻轻击掌，不拍疼。',
    completed: false,
  },
  {
    id: 'stage4-prize-temptation',
    emoji: '😬',
    stage: 4,
    title: '第4关 · 奖品诱惑',
    description: '选一个最想要的奖品，但这次先夸夸别人选的奖品。',
    stageLabel: '剧情冲突',
    stageGoal: '复刻 The Claw 里的期待和落空',
    safetyNote: '抓不到也要说“再试一次”。',
    completed: false,
  },
  {
    id: 'stage4-claw-glitch',
    emoji: '⚡',
    stage: 4,
    title: '第4关 · 爪子卡住了',
    description: '家长爪子假装卡住，孩子说 3 句维修口令。',
    stageLabel: '剧情冲突',
    stageGoal: '把随机故障变成表演笑点',
    safetyNote: '维修用口令，不拍打身体。',
    completed: false,
  },
  {
    id: 'stage5-final-grab',
    emoji: '🏆',
    stage: 5,
    title: '第5关 · 最后一抓',
    description: '全家一起倒数 3、2、1，孩子指挥爪子抓目标奖品。',
    stageLabel: '高潮挑战',
    stageGoal: '形成一轮完整 finale',
    safetyNote: '倒数时大家站稳，不抢奖品。',
    completed: false,
  },
  {
    id: 'stage5-wackadoo',
    emoji: '🎉',
    stage: 5,
    title: '第5关 · Wackadoo 颁奖',
    description: '不管抓没抓到，都给爪子和指挥官一个大欢呼。',
    stageLabel: '高潮挑战',
    stageGoal: '把成功和失败都变成庆祝',
    safetyNote: '欢呼可以小声，适合室内。',
    completed: false,
  },
]

export function buildClawTaskLadder(): ClawTask[] {
  return ([1, 2, 3, 4, 5] as ClawStage[]).map(stage => {
    const pool = clawTasks.filter(task => task.stage === stage)
    const picked = pool[Math.floor(Math.random() * pool.length)]
    return { ...picked, completed: false }
  })
}
