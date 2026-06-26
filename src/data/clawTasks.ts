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
    title: '第1步 · 摆好奖品',
    description: '把 5 个小奖品排成一排，孩子指一个最想抓的目标。',
    hostPrompt: '我们先把奖品排好，选一个最想让爪子抓的目标。',
    stageLabel: '入戏热身',
    stageGoal: '把现实奖品变成娃娃机目标',
    safetyNote: '奖品只用软玩具或轻物品。',
    completed: false,
  },
  {
    id: 'stage1-coin-rules',
    emoji: '🪙',
    stage: 1,
    title: '第1步 · 硬币规则',
    description: '一起数 3 枚硬币，说清楚：先做帮手动作，再继续投币。',
    hostPrompt: '我们一起数硬币，说好先帮忙，再投币。',
    stageLabel: '入戏热身',
    stageGoal: '建立帮手动作换硬币的核心规则',
    safetyNote: '小硬币由大人保管，避免入口。',
    completed: false,
  },
  {
    id: 'stage2-helper-job',
    emoji: '🧺',
    stage: 2,
    title: '第2步 · 帮手任务',
    description: '收好 3 个玩具或小物品，换来 2 枚爪子硬币。',
    hostPrompt: '先做一个小帮手任务，爪子机器才会给硬币。',
    stageLabel: '掌握规则',
    stageGoal: '把剧里的“做家务挣币”落到现实',
    safetyNote: '只收地面安全物品。',
    completed: false,
  },
  {
    id: 'stage2-soft-clean',
    emoji: '🧹',
    stage: 2,
    title: '第2步 · 轻轻整理',
    description: '用小抹布擦一块安全桌面，边擦边说“我要投币啦”。',
    hostPrompt: '轻轻整理一块安全地方，再说：我要投币啦。',
    stageLabel: '掌握规则',
    stageGoal: '练习完成条件和仪式感',
    safetyNote: '不用清洁剂，不擦电器。',
    completed: false,
  },
  {
    id: 'stage3-claw-command',
    emoji: '📣',
    stage: 3,
    title: '第3步 · 指挥爪子',
    description: '对家长爪子喊“左一点、右一点、停”，练习 3 次。',
    hostPrompt: '你来指挥爪子：左一点、右一点、停。',
    stageLabel: '协作升级',
    stageGoal: '孩子指挥，家长当爪子配合',
    safetyNote: '家长只抓奖品，不抓孩子。',
    completed: false,
  },
  {
    id: 'stage3-family-highfive',
    emoji: '✋',
    stage: 3,
    title: '第3步 · 击掌接力',
    description: '投币前和每位玩家击掌一圈，给爪子充能。',
    hostPrompt: '投币前给每个人轻轻击掌，给爪子充能。',
    stageLabel: '协作升级',
    stageGoal: '让等待也变成亲子互动',
    safetyNote: '轻轻击掌，不拍疼。',
    completed: false,
  },
  {
    id: 'stage4-prize-temptation',
    emoji: '😬',
    stage: 4,
    title: '第4步 · 奖品诱惑',
    description: '选一个最想要的奖品，但这次先夸夸别人选的奖品。',
    hostPrompt: '先夸夸别人选的奖品，再告诉爪子你想抓哪个。',
    stageLabel: '玩法转折',
    stageGoal: '演出抓娃娃机里的期待和落空',
    safetyNote: '抓不到也要说“再试一次”。',
    completed: false,
  },
  {
    id: 'stage4-claw-glitch',
    emoji: '⚡',
    stage: 4,
    title: '第4步 · 爪子卡住了',
    description: '家长爪子假装卡住，孩子说 3 句维修口令。',
    hostPrompt: '爪子卡住了，请工程师说三句维修口令。',
    stageLabel: '玩法转折',
    stageGoal: '把随机故障变成表演笑点',
    safetyNote: '维修用口令，不拍打身体。',
    completed: false,
  },
  {
    id: 'stage5-final-grab',
    emoji: '🎯',
    stage: 5,
    title: '第5步 · 最后一抓',
    description: '全家一起倒数 3、2、1，孩子指挥爪子抓目标奖品。',
    hostPrompt: '最后一抓，全家一起倒数，指挥爪子慢慢抓。',
    stageLabel: '高潮挑战',
    stageGoal: '形成一轮完整收尾大演出',
    safetyNote: '倒数时大家站稳，不抢奖品。',
    completed: false,
  },
  {
    id: 'stage5-wackadoo',
    emoji: '🎉',
    stage: 5,
    title: '第5步 · Wackadoo 颁奖',
    description: '不管抓没抓到，都给爪子和指挥官一个大欢呼。',
    hostPrompt: '不管抓没抓到，都给爪子和指挥官一个大欢呼。',
    stageLabel: '高潮挑战',
    stageGoal: '把抓住和滑掉都变成庆祝',
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
