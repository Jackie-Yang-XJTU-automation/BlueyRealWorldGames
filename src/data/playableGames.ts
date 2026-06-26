export interface PlayableGameMeta {
  route: string
  label: string
  statusLabel: string
}

export const PLAYABLE_GAMES: Record<string, PlayableGameMeta> = {
  'magic-xylophone': {
    route: '/game/magic-xylophone/play',
    label: '🎵 开始做 Ding！',
    statusLabel: '可深度玩',
  },
  hospital: {
    route: '/game/hospital/play',
    label: '🏥 开始看诊！',
    statusLabel: '可深度玩',
  },
  'keepy-uppy': {
    route: '/game/keepy-uppy/play',
    label: '🎈 开始顶气球！',
    statusLabel: '可深度玩',
  },
  shadowlands: {
    route: '/game/shadowlands/play',
    label: '☀️ 进入影子陆地！',
    statusLabel: '可深度玩',
  },
  'magic-statue': {
    route: '/game/magic-statue/play',
    label: '🗿 商店开张！',
    statusLabel: '可深度玩',
  },
  'daddy-robot': {
    route: '/game/daddy-robot/play',
    label: '🤖 启动机器人！',
    statusLabel: '可深度玩',
  },
  bbq: {
    route: '/game/bbq/play',
    label: '🍖 开始烧烤！',
    statusLabel: '可深度玩',
  },
  'claw-machine': {
    route: '/game/claw-machine/play',
    label: '🕹️ 打开娃娃机！',
    statusLabel: '可深度玩',
  },
  hotel: {
    route: '/game/hotel/play',
    label: '🏨 开始入住！',
    statusLabel: '可深度玩',
  },
  'spy-game': {
    route: '/game/spy-game/play',
    label: '🕵️ 间谍集合！',
    statusLabel: '可深度玩',
  },
  shops: {
    route: '/game/shops/play',
    label: '🛒 商店开门！',
    statusLabel: '可深度玩',
  },
  taxi: {
    route: '/game/taxi/play',
    label: '🚕 开车出发！',
    statusLabel: '可深度玩',
  },
  pirates: {
    route: '/game/pirates/play',
    label: '🏴‍☠️ 出海！',
    statusLabel: '可深度玩',
  },
  'freeze-dance': {
    route: '/game/freeze-dance/play',
    label: '🎵 开始跳舞！',
    statusLabel: '可深度玩',
  },
  featherwand: {
    route: '/game/featherwand/play',
    label: '🪄 开始变身！',
    statusLabel: '可深度玩',
  },
  grannies: {
    route: '/game/grannies/play',
    label: '👵 变成奶奶！',
    statusLabel: '可深度玩',
  },
}

export function getPlayableGame(id: string): PlayableGameMeta | undefined {
  return PLAYABLE_GAMES[id]
}

export function isPlayableGame(id: string): boolean {
  return id in PLAYABLE_GAMES
}
