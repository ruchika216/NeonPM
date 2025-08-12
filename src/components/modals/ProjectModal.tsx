import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDataStore } from '../../store/data'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const addProject = useDataStore((state) => state.addProject)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    startDate: '',
    endDate: '',
    assignee: '',
    reporter: '',
    team: [] as string[],
    labels: [] as string[],
  })

  const [newTeamMember, setNewTeamMember] = useState('')
  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setFormData((prev) => {
      const nextReporter = user.email || ''
      if (prev.reporter === nextReporter) return prev
      return { ...prev, reporter: nextReporter }
    })
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    addProject({
      ...formData,
      progress: 0,
      attachments: []
    })
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      assignee: '',
      reporter: '',
      team: [],
      labels: [],
    })
    
    onClose()
  }

  const addTeamMember = () => {
    if (newTeamMember.trim() && !formData.team.includes(newTeamMember.trim())) {
      setFormData(prev => ({ ...prev, team: [...prev.team, newTeamMember.trim()] }))
      setNewTeamMember('')
    }
  }

  const removeTeamMember = (member: string) => {
    setFormData(prev => ({ ...prev, team: prev.team.filter(m => m !== member) }))
  }

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData(prev => ({ ...prev, labels: [...prev.labels, newLabel.trim()] }))
      setNewLabel('')
    }
  }

  const removeLabel = (label: string) => {
    setFormData(prev => ({ ...prev, labels: prev.labels.filter(l => l !== label) }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-black/90 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cyan-300">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Lead
                </label>
                <input
                  type="email"
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="project.lead@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none resize-none"
                placeholder="Describe your project goals and objectives..."
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Members
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="team.member@company.com"
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.team.map((member) => (
                  <span
                    key={member}
                    className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-sm flex items-center gap-2"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member)}
                      className="text-blue-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Labels
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="frontend, backend, urgent..."
                />
                <button
                  type="button"
                  onClick={addLabel}
                  className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.labels.map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-sm flex items-center gap-2"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="text-green-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-gray-400 text-gray-300 hover:text-white hover:border-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
} 