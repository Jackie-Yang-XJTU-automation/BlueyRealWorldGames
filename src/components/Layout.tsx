import { Link, Outlet, useLocation } from 'react-router-dom'
import { Clouds } from './Clouds'
import blueyLogo from '../assets/bluey-icon.jpg'

export function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-btv-sky relative">
      <Clouds />

      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b-2 border-[#BBDEFB]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src={blueyLogo}
              alt="Bluey"
              className="h-10 w-auto rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
            />
            <div>
              <h1 className="text-lg font-extrabold text-btv-blue leading-tight">
                Bluey 现实世界游戏
              </h1>
              <p className="text-xs text-btv-blue/60 font-bold tracking-wider uppercase">
                Bluey Real World Games
              </p>
            </div>
          </Link>
          {!isHome && (
            <Link
              to="/"
              className="bg-btv-light-sky text-btv-blue font-extrabold px-6 py-2.5 rounded-full
                         hover:bg-btv-blue hover:text-white transition-all duration-200"
            >
              ← 返回
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative">
        <Outlet />
      </main>

      <footer className="text-center py-10 text-btv-blue/35 text-sm font-bold">
        <p>Bluey Real World Games · 和宝宝一起玩真的！</p>
      </footer>
    </div>
  )
}
