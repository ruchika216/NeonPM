import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../store/theme'
import { useDataStore } from '../store/data'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/meetings', label: 'Meetings', icon: '📅' },
  { to: '/people', label: 'People', icon: '👥' },
  { to: '/chat', label: 'Chat', icon: '💬' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout({ children }: PropsWithChildren) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const notifications = useDataStore((s) => s.notifications)
  const markAllNotificationsRead = useDataStore((s) => s.markAllNotificationsRead)
  const [showNotif, setShowNotif] = useState(false)

  // Only toggle class when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Read user once on mount
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/landing')
  }

  const currentPageTitle = navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'

  return (
    <div className="h-screen w-full bg-black text-gray-100 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col md:w-72 h-full gradient-bg border-r border-white/5 overflow-y-auto">
        <Link to="/dashboard" className="flex items-center gap-3 px-6 h-16 border-b border-white/5 shrink-0">
          <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgba(0,212,255,0.8)]" />
          <span className="text-xl font-bold text-cyan-300">NeonPM</span>
        </Link>

        <nav className="py-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={(args: { isActive: boolean }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      args.isActive 
                        ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20' 
                        : 'text-gray-300 hover:text-cyan-200 hover:bg-white/5'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-sm font-medium text-cyan-300 mb-2">Pro Tip</h4>
            <p className="text-xs text-gray-400">Use Ctrl+K to quickly search across projects and tasks.</p>
          </div>
        </div>
      </aside>

      {/* Sidebar drawer (mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 gradient-bg border-r border-white/10 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgba(0,212,255,0.8)]" />
                  <span className="text-lg font-bold text-cyan-300">NeonPM</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300">✕</button>
              </div>
              <nav className="py-4">
                <ul className="space-y-2 px-4">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={(args: { isActive: boolean }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            args.isActive 
                              ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20' 
                              : 'text-gray-300 hover:text-cyan-200 hover:bg-white/5'
                          }`
                        }
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Right content column */}
      <div className="flex-1 min-w-0 h-full flex flex-col">
        {/* Header sticky */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-black/60 backdrop-blur">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-200"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-white truncate">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-40 sm:w-56 lg:w-64 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>

            <div className="relative">
              <button className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors" onClick={() => setShowNotif((v) => !v)}>
                <span className="text-lg">🔔</span>
                {notifications.some(n => !n.read) && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>}
              </button>
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg p-2 z-50"
                  >
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-sm text-white font-medium">Notifications</span>
                      <button className="text-xs text-cyan-300" onClick={markAllNotificationsRead}>Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.slice(0, 8).map((n) => (
                        <div key={n.id} className={`p-2 rounded border ${n.read ? 'border-white/10' : 'border-cyan-400/30'} mb-1 bg-white/5`}>
                          <div className="text-sm text-white">{n.title}</div>
                          <div className="text-xs text-gray-400">{n.body}</div>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-3 text-sm text-gray-400">No notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-black font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block text-sm text-gray-300">{user?.name}</span>
                <span className="hidden sm:block text-gray-400">▼</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-cyan-300 hover:bg-white/5 rounded transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
} 