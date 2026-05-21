import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { GameDetailPage } from './pages/GameDetailPage'
import { KeepyUppyPage } from './pages/KeepyUppyPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'game/keepy-uppy/play', element: <KeepyUppyPage /> },
      { path: 'game/:gameId', element: <GameDetailPage /> }
    ]
  }
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, ''),
})

export default function App() {
  return <RouterProvider router={router} />
}
