import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#566E65', marginBottom: '1.5rem', fontWeight: 600 }}
        >
          <ArrowLeft size={18} />
          <span>Back to Login</span>
        </button>

        {!submitted ? (
          <>
            <h2 style={{ fontSize: '1.6rem', color: '#1C2D27', marginBottom: '0.5rem' }}>Reset Password</h2>
            <p style={{ color: '#566E65', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Enter your registered NEUZEN AI work email address and we'll send password recovery instructions.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1C2D27', marginBottom: '0.4rem' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#566E65' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@neuzenai.com"
                    required
                    style={{ width: '100%', paddingLeft: '2.8rem' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={54} color="#659287" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#1C2D27', marginBottom: '0.5rem' }}>Instructions Dispatched</h2>
            <p style={{ color: '#566E65', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              We have dispatched a password reset link to <strong>{email || 'your email'}</strong>. Please check your inbox.
            </p>
            <button onClick={() => navigate('/login')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
