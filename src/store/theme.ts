import { create } from 'zustand'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (t: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: ((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark'
    const persisted = localStorage.getItem('theme') as 'light' | 'dark' | null
    return persisted ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })(),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    set({ theme: next })
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
    localStorage.setItem('theme', next)
  },
  setTheme: (t) => {
    set({ theme: t })
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', t === 'dark')
    }
    localStorage.setItem('theme', t)
  }
})) 