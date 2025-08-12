import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDataStore } from '../store/data'

export default function ProjectDetails() {
  const { id = '' } = useParams()

  // Select plain slices
  const projects = useDataStore((s) => s.projects)
  const allTasks = useDataStore((s) => s.tasks)
  const timesheets = useDataStore((s) => s.timesheets)

  // Actions
  const addTimeLog = useDataStore((s) => s.addTimeLog)
  const deleteTimeLog = useDataStore((s) => s.deleteTimeLog)
  const addProjectComment = useDataStore((s) => s.addProjectComment)

  // Derive
  const project = useMemo(() => projects.find(p => p.id === id), [projects, id])
  const tasks = useMemo(() => allTasks.filter(t => t.projectId === id), [allTasks, id])
  const timeLogs = useMemo(() => timesheets.filter(t => t.projectId === id), [timesheets, id])

  const [tab, setTab] = useState<'overview' | 'tasks' | 'time' | 'comments'>('overview')
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0])
  const [logHours, setLogHours] = useState(1)
  const [logNote, setLogNote] = useState('')
  const [commentText, setCommentText] = useState('')

  if (!project) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Project not found</h1>
        <Link to="/projects" className="text-cyan-400">← Back to Projects</Link>
      </div>
    )
  }

  const addLog = (e: React.FormEvent) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    addTimeLog({ projectId: id, userEmail: user.email || 'anonymous@example.com', date: logDate, hours: logHours, note: logNote })
    setLogNote('')
  }

  const addComment = (e: React.FormEvent) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!commentText.trim()) return
    addProjectComment(id, { author: user.email || 'anonymous@example.com', text: commentText })
    setCommentText('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="theme-muted">{project.description}</p>
        </div>
        <Link to="/projects" className="text-cyan-400">← Back</Link>
      </div>

      <div className="flex gap-2 overflow-auto">
        {(['overview', 'tasks', 'time', 'comments'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded theme-card ${tab === t ? 'border-cyan-400/40' : ''}`}>{t.toUpperCase()}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded theme-card">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="theme-muted">Status</div>
                <div className="font-semibold capitalize">{project.status}</div>
              </div>
              <div>
                <div className="theme-muted">Priority</div>
                <div className="font-semibold capitalize">{project.priority}</div>
              </div>
              <div>
                <div className="theme-muted">Start</div>
                <div className="font-semibold">{project.startDate || '—'}</div>
              </div>
              <div>
                <div className="theme-muted">End</div>
                <div className="font-semibold">{project.endDate || '—'}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="theme-muted text-sm mb-1">Progress</div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded theme-card">
            <div className="theme-muted text-sm mb-2">Team Members</div>
            <div className="flex flex-wrap gap-2 text-sm">
              {project.team.map(e => (
                <span key={e} className="px-2 py-1 rounded bg-black/10 border border-white/10">{e}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="p-4 rounded theme-card">
          <div className="theme-muted text-sm mb-2">Tasks on this project</div>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="p-2 rounded bg-black/10 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.title}</div>
                  <span className="text-xs capitalize">{t.status}</span>
                </div>
                <div className="theme-muted text-sm">{t.description}</div>
              </div>
            ))}
            {tasks.length === 0 && <div className="theme-muted">No tasks yet.</div>}
          </div>
        </div>
      )}

      {tab === 'time' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="p-4 rounded theme-card">
            <div className="theme-muted text-sm mb-2">Time Logs</div>
            <div className="space-y-2">
              {timeLogs.map(t => (
                <div key={t.id} className="p-2 rounded bg-black/10 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{t.userEmail} • {t.hours}h</div>
                    <div className="theme-muted text-xs">{t.date} {t.note ? `• ${t.note}` : ''}</div>
                  </div>
                  <button className="text-xs text-red-400" onClick={() => deleteTimeLog(t.id)}>Delete</button>
                </div>
              ))}
              {timeLogs.length === 0 && <div className="theme-muted">No time logged yet.</div>}
            </div>
          </div>

          <form onSubmit={addLog} className="p-4 rounded theme-card h-max">
            <div className="font-semibold mb-3">Add Time</div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="theme-muted mb-1">Date</div>
                <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
              </div>
              <div>
                <div className="theme-muted mb-1">Hours</div>
                <input type="number" min={0} step={0.25} value={logHours} onChange={(e) => setLogHours(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
              </div>
              <div>
                <div className="theme-muted mb-1">Note</div>
                <textarea value={logNote} onChange={(e) => setLogNote(e.target.value)} rows={3} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
              </div>
              <button className="px-3 py-2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">Log Time</button>
            </div>
          </form>
        </div>
      )}

      {tab === 'comments' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="p-4 rounded theme-card">
            <div className="theme-muted text-sm mb-2">Comments</div>
            <div className="space-y-2">
              {(project.comments || []).map(c => (
                <div key={c.id} className="p-2 rounded bg-black/10 border border-white/10">
                  <div className="text-sm font-medium">{c.author}</div>
                  <div className="theme-muted text-sm">{c.text}</div>
                </div>
              ))}
              {(project.comments || []).length === 0 && <div className="theme-muted">No comments yet.</div>}
            </div>
          </div>

          <form onSubmit={addComment} className="p-4 rounded theme-card h-max">
            <div className="font-semibold mb-3">Add Comment</div>
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={4} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
            <button className="mt-3 px-3 py-2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">Submit</button>
          </form>
        </div>
      )}
    </div>
  )
} 