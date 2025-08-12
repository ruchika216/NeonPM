import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Meetings from './pages/Meetings'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import People from './pages/People'
import ProjectDetails from './pages/ProjectDetails'

// Simple auth check
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/landing" replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={
          isAuthenticated() ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/landing" replace />
          )
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <Layout>
              <ProjectDetails />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Layout>
              <Tasks />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/meetings" element={
          <ProtectedRoute>
            <Layout>
              <Meetings />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/people" element={
          <ProtectedRoute>
            <Layout>
              <People />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App