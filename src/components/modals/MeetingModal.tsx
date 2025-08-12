import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDataStore } from '../../store/data'

interface MeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MeetingModal({ isOpen, onClose }: MeetingModalProps) {
  const addMeeting = useDataStore((state) => state.addMeeting)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: [] as string[],
    location: '',
    type: 'other' as const,
    agenda: [] as string[],
    meetingLink: '',
    isRecurring: false,
    recurrencePattern: '',
    createdBy: '',
    allDay: false,
  })

  const [newAttendee, setNewAttendee] = useState('')
  const [newAgendaItem, setNewAgendaItem] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const today = new Date().toISOString().split('T')[0]
    const currentTime = new Date().toTimeString().slice(0, 5)

    setFormData((prev) => {
      const next = {
        ...prev,
        createdBy: user.email || '',
        date: prev.date || today,
        startTime: prev.startTime || currentTime,
      }
      // Avoid unnecessary state churn
      if (
        next.createdBy === prev.createdBy &&
        next.date === prev.date &&
        next.startTime === prev.startTime
      ) {
        return prev
      }
      return next
    })
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    if (formData.date < today) {
      alert('Please select a current or future date')
      return
    }
    addMeeting(formData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      attendees: [],
      location: '',
      type: 'other',
      agenda: [],
      meetingLink: '',
      isRecurring: false,
      recurrencePattern: '',
      createdBy: '',
      allDay: false,
    })
    
    onClose()
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({ ...prev, attendees: [...prev.attendees, newAttendee.trim()] }))
      setNewAttendee('')
    }
  }

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({ ...prev, attendees: prev.attendees.filter(a => a !== attendee) }))
  }

  const addAgendaItem = () => {
    if (newAgendaItem.trim() && !formData.agenda.includes(newAgendaItem.trim())) {
      setFormData(prev => ({ ...prev, agenda: [...prev.agenda, newAgendaItem.trim()] }))
      setNewAgendaItem('')
    }
  }

  const removeAgendaItem = (item: string) => {
    setFormData(prev => ({ ...prev, agenda: prev.agenda.filter(i => i !== item) }))
  }

  const generateMeetingLink = () => {
    const roomId = Math.random().toString(36).substr(2, 9)
    setFormData(prev => ({ ...prev, meetingLink: `https://meet.neonpm.com/${roomId}` }))
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
            <h2 className="text-lg font-bold text-cyan-300">Schedule Meeting</h2>
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
                Meeting Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                placeholder="Enter meeting title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none resize-none"
                placeholder="Meeting objective and notes..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none" />
              </div>

              <div className="flex items-center gap-2 md:col-span-1">
                <input id="allday" type="checkbox" checked={formData.allDay} onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))} />
                <label htmlFor="allday" className="text-sm text-gray-300">All day</label>
              </div>

              {!formData.allDay && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
                    <input type="time" required value={formData.startTime} onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time *</label>
                    <input type="time" required value={formData.endTime} onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none" />
                  </div>
                </>
              )}
            </div>

            {/* Meeting Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meeting Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="standup">🏃 Daily Standup</option>
                  <option value="planning">📋 Sprint Planning</option>
                  <option value="review">👥 Sprint Review</option>
                  <option value="retrospective">🔄 Retrospective</option>
                  <option value="client">🤝 Client Meeting</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="Conference Room A / Remote"
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Conference Link
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="https://meet.google.com/..."
                />
                <button
                  type="button"
                  onClick={generateMeetingLink}
                  className="px-4 py-3 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Attendees
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="attendee@company.com"
                />
                <button
                  type="button"
                  onClick={addAttendee}
                  className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((attendee) => (
                  <span
                    key={attendee}
                    className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-sm flex items-center gap-2"
                  >
                    {attendee}
                    <button
                      type="button"
                      onClick={() => removeAttendee(attendee)}
                      className="text-blue-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agenda Items
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAgendaItem}
                  onChange={(e) => setNewAgendaItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAgendaItem())}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  placeholder="Project status update"
                />
                <button
                  type="button"
                  onClick={addAgendaItem}
                  className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.agenda.map((item, index) => (
                  <div key={item} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-cyan-400 font-medium">{index + 1}.</span>
                    <span className="flex-1 text-white">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(item)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-cyan-400 focus:ring-cyan-400"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-300">
                  Recurring Meeting
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recurrence Pattern
                  </label>
                  <select
                    value={formData.recurrencePattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurrencePattern: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  >
                    <option value="">Select pattern</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                Schedule Meeting
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