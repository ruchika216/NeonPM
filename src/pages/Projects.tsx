import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useDataStore, type Project } from '../store/data'
import ProjectModal from '../components/modals/ProjectModal'
import { useNavigate } from 'react-router-dom'

export default function Projects() {
  const projects = useDataStore((s) => s.projects)
  const updateProject = useDataStore((s) => s.updateProject)
  const deleteProject = useDataStore((s) => s.deleteProject)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | Project['status']>('all')
  const [priority, setPriority] = useState<'all' | Project['priority']>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortKey, setSortKey] = useState<'recent' | 'progress' | 'name'>('recent')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const list = projects.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === 'all' || p.status === status
      const matchesPriority = priority === 'all' || p.priority === priority
      return matchesQuery && matchesStatus && matchesPriority
    })

    const sorted = [...list].sort((a, b) => {
      if (sortKey === 'progress') return b.progress - a.progress
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    return sorted
  }, [projects, query, status, priority, sortKey])

  const quickUpdate = (id: string, updates: Partial<Project>) => {
    updateProject(id, updates)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold text-white">Projects</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="recent">Sort: Recent</option>
            <option value="progress">Sort: Progress</option>
            <option value="name">Sort: Name</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
          >
            + New Project
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            aria-label={`Open ${project.name}`}
            onClick={() => navigate(`/projects/${project.id}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/projects/${project.id}`) }}
            className="cursor-pointer p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-400/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          >
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <div className="text-white font-semibold text-lg hover:text-cyan-300">{project.name}</div>
                <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === 'active' ? 'bg-green-400/10 text-green-400' :
                project.status === 'planning' ? 'bg-yellow-400/10 text-yellow-400' :
                project.status === 'on-hold' ? 'bg-orange-400/10 text-orange-400' :
                'bg-gray-400/10 text-gray-400'
              }`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="rounded bg-black/40 border border-white/10 p-2">
                <div className="text-gray-400">Priority</div>
                <div className="text-white capitalize">{project.priority}</div>
              </div>
              <div className="rounded bg-black/40 border border-white/10 p-2">
                <div className="text-gray-400">Team</div>
                <div className="text-white">{project.team.length}</div>
              </div>
              <div className="rounded bg-black/40 border border-white/10 p-2">
                <div className="text-gray-400">Due</div>
                <div className="text-white">{project.endDate ? format(new Date(project.endDate), 'MMM dd') : '—'}</div>
              </div>
            </div>

            <div className="h-2 bg-gray-700 rounded-full mb-3">
              <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${project.progress}%` }} />
            </div>

            {project.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {project.labels.slice(0, 5).map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-gray-300">{l}</span>
                ))}
                {project.labels.length > 5 && (
                  <span className="text-xs text-gray-400">+{project.labels.length - 5} more</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>Progress</span>
                <input type="range" min={0} max={100} value={project.progress} onChange={(e) => quickUpdate(project.id, { progress: parseInt(e.target.value) })} />
                <span className="text-white">{project.progress}%</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }} className="text-red-400 hover:text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
} 