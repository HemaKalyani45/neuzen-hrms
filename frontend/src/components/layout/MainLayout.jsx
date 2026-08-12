import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  CreditCard,
  UserPlus,
  BarChart3,
  LogOut,
  Sparkles,
  Shield,
  User,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';

export default function MainLayout({ children }) {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'HR', 'Employee'] },
    { label: 'Employee Management', path: '/employees', icon: Users, roles: ['Admin', 'HR'] },
    { label: 'Departments', path: '/departments', icon: Building2, roles: ['Admin'] },
    { label: 'Employee Onboarding', path: '/onboarding', icon: UserPlus, roles: ['Admin', 'HR'] },
    { label: 'Attendance', path: '/attendance', icon: Clock, roles: ['Admin', 'HR', 'Employee'] },
    { label: 'Leave Management', path: '/leave', icon: CalendarDays, roles: ['Admin', 'HR', 'Employee'] },
    { label: 'Payroll & Payslips', path: '/payroll', icon: CreditCard, roles: ['Admin', 'HR', 'Employee'] },
    { label: 'Company Calendar', path: '/calendar', icon: CalendarDays, roles: ['Admin', 'HR', 'Employee'] },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['Employee', 'HR', 'Admin'] }
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role || 'Employee'));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F8FA' }}>
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="mobile-backdrop-overlay"
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Section */}
        <div style={{
          padding: '1.8rem 1.5rem',
          borderBottom: '1px solid rgba(122, 178, 178, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #09637E, #088395)',
              color: '#ffffff',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: '#063A4B', lineHeight: 1 }}>NEUZEN AI</h2>
              <span style={{ fontSize: '0.75rem', color: '#09637E', fontWeight: 600, letterSpacing: '0.05em' }}>HRMS PLATFORM</span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="mobile-close-sidebar-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Header Info */}
        <div style={{
          margin: '1rem 1.2rem',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          background: 'rgba(235, 244, 246, 0.8)',
          border: '1px solid #7AB2B2',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #09637E, #088395)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#063A4B', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {user?.name || 'User'}
            </div>
            <span className={`badge ${user?.role === 'Admin' ? 'badge-danger' : user?.role === 'HR' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
              {user?.role || 'Employee'}
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ flex: 1, padding: '0.5rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#09637E' : '#4A7A8A',
                  background: isActive ? 'rgba(122, 178, 178, 0.2)' : 'transparent',
                  borderLeft: isActive ? '4px solid #09637E' : '4px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={20} color={isActive ? '#09637E' : '#4A7A8A'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout section */}
        <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid rgba(122, 178, 178, 0.3)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.75rem',
              borderRadius: '10px',
              background: '#FEE2E2',
              color: '#D93838',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid rgba(217, 56, 56, 0.2)'
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Header */}
        <header style={{
          height: '70px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #7AB2B2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="mobile-hamburger-btn"
            >
              <Menu size={24} />
            </button>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#063A4B', fontWeight: 800 }}>
                NEUZEN AI HR Portal
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#09637E', fontWeight: 600 }}>Welcome, {user?.name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="role-pill-badge">
              <Shield size={16} />
              <span>Role: {user?.role}</span>
            </div>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#F4F8FA',
              border: '1px solid #7AB2B2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#09637E'
            }}>
              <Bell size={18} />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="app-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
