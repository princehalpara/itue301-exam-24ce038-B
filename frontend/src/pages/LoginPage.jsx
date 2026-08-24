import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Lock, Mail, User, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [membershipType, setMembershipType] = useState('basic');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/classes';

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login({ email, name, membershipType });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickLogin = async (demoEmail, demoName, demoTier) => {
    try {
      setError('');
      setIsSubmitting(true);
      setEmail(demoEmail);
      setName(demoName);
      setMembershipType(demoTier);
      await login({ email: demoEmail, name: demoName, membershipType: demoTier });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-teal))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Dumbbell size={32} color="#0a0e17" />
          </div>
          <h2>Welcome to FitZone</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
            Enter your credentials or choose a test member profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span style={{ color: 'var(--accent-rose)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)',
                }}
              />
              <input
                id="email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. member@fitzone.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name (Optional for new members)
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)',
                }}
              />
              <input
                id="name"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. Prince Halpara"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="membershipType">
              Membership Tier
            </label>
            <select
              id="membershipType"
              className="form-control"
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
            >
              <option value="basic">Basic Tier (General Access)</option>
              <option value="premium">Premium Tier (All Classes + Locker)</option>
              <option value="platinum">Platinum Tier (VIP + 1-on-1 Training)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In & Continue</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for Examiner Convenience */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="var(--accent-teal)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Demo Accounts
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('prince.halpara@fitzone.edu', 'Prince Halpara (24CE038)', 'platinum')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
            >
              <span>Prince Halpara (Student Exam Account)</span>
              <span className="tier-pill tier-platinum">Platinum</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('alex.rivera@example.com', 'Alex Rivera', 'premium')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
            >
              <span>Alex Rivera</span>
              <span className="tier-pill tier-premium">Premium</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('sam.lee@example.com', 'Samantha Lee', 'basic')}
              className="btn btn-secondary"
              style={{ justifyContent: 'space-between', padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
            >
              <span>Samantha Lee</span>
              <span className="tier-pill tier-basic">Basic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
