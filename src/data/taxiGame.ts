export type TaxiPanel = 'traffic' | 'road' | 'turn' | 'nav' | 'passenger' | 'repair' | 'arrival'

export interface TaxiActionChip {
  emoji: string
  label: string
}

export interface TaxiDriverMove {
  id: string
  emoji: string
  label: string
  result: string
  logLabel: string
}

export interface TaxiRound {
  id: string
  panel: TaxiPanel
  emoji: string
  title: string
  callout: string
  speakText: string
  parentMoves: TaxiActionChip[]
  driverPrompt: string
  safetyNote: string
  driverMoves: TaxiDriverMove[]
}

export const TAXI_ROUNDS_PER_RIDE = 5
const TAXI_CORE_BODY_ROUND_IDS = ['red-light', 'speed-bumps', 'sharp-turn'] as const
type TaxiCoreBodyRoundId = typeof TAXI_CORE_BODY_ROUND_IDS[number]

export const TAXI_START_PROMPT = '你来开出租车，我来当乘客。手机会报路况，红灯就急刹，减速带就颠三下，急转弯大家一起歪！'

export const TAXI_OPENING_ACTIONS: TaxiActionChip[] = [
  { emoji: '🚦', label: '红灯停' },
  { emoji: '〰️', label: '颠三下' },
  { emoji: '↪️', label: '一起歪' },
]

export const TAXI_SAFETY_TIPS = [
  '坐着或慢慢走。',
  '急刹只定住。',
  '不撞人和家具。',
]

