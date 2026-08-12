import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Lock, ArrowRight, ArrowLeft, Cpu } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid login credentials. Please check email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Ambient Glow Spheres */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '450px', height: '450px',
        background: 'radial-gradient(circle, rgba(122, 178, 178, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(70px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(8, 131, 149, 0.2) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)', pointerEvents: 'none'
      }} />

      {/* Top Left Home Back Link */}
      <Link 
        to="/" 
        className="login-back-btn"
      >
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>

      {/* Centered Clean Login Container */}
      <div className="login-card-container">
        <div className="login-right-form">
          {/* Brand Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #09637E, #088395)',
              color: '#FFFFFF',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto',
              boxShadow: '0 8px 25px rgba(9, 99, 126, 0.3)'
            }}>
              <Cpu size={30} />
            </div>

            <h1 style={{ fontSize: '1.8rem', color: '#063A4B', fontWeight: 800, marginBottom: '0.3rem' }}>
              NEUZEN <span style={{ background: 'linear-gradient(135deg, #09637E, #088395)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#09637E', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '1.2rem' }}>
              HRMS PLATFORM
            </span>

            <h2 style={{ fontSize: '1.5rem', color: '#063A4B', fontWeight: 800, marginBottom: '0.4rem' }}>Welcome Back</h2>
            <p style={{ color: '#09637E', fontSize: '0.92rem', fontWeight: 500 }}>Enter your credentials to sign in to your workspace.</p>
          </div>

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#D93838',
              padding: '0.9rem 1.1rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              marginBottom: '1.6rem',
              border: '1px solid rgba(217, 56, 56, 0.3)',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Shield size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#063A4B', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#09637E' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@neuzenai.com"
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '2.8rem',
                    paddingRight: '1rem',
                    paddingTop: '0.85rem',
                    paddingBottom: '0.85rem',
                    border: '1.5px solid #7AB2B2',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    color: '#063A4B',
                    outline: 'none',
                    background: '#F4F8FA'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#063A4B' }}>Password</label>
                <a href="/forgot-password" style={{ fontSize: '0.85rem', color: '#09637E', textDecoration: 'none', fontWeight: 700 }}>Forgot Password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#09637E' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '2.8rem',
                    paddingRight: '1rem',
                    paddingTop: '0.85rem',
                    paddingBottom: '0.85rem',
                    border: '1.5px solid #7AB2B2',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    color: '#063A4B',
                    outline: 'none',
                    background: '#F4F8FA'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #09637E 0%, #088395 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(9, 99, 126, 0.35)',
                marginTop: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
