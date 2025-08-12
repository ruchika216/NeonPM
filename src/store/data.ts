import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'on-hold' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: string
  endDate: string
  assignee: string
  reporter: string
  team: string[]
  progress: number
  labels: string[]
  attachments: string[]
  createdAt: string
  updatedAt: string
  comments?: Comment[]
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'story' | 'bug' | 'task' | 'epic'
  assignee: string
  reporter: string
  projectId: string
  storyPoints: number
  labels: string[]
  dueDate: string
  estimatedHours: number
  timeLogged: number
  attachments: string[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Meeting {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  attendees: string[]
  location: string
  type: 'standup' | 'planning' | 'review' | 'retrospective' | 'client' | 'other'
  agenda: string[]
  meetingLink: string
  isRecurring: boolean
  recurrencePattern?: string
  createdBy: string
  createdAt: string
  allDay?: boolean
}

export interface Comment {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  text: string
  sender: string
  timestamp: string
  type: 'text' | 'file' | 'system'
  fileUrl?: string
  fileName?: string
}

export interface Conversation {
  id: string
  name?: string
  participantEmails: string[]
  messages: ChatMessage[]
  createdAt: string
}

export interface NotificationItem {
  id: string
  type: 'project' | 'task' | 'meeting' | 'chat'
  title: string
  body: string
  createdAt: string
  read?: boolean
}

export interface TimesheetEntry {
  id: string
  projectId: string
  userEmail: string
  date: string
  hours: number
  note?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'qa'
  title?: string
  department?: string
  status: 'active' | 'inactive'
  avatarUrl?: string
}

interface DataState {
  projects: Project[]
  tasks: Task[]
  meetings: Meeting[]
  chatMessages: ChatMessage[]
  conversations: Conversation[]
  activeConversationId?: string
  notifications: NotificationItem[]
  timesheets: TimesheetEntry[]
  users: UserProfile[]
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addProjectComment: (projectId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  updateMeeting: (id: string, updates: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  
  // Conversation actions
  createConversation: (participants: string[], name?: string) => string
  setActiveConversation: (id: string) => void
  addParticipantToConversation: (id: string, email: string) => void
  removeParticipantFromConversation: (id: string, email: string) => void
  addConversationMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  deleteConversation: (id: string) => void
  
  // Notifications
  addNotification: (n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void
  markAllNotificationsRead: () => void

  // Timesheets
  addTimeLog: (entry: Omit<TimesheetEntry, 'id' | 'createdAt'>) => void
  deleteTimeLog: (id: string) => void
  
  // User management
  addUser: (user: Omit<UserProfile, 'id'>) => void
  updateUser: (id: string, updates: Partial<UserProfile>) => void
  deleteUser: (id: string) => void

  // Assignment helpers
  assignUserToProject: (projectId: string, email: string) => void
  removeUserFromProject: (projectId: string, email: string) => void

  // Getters
  getProjectById: (id: string) => Project | undefined
  getTasksByProject: (projectId: string) => Task[]
  getUpcomingMeetings: () => Meeting[]
  getAllUsers: () => { email: string, name?: string }[]
  getActiveConversation: () => Conversation | undefined
  getTimeLogsByProject: (projectId: string) => TimesheetEntry[]
  getUsers: () => UserProfile[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Building a modern e-commerce platform with React and Node.js',
          status: 'active',
          priority: 'high',
          startDate: '2024-01-01',
          endDate: '2024-03-15',
          assignee: 'john@company.com',
          reporter: 'sarah@company.com',
          team: ['john@company.com', 'mike@company.com', 'sarah@company.com'],
          progress: 75,
          labels: ['frontend', 'backend', 'urgent'],
          attachments: [],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
          comments: [],
        },
        {
          id: '2',
          name: 'Mobile App Redesign',
          description: 'Refresh the mobile UI with new design system and animations',
          status: 'planning',
          priority: 'medium',
          startDate: '2024-02-01',
          endDate: '2024-04-30',
          assignee: 'mike@company.com',
          reporter: 'sarah@company.com',
          team: ['mike@company.com', 'emma@company.com'],
          progress: 30,
          labels: ['ui', 'ux'],
          attachments: [],
          createdAt: '2024-02-01T09:00:00Z',
          updatedAt: '2024-02-10T11:00:00Z',
          comments: [],
        },
        {
          id: '3',
          name: 'API Integration',
          description: 'Integrate third-party payments and analytics APIs',
          status: 'on-hold',
          priority: 'high',
          startDate: '2024-02-10',
          endDate: '2024-05-20',
          assignee: 'alex@company.com',
          reporter: 'john@company.com',
          team: ['alex@company.com', 'john@company.com'],
          progress: 10,
          labels: ['api', 'payments'],
          attachments: [],
          createdAt: '2024-02-10T10:00:00Z',
          updatedAt: '2024-02-12T10:00:00Z',
          comments: [],
        },
        {
          id: '4',
          name: 'Analytics Dashboard',
          description: 'Build analytics dashboards with charts and reporting for leadership.',
          status: 'active',
          priority: 'medium',
          startDate: '2024-02-05',
          endDate: '2024-04-10',
          assignee: 'emma@company.com',
          reporter: 'sarah@company.com',
          team: ['emma@company.com', 'john@company.com'],
          progress: 55,
          labels: ['charts', 'reporting'],
          attachments: [],
          createdAt: '2024-02-05T10:00:00Z',
          updatedAt: '2024-02-18T12:00:00Z',
          comments: [],
        },
        {
          id: '5',
          name: 'QA Automation Suite',
          description: 'Set up E2E test automation and CI integration.',
          status: 'planning',
          priority: 'high',
          startDate: '2024-03-01',
          endDate: '2024-06-01',
          assignee: 'mike@company.com',
          reporter: 'sarah@company.com',
          team: ['mike@company.com', 'alex@company.com'],
          progress: 20,
          labels: ['qa', 'automation', 'ci'],
          attachments: [],
          createdAt: '2024-03-01T08:30:00Z',
          updatedAt: '2024-03-05T09:00:00Z',
          comments: [],
        }
      ],
      tasks: [
        {
          id: '1',
          title: 'User Authentication System',
          description: 'Implement JWT-based authentication with role management',
          status: 'in-progress',
          priority: 'high',
          type: 'story',
          assignee: 'john@company.com',
          reporter: 'sarah@company.com',
          projectId: '1',
          storyPoints: 8,
          labels: ['backend', 'security'],
          dueDate: '2024-02-15',
          estimatedHours: 24,
          timeLogged: 16,
          attachments: [],
          comments: [],
          createdAt: '2024-01-05T09:00:00Z',
          updatedAt: '2024-01-10T16:00:00Z'
        },
        {
          id: '2',
          title: 'Product Listing Page',
          description: 'Build responsive catalog with filters and sorting',
          status: 'todo',
          priority: 'medium',
          type: 'task',
          assignee: 'emma@company.com',
          reporter: 'mike@company.com',
          projectId: '2',
          storyPoints: 5,
          labels: ['frontend'],
          dueDate: '2024-03-01',
          estimatedHours: 16,
          timeLogged: 0,
          attachments: [],
          comments: [],
          createdAt: '2024-02-02T09:00:00Z',
          updatedAt: '2024-02-02T09:00:00Z'
        },
        {
          id: '3',
          title: 'Payments Service Integration',
          description: 'Integrate Stripe payments with webhooks',
          status: 'todo',
          priority: 'high',
          type: 'story',
          assignee: 'alex@company.com',
          reporter: 'john@company.com',
          projectId: '3',
          storyPoints: 8,
          labels: ['api', 'payments'],
          dueDate: '2024-03-10',
          estimatedHours: 24,
          timeLogged: 0,
          attachments: [],
          comments: [],
          createdAt: '2024-02-11T10:00:00Z',
          updatedAt: '2024-02-11T10:00:00Z'
        },
        {
          id: '4',
          title: 'KPI Overview Cards',
          description: 'Design and build KPI summary cards for analytics.',
          status: 'in-progress',
          priority: 'medium',
          type: 'task',
          assignee: 'emma@company.com',
          reporter: 'sarah@company.com',
          projectId: '4',
          storyPoints: 3,
          labels: ['charts', 'ui'],
          dueDate: '2024-03-05',
          estimatedHours: 10,
          timeLogged: 2,
          attachments: [],
          comments: [],
          createdAt: '2024-02-20T10:00:00Z',
          updatedAt: '2024-02-21T10:00:00Z'
        },
        {
          id: '5',
          title: 'CI Pipeline for E2E',
          description: 'Configure CI workflows to run Playwright tests.',
          status: 'todo',
          priority: 'high',
          type: 'task',
          assignee: 'mike@company.com',
          reporter: 'sarah@company.com',
          projectId: '5',
          storyPoints: 5,
          labels: ['qa', 'automation', 'ci'],
          dueDate: '2024-03-20',
          estimatedHours: 18,
          timeLogged: 0,
          attachments: [],
          comments: [],
          createdAt: '2024-03-02T09:00:00Z',
          updatedAt: '2024-03-02T09:00:00Z'
        },
        {
          id: '6',
          title: 'Smoke Test Suite',
          description: 'Create initial smoke test coverage for core flows.',
          status: 'todo',
          priority: 'medium',
          type: 'task',
          assignee: 'alex@company.com',
          reporter: 'mike@company.com',
          projectId: '5',
          storyPoints: 3,
          labels: ['qa'],
          dueDate: '2024-03-25',
          estimatedHours: 12,
          timeLogged: 0,
          attachments: [],
          comments: [],
          createdAt: '2024-03-03T09:00:00Z',
          updatedAt: '2024-03-03T09:00:00Z'
        }
      ],
      meetings: [
        {
          id: '1',
          title: 'Daily Standup',
          description: 'Daily team sync and progress updates',
          date: '2024-02-15',
          startTime: '09:00',
          endTime: '09:30',
          attendees: ['john@company.com', 'mike@company.com', 'sarah@company.com'],
          location: 'Conference Room A',
          type: 'standup',
          agenda: ['Yesterday\'s progress', 'Today\'s goals', 'Blockers'],
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          isRecurring: true,
          recurrencePattern: 'daily',
          createdBy: 'sarah@company.com',
          createdAt: '2024-01-01T10:00:00Z',
          allDay: false,
        },
        {
          id: '2',
          title: 'Client Review – Mobile UI',
          description: 'Review wireframes with client stakeholders',
          date: '2024-02-18',
          startTime: '14:00',
          endTime: '15:00',
          attendees: ['sarah@company.com', 'emma@company.com'],
          location: 'Zoom',
          type: 'client',
          agenda: ['Wireframes', 'Feedback', 'Next steps'],
          meetingLink: '',
          isRecurring: false,
          createdBy: 'sarah@company.com',
          createdAt: '2024-02-10T08:00:00Z',
          allDay: false,
        }
      ],
      chatMessages: [
        {
          id: '1',
          text: 'Welcome to NeonPM! Start collaborating with your team.',
          sender: 'System',
          timestamp: '2024-01-01T10:00:00Z',
          type: 'system'
        },
        {
          id: '2',
          text: 'Morning all! Today I will work on auth flows.',
          sender: 'John',
          timestamp: '2024-02-10T09:10:00Z',
          type: 'text'
        },
        {
          id: '3',
          text: 'Uploaded latest mobile designs for your review.',
          sender: 'Emma',
          timestamp: '2024-02-10T09:30:00Z',
          type: 'text'
        }
      ],
      conversations: [],
      activeConversationId: undefined,
      notifications: [],
      timesheets: [],
      users: [
        { id: 'u1', name: 'Sarah Chen',  email: 'sarah@company.com', role: 'manager',   title: 'Product Manager', department: 'Product', status: 'active' },
        { id: 'u2', name: 'John Miller',  email: 'john@company.com',  role: 'developer', title: 'Senior Engineer', department: 'Engineering', status: 'active' },
        { id: 'u3', name: 'Mike Johnson', email: 'mike@company.com',  role: 'developer', title: 'Frontend Engineer', department: 'Engineering', status: 'active' },
        { id: 'u4', name: 'Emma Davis',   email: 'emma@company.com',  role: 'designer',  title: 'UI/UX Designer', department: 'Design', status: 'active' },
        { id: 'u5', name: 'Alex Garcia',  email: 'alex@company.com',  role: 'developer', title: 'Backend Engineer', department: 'Engineering', status: 'inactive' },
      ],

      // Project actions
      addProject: (projectData) => {
        const project: Project = {
          ...projectData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comments: [],
        }
        set((state) => ({ 
          projects: [...state.projects, project],
          notifications: [
            {
              id: generateId(),
              type: 'project',
              title: 'New Project',
              body: project.name,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications
          ]
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
          ),
          notifications: updates.progress !== undefined || updates.status !== undefined || updates.name !== undefined
            ? [
                {
                  id: generateId(),
                  type: 'project',
                  title: 'Project Updated',
                  body: state.projects.find(p => p.id === id)?.name || 'Project',
                  createdAt: new Date().toISOString(),
                  read: false,
                },
                ...state.notifications
              ]
            : state.notifications
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          tasks: state.tasks.filter((task) => task.projectId !== id)
        }))
      },

      addProjectComment: (projectId, commentData) => {
        const newComment: Comment = {
          ...commentData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          projects: state.projects.map(p => p.id === projectId ? { ...p, comments: [...(p.comments || []), newComment] } : p),
          notifications: [
            {
              id: generateId(),
              type: 'project',
              title: 'New Comment',
              body: newComment.text,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications
          ]
        }))
      },

      // Timesheets
      addTimeLog: (entry) => {
        const e: TimesheetEntry = {
          ...entry,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          timesheets: [e, ...state.timesheets],
          notifications: [
            { id: generateId(), type: 'project', title: 'Time Logged', body: `${e.userEmail} • ${e.hours}h`, createdAt: new Date().toISOString(), read: false },
            ...state.notifications,
          ]
        }))
      },
      deleteTimeLog: (id) => {
        set((state) => ({ timesheets: state.timesheets.filter(t => t.id !== id) }))
      },

      // Task actions
      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        set((state) => ({ 
          tasks: [...state.tasks, task],
          notifications: [
            {
              id: generateId(),
              type: 'task',
              title: 'New Task',
              body: task.title,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications
          ]
        }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }))
      },

      // Meeting actions
      addMeeting: (meetingData) => {
        const meeting: Meeting = {
          ...meetingData,
          id: generateId(),
          createdAt: new Date().toISOString()
        }
        set((state) => ({ 
          meetings: [...state.meetings, meeting],
          notifications: [
            {
              id: generateId(),
              type: 'meeting',
              title: 'New Meeting',
              body: meeting.title,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications
          ]
        }))
      },

      updateMeeting: (id, updates) => {
        set((state) => ({
          meetings: state.meetings.map((meeting) =>
            meeting.id === id ? { ...meeting, ...updates } : meeting
          )
        }))
      },

      deleteMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.filter((meeting) => meeting.id !== id)
        }))
      },

      // Legacy team-wide chat actions (dashboard hub)
      addChatMessage: (messageData) => {
        const message: ChatMessage = {
          ...messageData,
          id: generateId(),
          timestamp: new Date().toISOString()
        }
        set((state) => ({ chatMessages: [...state.chatMessages, message] }))
      },

      // Conversations
      createConversation: (participants, name) => {
        const id = generateId()
        const conversation: Conversation = {
          id,
          name,
          participantEmails: Array.from(new Set(participants)).filter(Boolean),
          messages: [],
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
          notifications: [
            {
              id: generateId(),
              type: 'chat',
              title: 'New Conversation',
              body: name || conversation.participantEmails.join(', ') || 'Empty',
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications
          ]
        }))
        return id
      },
      setActiveConversation: (id) => set({ activeConversationId: id }),
      addParticipantToConversation: (id, email) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id && email && !c.participantEmails.includes(email)
              ? { ...c, participantEmails: [...c.participantEmails, email] }
              : c
          ),
        }))
      },
      removeParticipantFromConversation: (id, email) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id
              ? { ...c, participantEmails: c.participantEmails.filter((e) => e !== email) }
              : c
          ),
        }))
      },
      addConversationMessage: (conversationId, messageData) => {
        const message: ChatMessage = {
          ...messageData,
          id: generateId(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
          ),
          notifications: [
            {
              id: generateId(),
              type: 'chat',
              title: 'New Message',
              body: message.text,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications
          ]
        }))
      },
      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId: state.activeConversationId === id ? undefined : state.activeConversationId,
        }))
      },

      // Notifications
      addNotification: (n) => {
        const item: NotificationItem = {
          id: generateId(),
          createdAt: new Date().toISOString(),
          read: false,
          ...n,
        }
        set((state) => ({ notifications: [item, ...state.notifications] }))
      },
      markAllNotificationsRead: () => {
        set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }))
      },

      // User management
      addUser: (user) => {
        const u: UserProfile = { id: generateId(), ...user }
        set((state) => ({ users: [u, ...state.users] }))
      },
      updateUser: (id, updates) => {
        set((state) => ({ users: state.users.map(u => u.id === id ? { ...u, ...updates } : u) }))
      },
      deleteUser: (id) => {
        set((state) => ({ users: state.users.filter(u => u.id !== id) }))
      },

      assignUserToProject: (projectId, email) => {
        set((state) => ({
          projects: state.projects.map(p => p.id === projectId && !p.team.includes(email) ? { ...p, team: [...p.team, email] } : p)
        }))
      },
      removeUserFromProject: (projectId, email) => {
        set((state) => ({
          projects: state.projects.map(p => p.id === projectId ? { ...p, team: p.team.filter(e => e !== email) } : p)
        }))
      },

      // Getters
      getProjectById: (id) => {
        return get().projects.find((project) => project.id === id)
      },
      getTasksByProject: (projectId) => {
        return get().tasks.filter((task) => task.projectId === projectId)
      },
      getUpcomingMeetings: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().meetings.filter((meeting) => meeting.date >= today)
      },
      getAllUsers: () => {
        const emails = new Set<string>()
        const tryAdd = (e?: string) => e && emails.add(e)
        get().projects.forEach(p => {
          tryAdd(p.assignee)
          tryAdd(p.reporter)
          p.team.forEach(tryAdd)
        })
        get().tasks.forEach(t => {
          tryAdd(t.assignee)
          tryAdd(t.reporter)
        })
        const arr = Array.from(emails).filter(Boolean)
        return arr.map(email => ({ email }))
      },
      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find(c => c.id === activeConversationId)
      },
      getTimeLogsByProject: (projectId) => {
        return get().timesheets.filter(t => t.projectId === projectId)
      },
      getUsers: () => get().users,
    }),
    {
      name: 'neonpm-data'
    }
  )
) 