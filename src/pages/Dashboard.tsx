import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { format } from 'date-fns'
import { useDataStore } from '../store/data'
import ProjectModal from '../components/modals/ProjectModal'
import TaskModal from '../components/modals/TaskModal'
import MeetingModal from '../components/modals/MeetingModal'

// Mock chart data
const projectData = [
  { name: 'Jan', completed: 12, inProgress: 8, total: 20 },
  { name: 'Feb', completed: 15, inProgress: 10, total: 25 },
  { name: 'Mar', completed: 18, inProgress: 12, total: 30 },
  { name: 'Apr', completed: 22, inProgress: 15, total: 37 },
  { name: 'May', completed: 28, inProgress: 18, total: 46 },
  { name: 'Jun', completed: 35, inProgress: 22, total: 57 },
]

const weeklyActivity = [
  { day: 'Mon', hours: 8 },
  { day: 'Tue', hours: 6 },
  { day: 'Wed', hours: 7 },
  { day: 'Thu', hours: 9 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 3 },
  { day: 'Sun', hours: 2 },
]

const recentActivity = [
  { type: 'task', user: 'Sarah Chen', action: 'completed task "User Authentication"', time: '2 minutes ago' },
  { type: 'project', user: 'Mike Johnson', action: 'created new project "Mobile App"', time: '15 minutes ago' },
  { type: 'meeting', user: 'Team Alpha', action: 'scheduled meeting for tomorrow', time: '1 hour ago' },
  { type: 'comment', user: 'Alex Rodriguez', action: 'commented on "Database Design"', time: '2 hours ago' },
]

export default function Dashboard() {
  const projects = useDataStore((s) => s.projects)
  const tasks = useDataStore((s) => s.tasks)
  const meetings = useDataStore((s) => s.meetings)
  const chatMessages = useDataStore((s) => s.chatMessages)
  const addChatMessage = useDataStore((s) => s.addChatMessage)

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')

  // Calculate task distribution from real data
  const taskDistribution = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#6b7280' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#00d4ff' },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#f59e0b' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' },
  ]

  const upcomingMeetings = meetings.slice(0, 3)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      addChatMessage({
        text: chatMessage,
        sender: user.name || 'Anonymous',
        type: 'text'
      })
      setChatMessage('')
    }
  }

  const startVideoCall = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    addChatMessage({
      text: 'Started a video call',
      sender: user.name || 'Anonymous',
      type: 'system'
    })
    alert('Video call feature would be implemented with WebRTC')
  }

  const startVoiceCall = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    addChatMessage({
      text: 'Started a voice call',
      sender: user.name || 'Anonymous',
      type: 'system'
    })
    alert('Voice call feature would be implemented with WebRTC')
  }

  const stats = [
    { title: 'Active Projects', value: projects.filter(p => p.status === 'active').length.toString(), change: '+2 this week', trend: 'up', icon: '📁' },
    { title: 'Tasks Completed', value: tasks.filter(t => t.status === 'done').length.toString(), change: '+23 today', trend: 'up', icon: '✅' },
    { title: 'Team Members', value: '24', change: '+3 this month', trend: 'up', icon: '👥' },
    { title: 'Hours Tracked', value: '342', change: '40 this week', trend: 'neutral', icon: '⏰' },
  ]

  return (
    <>
      <div className="space-y-8">
        {/* Header with Quick Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProjectModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow-[0_4px_20px_rgba(0,212,255,0.3)]"
            >
              + New Project
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
            >
              + New Task
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMeetingModalOpen(true)}
              className="px-4 py-2 rounded-lg border border-purple-400/50 text-purple-300 hover:bg-purple-400/10"
            >
              📅 Schedule Meeting
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-cyan-400/10">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'text-green-400 bg-green-400/10' :
                  stat.trend === 'down' ? 'text-red-400 bg-red-400/10' :
                  'text-gray-400 bg-gray-400/10'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Communication Section - HIGHLIGHTED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-500/5 border-2 border-cyan-400/20 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-cyan-300 mb-2">Team Communication Hub</h2>
              <p className="text-gray-300">Stay connected with your team through chat, video, and voice calls</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVideoCall}
                className="px-6 py-3 rounded-lg bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30 transition-colors flex items-center gap-2"
              >
                🎥 Video Call
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVoiceCall}
                className="px-6 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 hover:bg-blue-500/30 transition-colors flex items-center gap-2"
              >
                🎙️ Voice Call
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Team Chat</h3>
              <div className="h-64 bg-black/40 rounded-lg border border-white/10 p-4 overflow-y-auto space-y-3">
                {chatMessages.slice(-8).map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-black font-semibold text-sm">
                      {message.sender.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{message.sender}</span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        message.type === 'system' ? 'text-cyan-400 italic' : 'text-gray-300'
                      }`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📁</div>
                  <h4 className="text-white font-medium">New Project</h4>
                  <p className="text-gray-400 text-sm">Create a new project</p>
                </button>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">✅</div>
                  <h4 className="text-white font-medium">New Task</h4>
                  <p className="text-gray-400 text-sm">Add a task to project</p>
                </button>
                <button
                  onClick={() => setIsMeetingModalOpen(true)}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">📅</div>
                  <h4 className="text-white font-medium">Schedule Meeting</h4>
                  <p className="text-gray-400 text-sm">Plan team meetings</p>
                </button>
                <button className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors text-left">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="text-white font-medium">View Reports</h4>
                  <p className="text-gray-400 text-sm">Project analytics</p>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Project Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="inProgress"
                  stackId="1"
                  stroke="#00d4ff"
                  fill="#00d4ff"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Task Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Task Distribution</h3>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {taskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                    <span className="text-sm text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Activity & Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Bar dataKey="hours" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Meetings</h3>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{meeting.title}</p>
                    <p className="text-gray-400 text-xs">
                      {meeting.date} {meeting.startTime} • {meeting.attendees.length} attendees
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    meeting.type === 'standup' ? 'bg-blue-400/10 text-blue-400' :
                    meeting.type === 'client' ? 'bg-green-400/10 text-green-400' :
                    'bg-purple-400/10 text-purple-400'
                  }`}>
                    {meeting.type}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'task' ? 'bg-green-400' :
                    activity.type === 'project' ? 'bg-blue-400' :
                    activity.type === 'meeting' ? 'bg-purple-400' :
                    'bg-yellow-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm">
                      <span className="text-white font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{project.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'active' ? 'bg-green-400/10 text-green-400' :
                    project.status === 'planning' ? 'bg-yellow-400/10 text-yellow-400' :
                    'bg-gray-400/10 text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">👥 {project.team.length} members</span>
                  <span className="text-gray-400">
                    Due {project.endDate ? format(new Date(project.endDate), 'MMM dd') : 'No date'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />
      <MeetingModal 
        isOpen={isMeetingModalOpen} 
        onClose={() => setIsMeetingModalOpen(false)} 
      />
    </>
  )
} 