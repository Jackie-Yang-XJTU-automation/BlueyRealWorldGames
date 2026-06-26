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
    kidHook: '垫子或影子变安全岛，鳄鱼水在旁边。',
    setup: '垫子/影子都行',
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
    kidHook: '孩子指挥慢马照顾马厩，不骑背不快跑。',
    setup: '软垫和抱枕',
    parentRole: '当慢马或马车',
    bestMoment: '只想低速玩时',
  },
  hotel: {
    kidHook: '家里变酒店，孩子安排入住和服务。',
    setup: '纸当房卡',
    parentRole: '当客人',
    bestMoment: '多人一起演',
  },
  'spy-game': {
    kidHook: '孩子当间谍，用秘密装置指挥大人。',
    setup: '纸片/小盒子',
    parentRole: '当笨笨守卫',
    bestMoment: '户外聚会',
  },
  shops: {
    kidHook: '孩子开店，大家终于要正式开张。',
    setup: '玩具当商品',
    parentRole: '当顾客',
    bestMoment: '练习商量角色',
  },
  taxi: {
    kidHook: '孩子开车，大人跟着路况急刹、颠和歪。',
    setup: '抱枕当方向盘',
    parentRole: '夸张当乘客',
    bestMoment: '想马上笑起来',
  },
  pirates: {
    kidHook: '毯子变海盗船，勇敢救出船员。',
    setup: '毯子/抱枕',
    parentRole: '当旁白和鲸鱼',
    bestMoment: '故事冒险',
  },
  'freeze-dance': {
    kidHook: '音乐停就变木头人，定得越呆越好笑。',
    setup: '不用道具',
    parentRole: '当领舞兼裁判',
    bestMoment: '想释放体力时',
  },
  featherwand: {
    kidHook: '挥一下魔法棒，谁就要变身。',
    setup: '筷子/羽毛',
    parentRole: '配合被变身',
    bestMoment: '空手想象游戏',
  },
  grannies: {
    kidHook: '全家变老奶奶，慢慢走还会跳街舞。',
    setup: '雨伞当拐杖',
    parentRole: '当另一位奶奶',
    bestMoment: '夸张角色扮演',
  },
}

export function getParentPlayHint(gameId: string): ParentPlayHint {
  return parentPlayHints[gameId] ?? DEFAULT_HINT
}
