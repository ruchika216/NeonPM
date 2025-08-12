import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { useDataStore } from '../store/data'
import UserAvatar from '../components/UserAvatar'

export default function Chat() {
  // Select plain slices only
  const projects = useDataStore((s) => s.projects)
  const tasks = useDataStore((s) => s.tasks)
  const conversations = useDataStore((s) => s.conversations)
  const activeConversationId = useDataStore((s) => s.activeConversationId)

  // Actions
  const createConversation = useDataStore((s) => s.createConversation)
  const setActiveConversation = useDataStore((s) => s.setActiveConversation)
  const addConversationMessage = useDataStore((s) => s.addConversationMessage)
  const addParticipantToConversation = useDataStore((s) => s.addParticipantToConversation)
  const deleteConversation = useDataStore((s) => s.deleteConversation)

  // Derivations
  const users = useMemo(() => {
    const emails = new Set<string>()
    const tryAdd = (e?: string) => e && emails.add(e)
    projects.forEach(p => { tryAdd(p.assignee); tryAdd(p.reporter); p.team.forEach(tryAdd) })
    tasks.forEach(t => { tryAdd(t.assignee); tryAdd(t.reporter) })
    return Array.from(emails).map(email => ({ email }))
  }, [projects, tasks])

  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId)
  }, [conversations, activeConversationId])

  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeConversation?.messages.length])

  const startNewConversation = (emails: string[]) => {
    const id = createConversation(emails)
    setActiveConversation(id)
  }

  const onDropUserToConversation = (e: React.DragEvent, conversationId: string) => {
    const email = e.dataTransfer.getData('text/user-email')
    if (email) addParticipantToConversation(conversationId, email)
  }

  const onDragOver = (e: React.DragEvent) => e.preventDefault()

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !activeConversation) return
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    addConversationMessage(activeConversation.id, { text, sender: user.name || 'Anonymous', type: 'text' })
    setText('')
  }

  const dropzoneHint = activeConversation ? `Drop users here to add to conversation` : `Create or select a conversation`

  return (
    <div className="h-full grid grid-rows-[auto_1fr] gap-3">
      {/* Users bar with drag support */}
      <div className="rounded-lg bg-white/5 border border-white/10 p-3 overflow-x-auto">
        <div className="flex items-center gap-3">
          {users.slice(0, 20).map(u => (
            <div key={u.email} className="flex flex-col items-center gap-1" draggable onDragStart={(e) => e.dataTransfer.setData('text/user-email', u.email)}>
              <UserAvatar email={u.email} />
              <span className="text-[11px] text-gray-400 max-w-16 truncate">{u.email}</span>
              <button
                className="text-[10px] text-cyan-300"
                onClick={() => startNewConversation([u.email])}
              >
                Chat
              </button>
            </div>
          ))}
          <button
            onClick={() => startNewConversation([])}
            className="ml-auto px-3 py-2 rounded bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm"
          >
            + New Conversation
          </button>
        </div>
      </div>

      {/* Main split: conversation list + chat panel */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-3 min-h-0">
        {/* Conversation list */}
        <div className="rounded-lg bg-white/5 border border-white/10 p-3 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-2">Conversations</h3>
          <div className="space-y-2">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConversation(c.id)}
                className={`w-full text-left p-3 rounded border ${activeConversation?.id === c.id ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/10 bg-black/40'} hover:border-cyan-400/30`}
                onDrop={(e) => onDropUserToConversation(e, c.id)}
                onDragOver={onDragOver}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{c.name || (c.participantEmails[0] || 'Empty')}</span>
                  <button className="text-xs text-gray-400 hover:text-red-300" onClick={(ev) => { ev.stopPropagation(); deleteConversation(c.id) }}>Delete</button>
                </div>
                <div className="mt-2 flex items-center gap-1 flex-wrap">
                  {c.participantEmails.slice(0, 5).map(e => (
                    <UserAvatar key={e} email={e} size={20} />
                  ))}
                  {c.participantEmails.length === 0 && (
                    <span className="text-[11px] text-gray-400">Drop users here</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="rounded-lg bg-white/5 border border-white/10 p-3 flex flex-col min-h-0">
          <div
            className={`mb-3 p-3 rounded border ${activeConversation ? 'border-white/10 bg-black/40' : 'border-dashed border-cyan-400/40 bg-cyan-400/5'}`}
            onDrop={(e) => activeConversation && onDropUserToConversation(e, activeConversation.id)}
            onDragOver={onDragOver}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">{activeConversation ? (activeConversation.name || 'Conversation') : 'No conversation selected'}</h2>
                <p className="text-xs text-gray-400">{dropzoneHint}</p>
              </div>
              {activeConversation && (
                <div className="flex -space-x-2">
                  {activeConversation.participantEmails.slice(0, 6).map(e => (
                    <div key={e} className="border border-white/10 rounded-full"><UserAvatar email={e} size={28} /></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto rounded bg-black/40 border border-white/10 p-3 space-y-3">
            {(activeConversation?.messages || []).map((m) => (
              <div key={m.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-black font-semibold text-sm">
                  {m.sender.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{m.sender}</span>
                    <span className="text-xs text-gray-400">{format(new Date(m.timestamp), 'HH:mm')}</span>
                  </div>
                  <p className={`text-sm ${m.type === 'system' ? 'text-cyan-400 italic' : 'text-gray-300'}`}>{m.text}</p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="mt-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!activeConversation}
              placeholder={activeConversation ? 'Type a message...' : 'Select or create a conversation'}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none disabled:opacity-50"
            />
            <button disabled={!activeConversation} className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/30 disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 