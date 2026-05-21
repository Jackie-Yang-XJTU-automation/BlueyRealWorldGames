import { useCallback } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

export function useFavorites() {
  const getFavorites = useCallback((): string[] => {
    return loadFromStorage<string[]>('favorites', [])
  }, [])

  const isFavorite = useCallback((gameId: string): boolean => {
    return getFavorites().includes(gameId)
  }, [getFavorites])

  const toggleFavorite = useCallback((gameId: string): boolean => {
    const current = getFavorites()
    const next = current.includes(gameId)
      ? current.filter(id => id !== gameId)
      : [...current, gameId]
    saveToStorage('favorites', next)
    return !current.includes(gameId)
  }, [getFavorites])

  return { getFavorites, isFavorite, toggleFavorite }
}
