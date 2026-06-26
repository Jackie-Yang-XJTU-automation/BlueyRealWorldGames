import type { RandomEvent } from '../types/game'

// stages 对应步骤：1 检查 / 2 X光诊断 / 3 护士安慰 / 4 搞笑手术 / 5 妙招治愈
export const hospitalEvents: RandomEvent[] = [
  {
    id: 'needle-happy-doctor',
    title: '医生太爱 Ding 了',
    description: '医生要假装打针！改成轻轻点空气三下，病人夸张说“我很勇敢”。',
    duration: 9,
    emoji: '💉',
    stages: [1, 2, 3],
  },
  {
    id: 'nurse-bingo-xray',
    title: '护士重看 X 光',
    description: '小护士发现新线索：肚子里的声音不是问题，它在追一个小秘密。',
    duration: 11,
    emoji: '📋',
    stages: [2, 3],
  },
  {
    id: 'octopus-surprise',
    title: '拿错东西啦',
    description: '手术先拿出一只假装章鱼，医生和病人一起愣住 3 秒。',
    duration: 8,
    emoji: '🐙',
    stages: [4, 5],
  },
  {
    id: 'sleepy-song',
    title: '病人需要睡着',
    description: '护士唱一小段睡觉歌，医生改成小声说话，直到病人打呼噜。',
    duration: 10,
    emoji: '😴',
    stages: [3, 4],
  },
  {
    id: 'cat-bitey',
    title: '肚子里的猫会咬',
    description: '医生的手套被神秘东西咬住了！全家用“妙招、妙招”口令把它哄出来。',
    duration: 10,
    emoji: '🐱',
    stages: [4, 5],
  },
  {
    id: 'one-more-needle',
    title: '最后还要一针',
    description: '病人刚说好了，医生宣布“路上再来一针”。只能做空气针，大家一起笑。',
    duration: 8,
    emoji: '😂',
    stages: [4, 5],
  },
]
