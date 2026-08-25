import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { AdminPage } from './pages/AdminPage';

// Seeker Pages
import { SeekerDashboard } from './pages/seeker/SeekerDashboard';
import { JobsPage } from './pages/seeker/JobsPage';
import { ApplicationsPage } from './pages/seeker/ApplicationsPage';
import { ResumeIntelligence } from './pages/seeker/ResumeIntelligence';
import { CareerInsights } from './pages/seeker/CareerInsights';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { ManageJobs } from './pages/recruiter/ManageJobs';
import { CandidatesPage } from './pages/recruiter/CandidatesPage';
import { AnalyticsPage } from './pages/recruiter/AnalyticsPage';

// Layout
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const queryClient = new QueryClient();

// Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN' }> = ({
  children,
  allowedRole
}) => {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="h-screen bg-[#070A0F] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && state.user?.role !== allowedRole) {
    // Redirect role-mismatch to correct homepage
    if (state.user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (state.user?.role === 'RECRUITER') {
      return <Navigate to="/recruiter" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing/Auth Paths */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Direct Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="JOB_SEEKER">
                  <SeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Legacy URL redirects for compatibility */}
            <Route path="/seeker/dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/recruiter/dashboard" element={<Navigate to="/recruiter" replace />} />

            {/* Protected Job Seeker Portal subpaths */}
            <Route
              path="/seeker/jobs"
              element={
                <ProtectedRoute allowedRole="JOB_SEEKER">
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/applications"
              element={
                <ProtectedRoute allowedRole="JOB_SEEKER">
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/resume-intelligence"
              element={
                <ProtectedRoute allowedRole="JOB_SEEKER">
                  <ResumeIntelligence />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/career-insights"
              element={
                <ProtectedRoute allowedRole="JOB_SEEKER">
                  <CareerInsights />
                </ProtectedRoute>
              }
            />

            {/* Protected Recruiter Portal subpaths */}
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/candidates"
              element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <CandidatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/analytics"
              element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
