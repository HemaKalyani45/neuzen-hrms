import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMSDataProvider } from './context/HRMSDataContext';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboards/DashboardPage';
import EmployeeManagement from './pages/modules/EmployeeManagement';
import DepartmentManagement from './pages/modules/DepartmentManagement';
import OnboardingModule from './pages/modules/OnboardingModule';
import AttendanceModule from './pages/modules/AttendanceModule';
import LeaveManagement from './pages/modules/LeaveManagement';
import PayrollModule from './pages/modules/PayrollModule';
import CalendarModule from './pages/modules/CalendarModule';
import ProfileModule from './pages/modules/ProfileModule';
import MainLayout from './components/layout/MainLayout';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <HRMSDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingModule /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><AttendanceModule /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute><PayrollModule /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarModule /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileModule /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </HRMSDataProvider>
    </AuthProvider>
  );
}
