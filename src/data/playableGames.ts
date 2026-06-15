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
}

export function getPlayableGame(id: string): PlayableGameMeta | undefined {
  return PLAYABLE_GAMES[id]
}

export function isPlayableGame(id: string): boolean {
  return id in PLAYABLE_GAMES
}
