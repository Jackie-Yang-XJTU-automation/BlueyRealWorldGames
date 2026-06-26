import { useEffect } from 'react'
import { matchPath } from 'react-router-dom'
import { getGameById } from '../data/games'
import { getPlayableGame } from '../data/playableGames'
import { recordGameLaunch } from '../utils/playHistory'

export function usePlayRouteLogger(pathname: string) {
  useEffect(() => {
    const match = matchPath('/game/:gameId/play', pathname)
    const gameId = match?.params.gameId
    if (!gameId) return

    const game = getGameById(gameId)
    if (!game) return

    recordGameLaunch(game, 'direct-route', {
      route: getPlayableGame(game.id)?.route,
      note: '运行页',
    })
  }, [pathname])
}

