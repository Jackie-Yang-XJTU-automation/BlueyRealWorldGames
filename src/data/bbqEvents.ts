import type { RandomEvent } from '../types/game'

export const bbqEvents: RandomEvent[] = [
  {
    id: 'green-capsicum-needed',
    title: 'Muffin 要绿色彩椒',
    description: '客人突然指定绿色！找一个安全绿色物品放进假装沙拉碗。',
    duration: 10,
    emoji: '🟢',
  },
  {
    id: 'yellow-capsicum-too',
    title: 'Bluey 又加黄色',
    description: '黄色也要！不许爬高，改用地上的黄色道具或请大人帮忙。',
    duration: 11,
    emoji: '🟡',
  },
  {
    id: 'red-is-favourite',
    title: '红色才是最喜欢',
    description: 'Socks 最喜欢红色，找红色替代物时要慢慢走、轻轻放。',
    duration: 10,
    emoji: '🔴',
  },
  {
    id: 'relaxing-chair-call',
    title: 'Bingo 想休息',
    description: 'Bingo 坐到放松椅上数到三，其他人必须先说谢谢再加单。',
    duration: 9,
    emoji: '🪑',
  },
  {
    id: 'salad-dressing-missing',
    title: '还缺沙拉酱',
    description: '假装倒沙拉酱，厨师要说“这是泥巴口味”，客人认真试吃。',
    duration: 10,
    emoji: '🥗',
  },
  {
    id: 'sausage-ready',
    title: '香肠好了',
    description: '所有人准备上桌，但要先感谢沙拉，不然 Bingo 会提醒大家。',
    duration: 8,
    emoji: '🌭',
  },
]
