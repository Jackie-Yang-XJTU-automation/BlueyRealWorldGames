import type { RandomEvent } from '../types/game'

export const magicXylophoneEvents: RandomEvent[] = [
  {
    id: 'dad-steals-xylophone',
    title: '爸爸抢到木琴了！',
    description: '魔法师立刻把木琴交给大人，大人可以冻住一个小朋友 5 秒，然后必须还回来。',
    duration: 12,
    emoji: '😈'
  },
  {
    id: 'toilet-break',
    title: '厕所休息时间！',
    description: 'Chilli 妈妈提醒：被冻住的人也要休息。所有人解冻，原地伸个懒腰。',
    duration: 10,
    emoji: '🚽'
  },
  {
    id: 'blink-answer',
    title: '只能眨眼回答！',
    description: '被冻住的人不能说话，只能眨眼：眨一下是“不”，眨两下是“是”。',
    duration: 14,
    emoji: '😉'
  },
  {
    id: 'garden-gnome',
    title: '花园小矮人模式！',
    description: '被冻住的人要摆成小矮人姿势，其他人围着他转一圈。',
    duration: 12,
    emoji: '🧙'
  },
  {
    id: 'water-fountain',
    title: '爸爸喷泉来了！',
    description: '大人假装水管喷到自己脸上，全家一起笑三声再继续。',
    duration: 10,
    emoji: '💦'
  },
  {
    id: 'quiet-magic',
    title: '静音魔法！',
    description: '接下来只能用手势说 Freeze 和 Unfreeze，谁出声谁要冻住 3 秒。',
    duration: 14,
    emoji: '🤫'
  },
  {
    id: 'antler-hat',
    title: '鹿角帽出现！',
    description: '给被冻住的人想一个温柔的装扮：帽子、围巾、披风，不能乱画脸哦。',
    duration: 12,
    emoji: '🦌'
  },
  {
    id: 'bingo-turn',
    title: '该 Bingo 了！',
    description: '木琴必须交给最久没当魔法师的人。轮流才会更好玩！',
    duration: 10,
    emoji: '🧡'
  }
]
