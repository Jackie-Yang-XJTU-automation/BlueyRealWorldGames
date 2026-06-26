export type GameType = 'active' | 'roleplay' | 'story' | 'quiet'
export type Location = 'indoor' | 'outdoor' | 'both'
export type EnergyLevel = 1 | 2 | 3

export interface Game {
  id: string
  name: string
  emoji: string
  episode: number
  episodeName: string
  type: GameType
  location: Location
  energy: EnergyLevel
  minPlayers: number
  maxPlayers: number
  difficulty: 1 | 2 | 3
  description: string
  rules: string[]
  materials: string[]
  tips: string
  upgrades: string[]
}

export interface LeaderboardEntry {
  name: string
  time: number
  score: number
  date: string
}

export interface RandomEvent {
  id: string
  title: string
  description: string
  duration: number
  emoji: string
  // 该事件可触发的任务步骤号（1-based，对应「第 N 步」）。
  // 省略表示任意阶段都可触发（仅限休息/暂停/收拾这类不与主线冲突的事件）。
  // 调度器只会在当前步命中的事件里抽取，避免随机事件与当前任务逻辑打架（见 REQUIREMENTS G2）。
  stages?: number[]
}

export interface TaskCard {
  id: string
  title: string
  description: string
  hostPrompt?: string
  completed: boolean
  emoji?: string
  stageLabel?: string
  stageGoal?: string
  safetyNote?: string
}

export type TimerState = 'idle' | 'running' | 'paused' | 'finished'

export type FilterOptions = {
  type: GameType | 'all'
  location: Location | 'all'
  energy: EnergyLevel | 'all'
  difficulty: number | 'all'
}

export type FaultInteractionType = 'tap' | 'longpress' | 'shake' | 'voice'

export interface GameFault extends RandomEvent {
  interactionType: FaultInteractionType
  totalRequired: number
}
