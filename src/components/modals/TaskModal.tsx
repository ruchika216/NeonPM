import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDataStore } from '../../store/data'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const addTask = useDataStore((state) => state.addTask)
  const projects = useDataStore((state) => state.projects)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    type: 'task' as const,
    assignee: '',
    reporter: '',
    projectId: '',
    storyPoints: 1,
    labels: [] as string[],
    dueDate: '',
    estimatedHours: 0,
  })

  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const defaultProjectId = projects.length > 0 ? projects[0].id : ''

    // Guard against redundant updates to avoid render loops
    setFormData((prev) => {
      const nextReporter = user.email || ''
      if (prev.reporter === nextReporter && prev.projectId === defaultProjectId) return prev
      return { ...prev, reporter: nextReporter, projectId: defaultProjectId }
    })
    // Intentionally not depending on `projects` to avoid repeated resets on hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    addTask({
      ...formData,
      timeLogged: 0,
      attachments: [],
      comments: []
    })
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      type: 'task',
      assignee: '',
      reporter: '',
      projectId: projects.length > 0 ? projects[0].id : '',
      storyPoints: 1,
      labels: [],
      dueDate: '',
      estimatedHours: 0,
    })
    
    onClose()
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
          className="bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-cyan-300">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Basic Information */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Task Summary *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                placeholder="Enter task summary"
              />
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
                placeholder="Describe the task requirements and acceptance criteria..."
              />
            </div>

            {/* Project and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project *
                </label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issue Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="story">📖 Story</option>
                  <option value="task">📋 Task</option>
                  <option value="bug">🐛 Bug</option>
                  <option value="epic">🎯 Epic</option>
                </select>
              </div>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="critical">🔴 Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="todo">📝 To Do</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="review">👀 In Review</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            </div>

            {/* Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assignee
                </label>
                <input
                  type="email"
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="assignee@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Story Points and Estimation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Story Points
                </label>
                <select
                  value={formData.storyPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, storyPoints: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={13}>13</option>
                  <option value={21}>21</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="0"
                />
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
                  placeholder="frontend, api, testing..."
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
                Create Task
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