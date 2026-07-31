import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import HomePage from './pages/HomePage';
import { supabase } from './supabaseClient';

// Lazy-load heavy pages that are not needed on first paint
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const RegistrationModal = lazy(() => import('./components/RegistrationModal'));


type Page = 'home' | 'opportunities' | 'admin';

interface AuthUser { email: string; }

const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    html: `
      <h4>Identification of the data controller:</h4>
      <p>Asociación Estudiantil Junior Empresa NEXIO (hereinafter "NEXIO") with NIF ID G75579508 and domicile in Paseo Uribitarte 6, 48001 Bilbao (Bizkaia). Contact: contact@team-nexio.com</p>

      <h4>Who is responsible for the processing of your data?</h4>
      <p>This privacy policy applies to all personal data that the data subject provides to NEXIO, as well as to any natural person interested in the activities and services that NEXIO offers through its web pages and through any other means of communication. The purpose of NEXIO's Privacy Policy is to give transparency to information on how we process your personal data in compliance with the current data protection regulations.</p>

      <h4>For what purpose do we process your personal data and with what legitimacy?</h4>
      <p>NEXIO has a Record of Processing Activities where each of the following processing carried out as the data controller are detailed:</p>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse: collapse; margin-top: 1rem; color: var(--muted); font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border);">
              <th style="padding: 0.5rem; text-align: left;">PROCESSING</th>
              <th style="padding: 0.5rem; text-align: left;">PURPOSE</th>
              <th style="padding: 0.5rem; text-align: left;">LEGITIMATE BASIS</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">MEMBERS</td>
              <td style="padding: 0.5rem;">Management of personal data of members</td>
              <td style="padding: 0.5rem;">Art. 6.1 b) Contract performance</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">CONTACT PEOPLE</td>
              <td style="padding: 0.5rem;">Contacts database management</td>
              <td style="padding: 0.5rem;">Art. 6.1 f) Legitimate interest</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">EVENTS</td>
              <td style="padding: 0.5rem;">Management of participants</td>
              <td style="padding: 0.5rem;">Art. 6.1 a) Consent / Art. 6.1 f) Legitimate interest</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 0.5rem;">ACCOUNTABILITY</td>
              <td style="padding: 0.5rem;">Administrative management</td>
              <td style="padding: 0.5rem;">Art. 6.1 b) Contract performance</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>How long do we store your personal data?</h4>
      <p>NEXIO will store the data of the data subjects during their relationship with the organization and thereafter, according to the provisions of the archive and documentation regulations.</p>

      <h4>Who has access to your personal data?</h4>
      <p>NEXIO may make transfers or communications of personal data in order to meet its obligations with the Public Administrations.</p>

      <h4>What are the rights of those affected?</h4>
      <p>Right of access, rectification, deletion, limitation, objection, and portability. Such rights may be exercised free of charge by written request addressed to nexiocoop@gmail.com.</p>

      <h4>Unsubscribe from commercial communications</h4>
      <p>The interested party has the right to revoke consent at any time through the link in each communication or by statement to contact@team-nexio.com.</p>

      <h4>What security measures do we have implemented?</h4>
      <p>NEXIO adopts necessary measures to avoid alteration, loss, treatment or unauthorized access, in accordance with applicable regulations.</p>

      <h4>Modification of the Privacy Policy</h4>
      <p>NEXIO may modify its Privacy Policy in accordance with the applicable law at any time.</p>
      
      <p><em>Latest update: 27, March of 2025.</em></p>
    `
  },
  cookies: {
    title: "Cookies Policy",
    html: `
      <p>The JUNIOR ENTERPRISE STUDENT ASSOCIATION Nexio (hereinafter, Nexio) would like to inform you about the use of cookies on its websites.</p>
      
      <h4>Cookies Exempt from Consent</h4>
      <p>Certain technical cookies serving communication or specific requested services are exempt from explicit consent requirements under Art. 22.2 of Law 34/2002.</p>

      <h4>How to Modify Settings</h4>
      <p>You can restrict, block, or delete cookies through your browser settings (Chrome, Firefox, Safari, Edge).</p>
    `
  },
  legal: {
    title: "Legal Notice",
    html: `
      <p>Welcome to the website of ASOCIACION ESTUDIANTIL JUNIOR NEXIO (hereinafter NEXIO) with Tax Identification Number G75579508 and address at PS/ URIBITARTE, 6 48001 BILBAO (BIZKAIA). Contact by mail at contact@team-nexio.com and registered in the Registry of Associations of Bizkaia with the number AS/B/26060/2025.</p>
      
      <h4>Intellectual Property</h4>
      <p>The contents of this website, texts, images, sounds, animations, etc. as well as its graphic design and its source code are protected by Spanish legislation on intellectual and industrial property rights in favor of the companies that make up NEXIO. It is therefore prohibited its reproduction, distribution or public communication, totally or partially, without the express authorization of NEXIO.</p>

      <h4>Web content and links</h4>
      <p>At NEXIO we are not responsible for the misuse made of the contents of our website, being exclusive responsibility of the person who accesses them or uses them. We neither assume responsibility for the information contained on the third party´s web pages that can be accessed by links or search engines from this Web site.</p>

      <h4>Update and modification of the website</h4>
      <p>NEXIO, reserves the right to modify or remove, without prior notice, both the information contained on your website and its configuration and presentation, without assuming any responsibility for it.</p>

      <h4>Indications on technical aspects</h4>
      <p>NEXIO assumes no responsibility that can be derived from technical problems or failures in computer equipment that occur during connection to the Internet network, as well as damages that could be caused by third parties through illegitimate intrusions outside the control of NEXIO. We are also exempt from any responsibility for possible damages that the user may suffer as a result of errors, defects or omissions in the information we provide when coming from sources outside us.</p>
    `
  }
};

type LegalKey = keyof typeof LEGAL_CONTENT;

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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalKey | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) setShowCookieBanner(true);

    // Get initial session — no localStorage admin bypass
    supabase.auth.getSession().then(async ({ data: { session } }) => {
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

    // Listen for auth changes
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
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
