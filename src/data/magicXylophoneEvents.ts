import type { RandomEvent } from '../types/game'

export const magicXylophoneEvents: RandomEvent[] = [
  {
    id: 'dad-steals-xylophone',
    title: '大人抢到木琴了！',
    description: '魔法师把木琴交给大人，大人只冻住一个自愿的人 5 秒，然后还回来。',
    duration: 12,
    emoji: '😈'
  },
  {
    id: 'toilet-break',
    title: '厕所休息时间！',
    description: '安全员提醒：被冻住的人也要休息。所有人解冻，原地伸个懒腰。',
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
    description: '被冻住的人摆成稳稳的小矮人姿势，其他人离一臂距离看一圈。',
    duration: 12,
    emoji: '🧙'
  },
  {
    id: 'water-fountain',
    title: '水花音效来了！',
    description: '大人假装水管喷到自己脸上，全家一起笑三声再继续。',
    duration: 10,
    emoji: '💦'
  },
  {
    id: 'quiet-magic',
    title: '静音魔法！',
    description: '接下来只能用手势说 Freeze 和 Unfreeze，有人出声就全家一起定住 3 秒。',
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
    title: '轮到小救援员了！',
    description: '木琴交给最久没当魔法师的人。轮流才会更好玩！',
    duration: 10,
    emoji: '🧡'
  }
]
