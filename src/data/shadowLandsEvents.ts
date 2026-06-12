import type { RandomEvent } from '../types/game'

export const shadowLandsEvents: RandomEvent[] = [
  {
    id: 'cloud-bridge',
    title: '云影桥来了！',
    description: '大人当侦察员，指向一片安全影子。大家小步走过去，像剧里等云帮忙一样。',
    duration: 12,
    emoji: '☁️'
  },
  {
    id: 'crocodile-river',
    title: '鳄鱼河变宽了！',
    description: '阳光水面太宽，不能硬冲。一起重新找路线，绕到最近的大影子岛。',
    duration: 12,
    emoji: '🐊'
  },
  {
    id: 'no-shortcut',
    title: 'Coco 想走捷径！',
    description: '先停住讨论：要不要守规则？全家一起说“守规则更好玩”，再继续。',
    duration: 10,
    emoji: '🚫'
  },
  {
    id: 'snickers-gap',
    title: 'Snickers 过不去！',
    description: '给小短腿朋友想办法：大人伸出“影子桥”手臂，孩子慢慢跨到下一个影子。',
    duration: 12,
    emoji: '🌭'
  },
  {
    id: 'palm-island',
    title: '被困在棕榈岛！',
    description: '大家站稳在同一片影子里，数 3 秒观察下一座安全岛，不能急着踩阳光。',
    duration: 10,
    emoji: '🌴'
  },
  {
    id: 'picnic-call',
    title: '妈妈喊吃点心啦！',
    description: '点心在对岸！先指路，再由孩子决定下一步，不能为了点心破坏规则。',
    duration: 10,
    emoji: '🧁'
  },
  {
    id: 'moving-shadow',
    title: '影子在慢慢移动！',
    description: '双脚站稳，跟着影子小小挪一步。大人提醒看脚下，不单脚挑战。',
    duration: 10,
    emoji: '🌓'
  },
  {
    id: 'bus-shadow',
    title: '巴士影子经过！',
    description: '机会来了！等大人说“可以”，大家用小步快走穿过安全影子，不奔跑。',
    duration: 8,
    emoji: '🚌'
  },
  {
    id: 'rule-coach',
    title: 'Bluey 当规则队长！',
    description: '孩子说一次规则：“阳光是鳄鱼水，影子是安全岛。”说完继续前进。',
    duration: 8,
    emoji: '📣'
  },
  {
    id: 'family-map',
    title: '全家画路线图！',
    description: '用手指在空中画出下一步路线：先到小影子，再到大影子，最后上岸。',
    duration: 10,
    emoji: '🗺️'
  }
]