export const TAXI_ROUNDS: TaxiRound[] = [
  {
    id: 'red-light',
    panel: 'traffic',
    emoji: '🚦',
    title: '红灯急刹',
    callout: '红灯！安全刹车！',
    speakText: '红灯，司机快安全刹车。乘客抱紧行李，身体定住。',
    parentMoves: [
      { emoji: '🧍', label: '定住' },
      { emoji: '🧳', label: '抱紧' },
      { emoji: '😮', label: '哎呀' },
    ],
    driverPrompt: '司机选一个刹车方式。',
    safetyNote: '只做身体定住，不往前扑。',
    driverMoves: [
      {
        id: 'soft-brake',
        emoji: '🦶',
        label: '轻轻刹车',
        result: '全车稳稳停住，乘客松了一口气。',
        logLabel: '红灯急刹',
      },
      {
        id: 'freeze',
        emoji: '✋',
        label: '喊定住',
        result: '司机一喊停，大家像雕像一样定住。',
        logLabel: '全车定住',
      },
    ],
  },
  {
    id: 'speed-bumps',
    panel: 'road',
    emoji: '〰️',
    title: '三个减速带',
    callout: '减速带！咚、咚、咚！',
    speakText: '前面有三个减速带。大家坐稳，轻轻颠三下，咚，咚，咚。',
    parentMoves: [
      { emoji: '1️⃣', label: '咚' },
      { emoji: '2️⃣', label: '咚' },
      { emoji: '3️⃣', label: '咚' },
    ],
    driverPrompt: '司机决定怎么过减速带。',
    safetyNote: '只轻轻颠身体，不跳起来。',
    driverMoves: [
      {
        id: 'count-three',
        emoji: '🔢',
        label: '数三下',
        result: '大家一起咚咚咚，乘客的帽子差点飞走。',
        logLabel: '三个减速带',
      },
      {
        id: 'slow-bumps',
        emoji: '🐢',
        label: '慢慢过',
        result: '出租车慢慢颠过去，乘客说这辆车还挺稳。',
        logLabel: '慢过减速带',
      },
    ],
  },
  {
    id: 'sharp-turn',
    panel: 'turn',
    emoji: '↪️',
    title: '急转弯',
    callout: '急转弯！全车一起歪！',
    speakText: '前面急转弯。司机打方向，乘客跟着一起歪。',
    parentMoves: [
      { emoji: '↩️', label: '左歪' },
      { emoji: '↪️', label: '右歪' },
      { emoji: '🧳', label: '护行李' },
    ],
    driverPrompt: '司机选转弯方向。',
    safetyNote: '只动上半身，不碰旁边的人。',
    driverMoves: [
      {
        id: 'left',
        emoji: '↩️',
        label: '向左转',
        result: '全车向左歪，乘客努力抓住行李。',
        logLabel: '左急转弯',
      },
      {
        id: 'right',
        emoji: '↪️',
        label: '向右转',
        result: '全车向右歪，乘客说我的行李还好吗？',
        logLabel: '右急转弯',
      },
    ],
  },
  {
    id: 'traffic-jam',
    panel: 'traffic',
    emoji: '🚗',
    title: '前面堵车',
    callout: '堵车了！司机想办法！',
    speakText: '前面堵车了。司机想办法，乘客开始着急地看窗外。',
    parentMoves: [
      { emoji: '🪟', label: '看窗外' },
      { emoji: '😬', label: '有点急' },
      { emoji: '📣', label: '小声催' },
    ],
    driverPrompt: '司机选一个办法。',
    safetyNote: '按喇叭只用嘴巴小声哔哔。',
    driverMoves: [
      {
        id: 'tiny-honk',
        emoji: '📣',
        label: '小喇叭',
        result: '小喇叭哔哔两声，乘客觉得好忙。',
        logLabel: '堵车小喇叭',
      },
      {
        id: 'go-around',
        emoji: '🔄',
        label: '绕小路',
        result: '司机决定绕路，方向盘转了一大圈。',
        logLabel: '堵车绕路',
      },
    ],
  },
  {
    id: 'confused-nav',
    panel: 'nav',
    emoji: '🧭',
    title: '导航乱指',
    callout: '导航说：左、右、绕一圈！',
    speakText: '导航乱指路。它一会儿说左，一会儿说右，最后说请绕一圈。',
    parentMoves: [
      { emoji: '↩️', label: '左看' },
      { emoji: '↪️', label: '右看' },
      { emoji: '🤨', label: '怀疑' },
    ],
    driverPrompt: '司机要不要听导航？',
    safetyNote: '绕圈只转方向盘或慢慢转身。',
    driverMoves: [
      {
        id: 'follow-nav',
        emoji: '🧭',
        label: '听导航',
        result: '车子认真绕了一圈，乘客开始怀疑导航。',
        logLabel: '导航绕圈',
      },
      {
        id: 'mute-nav',
        emoji: '🔇',
        label: '关导航',
        result: '导航安静了三秒，又小声说其实我迷路了。',
        logLabel: '关掉迷路导航',
      },
    ],
  },
  {
    id: 'tiny-tunnel',
    panel: 'road',
    emoji: '🌉',
    title: '进隧道',
    callout: '进隧道！小声开车！',
    speakText: '出租车进隧道了。司机开小灯，乘客用小小声说话。',
    parentMoves: [
      { emoji: '🤫', label: '小声' },
      { emoji: '💡', label: '开小灯' },
      { emoji: '👀', label: '看前方' },
    ],
    driverPrompt: '司机选隧道模式。',
    safetyNote: '不要真的关灯跑动。',
    driverMoves: [
      {
        id: 'quiet-drive',
        emoji: '🤫',
        label: '小声开',
        result: '全车突然变得很安静，只听见小小的引擎声。',
        logLabel: '小声隧道',
      },
      {
        id: 'lights-on',
        emoji: '💡',
        label: '开小灯',
        result: '小灯亮了，乘客发现自己的行李还在。',
        logLabel: '隧道开灯',
      },
    ],
  },
  {
    id: 'dizzy-passenger',
    panel: 'passenger',
    emoji: '🥴',
    title: '乘客有点晕',
    callout: '乘客晕车！开稳一点！',
    speakText: '乘客有点晕车。司机开稳一点，大家深呼吸。',
    parentMoves: [
      { emoji: '🥴', label: '扶额' },
      { emoji: '🌬️', label: '呼气' },
      { emoji: '🐢', label: '慢一点' },
    ],
    driverPrompt: '司机怎么让车稳下来？',
    safetyNote: '晕车只是假装，不做恶心动作。',
    driverMoves: [
      {
        id: 'slow-down',
        emoji: '🐢',
        label: '慢慢开',
        result: '车慢了下来，乘客终于能坐直一点。',
        logLabel: '慢开安抚乘客',
      },
      {
        id: 'fresh-air',
        emoji: '🌬️',
        label: '开窗呼气',
        result: '大家一起呼一口气，晕车宝宝也安静了。',
        logLabel: '乘客深呼吸',
      },
    ],
  },
  {
    id: 'singing-horn',
    panel: 'repair',
    emoji: '🎺',
    title: '喇叭唱歌',
    callout: '喇叭只会唱歌了！',
    speakText: '出租车喇叭开始唱歌。司机快想办法修一修。',
    parentMoves: [
      { emoji: '🎵', label: '听歌' },
      { emoji: '🙉', label: '捂耳' },
      { emoji: '🔧', label: '等修' },
    ],
    driverPrompt: '司机选一个修车动作。',
    safetyNote: '修车只拍抱枕、方向盘或空气。',
    driverMoves: [
      {
        id: 'repair-song',
        emoji: '🎶',
        label: '唱修车歌',
        result: '修车歌唱完，喇叭终于只哔了一声。',
        logLabel: '修好唱歌喇叭',
      },
      {
        id: 'tap-wheel',
        emoji: '🛞',
        label: '拍拍方向盘',
        result: '方向盘被认真拍了两下，喇叭乖乖安静。',
        logLabel: '拍拍修车',
      },
    ],
  },
  {
    id: 'rain-wipers',
    panel: 'road',
    emoji: '🌧️',
    title: '下雨刷刷',
    callout: '下雨了！雨刷刷刷！',
    speakText: '突然下雨了。司机打开雨刷，大家刷刷刷地摆手。',
    parentMoves: [
      { emoji: '🌧️', label: '下雨' },
      { emoji: '🖐️', label: '刷刷' },
      { emoji: '🐢', label: '慢开' },
    ],
    driverPrompt: '司机选雨天开法。',
    safetyNote: '雨刷动作只摆手，不打到人。',
    driverMoves: [
      {
        id: 'wipers',
        emoji: '🖐️',
        label: '开雨刷',
        result: '雨刷刷刷刷，乘客终于看清前方。',
        logLabel: '雨刷刷刷',
      },
      {
        id: 'rain-slow',
        emoji: '🐢',
        label: '雨天慢开',
        result: '出租车慢慢开过雨地，车里变得很安静。',
        logLabel: '雨天慢开',
      },
    ],
  },
]

