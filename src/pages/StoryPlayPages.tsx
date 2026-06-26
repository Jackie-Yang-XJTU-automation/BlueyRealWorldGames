import { StoryPlayPage } from '../components/StoryPlayPage'
import { STORY_PLAY_CONFIGS } from '../data/storyPlayConfigs'

export function MagicStatuePage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS['magic-statue']} />
}

export function HotelPage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS.hotel} />
}

export function SpyGamePage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS['spy-game']} />
}

export function ShopsPage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS.shops} />
}

export function PiratesPage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS.pirates} />
}

export function FeatherwandPage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS.featherwand} />
}

export function GranniesPage() {
  return <StoryPlayPage config={STORY_PLAY_CONFIGS.grannies} />
}
