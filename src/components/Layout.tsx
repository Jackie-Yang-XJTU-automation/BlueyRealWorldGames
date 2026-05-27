import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Clouds } from './Clouds'
import blueyLogo from '../assets/bluey-trademark-blue-white.svg'

export function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showTools, setShowTools] = useState(false)

  return (
    <div className="min-h-screen bg-btv-sky relative" onClick={() => setShowTools(false)}>
      <Clouds />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[500] focus:px-5 focus:py-3 focus:bg-white focus:rounded-full focus:shadow-lg focus:font-extrabold focus:text-btv-dark focus:no-underline">
        跳到主要内容
      </a>

      <header className="sticky top-0 z-[200] bg-white/85 backdrop-blur-md border-b-2 border-[#BBDEFB]">
        <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center no-underline shrink-0">
            <img
              src={blueyLogo}
              alt="Bluey"
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-1.5">
            {/* 工具箱 */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShowTools(!showTools)}
                className="w-10 h-10 rounded-full bg-btv-light-sky text-lg flex items-center justify-center hover:bg-btv-blue hover:text-white transition-all duration-200 shadow-sm"
                title="工具箱"
              >
                🧰
              </button>
              {showTools && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border-2 border-[#E3F2FD] py-2 min-w-36 z-[100] animate-event-pop-in">
                  <Link
                    to="/tools/timer"
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-2 px-4 py-2.5 font-extrabold text-btv-dark hover:bg-[#E3F2FD] transition-colors"
                  >
                    <span className="text-lg">⏱</span> 计时器
                  </Link>
                  <Link
                    to="/tools/dice"
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-2 px-4 py-2.5 font-extrabold text-btv-dark hover:bg-[#E3F2FD] transition-colors"
                  >
                    <span className="text-lg">🎲</span> 骰子
                  </Link>
                </div>
              )}
            </div>

            {/* 返回按钮 */}
            {!isHome && (
              <Link
                to="/"
                className="shrink-0 bg-[#abe0fa] text-[#5a5a87] font-extrabold px-4.5 py-2 rounded-full border-2 border-white/60
                           hover:bg-[#9edefd] hover:scale-105 active:scale-95 transition-all duration-200 text-xs shadow-sm flex items-center gap-1"
              >
                <span>← 返回首页</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8 relative">
        <Outlet />
      </main>

      <footer className="text-center py-12 text-[#5a5a87]/40 text-xs font-black tracking-widest uppercase">
        <p>© Ludo Studio · Bluey Real World Games · 和宝宝一起玩真的！</p>
      </footer>
    </div>
  )
}
