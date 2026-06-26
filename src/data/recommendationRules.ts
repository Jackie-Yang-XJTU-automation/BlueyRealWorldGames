import type {
  PlayMoment,
  PlayNeed,
  PlayPlace,
  RecommendationContext,
  RecommendationRule,
} from '../types/playExperience'

export const DEFAULT_RECOMMENDATION_CONTEXT: RecommendationContext = {
  moment: 'late-afternoon',
  place: 'living-room',
  need: 'quick',
  availableMinutes: 10,
  hasOutdoorSpace: false,
  wantsLowNoise: false,
}

export const NEED_LABELS: Record<PlayNeed, { emoji: string; label: string; helper: string }> = {
  quick: { emoji: '⏱️', label: '先救场', helper: '5-10 分钟就能开局' },
  quiet: { emoji: '🤫', label: '安静一点', helper: '少跑跳，适合家里' },
  'burn-energy': { emoji: '⚡', label: '释放体力', helper: '孩子电量满格时用' },
  pretend: { emoji: '🎭', label: '想演角色', helper: '家长一起夸张表演' },
  'no-materials': { emoji: '✨', label: '不用准备', helper: '空手也能开始' },
  teamwork: { emoji: '🤝', label: '一起合作', helper: '少输赢，多配合' },
  'wind-down': { emoji: '🌙', label: '睡前收尾', helper: '低刺激，慢慢结束' },
  surprise: { emoji: '🎲', label: '给我惊喜', helper: '让 App 负责出点子' },
}

export const PLACE_LABELS: Record<PlayPlace, { emoji: string; label: string; helper: string }> = {
  'living-room': { emoji: '🏠', label: '客厅', helper: '垫子、沙发旁边' },
  bedroom: { emoji: '🛏️', label: '卧室', helper: '轻声、低刺激' },
  'kitchen-table': { emoji: '🍽️', label: '桌边', helper: '点餐、商店、道具' },
  outside: { emoji: '🌳', label: '户外', helper: '院子、公园、走廊' },
  anywhere: { emoji: '🧺', label: '都可以', helper: '按当前状态推荐' },
}

export const MOMENT_LABELS: Record<PlayMoment, { emoji: string; label: string }> = {
  'wake-up': { emoji: '🌤️', label: '刚醒' },
  morning: { emoji: '☀️', label: '上午' },
  'after-lunch': { emoji: '🍌', label: '饭后' },
  'late-afternoon': { emoji: '🌈', label: '下午' },
  evening: { emoji: '🏡', label: '傍晚' },
  bedtime: { emoji: '🌙', label: '睡前' },
}

