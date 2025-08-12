import { useMemo, useState } from 'react'
import { useDataStore, type UserProfile } from '../store/data'

export default function People() {
  const users = useDataStore((s) => s.users)
  const projects = useDataStore((s) => s.projects)
  const tasks = useDataStore((s) => s.tasks)
  const timesheets = useDataStore((s) => s.timesheets)
  const updateUser = useDataStore((s) => s.updateUser)
  const addUser = useDataStore((s) => s.addUser)
  const deleteUser = useDataStore((s) => s.deleteUser)

  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserProfile['role']>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | UserProfile['status']>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesQ = [u.name, u.email, u.title, u.department].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase())
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter
      return matchesQ && matchesRole && matchesStatus
    })
  }, [users, query, roleFilter, statusFilter])

  const stats = (email: string) => {
    const userProjects = projects.filter(p => p.team.includes(email) || p.assignee === email || p.reporter === email)
    const userTasks = tasks.filter(t => t.assignee === email || t.reporter === email)
    const hours = timesheets.filter(t => t.userEmail === email).reduce((s, t) => s + t.hours, 0)
    return { projects: userProjects.length, tasks: userTasks.length, hours }
  }

  const addDemoUser = () => {
    addUser({ name: 'New User', email: `user${Math.floor(Math.random()*1000)}@company.com`, role: 'developer', title: 'Engineer', department: 'Engineering', status: 'active' })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">People</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email..." className="px-3 py-2 rounded bg-white/5 border border-white/10" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="px-3 py-2 rounded bg-white/5 border border-white/10">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="qa">QA</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 rounded bg-white/5 border border-white/10">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={addDemoUser} className="px-3 py-2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">+ Add User</button>
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(u => {
          const s = stats(u.email)
          const isEditing = editingId === u.id
          return (
            <div key={u.id} className="rounded-xl theme-card p-4 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-semibold flex items-center justify-center">
                    {(u.name || u.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{u.name}</div>
                    <div className="text-xs theme-muted truncate">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${u.role === 'admin' ? 'border-yellow-400/50 text-yellow-400' : 'border-white/10 theme-muted'}`}>{u.role}</span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${u.status === 'active' ? 'border-green-400/50 text-green-400' : 'border-red-400/50 text-red-400'}`}>{u.status}</span>
                </div>
              </div>

              {/* Details */}
              {!isEditing ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="theme-muted">Title</div>
                    <div className="font-medium">{u.title || '—'}</div>
                  </div>
                  <div>
                    <div className="theme-muted">Department</div>
                    <div className="font-medium">{u.department || '—'}</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="theme-muted mb-1">Role</div>
                    <select value={u.role} onChange={(e) => updateUser(u.id, { role: e.target.value as any })} className="w-full px-2 py-2 rounded bg-white/5 border border-white/10">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="qa">QA</option>
                    </select>
                  </div>
                  <div>
                    <div className="theme-muted mb-1">Status</div>
                    <select value={u.status} onChange={(e) => updateUser(u.id, { status: e.target.value as any })} className="w-full px-2 py-2 rounded bg-white/5 border border-white/10">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <div className="theme-muted mb-1">Title</div>
                    <input value={u.title || ''} onChange={(e) => updateUser(u.id, { title: e.target.value })} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                  </div>
                  <div className="col-span-2">
                    <div className="theme-muted mb-1">Department</div>
                    <input value={u.department || ''} onChange={(e) => updateUser(u.id, { department: e.target.value })} className="w-full px-3 py-2 rounded bg-white/5 border border-white/10" />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded bg-black/10 p-2">
                  <div className="theme-muted">Projects</div>
                  <div className="font-semibold">{s.projects}</div>
                </div>
                <div className="rounded bg-black/10 p-2">
                  <div className="theme-muted">Tasks</div>
                  <div className="font-semibold">{s.tasks}</div>
                </div>
                <div className="rounded bg-black/10 p-2">
                  <div className="theme-muted">Hours</div>
                  <div className="font-semibold">{s.hours}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button onClick={() => setEditingId(isEditing ? null : u.id)} className="px-3 py-2 rounded bg-white/5 border border-white/10 text-sm">
                  {isEditing ? 'Done' : 'Edit'}
                </button>
                <button onClick={() => deleteUser(u.id)} className="px-3 py-2 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-sm">
                  Delete
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="theme-muted">No users found.</div>
        )}
      </div>
    </div>
  )
} 