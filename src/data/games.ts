import type { Game } from '../types/game'

export const games: Game[] = [
  {
    id: 'magic-xylophone',
    name: '魔法木琴',
    emoji: '🎵',
    episode: 1,
    episodeName: '魔法木琴',
    type: 'active',
    location: 'indoor',
    energy: 1,
    minPlayers: 2,
    maxPlayers: 6,
    difficulty: 1,
    description: '用任何物品当作"魔法木琴"，敲击时被指到的人必须立刻"冻住"！只有再次敲击才能解冻。',
    rules: [
      '选一个物品当作魔法木琴（勺子、笔、玩具都可以）',
      '魔法师敲击木琴，指向一个人',
      '被指到的人必须立刻冻住，保持姿势不能动',
      '再次敲击木琴才能解冻',
      '轮流当魔法师和被冻住的人'
    ],
    materials: ['任意小物品（勺子、笔、玩具）'],
    tips: '这个游戏能锻炼孩子的反应能力和规则意识。轮流当魔法师可以帮助孩子理解"轮流等待"的概念，而保持不动则训练自控力。',
    upgrades: [
      '超级冰冻：冻住后只能眨眼睛',
      '解冻挑战：被冻住的人要完成小任务才能解冻',
      '反向魔法：敲击后除了被指到的人，其他人都要冻住'
    ]
  },
  {
    id: 'hospital',
    name: '医院角色扮演',
    emoji: '🏥',
    episode: 2,
    episodeName: '医院',
    type: 'roleplay',
    location: 'indoor',
    energy: 1,
    minPlayers: 2,
    maxPlayers: 5,
    difficulty: 2,
    description: '分配医生、护士、病人角色，病人描述夸张的"病情"，医生用创意道具进行检查和治疗。',
    rules: [
      '分配角色：医生、护士、病人',
      '病人描述自己的"病情"（越夸张越好，比如"肚子里有只猫"）',
      '医生用听诊器（卷起来的纸）检查',
      '护士帮忙量体温、打针',
      '进行"手术"取出"异物"'
    ],
    materials: ['玩具听诊器', '卷纸（绷带）', '笔（针筒）', '白纸（X光片）'],
    tips: '角色扮演能培养孩子的同理心和语言表达能力。通过模拟医疗场景，也能帮助孩子减少对看医生的恐惧。',
    upgrades: [
      '急诊模式：突然有紧急病人需要抢救',
      '药房模式：病人凭处方拿药',
      '兽医模式：给毛绒玩具看病'
    ]
  },
  {
    id: 'keepy-uppy',
    name: '顶气球',
    emoji: '🎈',
    episode: 3,
    episodeName: '顶气球',
    type: 'active',
    location: 'indoor',
    energy: 3,
    minPlayers: 1,
    maxPlayers: 6,
    difficulty: 2,
    description: '用手、头、膝盖把气球顶在空中不能落地！可以单人挑战纪录，也可以全家合作。Bluey 同款游戏！',
    rules: [
      '用身体部位（手、头、膝盖）把气球顶在空中',
      '不能让气球落地',
      '可以单人挑战，也可以多人合作',
      '挑战看谁顶得最久，或者最多人一起顶不落地'
    ],
    materials: ['气球（多准备几个备用）'],
    tips: '顶气球是绝佳的手眼协调训练！合作模式培养团队精神，单人模式培养专注力。Bluey 里全家一起玩的经典场景。',
    upgrades: [
      '障碍模式：在房间里设置障碍物不能碰到',
      '限时挑战：规定时间内顶的次数最多获胜',
      '夜间模式：用夜光气球在黑暗中玩'
    ]
  },
  {
    id: 'daddy-robot',
    name: '爸爸机器人',
    emoji: '🤖',
    episode: 4,
    episodeName: '爸爸机器人',
    type: 'roleplay',
    location: 'indoor',
    energy: 2,
    minPlayers: 2,
    maxPlayers: 4,
    difficulty: 2,
    description: '家长扮演"机器人"，完全听从孩子的指令。机器人会出各种故障，孩子需要"修理"才能恢复正常！',
    rules: [
      '家长扮演机器人，完全听从孩子的指令',
      '机器人会出各种"故障"：听不懂指令、动作变慢、突然转圈',
      '孩子需要"修理"机器人（拍拍头、按按钮）',
      '修好后继续听从指令'
    ],
    materials: [],
    tips: '这个游戏让孩子体验"指挥者"的角色，培养语言表达和问题解决能力。家长演得越夸张，孩子越开心！',
    upgrades: [
      '机器人升级：孩子给机器人安装新功能',
      '病毒模式：机器人感染病毒，需要输入密码解除',
      '多机器人：多个家长同时扮演不同功能的机器人'
    ]
  },
  {
    id: 'shadowlands',
    name: '影子陆地',
    emoji: '🌳',
    episode: 5,
    episodeName: '影子陆地',
    type: 'active',
    location: 'outdoor',
    energy: 3,
    minPlayers: 1,
    maxPlayers: 6,
    difficulty: 3,
    description: '只能踩在影子上，不能踩到阳光！阳光里有"鳄鱼"哦。从起点走到终点，利用各种影子当"安全岛"。',
    rules: [
      '只能在影子上行走，不能踩到阳光照射的地方',
      '阳光里有"鳄鱼"，踩到阳光就被"咬"到了',
      '从起点走到终点',
      '可以利用云朵、大树、建筑物的影子'
    ],
    materials: [],
    tips: '影子陆地培养空间想象力和观察力。在户外活动的同时，孩子学会规划和选择路线。最适合晴朗的下午！',
    upgrades: [
      '搭桥：用树枝石头当临时桥梁跨过"鳄鱼河"',
      '宝藏模式：在终点藏小零食作为宝藏',
      '夜间版：用手电筒的影子在室内玩'
    ]
  },
  {
    id: 'magic-statue',
    name: '魔法雕像商店',
    emoji: '🗿',
    episode: 6,
    episodeName: '魔法雕像商店',
    type: 'roleplay',
    location: 'indoor',
    energy: 1,
    minPlayers: 3,
    maxPlayers: 6,
    difficulty: 2,
    description: '一个人当店主，一个人当雕像，一个人当顾客。雕像必须保持不动，但可以偷偷移动！被顾客发现就要退款。',
    rules: [
      '分配角色：店主、雕像、顾客',
      '顾客从店主那里"购买"雕像',
      '雕像必须保持不动，直到顾客离开',
      '雕像可以偷偷移动，顾客发现后可以要求退款'
    ],
    materials: [],
    tips: '魔法雕像商店是自控力的绝佳训练！保持不动的过程就是延迟满足的练习，偷偷移动的设定又增加了趣味性。',
    upgrades: [
      '不同类型雕像：动物、超级英雄、公主雕像',
      '魔法咒语：店主念咒语才能激活雕像',
      '叮咚跑：按门铃然后跑掉，顾客去追'
    ]
  },
  {
    id: 'bbq',
    name: '假装烧烤',
    emoji: '🍖',
    episode: 7,
    episodeName: '烧烤',
    type: 'roleplay',
    location: 'both',
    energy: 2,
    minPlayers: 2,
    maxPlayers: 6,
    difficulty: 2,
    description: '用玩具食物或树叶花瓣当食材，分配烧烤师傅、顾客、服务员角色，体验烹饪和社交的乐趣。',
    rules: [
      '收集"食材"（玩具食物、树叶、花瓣等）',
      '分配角色：烧烤师傅、顾客、服务员',
      '烧烤师傅烤食物，顾客点餐，服务员上菜',
      '可以增加沙拉制作环节：收集不同颜色的食材'
    ],
    materials: ['玩具食物', '小桌子', '盘子', '夹子'],
    tips: '假装烧烤能培养生活技能和社交能力。算账环节是很好的数学启蒙，角色扮演则锻炼语言表达。',
    upgrades: [
      '外卖服务：顾客打电话点餐',
      '烧烤比赛：看谁烤的食物最受欢迎',
      '突发状况：烤焦了、没盐了、下雨了'
    ]
  },
  {
    id: 'horsey-ride',
    name: '骑马游戏',
    emoji: '🐴',
    episode: 9,
    episodeName: '骑马',
    type: 'active',
    location: 'indoor',
    energy: 3,
    minPlayers: 2,
    maxPlayers: 6,
    difficulty: 3,
    description: '家长当"马"，孩子骑在背上指挥前进、转弯、快跑。可以设置障碍赛和举办"马儿婚礼"！',
    rules: [
      '家长趴在地上当"马"，孩子骑在背上',
      '孩子指挥马前进、转弯、快跑',
      '可以设置障碍赛：绕过椅子、钻过桌子',
      '还可以举办马儿婚礼：孩子当牧师和宾客'
    ],
    materials: [],
    tips: '骑马游戏是极好的亲子互动！对家长体力有要求但回报巨大。孩子在指挥过程中锻炼语言表达，骑马则发展平衡感。',
    upgrades: [
      '搭马厩：用毯子搭一个马厩',
      '喂马：给"马"喂小零食',
      '赛马比赛：多匹马一起比赛'
    ]
  },
  {
    id: 'hotel',
    name: '酒店角色扮演',
    emoji: '🏨',
    episode: 10,
    episodeName: '酒店',
    type: 'roleplay',
    location: 'indoor',
    energy: 1,
    minPlayers: 3,
    maxPlayers: 8,
    difficulty: 3,
    description: '经营一家酒店！有人当前台办入住，有人当服务员打扫房间，有人当客人享受服务。还有餐厅和健身房！',
    rules: [
      '分配角色：酒店经理、前台、服务员、客人',
      '客人办理入住，前台给钥匙',
      '服务员打扫房间、送早餐',
      '可以扩展餐厅、健身房等设施'
    ],
    materials: ['白纸（房卡）', '小本子（登记本）', '托盘'],
    tips: '酒店扮演培养孩子的社交能力和责任感。服务他人的过程帮助孩子理解社会角色，组织能力也能得到锻炼。',
    upgrades: [
      '特殊客人：挑剔的客人、迷路的客人',
      '紧急情况：火灾演习、停电',
      '酒店评分：客人离开时打分'
    ]
  }
]

export function getGameById(id: string): Game | undefined {
  return games.find(g => g.id === id)
}

export function getGamesByType(type: Game['type']): Game[] {
  return games.filter(g => g.type === type)
}

export function getRandomGame(excludeIds?: string[]): Game {
  const pool = excludeIds ? games.filter(g => !excludeIds.includes(g.id)) : games
  return pool[Math.floor(Math.random() * pool.length)]
}