export const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    id: 'fast-living-room-save',
    title: '客厅救场',
    emoji: '🛟',
    mood: 'rescue',
    priority: 96,
    preferredGameIds: ['magic-xylophone', 'hospital', 'bbq', 'daddy-robot'],
    typeBoosts: { roleplay: 8, active: 3 },
    locationBoosts: { indoor: 9, both: 4 },
    energyBoosts: { 1: 8, 2: 5 },
    needBoosts: { quick: 14, 'no-materials': 7, pretend: 4 },
    placeBoosts: { 'living-room': 10, bedroom: 6, anywhere: 5 },
    momentBoosts: { morning: 4, 'late-afternoon': 7, evening: 6 },
    parentLine: '“我来当主持，先玩一小轮就好。”',
    childLine: '选一个角色，我们马上开演。',
    setupLine: '只要清出一小块安全位置。',
    safetyLine: '先说好慢动作和暂停手势。',
    why: '适合家长没准备、孩子又想立刻开始的时刻。',
  },
  {
    id: 'sleepy-soft-landing',
    title: '睡前软着陆',
    emoji: '🌙',
    mood: 'cozy',
    priority: 92,
    preferredGameIds: ['hospital', 'shops', 'magic-xylophone', 'bbq'],
    avoidGameIds: ['keepy-uppy', 'shadowlands'],
    typeBoosts: { roleplay: 9, quiet: 8 },
    locationBoosts: { indoor: 9 },
    energyBoosts: { 1: 12 },
    needBoosts: { 'wind-down': 16, quiet: 12, pretend: 4 },
    placeBoosts: { bedroom: 12, 'living-room': 6 },
    momentBoosts: { bedtime: 18, evening: 10 },
    parentLine: '“这局我们轻轻说，最后一起收工。”',
    childLine: '当医生、店主或魔法师都可以小声玩。',
    setupLine: '灯光放柔，玩具只拿 2-3 个。',
    safetyLine: '不追跑，不大叫，结尾一起把道具送回家。',
    why: '睡前需要的是可结束的想象游戏，而不是再把身体点燃。',
  },
  {
    id: 'high-energy-room',
    title: '电量释放',
    emoji: '⚡',
    mood: 'wiggly',
    priority: 88,
    preferredGameIds: ['keepy-uppy', 'shadowlands', 'freeze-dance', 'daddy-robot', 'taxi'],
    typeBoosts: { active: 12, roleplay: 5 },
    locationBoosts: { indoor: 5, both: 8, outdoor: 10 },
    energyBoosts: { 3: 14, 2: 7 },
    needBoosts: { 'burn-energy': 16, teamwork: 8, surprise: 4 },
    placeBoosts: { outside: 12, 'living-room': 7, anywhere: 5 },
    momentBoosts: { morning: 7, 'late-afternoon': 12 },
    parentLine: '“我们把身体电量用到安全地方。”',
    childLine: '顶气球、走安全岛，动起来但不撞家具。',
    setupLine: '先把尖角和小物件挪开。',
    safetyLine: '只慢跑或慢走；一听暂停就停住。',
    why: '孩子明显坐不住时，先让现实动作承接能量。',
  },
  {
    id: 'pretend-with-parent',
    title: '家长一起演',
    emoji: '🎭',
    mood: 'story',
    priority: 86,
    preferredGameIds: ['daddy-robot', 'hotel', 'spy-game', 'grannies', 'featherwand', 'claw-machine', 'shops'],
    typeBoosts: { roleplay: 12, story: 8 },
    locationBoosts: { indoor: 8, both: 5 },
    energyBoosts: { 1: 6, 2: 8 },
    needBoosts: { pretend: 16, teamwork: 8, surprise: 5 },
    placeBoosts: { 'living-room': 7, 'kitchen-table': 10, anywhere: 5 },
    momentBoosts: { 'after-lunch': 7, 'late-afternoon': 8, evening: 7 },
    parentLine: '“我负责演得夸张，你负责下指令。”',
    childLine: '给大人一个角色，再给他一个好笑任务。',
    setupLine: '给每个人一句角色介绍就能开始。',
    safetyLine: '指令必须能安全完成，不能撞人或爬高。',
    why: '当孩子想要大人参与时，角色扮演比解释规则更快。',
  },
  {
    id: 'tabletop-helper',
    title: '桌边小帮手',
    emoji: '🍽️',
    mood: 'helper',
    priority: 82,
    preferredGameIds: ['shops', 'bbq', 'hospital', 'hotel', 'claw-machine'],
    typeBoosts: { roleplay: 10, quiet: 7 },
    locationBoosts: { indoor: 8, both: 4 },
    energyBoosts: { 1: 9, 2: 5 },
    needBoosts: { quiet: 9, pretend: 8, teamwork: 6 },
    placeBoosts: { 'kitchen-table': 16, 'living-room': 5 },
    momentBoosts: { 'after-lunch': 12, evening: 6 },
    parentLine: '“桌子就是服务台，我们来开张。”',
    childLine: '点餐、看诊、收银都可以轮流做。',
    setupLine: '拿纸片、积木或玩具当订单。',
    safetyLine: '小物件不用放嘴里，收摊时一起归位。',
    why: '桌边场景天然适合订单、病历、房卡和小道具。',
  },
  {
    id: 'outside-adventure',
    title: '户外冒险',
    emoji: '🌳',
    mood: 'wiggly',
    priority: 80,
    preferredGameIds: ['shadowlands', 'pirates', 'spy-game', 'bbq'],
    typeBoosts: { active: 9, story: 8, roleplay: 4 },
    locationBoosts: { outdoor: 14, both: 10 },
    energyBoosts: { 2: 7, 3: 9 },
    needBoosts: { 'burn-energy': 8, teamwork: 7, surprise: 5 },
    placeBoosts: { outside: 18, anywhere: 5 },
    momentBoosts: { morning: 8, 'late-afternoon': 9 },
    parentLine: '“外面空间大，我们把路线先画安全。”',
    childLine: '找安全岛、宝藏或秘密基地。',
    setupLine: '用树叶、石头或地面边线做提示。',
    safetyLine: '远离车道、水边和高处；路线短一点也好玩。',
    why: '户外最适合路线、基地、船和影子类现实动作。',
  },
  {
    id: 'no-prop-now',
    title: '空手开局',
    emoji: '✨',
    mood: 'rescue',
    priority: 78,
    preferredGameIds: ['daddy-robot', 'magic-statue', 'featherwand', 'freeze-dance', 'shops', 'spy-game'],
    typeBoosts: { roleplay: 10, story: 6 },
    locationBoosts: { indoor: 7, both: 7 },
    energyBoosts: { 1: 7, 2: 7 },
    needBoosts: { 'no-materials': 18, quick: 8, pretend: 6 },
    placeBoosts: { anywhere: 10, 'living-room': 7, bedroom: 4 },
    momentBoosts: { morning: 5, 'late-afternoon': 7, evening: 5 },
    parentLine: '“不用拿东西，我们直接用身体和声音玩。”',
    childLine: '选一个大人，让他变机器人或雕像。',
    setupLine: '站稳或坐稳就能开始。',
    safetyLine: '所有动作都保持慢速，先练暂停。',
    why: '没有材料时，身体表演和角色指令最省力。',
  },
  {
    id: 'surprise-me',
    title: '惊喜一局',
    emoji: '🎲',
    mood: 'rescue',
    priority: 74,
    preferredGameIds: ['taxi', 'claw-machine', 'magic-xylophone', 'pirates'],
    typeBoosts: { roleplay: 7, story: 7, active: 4 },
    locationBoosts: { indoor: 5, both: 5 },
    energyBoosts: { 1: 4, 2: 6, 3: 4 },
    needBoosts: { surprise: 18, quick: 5, teamwork: 5 },
    placeBoosts: { anywhere: 9, 'living-room': 6 },
    momentBoosts: { 'late-afternoon': 7, evening: 5 },
    parentLine: '“这次让 App 出题，我们只负责演。”',
    childLine: '抽到什么就演什么，滑掉也可以笑。',
    setupLine: '准备一个安全中心点。',
    safetyLine: '惊喜只改玩法，不改安全边界。',
    why: '家长脑子累时，随机感能帮忙续一轮。',
  },
]

