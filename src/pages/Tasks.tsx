import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useDataStore, type Task } from '../store/data'
import TaskModal from '../components/modals/TaskModal'

const STATUSES: Task['status'][] = ['todo', 'in-progress', 'review', 'done']

export default function Tasks() {
  const tasks = useDataStore((s) => s.tasks)
  const projects = useDataStore((s) => s.projects)
  const updateTask = useDataStore((s) => s.updateTask)

  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const grouped = useMemo(() => {
    const filtered = projectFilter === 'all' ? tasks : tasks.filter(t => t.projectId === projectFilter)
    return STATUSES.map(status => ({
      status,
      items: filtered.filter(t => t.status === status)
    }))
  }, [tasks, projectFilter])

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/task-id', taskId)
  }

  const onDrop = (e: React.DragEvent, status: Task['status']) => {
    const id = e.dataTransfer.getData('text/task-id')
    if (id) updateTask(id, { status })
  }

  const onDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
          >
            + New Task
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[60vh]">
        {grouped.map(col => (
          <div
            key={col.status}
            onDrop={(e) => onDrop(e, col.status)}
            onDragOver={onDragOver}
            className="rounded-lg theme-card p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium capitalize">{col.status.replace('-', ' ')}</h3>
              <span className="text-xs theme-muted">{col.items.length}</span>
            </div>
            <div className="space-y-2">
              {col.items.map(task => (
                <div
                  key={task.id}
                  className="p-2 rounded bg-black/40 border border-white/10"
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium truncate">{task.title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      task.priority === 'critical' ? 'text-red-600 border-red-400/60' :
                      task.priority === 'high' ? 'text-orange-600 border-orange-400/60' :
                      task.priority === 'medium' ? 'text-yellow-700 border-yellow-500/60' :
                      'text-green-700 border-green-500/60'
                    }`}>{task.priority}</span>
                  </div>
                  <p className="text-[11px] theme-muted line-clamp-2 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
} 