import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 摆桌 / 2 点单 / 3 配彩色沙拉 / 4 翻面加酱 / 5 上桌感谢
export const bbqEvents: RandomEvent[] = [
  {
    id: 'green-capsicum-needed',
    title: '客人要绿色食材',
    description: '客人突然指定绿色！找一个安全绿色物品放进假装沙拉碗。',
    duration: 10,
    emoji: '🟢',
    stages: [2, 3],
  },
  {
    id: 'yellow-capsicum-too',
    title: '客人又加黄色',
    description: '黄色也要！不许爬高，改用地上的黄色道具或请大人帮忙。',
    duration: 11,
    emoji: '🟡',
    stages: [2, 3],
  },
  {
    id: 'red-is-favourite',
    title: '红色才是最喜欢',
    description: 'Socks 最喜欢红色，找红色替代物时要慢慢走、轻轻放。',
    duration: 10,
    emoji: '🔴',
    stages: [2, 3],
  },
  {
    id: 'relaxing-chair-call',
    title: '大厨想休息',
    description: '大厨坐到休息椅上数到三，其他人先说谢谢再加单。',
    duration: 9,
    emoji: '🪑',
  },
  {
    id: 'salad-dressing-missing',
    title: '还缺沙拉酱',
    description: '假装倒沙拉酱，厨师要说“这是泥巴口味”，客人认真试吃。',
    duration: 10,
    emoji: '🥗',
    stages: [3, 4],
  },
  {
    id: 'sausage-ready',
    title: '香肠好了',
    description: '所有人准备上桌，但要先感谢做沙拉的人，不然大厨会提醒大家。',
    duration: 8,
    emoji: '🌭',
    stages: [4, 5],
  },
]
