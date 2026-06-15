export interface ParentPlayHint {
  kidHook: string
  setup: string
  parentRole: string
  bestMoment: string
}

const DEFAULT_HINT: ParentPlayHint = {
  kidHook: '把剧里的游戏搬到家里玩。',
  setup: '先看规则',
  parentRole: '陪孩子一起演',
  bestMoment: '孩子想换玩法时',
}

export const parentPlayHints: Record<string, ParentPlayHint> = {
  'magic-xylophone': {
    kidHook: '一敲 Ding，爸爸妈妈就要冻住。',
    setup: '1 个小物品',
    parentRole: '认真被冻住',
    bestMoment: '刚开始热身',
  },
  hospital: {
    kidHook: '孩子当医生，病人肚子里可以有猫。',
    setup: '纸和贴纸即可',
    parentRole: '夸张当病人',
    bestMoment: '安静角色扮演',
  },
  'keepy-uppy': {
    kidHook: '气球不能落地，全家一起救它。',
    setup: '1 个气球',
    parentRole: '慢慢托气球',
    bestMoment: '孩子很有电',
  },
  'daddy-robot': {
    kidHook: '孩子发指令，大人变成搞笑机器人。',
    setup: '不用材料',
    parentRole: '当机器人',
    bestMoment: '爸妈愿意演',
  },
  shadowlands: {
    kidHook: '阳光里有鳄鱼，只能踩影子。',
    setup: '有阳光最好',
    parentRole: '当路线侦察员',
    bestMoment: '户外散步',
  },
  bbq: {
    kidHook: '孩子开烧烤摊，大家都来点单。',
    setup: '玩具食物/纸片',
    parentRole: '当挑剔客人',
    bestMoment: '慢慢收尾',
  },
  'claw-machine': {
    kidHook: '家长变爪子，孩子投币指挥抓奖品。',
    setup: '几个小玩具',
    parentRole: '当爪子机器',
    bestMoment: '想要惊喜结果',
  },
  'magic-statue': {
    kidHook: '雕像要装不动，又可以偷偷动。',
    setup: '不用材料',
    parentRole: '当顾客',
    bestMoment: '练习忍住不笑',
  },
  'horsey-ride': {
    kidHook: '孩子指挥马儿完成安全路线。',
    setup: '软地面',
    parentRole: '当慢马',
    bestMoment: '大人体力够时',
  },
  hotel: {
    kidHook: '家里变酒店，孩子安排入住和服务。',
    setup: '纸当房卡',
    parentRole: '当客人',
    bestMoment: '多人一起演',
  },
}

export function getParentPlayHint(gameId: string): ParentPlayHint {
  return parentPlayHints[gameId] ?? DEFAULT_HINT
}
