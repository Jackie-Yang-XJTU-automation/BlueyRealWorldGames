import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { GameDetailPage } from './pages/GameDetailPage'
import { KeepyUppyPage } from './pages/KeepyUppyPage'
import { MagicXylophonePage } from './pages/MagicXylophonePage'
import { ShadowLandsPage } from './pages/ShadowLandsPage'
import { DaddyRobotPage } from './pages/DaddyRobotPage'
import { TimerPage } from './pages/TimerPage'
import { DicePage } from './pages/DicePage'
import { ClawGamePage } from './pages/ClawGamePage'
import { HospitalPage } from './pages/HospitalPage'
import { BbqPage } from './pages/BbqPage'
import { FeatherwandPage, GranniesPage, HotelPage, MagicStatuePage, PiratesPage, ShopsPage, SpyGamePage } from './pages/StoryPlayPages'
import { TaxiPage } from './pages/TaxiPage'
import { FreezeDancePage } from './pages/FreezeDancePage'
import { FamilyPlayLogPage } from './pages/FamilyPlayLogPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'game/magic-xylophone/play', element: <MagicXylophonePage /> },
      { path: 'game/hospital/play', element: <HospitalPage /> },
      { path: 'game/keepy-uppy/play', element: <KeepyUppyPage /> },
      { path: 'game/shadowlands/play', element: <ShadowLandsPage /> },
      { path: 'game/daddy-robot/play', element: <DaddyRobotPage /> },
      { path: 'game/bbq/play', element: <BbqPage /> },
      { path: 'game/claw-machine/play', element: <ClawGamePage /> },
      { path: 'game/magic-statue/play', element: <MagicStatuePage /> },
      { path: 'game/hotel/play', element: <HotelPage /> },
      { path: 'game/spy-game/play', element: <SpyGamePage /> },
      { path: 'game/shops/play', element: <ShopsPage /> },
      { path: 'game/taxi/play', element: <TaxiPage /> },
      { path: 'game/pirates/play', element: <PiratesPage /> },
      { path: 'game/freeze-dance/play', element: <FreezeDancePage /> },
      { path: 'game/featherwand/play', element: <FeatherwandPage /> },
      { path: 'game/grannies/play', element: <GranniesPage /> },
      { path: 'game/:gameId', element: <GameDetailPage /> },
      { path: 'family-log', element: <FamilyPlayLogPage /> },
      { path: 'tools/timer', element: <TimerPage /> },
      { path: 'tools/dice', element: <DicePage /> },
    ]
  }
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, ''),
})

export default function App() {
  return <RouterProvider router={router} />
}
