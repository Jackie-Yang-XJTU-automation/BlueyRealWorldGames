import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 入住 / 2 看房 / 3 叫醒 / 4 疯狂枕头 / 5 客房服务
export const hotelEvents: RandomEvent[] = [
  {
    id: 'lost-key',
    title: '房卡不见了',
    description: '经理和助手一起找一张纸片房卡，客人可以假装很困但要有礼貌。',
    duration: 12,
    emoji: '🔑',
    stages: [1, 2],
  },
  {
    id: 'crazy-helper',
    title: '疯狂助手冲进来',
    description: '助手用一个安全声音叫醒客人，然后经理赶紧把助手请出去。',
    duration: 10,
    emoji: '📯',
    stages: [3, 4],
  },
  {
    id: 'news-time',
    title: '电视新闻时间',
    description: '经理和助手当电视新闻，播报“今天酒店太吵了”。',
    duration: 12,
    emoji: '📺',
    stages: [2, 3, 4],
  },
  {
    id: 'guest-complaint',
    title: '客人投诉',
    description: '客人说一个小问题，经理先道歉，再提出一个更好笑的解决办法。',
    duration: 12,
    emoji: '😴',
    stages: [3, 4, 5],
  },
  {
    id: 'pillow-request',
    title: '我要当疯狂枕头',
    description: '暂停一下，问问每个人想当什么角色，然后让最想换的人换一次。',
    duration: 14,
    emoji: '🛏️',
    stages: [3, 4],
  },
  {
    id: 'mum-checks-room',
    title: '妈妈来检查房间',
    description: '全员 10 秒整理一个小角落，酒店游戏也要会收拾。',
    duration: 10,
    emoji: '🧺',
  },
]
