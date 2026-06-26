import type { RandomEvent, TaskCard } from '../types/game'
import { featherwandEvents } from './featherwandEvents'
import { featherwandTasks } from './featherwandTasks'
import { granniesEvents } from './granniesEvents'
import { granniesTasks } from './granniesTasks'
import { hotelEvents } from './hotelEvents'
import { hotelTasks } from './hotelTasks'
import { magicStatueEvents } from './magicStatueEvents'
import { magicStatueTasks } from './magicStatueTasks'
import { piratesEvents } from './piratesEvents'
import { piratesTasks } from './piratesTasks'
import { shopsEvents } from './shopsEvents'
import { shopsTasks } from './shopsTasks'
import { spyGameEvents } from './spyGameEvents'
import { spyGameTasks } from './spyGameTasks'

export interface StoryPlayAction {
  id: string
  emoji: string
  label: string
  hint: string
  color: string
  response: string
  success?: boolean
}

export interface StoryTaskRequirement {
  counts?: Record<string, number>
  totalActions?: number
}

export interface StoryPlayConfig {
  id: string
  leaderboardKey: string
  emoji: string
  title: string
  subtitle: string
  startLabel: string
  taskTitle: string
  completionMessage: string
  idlePrompt: string
  runningNudge: string[]
  pauseMessage: string
  safeTip: string
  resultTitle: string
  resultSubtitle: string
  victoryTitle: string
  victorySubtitle: string
  namePlaceholder: string
  saveLabel: string
  endTitle: string
  endMessage: string
  endLabel: string
  eventEndLabel: string
  eventConfirmQuestion: string
  eventConfirmLabel: string
  accentColor: string
  accentSoft: string
  accentTint: string
  confirmColor: string
  actions: StoryPlayAction[]
  taskRequirements: Record<string, StoryTaskRequirement>
  tasks: TaskCard[]
  events: RandomEvent[]
  presetNames: string[]
}

