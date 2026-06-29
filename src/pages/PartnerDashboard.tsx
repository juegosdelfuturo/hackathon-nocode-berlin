import { useState, useEffect } from 'react';
import { Lock, Crown, Check, ArrowRight, User, Shield, Key, AlertCircle, CheckCircle2, Building2, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';
import CommunityPage from './CommunityPage';
import JobsPage from './JobsPage';

interface PartnerDashboardProps {
  subscriptionTier: 'none' | 'data_partner' | 'track_partner';
  onSubscribeClick: (tier: 'data_partner' | 'track_partner') => void;
  partnerEmail?: string;
}

export default function PartnerDashboard({
  subscriptionTier,
  onSubscribeClick,
  partnerEmail
}: PartnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'talent' | 'jobs' | 'profile'>('talent');

  // Profile data states
  const [companyName, setCompanyName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    if (!partnerEmail) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('company_name')
          .eq('email', partnerEmail)
          .single();

        if (error) throw error;
        if (data) {
          setCompanyName(data.company_name || '');
        }
      } catch (err: any) {
        console.error('Error fetching partner profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [partnerEmail]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileSaving(true);

    try {
      const { error } = await supabase
        .from('partners')
        .update({ company_name: companyName.trim() })
        .eq('email', partnerEmail);

      if (error) throw error;
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match.');
      return;
    }

    setPwdLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setPwdSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Failed to change password.');
    } finally {
      setPwdLoading(false);
    }
  };

  // Render the Paywall/Upgrade view
  const renderPaywall = () => (
    <div className="platform-page" style={{ paddingBottom: '4rem' }}>
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem', marginBottom: '3rem' }}>
        <div className="login-wall-icon" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.2)', margin: '0 auto 1.5rem' }}>
          <Lock size={36} />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Unlock the Talent Pool</h2>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose a license below to get immediate access to our vetted candidate database and post your open roles.
        </p>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Package 1: Data Partner */}
          <div style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Data Partner</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem', minHeight: '40px' }}>
              Access to participant profiles from the last month.
            </p>
            <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--fg)' }}>€2500</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem' }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                Access to recent profiles
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem' }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                Filter by skills, roles, and experience
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem' }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                Direct contact links
              </li>
            </ul>

            <button className="btn btn-secondary" onClick={() => onSubscribeClick('data_partner')} style={{ width: '100%', justifyContent: 'center' }}>
              PURCHASE DATA PLAN
            </button>
          </div>

          {/* Package 2: Track Partner Package */}
          <div style={{ 
            background: 'rgba(0,102,255,0.03)', 
            border: '2px solid var(--accent)', 
            borderRadius: '12px', 
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', 
              background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
              padding: '0.2rem 0.75rem', borderRadius: '20px', letterSpacing: '0.05em', fontWeight: 'bold'
            }}>
              PREMIUM
            </div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Track Partner</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem', minHeight: '40px' }}>
              Full partnership experience and unlimited data access.
            </p>
            <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--fg)' }}>€4500</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem', fontWeight: 600 }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                Full access to all participant profiles
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem' }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                Custom sponsorship opportunities
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem' }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                VIP access to all events
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: 'var(--fg)', fontSize: '0.95rem' }}>
                <Check size={18} color="var(--accent)" style={{ flexShrink: 0 }} /> 
                Dedicated account manager
              </li>
            </ul>

            <button className="btn" onClick={() => onSubscribeClick('track_partner')} style={{ width: '100%', justifyContent: 'center' }}>
              PURCHASE TRACK PLAN <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div className="platform-page" style={{ position: 'relative' }}>
      {/* Active License Banner */}
      {subscriptionTier !== 'none' && (
        <div style={{ 
          background: subscriptionTier === 'data_partner' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(0,102,255,0.1)',
          borderBottom: `1px solid ${subscriptionTier === 'data_partner' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,102,255,0.2)'}`,
          padding: '0.75rem',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: subscriptionTier === 'data_partner' ? '#34d399' : 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {subscriptionTier === 'data_partner' ? <Check size={14} /> : <Crown size={14} />}
          {subscriptionTier === 'data_partner' ? 'DATA PARTNER ACTIVE' : 'TRACK PARTNER ACTIVE'}
        </div>
      )}
      
      {/* Internal Navigation */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
        <div className="container" style={{ display: 'flex', gap: '2rem' }}>
          <button 
            className={`platform-nav-link ${activeTab === 'talent' ? 'active' : ''}`} 
            onClick={() => setActiveTab('talent')}
            style={{ padding: '1rem 0' }}
          >
            TALENT POOL
          </button>
          <button 
            className={`platform-nav-link ${activeTab === 'jobs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('jobs')}
            style={{ padding: '1rem 0' }}
          >
            JOB POSTINGS
          </button>
          <button 
            className={`platform-nav-link ${activeTab === 'profile' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profile')}
            style={{ padding: '1rem 0' }}
          >
            PROFILE
          </button>
        </div>
      </div>

      {/* Render selected view */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {activeTab === 'talent' && (subscriptionTier === 'none' ? renderPaywall() : <CommunityPage subscriptionTier={subscriptionTier} />)}
        {activeTab === 'jobs' && (subscriptionTier === 'none' ? renderPaywall() : <JobsPage />)}
        
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={28} color="var(--accent)" /> Partner Profile
            </h1>

            {profileLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                Loading profile details...
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                
                {/* Account Details & Status */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={20} color="var(--accent)" /> Account Information
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Registered Email</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                        <Mail size={16} color="var(--muted)" />
                        <span>{partnerEmail}</span>
                      </div>
                    </div>

                    <div>
                      <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Company / Full Name</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                        <Building2 size={16} color="var(--muted)" />
                        <span>{companyName || 'Not Set'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="mono" style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Active Plan</span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: subscriptionTier !== 'none' ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${subscriptionTier !== 'none' ? '#34d399' : 'var(--border)'}` }}>
                        <Crown size={14} color={subscriptionTier !== 'none' ? '#34d399' : 'var(--muted)'} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: subscriptionTier !== 'none' ? '#34d399' : 'var(--muted)' }}>
                          {subscriptionTier === 'none' ? 'NO ACTIVE PLAN' : 
                           subscriptionTier === 'data_partner' ? 'DATA PARTNER' : 'TRACK PARTNER'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Form & Password Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Edit Profile Form */}
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Edit Profile Details
                    </h3>

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Company or Full Name</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          required
                          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)', fontSize: '0.95rem' }}
                        />
                      </div>

                      {profileSuccess && (
                        <div style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(52,211,153,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(52,211,153,0.2)' }}>
                          <CheckCircle2 size={14} /> {profileSuccess}
                        </div>
                      )}

                      {profileError && (
                        <div style={{ color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(248,113,113,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.2)' }}>
                          <AlertCircle size={14} /> {profileError}
                        </div>
                      )}

                      <button type="submit" className="btn btn-secondary" disabled={profileSaving} style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem' }}>
                        {profileSaving ? 'SAVING...' : 'UPDATE NAME'}
                      </button>
                    </form>
                  </div>

                  {/* Change Password Form */}
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Key size={20} color="var(--accent)" /> Change Password
                    </h3>

                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)', fontSize: '0.95rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)', fontSize: '0.95rem' }}
                        />
                      </div>

                      {pwdSuccess && (
                        <div style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(52,211,153,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(52,211,153,0.2)' }}>
                          <CheckCircle2 size={14} /> {pwdSuccess}
                        </div>
                      )}

                      {pwdError && (
                        <div style={{ color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(248,113,113,0.05)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.2)' }}>
                          <AlertCircle size={14} /> {pwdError}
                        </div>
                      )}

                      <button type="submit" className="btn" disabled={pwdLoading} style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem' }}>
                        {pwdLoading ? 'CHANGING...' : 'CHANGE PASSWORD'}
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
