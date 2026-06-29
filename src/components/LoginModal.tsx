import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, Eye, EyeOff, Clock, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (isAdmin?: boolean, email?: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailLower = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        if (!companyName.trim()) {
          setError('Company/Full Name is required.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        // Sign Up via Supabase Auth
        const { error: signUpError } = await supabase.auth.signUp({
          email: emailLower,
          password: password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          // Insert partner record as PENDING
          const { error: insertError } = await supabase.from('partners').insert([{
            email: emailLower,
            company_name: companyName.trim(),
            subscription_tier: 'none',
            subscription_status: 'inactive',
            status: 'PENDING'
          }]);

          if (insertError && !insertError.message.includes('duplicate')) {
            console.error("Failed to create partner record:", insertError);
          }

          // Show the dedicated pending screen
          setSignedUpEmail(emailLower);
        }
      } else {
        // ── ADMIN LOGIN: verify via DB RPC (no Supabase Auth session needed) ──
        const { data: isAdmin, error: rpcError } = await supabase.rpc('verify_admin_login', {
          p_email: emailLower,
          p_password: password,
        });

        if (!rpcError && isAdmin === true) {
          onSuccess(true, emailLower);
          onClose();
          setLoading(false);
          return;
        }

        // ── PARTNER LOGIN: via Supabase Auth ────────────────────────────────
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: emailLower,
          password: password,
        });

        if (signInError) {
          const msg = signInError.message.toLowerCase();
          if (msg.includes('rate limit') || msg.includes('too many requests')) {
            setError('Too many failed login attempts. Please try again later.');
          } else if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
            setError('Invalid email or password.');
          } else {
            setError(signInError.message);
          }
          setLoading(false);
          return;
        }

        if (signInData.session) {
          // Check partner approval status
          const { data: partnerRecord } = await supabase
            .from('partners')
            .select('status')
            .eq('email', emailLower)
            .single();

          if (partnerRecord && partnerRecord.status === 'PENDING') {
            await supabase.auth.signOut();
            setError('Your account is pending admin approval.');
          } else if (partnerRecord && partnerRecord.status === 'REJECTED') {
            await supabase.auth.signOut();
            setError('Your partner account was not approved.');
          } else {
            onSuccess();
            onClose();
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ─── POST-SIGNUP PENDING SCREEN ────────────────────────────────────────────
  if (signedUpEmail) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="login-modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>

          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(52,211,153,0.1)', border: '2px solid #34d399',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '1.5rem auto 1.5rem'
          }}>
            <CheckCircle size={36} color="#34d399" />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Request Submitted!
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            Your partner account for
          </p>
          <p style={{
            fontSize: '0.9rem', fontFamily: 'var(--font-mono)',
            color: 'var(--accent)', background: 'rgba(0,200,200,0.05)',
            padding: '0.4rem 0.8rem', borderRadius: '6px',
            display: 'inline-block', marginBottom: '1.25rem'
          }}>
            {signedUpEmail}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            has been submitted and is <strong style={{ color: 'var(--fg)' }}>pending approval</strong>.
            You will be contacted once an admin reviews your request.
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.75rem', background: 'rgba(251,191,36,0.07)',
            border: '1px solid rgba(251,191,36,0.3)', borderRadius: '8px', marginBottom: '2rem'
          }}>
            <Clock size={16} color="#fbbf24" />
            <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>Awaiting Admin Approval</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setSignedUpEmail('');
                setIsSignUp(false);
                setEmail('');
                setCompanyName('');
                setPassword('');
              }}
              className="btn"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogIn size={16} /> Sign In to Existing Account <ArrowRight size={14} />
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGIN / SIGNUP FORM ───────────────────────────────────────────────────
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        <div className="login-modal-brand">
          <img src="/logos/hacklab.png" alt="HackLab" className="login-brand-logo" />
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            style={{
              flex: 1, padding: '0.75rem', background: 'none', border: 'none',
              borderBottom: !isSignUp ? '2px solid var(--accent)' : 'none',
              color: !isSignUp ? 'var(--fg)' : 'var(--muted)',
              fontWeight: !isSignUp ? 'bold' : 'normal',
              cursor: 'pointer', fontSize: '0.9rem'
            }}
            onClick={() => { setIsSignUp(false); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1, padding: '0.75rem', background: 'none', border: 'none',
              borderBottom: isSignUp ? '2px solid var(--accent)' : 'none',
              color: isSignUp ? 'var(--fg)' : 'var(--muted)',
              fontWeight: isSignUp ? 'bold' : 'normal',
              cursor: 'pointer', fontSize: '0.9rem'
            }}
            onClick={() => { setIsSignUp(true); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        <div className="login-header" style={{ marginBottom: '2.5rem' }}>
          <h2>{isSignUp ? 'Partner Registration' : 'Partner Access'}</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="login-input-group">
              <Building2 size={16} className="login-input-icon" />
              <input
                className="login-input login-input-active"
                type="text"
                placeholder="name"
                value={companyName}
                onChange={e => { setCompanyName(e.target.value); setError(''); }}
                required={isSignUp}
                autoFocus={isSignUp}
              />
            </div>
          )}
          <div className="login-input-group">
            <Mail size={16} className="login-input-icon" />
            <input
              className="login-input login-input-active"
              type="email"
              placeholder="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              required
              autoFocus={!isSignUp}
            />
          </div>
          <div className="login-input-group">
            <Lock size={16} className="login-input-icon" />
            <input
              className="login-input login-input-active"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              required
            />
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPwd(!showPwd)}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" className="btn login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner" /> {isSignUp ? 'CREATING ACCOUNT...' : 'AUTHENTICATING...'}
              </>
            ) : (
              <>
                <LogIn size={15} style={{ marginRight: '0.5rem' }} />
                {isSignUp ? 'SUBMIT REQUEST' : 'SIGN IN'}
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginModal;
