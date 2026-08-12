import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  UserPlus, 
  Clock, 
  CalendarDays, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  BarChart3, 
  Cpu, 
  Briefcase,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F4F8FA 0%, #F3F9FA 50%, #D8ECF0 100%)',
      color: '#063A4B',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Ambient Background Glow Highlights */}
      <div style={{
        position: 'absolute', top: '-10%', left: '10%', width: '550px', height: '550px',
        background: 'radial-gradient(circle, rgba(122, 178, 178, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(70px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '5%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(8, 131, 149, 0.18) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(90px)', pointerEvents: 'none'
      }} />

      {/* ─── Navigation Header ────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(16px)',
        background: 'rgba(255, 255, 255, 0.92)',
        borderBottom: '1px solid #7AB2B2',
        padding: '1.1rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(9, 99, 126, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{
            background: 'linear-gradient(135deg, #09637E, #088395)',
            padding: '0.6rem', borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(9, 99, 126, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Cpu size={24} color="#FFFFFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#063A4B' }}>
              NEUZEN <span style={{ background: 'linear-gradient(135deg, #09637E, #088395)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: '#09637E', fontWeight: 700, letterSpacing: '0.1em' }}>
              HRMS PLATFORM
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#why-login" style={{ color: '#09637E', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'color 0.2s' }}>Why Log In?</a>
          <a href="#modules" style={{ color: '#09637E', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'color 0.2s' }}>HR Modules</a>
          
          <button 
            onClick={handleLoginRedirect}
            style={{
              background: 'linear-gradient(135deg, #09637E 0%, #088395 100%)',
              color: '#FFFFFF',
              padding: '0.75rem 1.6rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(9, 99, 126, 0.35)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 99, 126, 0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(9, 99, 126, 0.35)'; }}
          >
            <span>Sign In to HRMS</span>
            <ArrowRight size={18} />
          </button>
        </nav>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 2rem 2.5rem 2rem', textAlign: 'center', position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          background: 'rgba(9, 99, 126, 0.08)', border: '1px solid #7AB2B2',
          padding: '0.45rem 1.2rem', borderRadius: '50px', marginBottom: '1.8rem'
        }}>
          <Sparkles size={16} color="#09637E" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#09637E', letterSpacing: '0.02em' }}>
            Autonomous Intelligent HRMS Ecosystem
          </span>
        </div>

        <h1 style={{
          fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.04em',
          maxWidth: '920px', margin: '0 auto 1.5rem auto',
          color: '#063A4B'
        }}>
          Transform Workforce Operations with <span style={{ background: 'linear-gradient(135deg, #09637E, #088395)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Intelligence</span>
        </h1>

        <p style={{
          fontSize: '1.2rem', color: '#09637E', maxWidth: '750px', margin: '0 auto 2.5rem auto', lineHeight: 1.6, fontWeight: 500
        }}>
          Streamline applicant onboarding, automated attendance logging, instant payslip generation, and real-time leave management — engineered for modern enterprises.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleLoginRedirect}
            style={{
              background: 'linear-gradient(135deg, #09637E 0%, #088395 100%)',
              color: '#FFFFFF',
              padding: '1.1rem 2.4rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              boxShadow: '0 10px 30px rgba(9, 99, 126, 0.35)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(9, 99, 126, 0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(9, 99, 126, 0.35)'; }}
          >
            <span>Launch HRMS Portal</span>
            <ArrowRight size={22} />
          </button>

          <a
            href="#why-login"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #7AB2B2',
              color: '#063A4B',
              padding: '1.1rem 2.2rem',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1.1rem',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              boxShadow: '0 4px 15px rgba(9, 99, 126, 0.06)',
              transition: 'all 0.3s ease'
            }}
          >
            <Briefcase size={20} color="#09637E" />
            <span>Why Use This Platform?</span>
          </a>
        </div>
      </section>

      {/* ─── CONCISE WHY LOG IN SECTION ───────────────────────────────────── */}
      <section id="why-login" style={{
        maxWidth: '1100px', margin: '2rem auto 4rem auto', padding: '0 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(9, 99, 126, 0.08)', border: '1px solid #7AB2B2',
            padding: '0.4rem 1.1rem', borderRadius: '50px', marginBottom: '0.8rem',
            fontSize: '0.85rem', fontWeight: 700, color: '#09637E'
          }}>
            <ShieldCheck size={16} />
            <span>BUSINESS PURPOSE</span>
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#063A4B', letterSpacing: '-0.03em' }}>
            Why Log In to NEUZEN AI HRMS?
          </h2>
          <p style={{ color: '#09637E', fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 0 auto', fontWeight: 500 }}>
            A unified digital workspace providing self-service tools, HR automation, and executive analytics.
          </p>
        </div>

        {/* 3 Concise Feature Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Pillar 1: Employees */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '20px', padding: '1.8rem', boxShadow: '0 8px 25px rgba(9, 99, 126, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#F4F8FA', padding: '0.6rem', borderRadius: '12px', color: '#088395' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#063A4B' }}>For Employees</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.92rem', color: '#063A4B' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#088395" /> 1-Click attendance check-in & check-out
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#088395" /> Online leave requests & live status tracking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#088395" /> Instant PDF payslip view & download
              </li>
            </ul>
          </div>

          {/* Pillar 2: HR Managers */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '20px', padding: '1.8rem', boxShadow: '0 8px 25px rgba(9, 99, 126, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#F4F8FA', padding: '0.6rem', borderRadius: '12px', color: '#09637E' }}>
                <Briefcase size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#063A4B' }}>For HR Managers</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.92rem', color: '#063A4B' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#09637E" /> Digital candidate onboarding & offer letters
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#09637E" /> Centralized leave approvals & comments
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#09637E" /> Automated payroll calculation & query management
              </li>
            </ul>
          </div>

          {/* Pillar 3: Executive Leadership */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '20px', padding: '1.8rem', boxShadow: '0 8px 25px rgba(9, 99, 126, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#F4F8FA', padding: '0.6rem', borderRadius: '12px', color: '#088395' }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#063A4B' }}>For Executives & Admins</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.92rem', color: '#063A4B' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#088395" /> Visual analytics for headcount & expenditure
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#088395" /> Role-based security & strict privacy control
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#088395" /> 1-Click executive summary report exports
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Modules Grid Section ─────────────────────────────────────────── */}
      <section id="modules" style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#063A4B', marginBottom: '0.6rem' }}>Comprehensive HR Modules</h2>
          <p style={{ color: '#09637E', fontSize: '1.05rem', fontWeight: 500 }}>Everything required to operate your human capital management efficiently.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '18px', padding: '1.6rem', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.05)'
          }}>
            <div style={{ background: '#F4F8FA', padding: '0.7rem', borderRadius: '12px', width: 'fit-content', color: '#088395', marginBottom: '1rem' }}>
              <UserPlus size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.5rem' }}>Onboarding Candidates</h3>
            <p style={{ color: '#09637E', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Candidate pipeline tracking, digital offer letter issuance, and staff activation.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '18px', padding: '1.6rem', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.05)'
          }}>
            <div style={{ background: '#F4F8FA', padding: '0.7rem', borderRadius: '12px', width: 'fit-content', color: '#09637E', marginBottom: '1rem' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.5rem' }}>Attendance & Login Tracking</h3>
            <p style={{ color: '#09637E', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Personal employee dashboard with live Log In / Log Out timestamps.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '18px', padding: '1.6rem', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.05)'
          }}>
            <div style={{ background: '#F4F8FA', padding: '0.7rem', borderRadius: '12px', width: 'fit-content', color: '#088395', marginBottom: '1rem' }}>
              <CalendarDays size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.5rem' }}>Leave Management & Approvals</h3>
            <p style={{ color: '#09637E', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Self-service leave applications for employees with live status tracking.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '18px', padding: '1.6rem', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.05)'
          }}>
            <div style={{ background: '#F4F8FA', padding: '0.7rem', borderRadius: '12px', width: 'fit-content', color: '#09637E', marginBottom: '1rem' }}>
              <CreditCard size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.5rem' }}>Automated Payroll & PDF Payslips</h3>
            <p style={{ color: '#09637E', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Detailed salary breakdowns with 1-click official PDF payslip downloads.
            </p>
          </div>

          {/* Card 5 */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '18px', padding: '1.6rem', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.05)'
          }}>
            <div style={{ background: '#F4F8FA', padding: '0.7rem', borderRadius: '12px', width: 'fit-content', color: '#088395', marginBottom: '1rem' }}>
              <CalendarDays size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.5rem' }}>Company Calendar & Meetings</h3>
            <p style={{ color: '#09637E', fontSize: '0.92rem', lineHeight: 1.5 }}>
              HR/Admin scheduled meetings and company holiday calendar visible in real-time.
            </p>
          </div>

          {/* Card 6 */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #7AB2B2',
            borderRadius: '18px', padding: '1.6rem', boxShadow: '0 4px 15px rgba(9, 99, 126, 0.05)'
          }}>
            <div style={{ background: '#EBF4F6', padding: '0.7rem', borderRadius: '12px', width: 'fit-content', color: '#09637E', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.5rem' }}>Role-Based Access Control</h3>
            <p style={{ color: '#09637E', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Granular view and control permissions customized for Admin, HR Managers, and Employees.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #7AB2B2', background: '#FFFFFF',
        padding: '2rem', textAlign: 'center', color: '#09637E', fontSize: '0.9rem', fontWeight: 600, marginTop: '4rem'
      }}>
        <div>© 2026 NEUZEN AI Human Resource Management System. All rights reserved.</div>
      </footer>
    </div>
  );
}
