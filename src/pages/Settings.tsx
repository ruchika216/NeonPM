import { useState } from 'react'
import { useThemeStore } from '../store/theme'

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore()
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : { name: 'Demo User', email: 'demo@neonpm.com' }
  })

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('user', JSON.stringify(user))
    alert('Profile saved')
  }

  const clearData = () => {
    localStorage.removeItem('neonpm-data')
    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/landing'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Settings</h1>

      <section className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-lg font-medium text-white mb-3">Profile</h2>
        <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-400">Name</label>
            <input
              className="mt-1 w-full text-white bg-black/40 border border-white/10 rounded px-3 py-2"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-gray-400">Email</label>
            <input
              className="mt-1 w-full text-white bg-black/40 border border-white/10 rounded px-3 py-2"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <button className="px-4 py-2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              Save Profile
            </button>
          </div>
        </form>
      </section>

      <section className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-lg font-medium text-white mb-3">Appearance</h2>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/40"
        >
          Toggle Theme (current: {theme})
        </button>
      </section>

      <section className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-lg font-medium text-white mb-3">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={clearData} className="px-4 py-2 rounded bg-red-500/10 text-red-300 border border-red-500/30">
            Clear Local Data
          </button>
          <button onClick={logout} className="px-4 py-2 rounded bg-white/5 border border-white/10 text-gray-200">
            Logout
          </button>
        </div>
      </section>
    </div>
  )
} 