export function getMomentFromDate(date = new Date()): PlayMoment {
  const hour = date.getHours()
  if (hour < 8) return 'wake-up'
  if (hour < 12) return 'morning'
  if (hour < 15) return 'after-lunch'
  if (hour < 18) return 'late-afternoon'
  if (hour < 20) return 'evening'
  return 'bedtime'
}

export function getDefaultContextForNow(date = new Date()): RecommendationContext {
  const moment = getMomentFromDate(date)
  if (moment === 'bedtime') {
    return {
      ...DEFAULT_RECOMMENDATION_CONTEXT,
      moment,
      place: 'bedroom',
      need: 'wind-down',
      availableMinutes: 10,
      wantsLowNoise: true,
    }
  }

  if (moment === 'morning') {
    return {
      ...DEFAULT_RECOMMENDATION_CONTEXT,
      moment,
      need: 'burn-energy',
      availableMinutes: 15,
      hasOutdoorSpace: true,
    }
  }

  if (moment === 'after-lunch') {
    return {
      ...DEFAULT_RECOMMENDATION_CONTEXT,
      moment,
      place: 'kitchen-table',
      need: 'quiet',
      availableMinutes: 10,
      wantsLowNoise: true,
    }
  }

  return {
    ...DEFAULT_RECOMMENDATION_CONTEXT,
    moment,
  }
}

export function getSeedForToday(date = new Date()): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year * 10000 + month * 100 + day
}

