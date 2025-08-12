# NeonPM – Modern Project Management App (React + Vite + TS + Tailwind v4)

NeonPM is a modern, responsive project management application inspired by Jira. It includes projects, Kanban tasks with drag-and-drop, meetings and scheduling, chat with group conversations, notifications, people admin, project details (time logs + comments), and global light/dark theming.

## Table of Contents
- Quick Start
- Features at a Glance
- Screens and Workflows
- Demo Data (seed)
- Theming (Light/Dark)
- Data Model & Persistence
- Project Structure
- Scripts
- Build & Deploy
- Accessibility & UX
- Troubleshooting & FAQs
- Roadmap (Next Steps)

---

## Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Start dev server
npm run dev
# Local: http://localhost:5173 (or next available)

# 3) Type-check
npm run typecheck

# 4) Production build
npm run build

# 5) Preview production build
npm run start
# OR
npm run preview
```

To reset app data, go to Settings → Clear Local Data (or delete the `neonpm-data` key in browser localStorage).

---

## Features at a Glance
- Projects: CRUD, status and priority, labels, progress, teams; card list with sorting and search
- Tasks: Kanban columns (To do / In progress / Review / Done) with drag-and-drop across columns; filter by project
- Meetings: schedule meetings (all-day or timed), meeting types, attendees, recurring options, quick start button
- Chat: users bar, create 1:1 or group conversations, drag users into conversations, persistent messages per conversation
- Notifications: recent project/task/meeting/chat activity in header bell menu, “mark all read”
- People (Admin): manage users, edit role/status/title/department, see per-user stats (projects, tasks, hours)
- Project Details: overview, tasks for that project, time logs (add/delete), comments (add)
- Theming: global light/dark toggle with CSS variables; smooth transitions, readable dropdowns in both themes
- Responsive: mobile drawer sidebar, sticky header, independent scroll, fluid typography
- Demo Data: Rich seed for projects, tasks, meetings, users, and chat for instant exploration

---

## Screens and Workflows

### Landing & Auth
- Landing page with hero + auth form; click “Try Demo” to auto-login.
- Authentication is local (no backend). A user is persisted as `user` in localStorage.

### Dashboard
- Stats and charts (Recharts), quick actions, communication hub (chat + call placeholders), upcoming meetings, recent activity, recent projects.

### Projects
- Search, filter (status, priority), sort (recent/progress/name).
- Each card shows summary metrics, progress, labels, and opens a Project Details page.

### Project Details
- Tabs: Overview, Tasks, Time, Comments.
- Time: add logs (date, hours, note), delete logs; Comments: add new comments.

### Tasks (Kanban)
- Filter by project; drag items between columns to update status.

### Meetings
- Create meetings (all-day or timed), types, attendees (select from users quickly).
- Start button generates/opens link if missing.

### Chat
- Create conversations by clicking a user or dropping users into a conversation.
- Messages persist per conversation; active conversation required to send.

### People (Admin)
- Cards per user: avatar initial, name/email, role/status, title, department, stats (projects, tasks, hours).
- Edit inline (role, status, title, department). Add demo users; delete users.

### Settings
- Profile (name/email) saved to localStorage.
- Light/Dark toggle; clear local data; logout.

---

## Demo Data (Seed)
The app ships with rich demo data to explore immediately:
- Users: `sarah@company.com`, `john@company.com`, `mike@company.com`, `emma@company.com`, `alex@company.com`
- Projects: E‑commerce Platform, Mobile App Redesign, API Integration, Analytics Dashboard, QA Automation Suite
- Tasks: Assigned across projects and users with meaningful labels and priorities
- Meetings: Daily standup, client review; attendees, recurring options, start link
- Chat: A couple of starter messages; create new conversations freely

All demo data is defined in `src/store/data.ts` and persisted in localStorage under `neonpm-data` after first run.

---

## Theming (Light/Dark)
- Theme tokens are defined in `src/index.css` using CSS variables (e.g., `--bg`, `--text`, `--card`, `--border`).
- The header toggle switches the `dark` class on `<html>`, flipping the whole UI.
- Global overrides ensure dropdowns, options, inputs, and placeholders are readable in both themes.
- Fluid typography and spacing harmonize the layout on small screens.

---

## Data Model & Persistence
- Single Zustand store (`src/store/data.ts`) with type-safe models:
  - Project, Task, Meeting, Conversation, ChatMessage, NotificationItem, TimesheetEntry, UserProfile
- Actions for CRUD across slices (projects/tasks/meetings/chat/conversations/users) and helpers:
  - `createConversation`, `addConversationMessage`, `addTimeLog`, `addProjectComment`, `assignUserToProject`, etc.
- Persistence via Zustand `persist` → localStorage key `neonpm-data`.

---

## Project Structure
```
src/
  components/
    ErrorBoundary.tsx
    Layout.tsx            # App shell: sidebar, header, notifications, theme toggle
    UserAvatar.tsx
    modals/
      MeetingModal.tsx
      ProjectModal.tsx
      TaskModal.tsx
  pages/
    Landing.tsx
    Dashboard.tsx
    Projects.tsx
    ProjectDetails.tsx
    Tasks.tsx
    Meetings.tsx
    People.tsx
    Chat.tsx
    Settings.tsx
  store/
    data.ts               # Types, state, actions, persistence
    theme.ts              # Theme toggle store
  index.css               # Tailwind v4 + tokens + form styles + light/dark overrides
  main.tsx                # Bootstrap + ErrorBoundary
  App.tsx                 # Routes + auth guard
```

---

## Scripts
- `npm run dev` – Vite dev server
- `npm run typecheck` – TypeScript checks
- `npm run build` – TypeScript build + Vite production build
- `npm run start` or `npm run preview` – Preview production build
- `npm run lint` – ESLint (configured)

---

## Build & Deploy
- Run `npm run build` → `dist/` directory.
- Deploy `dist/` to any static hosting (Vercel, Netlify, GitHub Pages, S3/CloudFront).
- If you add a backend, replace store actions with API calls and configure environment variables via Vite.

---

## Accessibility & UX
- Keyboard-accessible navigation; Enter/Space opens project cards.
- High contrast with theme-aware form controls.
- Motion used modestly (Framer Motion) with short durations.
- Responsive layout: mobile drawer sidebar, sticky header, scrollable content area.

---

## Troubleshooting & FAQs
- Black text in dropdowns (light mode): handled globally in `index.css` (form control overrides). If you add custom selects, extend those classes.
- PostCSS/Tailwind plugin conflicts: a local `postcss.config.js` is provided to avoid picking up global configs.
- Clear all data: Settings → Clear Local Data or remove `neonpm-data` in DevTools.
- Infinite update depth errors: selectors now read plain slices; derived data is computed with `useMemo` to avoid render loops.

---

## Roadmap (Next Steps)
- Drag-and-drop reordering within columns and swimlanes
- Conversation naming + members management modal
- Server-backed persistence + auth (JWT/OAuth)
- File uploads and attachments
- PWA (offline), push notifications
- Role-based access control and permissions

---
If you want this codebase restructured into a feature-first layout or integrated with an API (Express/NestJS/Firebase), I can apply those changes quickly. 
