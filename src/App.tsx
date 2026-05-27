import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { GameDetailPage } from './pages/GameDetailPage'
import { KeepyUppyPage } from './pages/KeepyUppyPage'
import { ShadowLandsPage } from './pages/ShadowLandsPage'
import { DaddyRobotPage } from './pages/DaddyRobotPage'
import { TimerPage } from './pages/TimerPage'
import { DicePage } from './pages/DicePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'game/keepy-uppy/play', element: <KeepyUppyPage /> },
      { path: 'game/shadowlands/play', element: <ShadowLandsPage /> },
      { path: 'game/daddy-robot/play', element: <DaddyRobotPage /> },
      { path: 'game/:gameId', element: <GameDetailPage /> },
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
