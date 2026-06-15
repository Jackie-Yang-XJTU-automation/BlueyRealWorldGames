import type { RandomEvent } from '../types/game'

export const hospitalEvents: RandomEvent[] = [
  {
    id: 'needle-happy-doctor',
    title: '医生太爱 Ding 了',
    description: 'Doctor Bluey 要打针！改成轻轻点空气三下，病人夸张说“勇敢的孩子”。',
    duration: 9,
    emoji: '💉',
  },
  {
    id: 'nurse-bingo-xray',
    title: '护士重看 X 光',
    description: 'Nurse Bingo 发现新线索：猫不是问题，猫在追一只小老鼠。',
    duration: 11,
    emoji: '📋',
  },
  {
    id: 'octopus-surprise',
    title: '拿错东西啦',
    description: '手术先拿出一只假装章鱼，医生和病人一起愣住 3 秒。',
    duration: 8,
    emoji: '🐙',
  },
  {
    id: 'sleepy-song',
    title: '病人需要睡着',
    description: '护士唱一小段睡觉歌，医生必须小声说话，直到病人打呼噜。',
    duration: 10,
    emoji: '😴',
  },
  {
    id: 'cat-bitey',
    title: '肚子里的猫会咬',
    description: '医生的手套被猫咬住了！全家用“奶酪、奶酪”口令把它哄出来。',
    duration: 10,
    emoji: '🐱',
  },
  {
    id: 'one-more-needle',
    title: '最后还要一针',
    description: '病人刚说好了，医生宣布“路上再来一针”。只能做空气针，大家一起笑。',
    duration: 8,
    emoji: '😂',
  },
]
