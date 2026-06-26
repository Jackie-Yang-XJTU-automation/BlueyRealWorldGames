// 音乐定格舞（红绿灯木头人）数据层
// 玩法自立：音乐响就跳，音乐停就定住，动了就换一个定格主题再来。
// App 负责随机出"跳什么"和"定成什么"，并用音效提示音乐停，家长只当裁判和领舞。

export interface DanceMove {
  id: string
  emoji: string
  label: string
  hint: string
}

export interface FreezePose {
  id: string
  emoji: string
  label: string
  hint: string
  safetyNote?: string
}

// 跳舞主题：每回合随机一个，强调安全、好笑、好模仿
export const DANCE_MOVES: DanceMove[] = [
  { id: 'slow-motion', emoji: '🐢', label: '慢动作舞', hint: '像在水里一样慢慢跳' },
  { id: 'giant-steps', emoji: '🦕', label: '巨人步', hint: '迈大步，但脚要踩稳' },
  { id: 'crab-walk', emoji: '🦀', label: '螃蟹横步', hint: '横着走，双手当大钳子' },
  { id: 'jelly-wobble', emoji: '🍮', label: '果冻抖', hint: '全身轻轻抖，软软的' },
  { id: 'airplane', emoji: '✈️', label: '飞机展翅', hint: '张开手臂慢慢转圈' },
  { id: 'stomp', emoji: '🦣', label: '跺脚舞', hint: '原地跺脚，喊出节奏' },
  { id: 'tiptoe', emoji: '🩰', label: '踮脚舞', hint: '踮着脚尖轻轻走' },
  { id: 'clap-jump', emoji: '👏', label: '拍手跳', hint: '边拍手边小幅度跳' },
  { id: 'noodle-arms', emoji: '🍜', label: '面条手', hint: '手臂软绵绵地甩' },
  { id: 'bouncy', emoji: '🦘', label: '袋鼠跳', hint: '小幅度蹦，落地要轻' },
]

// 定格主题：音乐停时要定成的样子，全部降级为安全姿势（不单脚硬撑、不爬高）
export const FREEZE_POSES: FreezePose[] = [
  { id: 'teapot', emoji: '🫖', label: '茶壶', hint: '一手叉腰，一手当壶嘴' },
  { id: 'penguin', emoji: '🐧', label: '企鹅', hint: '夹紧手臂，脚并拢站稳' },
  { id: 'tree', emoji: '🌳', label: '小树', hint: '双手举高，脚踩牢地面' },
  { id: 'rock', emoji: '🪨', label: '石头', hint: '蹲下来抱住膝盖' },
  { id: 'sleepy-cat', emoji: '🐱', label: '睡着的猫', hint: '坐下或趴下，假装睡着' },
  { id: 'superhero', emoji: '🦸', label: '超人', hint: '双脚分开站稳，叉腰挺胸' },
  { id: 'gnome', emoji: '🧙', label: '花园矮人', hint: '微微弯腰，露出最呆的笑' },
  { id: 'starfish', emoji: '⭐', label: '海星', hint: '手脚张开，但脚都踩地' },
  { id: 'robot', emoji: '🤖', label: '机器人', hint: '手脚僵硬地停住，断电啦' },
  { id: 'flamingo-sit', emoji: '🦩', label: '坐着的火烈鸟', hint: '坐下来再单脚翘起，更安全' },
]

// 运行中的鼓励/主持词，轮播显示
export const FREEZE_DANCE_PHRASES = [
  '音乐一停就要变木头人哦！',
  '动了没关系，笑一笑换个姿势再来。',
  '家长也可以一起跳，定得越呆越好笑。',
  '跳的时候注意脚下，别撞到家具。',
  '谁定得最稳，谁就是今天的木头人冠军。',
]

// 安全提示（idle 屏与帮助里展示）
export const FREEZE_DANCE_SAFETY = [
  '先清出一块没有尖角的空地',
  '所有定格都不单脚硬撑，站不稳就坐下',
  '只在原地跳，不追跑、不推人',
]

// 角色卡（idle 屏展示，谁干什么）
export const FREEZE_DANCE_ROLES = [
  { emoji: '🧒', title: '小舞者', detail: '跟着主题跳' },
  { emoji: '📱', title: 'App 音乐', detail: '随机喊停' },
  { emoji: '🧑', title: '家长裁判', detail: '当领舞兼裁判' },
]

export const FREEZE_DANCE_START_PROMPT =
  '音乐响起来就跟着主题跳，手机说停的时候，大家马上定住别动！动了的人就笑一笑，下一轮换个姿势再来。'

// 每轮跳舞自动喊停的时长（毫秒）。家长是主 DJ（手动「喊停」随时可按），
// 这里只是兜底，所以窗口放宽一些，避免太快替家长把音乐停掉。
export const DANCE_MIN_MS = 5000
export const DANCE_MAX_MS = 11000

// 随机抽取工具：避免与上一项重复
export function pickNext<T extends { id: string }>(pool: T[], prevId?: string): T {
  if (pool.length === 0) throw new Error('pickNext: empty pool')
  if (pool.length === 1) return pool[0]
  let next = pool[Math.floor(Math.random() * pool.length)]
  let guard = 0
  while (next.id === prevId && guard < 8) {
    next = pool[Math.floor(Math.random() * pool.length)]
    guard += 1
  }
  return next
}

// 根据回合数计算本轮跳舞时长：回合越靠后越紧凑，但不低于下限
export function danceDurationForRound(round: number): number {
  const shrink = Math.min(round * 250, DANCE_MAX_MS - DANCE_MIN_MS)
  const upper = DANCE_MAX_MS - shrink
  return Math.round(DANCE_MIN_MS + Math.random() * (upper - DANCE_MIN_MS))
}

// 木头人称号：根据成功定格次数给一个收尾头衔
export function freezeDanceTitle(freezeCount: number): string {
  if (freezeCount >= 12) return '钢铁木头人'
  if (freezeCount >= 8) return '定格大师'
  if (freezeCount >= 5) return '稳稳小木头'
  if (freezeCount >= 2) return '会定格的小舞者'
  return '刚学会的小舞者'
}
