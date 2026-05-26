import type { RandomEvent } from '../types/game'

export const shadowLandsEvents: RandomEvent[] = [
  {
    id: 'cloud-covers',
    title: '云遮住了太阳！',
    description: '影子消失了！快跳到最近的影子，原地数 5 秒等云飘走！',
    duration: 10,
    emoji: '☁️'
  },
  {
    id: 'crocodile-spots',
    title: '鳄鱼发现你了！',
    description: '一只鳄鱼正盯着你！所有人一起学鳄鱼叫三声把它吓跑！',
    duration: 8,
    emoji: '🐊'
  },
  {
    id: 'shadow-moving',
    title: '影子在移动！',
    description: '脚下的影子在变！单脚站立保持平衡 5 秒，不准落地！',
    duration: 10,
    emoji: '🌓'
  },
  {
    id: 'wind-gust',
    title: '一阵大风吹来！',
    description: '风太大了！所有人原地转一圈然后继续跳影子！',
    duration: 8,
    emoji: '🌬️'
  },
  {
    id: 'leaf-storm',
    title: '落叶风暴！',
    description: '落叶砸到水面了！假装被砸到，夸张地倒在地上再爬起来！',
    duration: 10,
    emoji: '🍂'
  },
  {
    id: 'rainbow-appears',
    title: '彩虹桥出现了！',
    description: '所有玩家手牵手跳 5 下，彩虹会保佑你们安全！',
    duration: 12,
    emoji: '🌈'
  },
  {
    id: 'mosquito-attack',
    title: '蚊子来偷袭！',
    description: '嗡嗡嗡！拍三下蚊子（在空中拍三下手），然后继续！',
    duration: 8,
    emoji: '🦟'
  },
  {
    id: 'frog-leap',
    title: '青蛙过河！',
    description: '像青蛙一样蹲下跳 3 次，边跳边喊呱呱呱！',
    duration: 10,
    emoji: '🐸'
  },
  {
    id: 'lizard-crossing',
    title: '蜥蜴在晒太阳！',
    description: '一只蜥蜴占了你的影子！从它旁边轻轻绕过，不能吵醒它！',
    duration: 12,
    emoji: '🦎'
  },
  {
    id: 'grass-tickles',
    title: '草地上有蚂蚁！',
    description: '脚下痒痒的！原地跺脚 3 下把蚂蚁抖掉！',
    duration: 8,
    emoji: '🐜'
  },
  {
    id: 'sun-too-bright',
    title: '太阳太刺眼了！',
    description: '闭上眼睛原地数 5 秒——1、2、3、4、5！睁开继续！',
    duration: 8,
    emoji: '😎'
  },
  {
    id: 'shadow-double',
    title: '你的影子分身了！',
    description: '有两个影子！跟自己的影子击掌（左手拍右手），继续前进！',
    duration: 8,
    emoji: '👥'
  },
  {
    id: 'splash-puddle',
    title: '踩到水坑了！',
    description: '假装踩到水坑——夸张地跳起来甩甩脚！让脚变干！',
    duration: 8,
    emoji: '💦'
  },
  {
    id: 'cloud-race',
    title: '云朵赛跑！',
    description: '两朵云在比赛！猜哪朵先飘过太阳——猜错了的人转一圈！',
    duration: 12,
    emoji: '⛅'
  }
]