export const TAXI_FINISH_ROUNDS: TaxiRound[] = [
  {
    id: 'safe-arrival',
    panel: 'arrival',
    emoji: '🏁',
    title: '安全到站',
    callout: '到站啦！乘客下车！',
    speakText: '出租车安全到站了。乘客拿好行李，给司机一个大拇指。',
    parentMoves: [
      { emoji: '🧳', label: '拿行李' },
      { emoji: '👍', label: '点赞' },
      { emoji: '😄', label: '再见' },
    ],
    driverPrompt: '司机选收车方式。',
    safetyNote: '下车只是假装站起来或挥手。',
    driverMoves: [
      {
        id: 'park',
        emoji: '🅿️',
        label: '停车收车',
        result: '司机稳稳停车，乘客说这趟车太精彩了。',
        logLabel: '安全到站',
      },
      {
        id: 'open-door',
        emoji: '🚪',
        label: '开车门',
        result: '车门打开，乘客拿着行李快乐下车。',
        logLabel: '快乐下车',
      },
    ],
  },
  {
    id: 'one-more-loop',
    panel: 'arrival',
    emoji: '🔁',
    title: '还想再坐',
    callout: '乘客说：再绕一圈！',
    speakText: '乘客到站了，可是还想再坐一圈。司机准备下一趟。',
    parentMoves: [
      { emoji: '😄', label: '还想玩' },
      { emoji: '🔁', label: '再一圈' },
      { emoji: '👏', label: '拍手' },
    ],
    driverPrompt: '司机选结尾。',
    safetyNote: '想继续玩就重新开一局。',
    driverMoves: [
      {
        id: 'again',
        emoji: '🔁',
        label: '再接一单',
        result: '乘客还没下车，就想让司机再开一圈。',
        logLabel: '还想再坐',
      },
      {
        id: 'next-passenger',
        emoji: '👋',
        label: '下一位',
        result: '下一位乘客已经在路边挥手了。',
        logLabel: '下一位乘客',
      },
    ],
  },
]

function shuffleRounds(rounds: TaxiRound[]): TaxiRound[] {
  return [...rounds].sort(() => Math.random() - 0.5)
}

function getTaxiRoundById(id: TaxiCoreBodyRoundId): TaxiRound {
  return TAXI_ROUNDS.find(round => round.id === id)!
}

export function createTaxiRide(): TaxiRound[] {
  const openingId = [...TAXI_CORE_BODY_ROUND_IDS].sort(() => Math.random() - 0.5)[0]
  const openingRound = getTaxiRoundById(openingId)
  const requiredMiddleRounds = TAXI_CORE_BODY_ROUND_IDS
    .filter(id => id !== openingId)
    .map(id => getTaxiRoundById(id))
  const extraRounds = shuffleRounds(TAXI_ROUNDS.filter(round => !TAXI_CORE_BODY_ROUND_IDS.includes(round.id as TaxiCoreBodyRoundId)))
    .slice(0, TAXI_ROUNDS_PER_RIDE - 1 - requiredMiddleRounds.length)
  const rideRounds = [openingRound, ...shuffleRounds([...requiredMiddleRounds, ...extraRounds])]
  const finale = TAXI_FINISH_ROUNDS[Math.floor(Math.random() * TAXI_FINISH_ROUNDS.length)]
  return [...rideRounds, finale]
}
