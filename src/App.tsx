import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuth } from './hooks/useAuth';
import { queryClient } from './lib/queryClient';

// Auth pages
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Protected pages
import { Dashboard } from './pages/Dashboard';
import { DigitalTwins } from './pages/company/DigitalTwins';
import { Campaigns } from './pages/company/Campaigns';
import { AgentProfile } from './pages/agent/Profile';
import { AgentCampaigns } from './pages/agent/Campaigns';
import { AgentEarnings } from './pages/agent/Earnings';
import { AdminCompanies } from './pages/admin/Companies';
import { AdminSettings } from './pages/admin/Settings';
import { CompanyBilling } from './pages/company/Billing';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
          
          {/* Company routes */}
          <Route 
            path="/company/digital-twins" 
            element={
              <ProtectedRoute requiredRole="company">
                <DigitalTwins />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/campaigns" 
            element={
              <ProtectedRoute requiredRole="company">
                <Campaigns />
              </ProtectedRoute>
            } 
          />

          {/* Agent routes */}
          <Route 
            path="/agent/profile" 
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/campaigns" 
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentCampaigns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agent/earnings" 
            element={
              <ProtectedRoute requiredRole="agent">
                <AgentEarnings />
              </ProtectedRoute>
            } 
          />

          {/* Admin routes */}
          <Route 
            path="/admin/companies" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminCompanies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSettings />
              </ProtectedRoute>
            } 
          />

          {/* Company billing */}
          <Route 
            path="/company/billing" 
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyBilling />
              </ProtectedRoute>
            } 
          />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;