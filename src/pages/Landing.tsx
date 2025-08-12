import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../store/theme'

interface AuthFormData {
  email: string
  password: string
  name?: string
}

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate authentication - in real app, this would connect to backend
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      name: formData.name || 'Demo User',
      email: formData.email
    }))
    navigate('/dashboard')
  }

  const handleDemoLogin = () => {
    localStorage.setItem('user', JSON.stringify({
      id: 'demo',
      name: 'Demo User',
      email: 'demo@neonpm.com'
    }))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,212,255,0.05),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_16px_4px_rgba(0,212,255,0.8)]" />
            <span className="text-xl font-bold text-cyan-300">NeonPM</span>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
              aria-label="Toggle theme"
            >
              <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleDemoLogin}
              className="px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 transition-colors"
            >
              Try Demo
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-120px)]">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Project Management
                <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience the future of team collaboration with real-time chat, video calls, 
                AI-powered task management, and stunning visualizations.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🚀', title: 'AI-Powered', desc: 'Smart task suggestions' },
                { icon: '💬', title: 'Real-time Chat', desc: 'Video & audio calls' },
                { icon: '📊', title: 'Analytics', desc: 'Beautiful dashboards' },
                { icon: '⚡', title: 'Lightning Fast', desc: 'Instant updates' }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-cyan-300">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Authentication Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-cyan-300 mb-2">
                  {isLogin ? 'Welcome Back' : 'Join NeonPM'}
                </h2>
                <p className="text-gray-400">
                  {isLogin ? 'Sign in to your account' : 'Create your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:from-cyan-300 hover:to-blue-400 transform hover:scale-105 transition-all duration-200 shadow-[0_4px_20px_rgba(0,212,255,0.3)]"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={handleDemoLogin}
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Continue with Demo Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 