import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useDataStore, type Meeting } from '../store/data'
import MeetingModal from '../components/modals/MeetingModal'
import UserAvatar from '../components/UserAvatar'

export default function Meetings() {
  const meetings = useDataStore((s) => s.meetings)
  const deleteMeeting = useDataStore((s) => s.deleteMeeting)
  const updateMeeting = useDataStore((s) => s.updateMeeting)
  const getAllUsers = useDataStore((s) => s.getAllUsers)
  const users = getAllUsers()

  const [type, setType] = useState<'all' | Meeting['type']>('all')
  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      const matchesType = type === 'all' || m.type === type
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase())
      return matchesType && matchesQuery
    }).sort((a, b) => a.date.localeCompare(b.date))
  }, [meetings, type, query])

  const startMeeting = (m: Meeting) => {
    const link = m.meetingLink && m.meetingLink.trim().length > 0 ? m.meetingLink : `https://meet.neonpm.com/${m.id}`
    if (!m.meetingLink || m.meetingLink.trim().length === 0) {
      updateMeeting(m.id, { meetingLink: link })
    }
    window.open(link, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">Meetings</h1>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings..."
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            <option value="all">All Types</option>
            <option value="standup">Daily Standup</option>
            <option value="planning">Sprint Planning</option>
            <option value="review">Sprint Review</option>
            <option value="retrospective">Retrospective</option>
            <option value="client">Client</option>
            <option value="other">Other</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
          >
            + Schedule Meeting
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <div key={m.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-medium">{m.title}</h3>
                <p className="text-gray-400 text-sm">{m.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                m.type === 'client' ? 'bg-green-400/10 text-green-400' :
                m.type === 'standup' ? 'bg-blue-400/10 text-blue-400' :
                'bg-purple-400/10 text-purple-400'
              }`}>
                {m.type}
              </span>
            </div>

            <div className="text-sm text-gray-300 mb-2">
              {format(new Date(`${m.date}T${m.startTime || '00:00'}`), 'EEE, MMM dd')} • {m.allDay ? 'All day' : `${m.startTime} - ${m.endTime || 'TBD'}`}
            </div>
            <div className="text-xs text-gray-400 mb-3">
              👥 {m.attendees.length} attendees • {m.location || 'Remote'}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => startMeeting(m)} className="px-3 py-1.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/30 text-sm">
                  ▶ Start
                </button>
                <a href={m.meetingLink || '#'} target="_blank" onClick={(e) => { if (!m.meetingLink) { e.preventDefault(); startMeeting(m) } }} className="text-cyan-300 hover:text-cyan-200 text-sm" rel="noreferrer">
                  {m.meetingLink ? 'Open Link' : 'Generate Link'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={m.type}
                  onChange={(e) => updateMeeting(m.id, { type: e.target.value as any })}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-sm"
                >
                  <option value="standup">Standup</option>
                  <option value="planning">Planning</option>
                  <option value="review">Review</option>
                  <option value="retrospective">Retro</option>
                  <option value="client">Client</option>
                  <option value="other">Other</option>
                </select>
                <button onClick={() => deleteMeeting(m.id)} className="text-red-400 hover:text-red-300 text-sm">
                  Delete
                </button>
              </div>
            </div>

            {/* attendees quick manage */}
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-2">Attendees</div>
              <div className="flex flex-wrap gap-2">
                {users.slice(0, 10).map(u => {
                  const checked = m.attendees.includes(u.email)
                  return (
                    <label key={u.email} className={`flex items-center gap-2 px-2 py-1 rounded border ${checked ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/10 bg-white/5'} text-xs`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...m.attendees, u.email]
                            : m.attendees.filter(a => a !== u.email)
                          updateMeeting(m.id, { attendees: next })
                        }}
                      />
                      <UserAvatar email={u.email} size={20} />
                      <span className="text-gray-300">{u.email}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
} 