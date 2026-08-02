import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import HomePage from './pages/HomePage';
import { LEGAL_CONTENT, type LegalKey } from './data/legalContent';

// Lazy-load heavy pages that are not needed on first paint
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));


type Page = 'home' | 'opportunities' | 'articles' | 'admin';

interface AuthUser { email: string; }

// ─── SHARED HEADER ────────────────────────────────────────────────────────────
function PlatformHeader({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate: (p: Page) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="platform-header">
      <div className="container nav-inner">
        {/* Logo */}
        <button className="logo-brand hacklab-logo-link" onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="HackLab Home">
          <img src="/logos/hacklab.webp" alt="HackLab" className="hacklab-logo-img" width={80} height={80} decoding="async" />
        </button>

        {/* Desktop nav */}
        <nav className="platform-nav">
          <button className={`platform-nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            Hackathons
          </button>
          <button className={`platform-nav-link ${currentPage === 'opportunities' ? 'active' : ''}`} onClick={() => onNavigate('opportunities')}>
            Opportunities
          </button>
        </nav>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu-item" onClick={() => { onNavigate('home'); setMobileOpen(false); }}>Hackathons</button>
          <button className="mobile-menu-item" onClick={() => { onNavigate('opportunities'); setMobileOpen(false); }}>Opportunities</button>
        </div>
      )}
    </header>
  );
}

// ─── LOGIN WALL (for protected pages) ────────────────────────────────────────
function LoginWall({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="login-wall">
      <div className="login-wall-inner">
        <div className="login-wall-icon">
          <Lock size={36} />
        </div>
        <h2>Access restricted</h2>
        <p>This section is restricted to the HackLab partners and team.<br />Please sign in with your account.</p>
        <button className="btn" onClick={onLoginClick}>
          SIGN IN
        </button>
      </div>
    </div>
  );
}


// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const getInitialPage = (): Page => {
    if (window.location.hash === '#articles') return 'articles';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalKey | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) setShowCookieBanner(true);

    let subObj: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      // Only import Supabase on initial load if an auth token exists in localStorage
      const hasAuthToken = Object.keys(localStorage).some(k => k.includes('auth-token') || k.startsWith('sb-'));
      if (!hasAuthToken) return;

      try {
        const { supabase } = await import('./supabaseClient');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase.from('partners').select('subscription_tier, status').eq('email', session.user.email).single();
          if (data && data.status !== 'PENDING' && data.status !== 'REJECTED') {
            setAuthUser({ email: session.user.email || '' });
          } else {
            setAuthUser(null);
          }
        } else {
          setAuthUser(null);
          setIsAdmin(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const { data } = await supabase.from('partners').select('subscription_tier, status').eq('email', session.user.email).single();
            if (data && data.status !== 'PENDING' && data.status !== 'REJECTED') {
              setAuthUser({ email: session.user.email || '' });
            } else {
              setAuthUser(null);
            }
          } else {
            setAuthUser(null);
            setIsAdmin(false);
          }
        });
        subObj = subscription;
      } catch (e) {
        console.error('Auth initialization deferred error:', e);
      }
    };

    // Load auth after initial render idle window
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initAuth);
    } else {
      setTimeout(initAuth, 1000);
    }

    return () => {
      if (subObj) subObj.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { supabase } = await import('./supabaseClient');
    await supabase.auth.signOut();
    setAuthUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  const [consentCookies, setConsentCookies] = React.useState(false);
  const [consentData, setConsentData] = React.useState(false);

  const handleCookieConsent = () => {
    if (!consentCookies || !consentData) return;
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('dataConsent', 'accepted');
    setShowCookieBanner(false);
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <PlatformHeader
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {currentPage === 'home' && (
        <HomePage 
          onLegalClick={setActiveLegalDoc} 
          onRegisterClick={() => setShowRegistration(true)} 
        />
      )}
      
      {currentPage === 'opportunities' && (
        <Suspense fallback={null}>
          <OpportunitiesPage onLegalClick={setActiveLegalDoc} />
        </Suspense>
      )}

      {currentPage === 'articles' && (
        <Suspense fallback={null}>
          <ArticlesPage 
            onLegalClick={setActiveLegalDoc} 
            onRegisterClick={() => setShowRegistration(true)} 
          />
        </Suspense>
      )}

      {currentPage === 'admin' && (
        isAdmin || authUser
          ? <Suspense fallback={null}><AdminDashboard onLogout={handleLogout} /></Suspense>
          : <LoginWall onLoginClick={() => setShowLogin(true)} />
      )}

      {/* Login Modal */}
      {showLogin && (
        <Suspense fallback={null}>
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={(adminFlag, adminEmail) => {
              if (adminFlag) {
                setIsAdmin(true);
                if (adminEmail) {
                  setAuthUser({ email: adminEmail });
                }
                navigateTo('admin');
              } else {
                navigateTo('home');
              }
            }}
          />
        </Suspense>
      )}

      {/* Registration Modal */}
      {showRegistration && (
        <Suspense fallback={null}>
          <RegistrationModal
            onClose={() => setShowRegistration(false)}
            onSuccess={() => {
              alert('Successfully registered for HackLab! Your profile has been created.');
              setShowRegistration(false);
            }}
          />
        </Suspense>
      )}

      {/* Legal Modal */}
      {activeLegalDoc && (
        <div className="modal-backdrop" onClick={() => setActiveLegalDoc(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveLegalDoc(null)}>×</button>
            <h2>{LEGAL_CONTENT[activeLegalDoc].title}</h2>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: LEGAL_CONTENT[activeLegalDoc].html }} />
          </div>
        </div>
      )}

      {/* Cookie & Consent Modal - Full Screen Blocking */}
      {showCookieBanner && (
        <div className="cookie-modal-overlay">
          <div className="cookie-modal-content">
            {/* Accent top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--accent), #7c3aed)' }} />

            {/* Header */}
            <div className="cookie-modal-header">
              <div className="cookie-modal-icon">🔒</div>
              <div>
                <h2 className="cookie-modal-title">Privacy & Data Consent</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>Required before accessing HackLab Robotics</p>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              HackLab Robotics collects and processes personal data in accordance with the <strong style={{ color: 'var(--fg)' }}>General Data Protection Regulation (GDPR)</strong> and applicable Spanish data protection law. To continue, you must review and accept the following:
            </p>

            {/* Consent checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>

              {/* Checkbox 1 – Cookies */}
              <label className={`cookie-option ${consentCookies ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={consentCookies}
                  onChange={e => setConsentCookies(e.target.checked)}
                  className="cookie-option-checkbox"
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>🍪 Cookies & Analytics</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                    I accept the use of essential and analytical cookies necessary for the proper functioning of the website, user session management, and platform improvement. These cookies do not track you across third-party sites.
                  </div>
                </div>
              </label>

              {/* Checkbox 2 – Recruiting data */}
              <label className={`cookie-option ${consentData ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={consentData}
                  onChange={e => setConsentData(e.target.checked)}
                  className="cookie-option-checkbox"
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>🏢 Sharing with Recruiting Partners</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.5' }}>
                    I explicitly consent (pursuant to <strong style={{ color: 'var(--fg)' }}>Art. 6(1)(a) GDPR</strong>) to HackLab Robotics collecting, storing, and sharing my personal and professional data (including name, email, skills, and portfolio) with verified recruiting companies and challenge sponsors participating in HackLab events. I understand I may withdraw this consent at any time by contacting <strong style={{ color: 'var(--fg)' }}>contact@team-nexio.com</strong>.
                  </div>
                </div>
              </label>
            </div>

            {/* Legal note */}
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', lineHeight: '1.5', marginBottom: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              Data controller: <strong style={{ color: 'var(--fg)' }}>Asociación Estudiantil Junior Empresa NEXIO</strong>, NIF G75579508, Paseo Uribitarte 6, 48001 Bilbao. You have the right to access, rectify, delete, restrict, object, and port your data. Contact: contact@team-nexio.com.
            </p>

            {/* CTA */}
            <button
              onClick={handleCookieConsent}
              disabled={!consentCookies || !consentData}
              className="btn"
              style={{ width: '100%', justifyContent: 'center', opacity: (!consentCookies || !consentData) ? 0.4 : 1, cursor: (!consentCookies || !consentData) ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
            >
              Accept & Enter HackLab Robotics
            </button>
            {(!consentCookies || !consentData) && (
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>You must accept both consents to access the platform.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