export const STORY_PLAY_CONFIGS: Record<string, StoryPlayConfig> = {
  'magic-statue': {
    id: 'magic-statue',
    leaderboardKey: 'magic-statue-leaderboard',
    emoji: '🗿',
    title: '魔法雕像商店',
    subtitle: '店主、顾客和会偷偷动的雕像',
    startLabel: '🗿 商店开张！',
    taskTitle: '🗿 雕像回合',
    completionMessage: '🎉 魔法雕像被看见，也被好好听见了！',
    idlePrompt: '准备一个安全姿势，今天的雕像会偷偷动。',
    runningNudge: [
      '店主可以一本正经地夸雕像。',
      '顾客越认真检查，雕像越好笑。',
      '有人想说话时，先暂停看一眼。',
      '这局的重点不是追，是看见小小发现。',
    ],
    pauseMessage: '雕像商店先暂停，所有雕像都可以活动手脚。',
    safeTip: '不追跑、不推拉；雕像姿势要稳，小发现只观察。',
    resultTitle: '商店今天营业成功',
    resultSubtitle: '你们练习了定格、观察和听见小小发现。',
    victoryTitle: 'Wackadoo! 魔法雕像演完啦',
    victorySubtitle: '雕像、店主、顾客都完成了自己的表演。',
    namePlaceholder: '给这家店取名',
    saveLabel: '记录商店',
    endTitle: '确定关店吗？',
    endMessage: '雕像还可以再偷偷动一次，也可以现在收工。',
    endLabel: '关店',
    eventEndLabel: '🛑 关店',
    eventConfirmQuestion: '确定要让雕像商店关门了吗？',
    eventConfirmLabel: '是，关店',
    accentColor: '#AB47BC',
    accentSoft: '#F3E5F5',
    accentTint: '#E3F2FD',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'pose', emoji: '🗿', label: '摆雕像', hint: '站稳', color: '#AB47BC', response: '雕像摆好了，顾客可以开始检查。' },
      { id: 'sell', emoji: '🏷️', label: '介绍', hint: '店主台词', color: '#5a5a87', response: '店主介绍：这是一尊很特别的魔法雕像。' },
      { id: 'inspect', emoji: '👀', label: '验货', hint: '慢慢看', color: '#1C98ED', response: '顾客绕一圈检查，雕像努力忍住不笑。' },
      { id: 'move', emoji: '🤫', label: '偷动', hint: '小动作', color: '#F58634', response: '雕像偷偷换了一个表情，太可疑了。' },
      { id: 'bell', emoji: '🔔', label: '叮咚', hint: '定住', color: '#EC407A', response: '叮咚！顾客回头，所有人马上定住。' },
      { id: 'leaf', emoji: '🍃', label: '看发现', hint: '认真听', color: '#4CAF50', response: '大家暂停追游戏，认真看见了小小发现。', success: true },
    ],
    taskRequirements: {
      'choose-statue': { counts: { pose: 1 } },
      'sell-statue': { counts: { sell: 1, inspect: 1 } },
      'sneaky-move': { counts: { move: 2 } },
      'ding-dong-dash': { counts: { bell: 1, pose: 2 } },
      'leaf-insect': { counts: { leaf: 1 }, totalActions: 8 },
    },
    tasks: magicStatueTasks,
    events: magicStatueEvents,
    presetNames: ['店主', '雕像', '顾客', '小助手', '家长'],
  },
  hotel: {
    id: 'hotel',
    leaderboardKey: 'hotel-leaderboard',
    emoji: '🏨',
    title: '酒店角色扮演',
    subtitle: '疯狂经理、助手和只想睡觉的客人',
    startLabel: '🏨 开始入住！',
    taskTitle: '🏨 客房服务票',
    completionMessage: '🎉 疯狂酒店完成入住、叫醒和客房服务！',
    idlePrompt: '铺一个安全房间，客人马上要入住。',
    runningNudge: [
      '客人越想睡，酒店越疯狂。',
      '如果有人想换角色，先听他说完。',
      '疯狂可以好笑，但声音不用太大。',
      '客人投诉时，经理先道歉再想办法。',
    ],
    pauseMessage: '酒店进入安静时段，客人终于能睡一会儿。',
    safeTip: '不敲硬物吓人，不爬床跳床；挠痒要先同意。',
    resultTitle: '今天的酒店很疯狂',
    resultSubtitle: '你们完成了入住、服务，也练习了角色协商。',
    victoryTitle: 'Wackadoo! 酒店五星营业',
    victorySubtitle: '疯狂枕头被允许加入，客人也收到了服务。',
    namePlaceholder: '给酒店取名',
    saveLabel: '保存酒店',
    endTitle: '确定退房吗？',
    endMessage: '客人已经住了一会儿，还可以再叫一次客房服务。',
    endLabel: '退房',
    eventEndLabel: '🛎️ 退房',
    eventConfirmQuestion: '确定让客人退房了吗？',
    eventConfirmLabel: '是，退房',
    accentColor: '#1C98ED',
    accentSoft: '#E3F2FD',
    accentTint: '#F0F4FF',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'checkin', emoji: '🛎️', label: '入住', hint: '给房卡', color: '#1C98ED', response: '客人办好入住，经理把房卡交出去了。' },
      { id: 'tour', emoji: '🚪', label: '看房', hint: '介绍房间', color: '#5a5a87', response: '经理带客人参观，助手介绍了一个很怪的设施。' },
      { id: 'facility', emoji: '📺', label: '设施', hint: '电视/床', color: '#AB47BC', response: '酒店设施启动：电视新闻、奇怪床铺或早餐铃。' },
      { id: 'wakeup', emoji: '📯', label: '叫醒', hint: '安全声音', color: '#F58634', response: '疯狂助手叫醒客人，经理赶紧道歉。' },
      { id: 'pillow', emoji: '🛏️', label: '枕头', hint: '换角色', color: '#EC407A', response: '疯狂枕头终于登场，但只挠愿意的人。' },
      { id: 'service', emoji: '🍽️', label: '送餐', hint: '客房服务', color: '#4CAF50', response: '客房服务送到了，客人给了温柔评价。', success: true },
    ],
    taskRequirements: {
      'check-in': { counts: { checkin: 1 } },
      'room-tour': { counts: { tour: 1, facility: 1 } },
      'wake-up-call': { counts: { wakeup: 1 } },
      'crazy-pillow': { counts: { pillow: 1 }, totalActions: 5 },
      'room-service': { counts: { service: 1 }, totalActions: 8 },
    },
    tasks: hotelTasks,
    events: hotelEvents,
    presetNames: ['经理', '客人', '助手', '枕头', '爸爸'],
  },
  'spy-game': {
    id: 'spy-game',
    leaderboardKey: 'spy-game-leaderboard',
    emoji: '🕵️',
    title: '间谍任务',
    subtitle: '秘密基地、药水和控制大人的装置',
    startLabel: '🕵️ 间谍集合！',
    taskTitle: '🕵️ 秘密任务盘',
    completionMessage: '🎉 控制器修好了，药水师也回到小队！',
    idlePrompt: '找一个安全基地，间谍小队准备接任务。',
    runningNudge: [
      '每个间谍都要有一个重要工作。',
      '大人守卫可以笨一点，让孩子成功。',
      '药水师的工作也很重要。',
      '控制大人的指令要安全又好笑。',
    ],
    pauseMessage: '秘密基地进入静音模式，间谍先补充能量。',
    safeTip: '不抢大人头发或衣服；样本都用安全小物替代。',
    resultTitle: '间谍任务完成一半',
    resultSubtitle: '你们有基地、有样本，也练习了重新分工。',
    victoryTitle: 'Wackadoo! 装置启动',
    victorySubtitle: '所有间谍都被需要，大人也被安全控制了。',
    namePlaceholder: '给小队取名',
    saveLabel: '记录任务',
    endTitle: '确定撤离基地吗？',
    endMessage: '间谍可以继续收集样本，也可以安全撤离。',
    endLabel: '撤离',
    eventEndLabel: '🛑 撤离',
    eventConfirmQuestion: '确定让间谍小队撤离了吗？',
    eventConfirmLabel: '是，撤离',
    accentColor: '#5a5a87',
    accentSoft: '#F0F4FF',
    accentTint: '#E3F2FD',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'base', emoji: '🌳', label: '基地', hint: '集合', color: '#5a5a87', response: '秘密基地建立，守卫开始巡逻。' },
      { id: 'sample', emoji: '🧪', label: '样本', hint: '安全小物', color: '#1C98ED', response: '一个安全样本送回基地，药水更接近完成。' },
      { id: 'code', emoji: '🤫', label: '暗号', hint: '手势', color: '#AB47BC', response: '间谍用暗号传递消息，没有惊动守卫。' },
      { id: 'potion', emoji: '✨', label: '药水', hint: '药水师', color: '#F58634', response: '药水师调好药水，所有人都等他按按钮。' },
      { id: 'repair', emoji: '🤝', label: '分工', hint: '邀请回来', color: '#EC407A', response: '小队暂停争论，重新分工，把伙伴邀请回来。' },
      { id: 'control', emoji: '🎛️', label: '控制', hint: '大人动作', color: '#4CAF50', response: '控制器启动，大人做了一个安全又搞笑的动作。', success: true },
    ],
    taskRequirements: {
      'secret-base': { counts: { base: 1, code: 1 } },
      'collect-samples': { counts: { sample: 3 } },
      'potion-maker': { counts: { potion: 1, sample: 3 } },
      'role-repair': { counts: { repair: 1 } },
      'control-grownups': { counts: { control: 2 }, totalActions: 10 },
    },
    tasks: spyGameTasks,
    events: spyGameEvents,
    presetNames: ['药水师', '间谍队', '守卫', '队长', '小助手'],
  },
  shops: {
    id: 'shops',
    leaderboardKey: 'shops-leaderboard',
    emoji: '🛒',
    title: '开商店',
    subtitle: '终于开张，而不是一直准备',
    startLabel: '🛒 商店开门！',
    taskTitle: '🛒 商店订单',
    completionMessage: '🎉 商店终于开张，还成功卖出一件商品！',
    idlePrompt: '拿 3 个安全小物，今天我们真的要开张。',
    runningNudge: [
      '准备不要太久，先玩一轮再换。',
      '有人等不住时，给他一个明确角色。',
      '小猫只能喵喵叫，会立刻变好笑。',
      '卖出一件商品就算这一局成功。',
    ],
    pauseMessage: '商店暂停营业，大家先决定下一位顾客是谁。',
    safeTip: '商品放低处；纸片当钱，不拿真实钱币入口。',
    resultTitle: '商店已经开始营业',
    resultSubtitle: '你们把角色、商品和顾客需求都跑起来了。',
    victoryTitle: 'Wackadoo! 成功开张',
    victorySubtitle: '没有一直准备，商店真的完成了一笔生意。',
    namePlaceholder: '给商店取名',
    saveLabel: '保存商店',
    endTitle: '确定打烊吗？',
    endMessage: '还能再接待一个顾客，也可以一起收拾商品。',
    endLabel: '打烊',
    eventEndLabel: '🛑 打烊',
    eventConfirmQuestion: '确定让商店打烊了吗？',
    eventConfirmLabel: '是，打烊',
    accentColor: '#F58634',
    accentSoft: '#FFF3E0',
    accentTint: '#E8F5E9',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'theme', emoji: '🏪', label: '主题', hint: '卖什么', color: '#5a5a87', response: '商店主题定好了，今天只卖这一类东西。' },
      { id: 'role', emoji: '🎭', label: '角色', hint: '先定一轮', color: '#AB47BC', response: '角色分配完成，这一轮先不反复换。' },
      { id: 'stock', emoji: '🧺', label: '上架', hint: '三个商品', color: '#1C98ED', response: '商品上架完成，助手摆得很整齐。' },
      { id: 'bell', emoji: '🔔', label: '进门', hint: '叮咚', color: '#F58634', response: '叮咚！顾客进店，小猫开始喵喵叫。' },
      { id: 'pay', emoji: '💵', label: '付款', hint: '纸片钱', color: '#EC407A', response: '顾客付款成功，收银员认真找零。' },
      { id: 'wrap', emoji: '🧾', label: '包装', hint: '说谢谢', color: '#4CAF50', response: '商品包装好，店主说谢谢欢迎再来。', success: true },
    ],
    taskRequirements: {
      'pick-shop': { counts: { theme: 1 } },
      'assign-roles': { counts: { role: 1 } },
      'stock-shelves': { counts: { stock: 3 } },
      'patient-opening': { counts: { bell: 1 } },
      'sell-lead': { counts: { pay: 1, wrap: 1 }, totalActions: 8 },
    },
    tasks: shopsTasks,
    events: shopsEvents,
    presetNames: ['店主', '顾客', '小猫', '助手', '等不及顾客'],
  },
  pirates: {
    id: 'pirates',
    leaderboardKey: 'pirates-leaderboard',
    emoji: '🏴‍☠️',
    title: '海盗船冒险',
    subtitle: '风暴、灯塔、大海怪和勇敢救援',
    startLabel: '🏴‍☠️ 出海！',
    taskTitle: '🏴‍☠️ 航海路线',
    completionMessage: '🎉 船员救回来了，大海怪也被勇敢逗笑了！',
    idlePrompt: '用毯子或地垫划一艘安全船，准备出海。',
    runningNudge: [
      '害怕可以先去灯塔，这也是玩法的一部分。',
      '旁白越会讲，孩子越容易进入故事。',
      '大海怪只用声音和表情，不扑人。',
      '最小的海盗也可以成为救援队长。',
    ],
    pauseMessage: '海盗船靠岸，所有船员检查脚下再继续。',
    safeTip: '船在地面；不真实摇晃孩子，不推人，不压人。',
    resultTitle: '海盗船安全靠岸',
    resultSubtitle: '你们经历了风暴，也照顾了害怕的船员。',
    victoryTitle: 'Wackadoo! 海盗船安全回港',
    victorySubtitle: '灯塔守护者想出办法，大家一起救出了船员。',
    namePlaceholder: '给船取名',
    saveLabel: '记录航海',
    endTitle: '确定回港吗？',
    endMessage: '船员已经很勇敢，也可以再经历一次小风浪。',
    endLabel: '回港',
    eventEndLabel: '⚓ 回港',
    eventConfirmQuestion: '确定让海盗船回港了吗？',
    eventConfirmLabel: '是，回港',
    accentColor: '#1C98ED',
    accentSoft: '#E3F2FD',
    accentTint: '#FFF3E0',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'ship', emoji: '🏴‍☠️', label: '登船', hint: '坐稳', color: '#5a5a87', response: '船员都坐稳了，旁白宣布海盗船出发。' },
      { id: 'storm', emoji: '🌊', label: '风暴', hint: '声音演', color: '#1C98ED', response: '风暴来了，大家用声音和小动作演出海浪。' },
      { id: 'lighthouse', emoji: '🗼', label: '灯塔', hint: '可休息', color: '#F58634', response: '灯塔亮起来，害怕的船员也有重要位置。' },
      { id: 'rescue', emoji: '💎', label: '救援', hint: '想办法', color: '#AB47BC', response: '船长和灯塔一起想出救援办法，宝藏回来了。' },
      { id: 'whale', emoji: '🐋', label: '海怪', hint: '大人叫', color: '#EC407A', response: '大海怪出现！大人用声音演，不压人不扑人。' },
      { id: 'tickle', emoji: '👐', label: '逗笑', hint: '救出来', color: '#4CAF50', response: '大家一起逗笑大海怪，船员安全回到船上。', success: true },
    ],
    taskRequirements: {
      'build-ship': { counts: { ship: 1 } },
      'storm-practice': { counts: { storm: 1, lighthouse: 1 } },
      'rescue-treasure': { counts: { rescue: 1 } },
      'sea-monster': { counts: { whale: 1 } },
      'tickle-whale': { counts: { tickle: 1 }, totalActions: 8 },
    },
    tasks: piratesTasks,
    events: piratesEvents,
    presetNames: ['船长', '灯塔', '船员', '旁白', '家长'],
  },
  featherwand: {
    id: 'featherwand',
    leaderboardKey: 'featherwand-leaderboard',
    emoji: '🪄',
    title: '魔法羽毛棒',
    subtitle: '一挥棒，谁就要变身',
    startLabel: '🪄 开始变身！',
    taskTitle: '🪄 变身回合',
    completionMessage: '🎉 每个人都当过魔法师，也都被温柔变回了自己！',
    idlePrompt: '找一根筷子或羽毛当魔法棒，准备开始变身。',
    runningNudge: [
      '被指到就马上变身，越夸张越好笑。',
      '每个人都要轮到当一次魔法师。',
      '变身动作都在原地做，注意脚下。',
      '想结束时，用解咒动作温柔收尾。',
    ],
    pauseMessage: '魔法暂停，所有人先变回自己休息一下。',
    safeTip: '魔法棒只轻轻指，不戳人；变身动作不爬高不扑人。',
    resultTitle: '今天的魔法很热闹',
    resultSubtitle: '你们练习了变身、变速和轮流当魔法师。',
    victoryTitle: 'Wackadoo! 魔法全部完成',
    victorySubtitle: '魔法师轮流登场，大家也被安全地变回了自己。',
    namePlaceholder: '给这场魔法取名',
    saveLabel: '记录魔法',
    endTitle: '确定收起魔法棒吗？',
    endMessage: '还可以再变一次身，也可以现在解咒收工。',
    endLabel: '收棒',
    eventEndLabel: '🛑 收棒',
    eventConfirmQuestion: '确定要把魔法棒收起来了吗？',
    eventConfirmLabel: '是，收棒',
    accentColor: '#AB47BC',
    accentSoft: '#F3E5F5',
    accentTint: '#E3F2FD',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'wave', emoji: '🪄', label: '挥棒', hint: '指一个人', color: '#AB47BC', response: '魔法棒一挥，被指到的人开始变身。' },
      { id: 'animal', emoji: '🐸', label: '变动物', hint: '动作+声音', color: '#4CAF50', response: '变身成功！一只新动物在原地蹦跶起来。' },
      { id: 'speed', emoji: '🐢', label: '变速', hint: '慢或快', color: '#1C98ED', response: '魔法改变了速度，大家一起变慢或变快。' },
      { id: 'size', emoji: '🔮', label: '变大小', hint: '巨人/小不点', color: '#F58634', response: '身体慢慢变大又缩小，全程都在原地。' },
      { id: 'swap', emoji: '🔁', label: '换魔法师', hint: '传魔法棒', color: '#5a5a87', response: '魔法棒传给下一个人，新的魔法师上场。' },
      { id: 'unspell', emoji: '💞', label: '解咒', hint: '变回自己', color: '#EC407A', response: '温柔的解咒动作让大家都变回了自己。', success: true },
    ],
    taskRequirements: {
      'find-wand': { counts: { wave: 1 } },
      'first-spell': { counts: { animal: 1 } },
      'slow-fast': { counts: { speed: 2 } },
      'swap-wizard': { counts: { swap: 1 }, totalActions: 6 },
      'break-spell': { counts: { unspell: 1 }, totalActions: 8 },
    },
    tasks: featherwandTasks,
    events: featherwandEvents,
    presetNames: ['魔法师', '小动物', '家长', '宝宝', '观众'],
  },
  grannies: {
    id: 'grannies',
    leaderboardKey: 'grannies-leaderboard',
    emoji: '👵',
    title: '老奶奶',
    subtitle: '慢慢走、喝喝茶、还会跳街舞',
    startLabel: '👵 变成奶奶！',
    taskTitle: '👵 奶奶日常',
    completionMessage: '🎉 奶奶们走过路、喝过茶、跳过舞，还学会了和好！',
    idlePrompt: '找一个拐杖道具，给自己取个老奶奶名字。',
    runningNudge: [
      '动作越慢越像老奶奶，越夸张越好笑。',
      '记得用老奶奶的声音说台词。',
      '奶奶跳街舞的反差最受欢迎。',
      '拌嘴只用台词，最后一定要和好。',
    ],
    pauseMessage: '奶奶们先坐下歇歇脚，喝口茶再继续。',
    safeTip: '拐杖只拄地不挥人；弯腰慢走也要站稳不摔倒。',
    resultTitle: '今天的奶奶很忙碌',
    resultSubtitle: '你们练习了慢动作、角色台词和拌嘴后的和好。',
    victoryTitle: 'Wackadoo! 奶奶日常圆满',
    victorySubtitle: '奶奶们出过门、跳过舞，也好好和好了。',
    namePlaceholder: '给奶奶们取名',
    saveLabel: '记录奶奶日',
    endTitle: '确定奶奶要回家吗？',
    endMessage: '奶奶们还能再聊一会儿，也可以现在一起回家。',
    endLabel: '回家',
    eventEndLabel: '🛑 回家',
    eventConfirmQuestion: '确定让奶奶们回家了吗？',
    eventConfirmLabel: '是，回家',
    accentColor: '#EC407A',
    accentSoft: '#FCE4EC',
    accentTint: '#FFF3E0',
    confirmColor: '#4CAF50',
    actions: [
      { id: 'name', emoji: '👵', label: '取名', hint: '奶奶名字', color: '#EC407A', response: '奶奶名字取好了，角色正式上线。' },
      { id: 'walk', emoji: '🚶', label: '慢走', hint: '扶拐杖', color: '#5a5a87', response: '奶奶扶着拐杖慢慢走，腰也弯弯的。' },
      { id: 'tea', emoji: '🫖', label: '喝茶', hint: '聊八卦', color: '#F58634', response: '奶奶们坐下喝茶，开始聊今天的新鲜事。' },
      { id: 'floss', emoji: '🕺', label: '跳舞', hint: '奶奶街舞', color: '#AB47BC', response: '反差登场！老奶奶跳起了最潮的街舞。' },
      { id: 'squabble', emoji: '🍪', label: '拌嘴', hint: '只用台词', color: '#1C98ED', response: '奶奶们为小事好笑地拌起嘴来。' },
      { id: 'makeup', emoji: '🤝', label: '和好', hint: '想办法', color: '#4CAF50', response: '奶奶们想出办法道歉和好，一起继续玩。', success: true },
    ],
    taskRequirements: {
      'become-granny': { counts: { name: 1 } },
      'granny-walk': { counts: { walk: 1 } },
      'granny-tea': { counts: { tea: 1 } },
      'granny-floss': { counts: { floss: 1 }, totalActions: 5 },
      'granny-makeup': { counts: { squabble: 1, makeup: 1 }, totalActions: 8 },
    },
    tasks: granniesTasks,
    events: granniesEvents,
    presetNames: ['珍妮特', '丽塔', '奶奶', '家长', '小奶奶'],
  },
}
