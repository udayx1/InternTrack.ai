import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

import Dashboard from '@/pages/Dashboard'
import Pipeline from '@/pages/Pipeline'
import Applications from '@/pages/Applications'
import AddApplication from '@/pages/AddApplication'
import JobAnalyzer from '@/pages/JobAnalyzer'
import ResumeAnalyzer from '@/pages/ResumeAnalyzer'
import CareerProfile from '@/pages/CareerProfile'
import SkillGapPage from '@/pages/SkillGapPage'
import AICopilot from '@/pages/AICopilot'
import CareerInsights from '@/pages/CareerInsights'
import SettingsPage from '@/pages/SettingsPage'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/pipeline" element={<Pipeline />} />
            <Route path="/app/applications" element={<Applications />} />
            <Route path="/app/applications/new" element={<AddApplication />} />
            <Route path="/app/job-analyzer" element={<JobAnalyzer />} />
            <Route path="/app/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/app/profile" element={<CareerProfile />} />
            <Route path="/app/skill-gap" element={<SkillGapPage />} />
            <Route path="/app/copilot" element={<AICopilot />} />
            <Route path="/app/insights" element={<CareerInsights />} />
            <Route path="/app/settings" element={<SettingsPage />} />
          </Route>

          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
