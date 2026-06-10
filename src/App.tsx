import React, { useState, useEffect } from 'react';
import { Rocket, ArrowRight, Calendar, Zap, Target, Bot, Code2, Users, Linkedin, Clock, Trophy } from 'lucide-react';

const PARTNER_LOGOS = [
  { file: 'Logo ITQ con eslogan.png', needsBg: false },
  { file: 'apify.svg', needsBg: false },
  { file: 'cic.png', needsBg: false },
  { file: 'huggingface.webp', needsBg: false },
  { file: 'lovable.png', needsBg: false },
  { file: 'migrapreneur-community-logo-black.svg', needsBg: true },
  { file: 'mybotshop.png', needsBg: false },
  { file: 'n8nlogo.png', needsBg: false },
  { file: 'normacore.png', needsBg: false },
  { file: 'spiced.png', needsBg: false },
];


const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    html: `
      <h4>Identification of the data controller:</h4>
      <p>Asociación Estudiantil Junior Empresa NEXIO (hereinafter “NEXIO”) with NIF ID G75579508 and domicile in Paseo Uribitarte 6, 48001 Bilbao (Bizkaia). Contact: contact@team-nexio.com</p>

      <h4>Who is responsible for the processing of your data?</h4>
      <p>This privacy policy applies to all personal data that the data subject provides to NEXIO, as well as to any natural person interested in the activities and services that NEXIO offers through its web pages and through any other means of communication. The purpose of NEXIO’s Privacy Policy is to give transparency to information on how we process your personal data in compliance with the current data protection regulations.</p>

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

const App: React.FC = () => {
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalKey | null>(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleCookieConsent = (accept: boolean) => {
    localStorage.setItem('cookieConsent', accept ? 'accepted' : 'declined');
    setShowCookieBanner(false);
  };

  return (
    <div className="landing">
      {/* Header */}
      <header>
        <div className="container nav-inner">
          <a href="/" className="logo-brand hacklab-logo-link">
            <img src="/logos/hacklab.png" alt="HackLab" className="hacklab-logo-img" />
          </a>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#about" className="mono" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: '0.7rem' }}>ABOUT</a>
            <a href="#schedule" className="mono" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: '0.7rem' }}>SCHEDULE</a>
            <a href="https://luma.com/1857f2wa?tk=hUbfYk" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
              REGISTER
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero container animate-up">
        <span className="card-tag mono">Berlin | 20 &amp; 21 June 2026</span>
        <h1 style={{ marginTop: '2rem' }}>FOR THOSE WHO <br /> <span>BUILD</span> THE FUTURE WITHOUT CODE.</h1>
        <p>
          Join us for the first edition of the Berlin Robotics × Agentic AI Hackathon, a weekend of innovation, collaboration, and building the future of robotics. Whether you're a robotics engineer, software dev, designer, or entrepreneur, this is your playground.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <a href="https://luma.com/1857f2wa?tk=hUbfYk" target="_blank" rel="noopener noreferrer" className="btn" style={{ textDecoration: 'none' }}>
            REGISTER ON LUMA <ArrowRight size={18} style={{ marginLeft: '10px' }} />
          </a>
        </div>
      </section>

      {/* ─── EVENT DATE BANNER ─── */}
      <section className="date-banner">
        <div className="container">
          <div className="date-banner-inner">
            <div className="date-banner-item">
              <Calendar size={22} />
              <div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>WHEN</div>
                <div className="date-banner-value">20 &amp; 21 JUNE 2026</div>
              </div>
            </div>
            <div className="date-banner-divider" />
            <div className="date-banner-item">
              <Zap size={22} />
              <div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>FORMAT</div>
                <div className="date-banner-value">48 HOUR HACKATHON</div>
              </div>
            </div>
            <div className="date-banner-divider" />
            <div className="date-banner-item">
              <Bot size={22} />
              <div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>THEME</div>
                <div className="date-banner-value">ROBOTICS × AI</div>
              </div>
            </div>
            <div className="date-banner-divider" />
            <div className="date-banner-item">
              <Users size={22} />
              <div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>LOCATION</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Lohm%C3%BChlenstra%C3%9Fe+65%2C+12435+Berlin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="date-banner-value"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  LOHMÜHLENSTR. 65, 12435 BERLIN
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section - About */}
      <section id="about" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid">
            <div className="card full">
              <div className="console-brand">SYS // AIB | RB</div>
              <div className="console-screen">
                <span className="card-tag mono">02 / THE MISSION</span>
                <h2>BRIDGE THE GAP BETWEEN<br />AI BRAINS AND ROBOTIC BODIES.</h2>
                <p style={{ marginTop: '1.5rem', maxWidth: '720px', fontSize: '1.1rem' }}>
                  Our goal is to merge Robotics with Agentic AI to engineer functional, real-world solutions that generate a meaningful and tangible impact on society. Connect with Europe's most ambitious builders and turn your wildest ideas into functional prototypes.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="console-brand">SYS // AIB | RB</div>
              <div className="console-screen">
                <Bot size={32} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
                <h3>AGENTIC AI + ROBOTICS</h3>
                <p style={{ marginTop: '1rem' }}>
                  Decide whether to work on no-code solutions or physical robotic integrations. Work hands-on with cutting-edge hardware, the sky is the limit.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="console-brand">SYS // AIB | RB</div>
              <div className="console-screen">
                <Code2 size={32} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
                <h3>NO CODE POWER</h3>
                <p style={{ marginTop: '1rem' }}>
                  You don't need to touch a compiler. Use the best no-code and AI tools to build automation pipelines that talk to real robots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OBJECTIVES ─── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <span className="card-tag mono">03 / OBJECTIVES</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem', marginBottom: '3rem' }}>WHAT WE ARE BUILDING TOGETHER.</h2>
          <div className="info-cards">
            <div className="info-card objective-card">
              <div className="console-brand">SYS // AIB | RB</div>
              <div className="console-screen">
                <Users size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>GATHER TALENT</h3>
                <p style={{ fontSize: '0.95rem' }}>
                  We bring experts together to solve real world problems. The perfect place to launch new ideas and find the best talent in AI and Robotics.
                </p>
              </div>
            </div>
            <div className="info-card objective-card">
              <div className="console-brand">SYS // AIB | RB</div>
              <div className="console-screen">
                <Rocket size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>LAUNCHING STARTUPS</h3>
                <p style={{ fontSize: '0.95rem' }}>
                  Be the launchpad for people to build the pathway to a successful robotics startup in Berlin's innovation ecosystem.
                </p>
              </div>
            </div>
            <div className="info-card objective-card">
              <div className="console-brand">SYS // AIB | RB</div>
              <div className="console-screen">
                <Target size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>VISIBILITY</h3>
                <p style={{ fontSize: '0.95rem' }}>
                  Connect your products and services directly with a community of AI and Robotics specialists at the forefront of the Berlin innovation scene.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCHEDULE ─── */}
      <section id="schedule" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <span className="card-tag mono">04 / SCHEDULE</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem', marginBottom: '3rem' }}>TWO DAYS. ONE MISSION.</h2>
          <div className="schedule-grid">
            {/* Day 1 */}
            <div className="schedule-day">
              <div className="schedule-day-header">
                <Calendar size={20} style={{ color: 'var(--accent)' }} />
                <div className="schedule-day-title">SATURDAY, JUNE 20TH</div>
              </div>
              <div className="schedule-items">
                <div className="schedule-item">
                  <span className="schedule-time mono">10:00</span>
                  <span className="schedule-event">Doors Open &amp; Networking</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time mono">10:30</span>
                  <span className="schedule-event">Opening Ceremony &amp; Matchmaking</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time mono">12:30</span>
                  <span className="schedule-event">Lunch &amp; Networking</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time mono">18:30</span>
                  <span className="schedule-event">Dinner &amp; Late-night Hacking</span>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="schedule-day">
              <div className="schedule-day-header">
                <Trophy size={20} style={{ color: 'var(--accent)' }} />
                <div className="schedule-day-title">SUNDAY, JUNE 21ST</div>
              </div>
              <div className="schedule-items">
                <div className="schedule-item">
                  <span className="schedule-time mono">12:30</span>
                  <span className="schedule-event">Lunch</span>
                </div>
                <div className="schedule-item schedule-item-highlight">
                  <span className="schedule-time mono">15:00</span>
                  <span className="schedule-event">Project Submission Deadline 🏁</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time mono">16:00</span>
                  <span className="schedule-event">Announcement of Finalists</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-time mono">16:15</span>
                  <span className="schedule-event">Finalist Pitches</span>
                </div>
                <div className="schedule-item schedule-item-highlight">
                  <span className="schedule-time mono">17:30</span>
                  <span className="schedule-event">Award Ceremony &amp; Closing Drinks 🏆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY PARTICIPATE ─── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <span className="card-tag mono">05 / WHY PARTICIPATE</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem', marginBottom: '3rem' }}>WHAT YOU GAIN.</h2>
          <div className="info-cards">
            <div className="info-card objective-card">
              <Zap size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>HANDS-ON INNOVATION</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Work directly with no code tools and real robotics hardware. Build prototypes that actually move and think.
              </p>
            </div>

            <div className="info-card objective-card">
              <Clock size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>HIGH-LEVEL NETWORKING</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Connect with top-tier investors, potential co-founders, and Europe's most ambitious builders.
              </p>
            </div>
            <div className="info-card objective-card">
              <Trophy size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>SHOWCASE YOUR TALENT</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Present your project to a jury of tech pioneers and gain visibility in Berlin's innovation scene.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS MARQUEE ─── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '6rem 0' }}>
        <div className="container" style={{ marginBottom: '4rem' }}>
          <span className="card-tag mono">06 / PARTNERS</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem' }}>SUPPORTED BY INNOVATION LEADERS</h2>
        </div>

        <div className="partners-marquee-container">
          <div className="partners-marquee-content">
            {PARTNER_LOGOS.map(({ file, needsBg }, idx) => (
              <div key={`logo-1-${idx}`} className="partner-logo-item">
                <img src={`/logos/${file}`} alt={`Partner ${idx}`} className={needsBg ? 'logo-needs-bg' : ''} />
              </div>
            ))}
            {/* Duplicate for infinite scroll effect */}
            {PARTNER_LOGOS.map(({ file, needsBg }, idx) => (
              <div key={`logo-2-${idx}`} className="partner-logo-item">
                <img src={`/logos/${file}`} alt={`Partner ${idx}`} className={needsBg ? 'logo-needs-bg' : ''} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JUDGES ─── */}
      <section className="info-section">
        <div className="container">
          <span className="card-tag mono">07 / JUDGES</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem' }}>MEET THE PANEL</h2>
          <div className="info-cards">
            {[1, 2, 3].map((i) => (
              <div key={i} className="info-card info-card-soon">
                <div className="soon-avatar" />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                  PANEL MEMBER 0{i}
                </div>
                <span className="soon-badge">COMING SOON</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VENUE ─── */}
      <section className="info-section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <span className="card-tag mono">08 / VENUE</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem', display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap' }}>
            WHERE IT HAPPENS
            <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              CIC INNOVATION CAMPUS
            </span>
          </h2>
          <div className="info-cards" style={{ marginTop: '3rem' }}>
            <div className="info-card venue-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="venue-images">
                <div className="venue-img-container">
                  <img src="/assets/CIC_CAMPUS_PIC_1.webp" alt="CIC Campus Berlin 1" />
                </div>
                <div className="venue-img-container">
                  <img src="/assets/CIC_CAMPUS_PIC_2.webp" alt="CIC Campus Berlin 2" />
                </div>
              </div>
              <div className="venue-location-name">CIC CAMPUS BERLIN</div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lohm%C3%BChlenstra%C3%9Fe+65%2C+12435+Berlin"
                target="_blank"
                rel="noopener noreferrer"
                className="venue-address"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                Lohmühlenstraße 65, 12435 Berlin
              </a>
              <p style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '0.9rem', maxWidth: '600px' }}>
                Join us at the CIC Campus in Berlin, a hub for innovation and entrepreneurship. We've secured this world-class space to provide the perfect environment for building the future of robotics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="info-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="contact-banner">
            <h2>Contact</h2>
          </div>
          <p style={{ color: 'var(--muted)', marginTop: '2rem', marginBottom: '4rem', fontSize: '1rem' }}>
            If you want to collaborate, contact us.
          </p>

          <div className="organizers-grid">
            <div className="organizer-card">
              <div className="organizer-avatar avatar-pedro"></div>
              <a href="mailto:pedro@team-nexio.com" className="organizer-link">
                pedro@team-nexio.com
              </a>
              <div className="organizer-social">
                <Linkedin size={20} className="organizer-icon" />
                <a href="https://www.linkedin.com/in/pedrosanmi/" target="_blank" rel="noreferrer">Pedro San Miguel</a>
              </div>
            </div>

            <div className="organizer-card">
              <div className="organizer-avatar avatar-benat"></div>
              <a href="mailto:benat@team-nexio.com" className="organizer-link">
                benat@team-nexio.com
              </a>
              <div className="organizer-social">
                <Linkedin size={20} className="organizer-icon" />
                <a href="https://www.linkedin.com/in/be%C3%B1at-zuazubizkar-aizpurua-013532335/" target="_blank" rel="noreferrer">Beñat Zuazubizcar</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container nav-inner">
          <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
            © 2026 ROBOTICS × AI HACKATHON. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button onClick={() => setActiveLegalDoc('legal')} className="legal-link">Legal Notice</button>
            <button onClick={() => setActiveLegalDoc('privacy')} className="legal-link">Privacy Policy</button>
            <button onClick={() => setActiveLegalDoc('cookies')} className="legal-link">Cookies Policy</button>
          </div>
        </div>
      </footer>

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

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="cookie-banner-wrapper">
          <div className="cookie-banner-content">
            <div className="cookie-banner-info">
              <h3>Cookies Consent</h3>
              <p>We use cookies to improve your experience. You must accept our cookies policy to navigate the website.</p>
            </div>
            <div className="cookie-banner-btns">
              <button onClick={() => handleCookieConsent(true)} className="btn btn-sm">Accept All</button>
              <button onClick={() => handleCookieConsent(false)} className="btn btn-secondary btn-sm" style={{ marginLeft: '1rem' }}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
