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
    description: '用任何物品当作"魔法木琴"，听到 Ding 的人马上摆一个安全定格；再 Ding 一下就能解冻。',
    rules: [
      '选一个物品当作魔法木琴（勺子、笔、玩具都可以）',
      '魔法师敲击木琴，指向一个人',
      '被指到的人马上定格，姿势要站稳或坐稳',
      '再次敲击木琴才能解冻',
      '轮流当魔法师和被冻住的人'
    ],
    materials: ['任意小物品（勺子、笔、玩具）'],
    tips: '这个游戏能锻炼孩子的反应能力和规则意识。轮流当魔法师可以帮助孩子理解"轮流等待"的概念，而保持不动则训练自控力。',
    upgrades: [
      '超级冰冻：冻住后只能眨眼睛',
      '解冻小动作：被冻住的人做一个安全表情才能解冻',
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
    description: '用手、头、膝盖把气球顶在空中不能落地！可以单人挑战纪录，也可以全家合作。',
    rules: [
      '用身体部位（手、头、膝盖）把气球顶在空中',
      '不能让气球落地',
      '可以单人挑战，也可以多人合作',
      '可以看谁坚持得久，也可以全家一起救气球'
    ],
    materials: ['气球（多准备几个备用）'],
    tips: '顶气球是绝佳的手眼协调训练！合作模式培养团队精神，单人模式培养专注力。',
    upgrades: [
      '障碍模式：在房间里设置障碍物不能碰到',
      '限时合作：规定时间内全家一起让气球不落地',
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
    location: 'both',
    energy: 3,
    minPlayers: 1,
    maxPlayers: 6,
    difficulty: 3,
    description: '把影子、垫子、纸片或毛巾当安全岛，从起点慢慢走到终点。安全岛外是“鳄鱼水”，掉进去就先上岸重摆路线。',
    rules: [
      '先用影子或安全道具摆出连续路线',
      '只能慢慢走到下一座安全岛，不跑跳',
      '掉进鳄鱼水就先上岸，重新摆路线',
      '晴天可用真实影子，室内可用垫子、纸片或毛巾'
    ],
    materials: ['垫子/纸片/毛巾（阴天或室内替代）'],
    tips: '重点不是找到真实影子，而是一起造出安全路线。路线太远或太窄时，家长先暂停重摆安全岛。',
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
    description: '一个人当店主，一个人当雕像，一个人当顾客。雕像先稳稳定格，等顾客转身后偷偷变一个小动作。',
    rules: [
      '分配角色：店主、雕像、顾客',
      '顾客从店主那里"购买"雕像',
      '顾客看着时，雕像稳稳定格',
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
      '烧烤派对：顾客轮流说一句最喜欢的菜',
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
    description: '安全降级玩法：家长当慢马或马车，孩子坐在地垫旁边指挥路线、喂马和办婚礼，不追跑、不骑背。',
    rules: [
      '先铺好软垫或地毯，划出慢马路线',
      '家长趴着或坐着当慢马，孩子站在旁边指挥前进和停下',
      '只做慢走、原地转向、喂马和梳毛动作',
      '可以举办马儿婚礼：孩子当牧师、宾客或马房管理员'
    ],
    materials: ['软垫或地毯', '抱枕当马鞍或草料'],
    tips: '骑马游戏暂时只保留安全降级版本。重点是孩子指挥和照顾慢马，不让家长负重奔跑，也不把家具当障碍。',
    upgrades: [
      '搭马厩：用毯子搭一个马厩',
      '喂马：给"马"喂小零食',
      '慢马巡游：大家排队慢慢经过马厩'
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
      '感谢贴纸：客人离开时说一句最喜欢的服务'
    ]
  },
  {
    id: 'spy-game',
    name: '间谍任务',
    emoji: '🕵️',
    episode: 13,
    episodeName: 'Spy Game',
    type: 'roleplay',
    location: 'both',
    energy: 2,
    minPlayers: 3,
    maxPlayers: 6,
    difficulty: 2,
    description: '孩子组成间谍小队，给每个人分配代号和任务，收集线索、制作“控制大人”的秘密装置，最后让大人配合做搞笑动作。',
    rules: [
      '给每个玩家取一个间谍代号，选一个安全角落当秘密基地',
      '分配任务：有人找线索，有人守基地，有人制作“药水”或控制器',
      '收集安全小物品当线索，比如树叶、积木、纸片或玩具',
      '用暗号把线索送回基地，不能被“大人守卫”发现',
      '装置完成后，孩子下达一个搞笑但安全的大人动作指令'
    ],
    materials: ['纸片或积木当线索', '小盒子当秘密装置'],
    tips: '间谍任务最有趣的地方不是赢，而是每个人都有一个重要角色。家长可以故意演得有点笨，让孩子体会合作和轮流指挥。',
    upgrades: [
      '暗号模式：只能用手势或动物叫传递信息',
      '警报模式：听到警报全员冻结 5 秒',
      '小助手回归：让最小的孩子负责最后的控制按钮'
    ]
  },
  {
    id: 'claw-machine',
    name: '抓娃娃机',
    emoji: '🕹️',
    episode: 19,
    episodeName: '抓娃娃机',
    type: 'roleplay',
    location: 'indoor',
    energy: 1,
    minPlayers: 2,
    maxPlayers: 4,
    difficulty: 2,
    description: '家长变成娃娃机，孩子当指挥官。做一个小帮手动作拿硬币，投币后喊左、右、停来抓奖品。',
    rules: [
      '选一个人当"爪子机器"（推荐家长），准备几个小玩具当奖品',
      'App 给出小帮手动作，做好后机器吐出硬币',
      '投币后指挥爪子（喊左右停抓），家长伸手抓奖品',
      'App 随机判定：抓住→奖品归你！滑掉→再来！故障→挠痒修复！',
      '抓完或玩够就让奖品台收工，给指挥官和爪子一起鼓掌'
    ],
    materials: ['几个小玩具当奖品', '硬币或代币'],
    tips: '抓娃娃机是绝佳的亲子互动游戏！孩子练口头表达（指挥爪子），家长享受被挠痒的快乐。故障概率别太高，抓住的惊喜感最重要。',
    upgrades: [
      '超大娃娃模式：奖品放在远处，爪子得走远路',
      '双爪模式：两个家长同时当爪子',
      '盲盒模式：奖品用布盖住，抓之前不知道是啥'
    ]
  },
  {
    id: 'shops',
    name: '开商店',
    emoji: '🛒',
    episode: 23,
    episodeName: 'Shops',
    type: 'roleplay',
    location: 'both',
    energy: 1,
    minPlayers: 2,
    maxPlayers: 6,
    difficulty: 2,
    description: '用玩具、石头、树叶或小卡片开一家商店。孩子轮流当店主、顾客、小猫和助手，练习商量角色、开张和服务。',
    rules: [
      '先决定商店卖什么：小猫用品、玩具、早餐或任何孩子想到的东西',
      '分配角色：店主、顾客、助手、小猫或收银员',
      '准备 3-5 个商品，用纸片、积木或自然材料代替',
      '顾客提出需求，店主推荐商品，助手负责包装或收钱',
      '如果大家争角色，先暂停商量，再重新开张'
    ],
    materials: ['几个玩具或安全小物品', '纸片当钱或收据'],
    tips: '开商店的核心是“终于开张”。家长可以帮孩子把角色先定下来，让游戏从协商走向真正服务和买卖。',
    upgrades: [
      '小猫商店：顾客只能喵喵叫，店主要猜需求',
      '缺货事件：最想买的东西卖完了，店主要推荐替代品',
      '打烊整理：最后一起把商品送回原位'
    ]
  },
  {
    id: 'taxi',
    name: '出租车乘客模拟',
    emoji: '🚕',
    episode: 25,
    episodeName: 'Taxi',
    type: 'roleplay',
    location: 'indoor',
    energy: 2,
    minPlayers: 2,
    maxPlayers: 5,
    difficulty: 2,
    description: '孩子当出租车司机，家长当乘客。App 抽红灯、减速带、急转弯、堵车和乱导航，大家跟着身体反应一起演。',
    rules: [
      '孩子拿抱枕或盘子当方向盘，家长抱一个枕头当行李',
      'App 每局随机抽路况：红灯、减速带、急转弯、堵车、导航乱指等',
      '孩子选择司机动作，家长马上定住、颠三下、一起歪或夸张坐稳',
      '可以点语音播报，少读字也能按提示玩',
      '到站后回看今天遇到的路况，再开一局也会不一样'
    ],
    materials: ['抱枕或盘子当方向盘', '枕头或纸袋当行李', '一个玩具当晕车宝宝（可选）'],
    tips: '这个游戏不需要熟悉原剧。好玩的关键是路况一来，全家马上用身体反应：急刹定住、减速带轻颠、急转弯一起歪。',
    upgrades: [
      '导航乱指：左转、右转、绕一圈',
      '天气模式：下雨开雨刷，进隧道变小声',
      '乘客模式：晕车宝宝、唱歌喇叭、下一位乘客'
    ]
  },
  {
    id: 'pirates',
    name: '海盗船冒险',
    emoji: '🏴‍☠️',
    episode: 27,
    episodeName: 'Pirates',
    type: 'story',
    location: 'both',
    energy: 2,
    minPlayers: 2,
    maxPlayers: 5,
    difficulty: 2,
    description: '把毯子、抱枕或秋千想象成海盗船。家长当旁白和大海，孩子当船员，经历风暴、鲸鱼和宝藏救援。',
    rules: [
      '用毯子、抱枕或地垫划出一艘安全海盗船',
      '分配角色：船长、贪心海盗、灯塔守护者、鲸鱼或旁白',
      '船员坐在船里，家长用声音和轻轻摇晃制造风浪',
      '有人害怕时可以去“灯塔”休息，再选择是否回来救援',
      '最后一起挠痒或拍手赶走大鲸鱼，船员安全回港'
    ],
    materials: ['毯子或抱枕当船', '纸片当藏宝图'],
    tips: '海盗船冒险适合练勇敢，也适合练“害怕可以先停”。家长的旁白越像故事，孩子越容易被带进去。',
    upgrades: [
      '藏宝图模式：按线索找到一个小奖品',
      '灯塔救援：害怕的孩子可以当救援队长',
      '鲸鱼来啦：家长当鲸鱼，只能温柔摇船和发声音'
    ]
  },
  {
    id: 'freeze-dance',
    name: '音乐定格舞',
    emoji: '🕺',
    episode: 0,
    episodeName: 'Freeze Dance',
    type: 'active',
    location: 'both',
    energy: 3,
    minPlayers: 2,
    maxPlayers: 8,
    difficulty: 1,
    description: '音乐响起就跟着主题跳，手机喊停时所有人马上定住别动。动了的人笑一笑，换个定格姿势再来。是不依托剧情、空手就能玩的经典现实游戏。',
    rules: [
      '清出一块没有尖角的空地',
      '音乐响起，跟着手机给的跳舞主题一起跳',
      '听到提示音（音乐停）所有人立刻定住别动',
      '家长当裁判：全员定住就算成功一次，有人动了就换姿势再来',
      '所有定格都降级为安全姿势，不单脚硬撑、不爬高'
    ],
    materials: [],
    tips: '这是最容易救场的游戏：不用道具、规则一句话讲清。想让孩子释放体力时特别好用，定格主题越呆萌孩子越爱笑。',
    upgrades: [
      '主题模式：只能定成动物，或只能定成厨房用品',
      '慢动作回合：跳舞和定格都要用慢动作',
      '冠军赛：连续定住 5 次就是今天的木头人冠军'
    ]
  },
  {
    id: 'featherwand',
    name: '魔法羽毛棒',
    emoji: '🪄',
    episode: 33,
    episodeName: 'Featherwand',
    type: 'roleplay',
    location: 'both',
    energy: 2,
    minPlayers: 2,
    maxPlayers: 6,
    difficulty: 1,
    description: '用一根筷子或羽毛当魔法棒，挥一下，被指到的人就要变身——变动物、变慢动作、变大变小。每个人轮流当魔法师，最后用解咒动作温柔变回自己。',
    rules: [
      '找一根安全的小棒或羽毛当魔法棒',
      '魔法师挥棒指人，被指到的人立刻变身并演出来',
      '魔法可以是：变动物、变慢/快动作、变大/变小',
      '轮流把魔法棒传给下一个人，让每人都当魔法师',
      '想结束时用一个温柔的解咒动作，让大家变回自己'
    ],
    materials: ['筷子、铅笔或羽毛当魔法棒'],
    tips: '魔法棒游戏适合空手开局的想象时刻。家长配合被变身演得越夸张，孩子越投入；轮流当魔法师能练习指挥与被指挥。',
    upgrades: [
      '组合咒语：一次变身两个人，要变成同一种东西',
      '反向魔法：魔法师自己也会被反弹变身',
      '安静魔法：只能用动作不能出声，靠猜来玩'
    ]
  },
  {
    id: 'grannies',
    name: '老奶奶',
    emoji: '👵',
    episode: 28,
    episodeName: 'Grannies',
    type: 'roleplay',
    location: 'both',
    energy: 2,
    minPlayers: 2,
    maxPlayers: 5,
    difficulty: 1,
    description: '全家一起假装成老奶奶：取个奶奶名字、扶着拐杖慢慢走、坐下喝茶聊天，再突然跳起最潮的街舞。拌嘴之后还要学会道歉和好。',
    rules: [
      '每人取一个老奶奶名字，找个拐杖道具（雨伞、卷纸芯都行）',
      '用慢慢的步子、弯弯的腰扶着拐杖走来走去',
      '坐下来假装喝茶，用老奶奶的声音聊聊天',
      '老奶奶突然跳起 floss 或任意搞笑舞，反差越大越好笑',
      '为小事好笑地拌嘴，再想办法道歉和好'
    ],
    materials: ['雨伞或卷纸芯当拐杖'],
    tips: '老奶奶的乐趣在于反差：慢动作配上突然的街舞最好笑。结尾的"拌嘴—和好"也能自然练习道歉，是很好的情感收尾。',
    upgrades: [
      '逛超市：奶奶们慢慢去"超市"买一样东西',
      '奶奶斗舞：两位奶奶比谁跳得潮，其他人当评委',
      '茶话会：每位奶奶说一件今天最开心的事'
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
