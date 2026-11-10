import { ArrowRight, Zap, Users, Trophy, FileText, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

type LegalKey = 'privacy' | 'cookies' | 'legal';

const HACKATHON_PHOTOS = [
  { src: '/hackathon1.webp', caption: 'Participants listening to keynote presentations' },
  { src: '/hackathon2.webp', caption: 'Teams working on robotics hardware' },
  { src: '/hackathon3.webp', caption: 'Late-night hacking sessions in full swing' },
];

const PARTNER_LOGOS = [
  { file: 'Logo ITQ con eslogan.webp', name: 'ITQ', width: 120, height: 16, needsBg: false },
  { file: 'apify.svg', name: 'Apify', width: 120, height: 32, needsBg: false },
  { file: 'cic.webp', name: 'CIC', width: 78, height: 40, needsBg: false },
  { file: 'huggingface.webp', name: 'Hugging Face', width: 120, height: 32, needsBg: false },
  { file: 'lovable.webp', name: 'Lovable', width: 120, height: 20, needsBg: false },
  { file: 'migrapreneur-community-logo-black.svg', name: 'Migrapreneur', width: 120, height: 40, needsBg: true },
  { file: 'mybotshop.webp', name: 'MyBotShop', width: 103, height: 40, needsBg: false },
  { file: 'n8nlogo.webp', name: 'n8n', width: 108, height: 40, needsBg: false },
  { file: 'normacore.webp', name: 'Normacore', width: 40, height: 40, needsBg: false, style: { transform: 'scale(1.5)' } },
  { file: 'spiced.webp', name: 'Spiced Academy', width: 40, height: 40, needsBg: false, style: { transform: 'scale(1.5)' } },
  { file: 'redbull.webp', name: 'Red Bull', width: 120, height: 19, needsBg: false },
  { file: 'konvo.webp', name: 'Konvo', width: 120, height: 29, needsBg: false },
  { file: 'basquetrade.webp', name: 'Basquetrade', width: 120, height: 20, needsBg: false, style: { transform: 'scale(1.5)' } },
  { file: 'pdm_gelbe_seiten.webp', name: 'Gelbe Seiten', width: 120, height: 30, needsBg: false },
  { file: 'marso.webp', name: 'Marso', width: 93, height: 40, needsBg: false },
  { file: 'mistral.webp', name: 'Mistral AI', width: 120, height: 27, needsBg: false },
  { file: 'aws_builder_center.webp', name: 'AWS Builder Center', width: 120, height: 19, needsBg: false },
  { file: 'ibc.webp', name: 'IBC', width: 40, height: 40, needsBg: false, style: { transform: 'scale(1.4)' } },
  { file: 'anthropic.svg', name: 'Anthropic', width: 120, height: 13, needsBg: false },
  { file: 'nebius.svg', name: 'Nebius', width: 120, height: 33, needsBg: false },
  { file: 'cognition.svg', name: 'Cognition', width: 120, height: 26, needsBg: false },
  { file: 'xsquare.svg', name: 'X Square Robot', width: 120, height: 23, needsBg: false },
  { file: 'durance.svg', name: 'Durance AI', width: 120, height: 20, needsBg: false },
  { file: 'priorlabs.svg', name: 'Prior Labs', width: 120, height: 22, needsBg: false },
  { file: 'almedia.svg', name: 'Almedia', width: 120, height: 32, needsBg: false },
  { file: 'seeedstudio.png', name: 'Seeed Studio', width: 120, height: 16, needsBg: false },
  { file: 'openelab.png', name: 'OpenELab', width: 120, height: 35, needsBg: false },
  { file: 'linkup.svg', name: 'Linkup', width: 120, height: 30, needsBg: false },
];

// Edition #2 partners, in the order of the official event poster (luma.com/h0mcaqio).
// mono: render as white on the dark card; false keeps the brand colours.
// h: max logo height in px for marks with lots of padding (default 28).
const EDITION2_PARTNERS = [
  { file: 'xsquare.svg', name: 'X Square Robot', mono: false },
  { file: 'durance.svg', name: 'Durance AI', mono: false },
  { file: 'priorlabs.svg', name: 'Prior Labs', mono: false },
  { file: 'normacore.webp', name: 'NormaCore', mono: true, h: 52 },
  { file: 'huggingface.webp', name: 'Hugging Face', mono: false },
  { file: 'cognition.svg', name: 'Cognition', mono: false },
  { file: 'anthropic.svg', name: 'Anthropic', mono: false },
  { file: 'nebius.svg', name: 'Nebius', mono: false },
  { file: 'almedia.svg', name: 'Almedia', mono: false },
  { file: 'seeedstudio.png', name: 'Seeed Studio', mono: true },
  { file: 'openelab.png', name: 'OpenELab', mono: true, h: 40 },
  { file: 'mybotshop.webp', name: 'MyBotShop', mono: false, h: 34 },
  { file: 'linkup.svg', name: 'Linkup', mono: false },
  { file: 'redbull.webp', name: 'Red Bull', mono: false },
];

// Edition #1 sponsors, as listed in the Edition #1 impact report (8 of the 14 sponsors).
const EDITION1_PARTNERS = [
  { file: 'normacore.webp', name: 'Norma Core', mono: true, h: 52 },
  { file: 'huggingface.webp', name: 'Hugging Face', mono: false },
  { file: 'n8nlogo.webp', name: 'n8n', mono: true, h: 56 },
  { file: 'lovable.webp', name: 'Lovable', mono: false },
  { file: 'marso.webp', name: 'Marso Robotics', mono: false, h: 40 },
  { file: 'mistral.webp', name: 'Mistral AI', mono: false },
  { file: 'Logo ITQ con eslogan.webp', name: 'ITQ', mono: true, h: 26 },
  { file: 'redbull.webp', name: 'Red Bull', mono: false },
];

const EDITION2_TRACKS = [
  { name: 'AI Infrastructure', desc: 'Agents, pipelines and the infrastructure that connects models to machines.' },
  { name: 'Industrial Robotics Simulation', desc: 'Train and test in simulation, then bring it to real hardware.' },
  { name: 'Autonomous Navigation', desc: 'Perception, mapping and planning with real robots, including a Unitree Go2 EDU.' },
  { name: 'Wildcard / Open Source', desc: 'Your idea, your rules. Build anything at the edge of robotics and AI.' },
];

export default function HomePage({ 
  onLegalClick, 
  onRegisterClick,
  onArticlesClick
}: { 
  onLegalClick: (key: LegalKey) => void;
  onRegisterClick: () => void;
  onArticlesClick?: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HACKATHON_PHOTOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="brutal-wrapper">
      
      {/* ─── HERO & CAROUSEL (MIXED SPLIT) ─── */}
      <section className="brutal-hero-mixed">
        {/* Left: Text Content */}
        <div className="brutal-hero-content">
          <h1 className="brutal-huge-title">
            THE BEST<br />
            <span className="brutal-accent-text">ROBOTICS COMPETITIONS</span><br />
            FOR COMPANIES
          </h1>

          <div className="brutal-hero-bottom">
            <p className="brutal-lead-text">
              We organize high-impact robotics competitions where top engineers, designers, and innovators solve real-world challenges for leading tech companies. Join us to discover breakthrough solutions and elite talent.
            </p>
            <button className="brutal-primary-btn" onClick={onRegisterClick}>
              JOIN THE COMMUNITY <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right: Carousel */}
        <div className="brutal-hero-carousel">
          <div className="brutal-image-wrapper">
            <img
              src={HACKATHON_PHOTOS[activeSlide].src}
              alt={HACKATHON_PHOTOS[activeSlide].caption}
              className="brutal-hero-img"
              width={771}
              height={285}
              fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
              decoding="async"
            />
            <div className="brutal-image-caption">
              {HACKATHON_PHOTOS[activeSlide].caption}
            </div>
          </div>
          <div className="brutal-carousel-controls">
            {HACKATHON_PHOTOS.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`brutal-dot ${i === activeSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}: ${photo.caption}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / CLAIM WIDGET ─── */}
      <section className="about-section" style={{ padding: '4rem 2rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="brutal-mono-title" style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>ABOUT HACKLAB ROBOTICS</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--muted)', margin: 0 }}>
            <strong style={{ color: 'var(--fg)' }}>HackLab Robotics</strong> organizes the premier robotics competitions for companies. We connect elite hardware engineers, software developers, and product designers to solve complex, real-world physical AI challenges for industry leaders. If you are looking to discover breakthrough solutions, push the boundaries of embodied AI, or recruit top-tier talent in the robotics space, HackLab is the ultimate proving ground.
          </p>
        </div>
      </section>

      {/* ─── EDITIONS WIDGET ─── */}
      <section className="editions-section">
        <h2>EDITIONS</h2>

        {/* Edition #1 */}
        <div className="edition-widget">
          <div className="brutal-stats-grid">
            {/* Main Info */}
            <div className="brutal-stat-cell brutal-col-span-2">
              <span className="brutal-mono-tag">EDITION #1 • 20–21 JUNE 2026</span>
              <h3 className="brutal-stat-title">Berlin Robotics × Agentic AI Hackathon</h3>
              <p className="brutal-stat-desc">
                36 hours of non-stop building at CIC Berlin. Out of 600+ applicants we selected 130 builders: robotics students, ML engineers, robotics professionals and university researchers. Around 20 teams went from idea to a working demo in front of judges and sponsors, and <strong>5 participants were hired by sponsor companies</strong> after the event.
              </p>
            </div>

            {/* Stats */}
            <div className="brutal-stat-cell">
              <FileText size={24} className="brutal-icon" />
              <div className="brutal-stat-val">600+</div>
              <div className="brutal-stat-label">Applications</div>
            </div>
            <div className="brutal-stat-cell">
              <Users size={24} className="brutal-icon" />
              <div className="brutal-stat-val">130</div>
              <div className="brutal-stat-label">Builders Selected</div>
            </div>
            <div className="brutal-stat-cell">
              <Zap size={24} className="brutal-icon" />
              <div className="brutal-stat-val">~20</div>
              <div className="brutal-stat-label">Solutions Demoed</div>
            </div>
            <div className="brutal-stat-cell">
              <Trophy size={24} className="brutal-icon" />
              <div className="brutal-stat-val">5</div>
              <div className="brutal-stat-label">Hires After the Event</div>
            </div>

            {/* Sponsors */}
            <div className="brutal-stat-cell" style={{ gridColumn: '1 / -1', borderBottom: 'none' }}>
              <h4 className="brutal-mono-title">BACKED BY 14 SPONSORS, INCLUDING</h4>
              <ul className="edition-partner-grid">
                {EDITION1_PARTNERS.map(p => (
                  <li key={p.name} title={p.name}>
                    <img
                      src={`/logos/${p.file}`}
                      alt={p.name}
                      className={p.mono ? 'edition-logo-mono' : undefined}
                      style={'h' in p ? { maxHeight: `${p.h}px` } : undefined}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Edition #2 */}
        <div className="edition-widget edition-upcoming" style={{ marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
          {/* Upcoming glow badge */}
          <div className="edition-upcoming-badge">APPLICATIONS CLOSED</div>
          <div className="brutal-stats-grid">
            {/* Main Info */}
            <div className="brutal-stat-cell brutal-col-span-2">
              <span className="brutal-mono-tag" style={{ color: 'var(--accent)' }}>EDITION #2 • 21–22 NOVEMBER 2026</span>
              <h3 className="brutal-stat-title">AI × Robotics Hackathon II</h3>
              <p className="brutal-stat-desc">
                48 hours at CIC Berlin, co-organized with BRISA, the Berlin Robotics &amp; Intelligent Systems Association. Teams build on robot arms, robot sets and a Unitree Go2 EDU, with free credits from every technology partner and <strong>€10,000+ in prizes</strong> (cash, hardware &amp; more).
              </p>
            </div>
            <div className="brutal-stat-cell">
              <MapPin size={24} className="brutal-icon" />
              <div className="brutal-stat-val">CIC Berlin</div>
              <div className="brutal-stat-label">Lohmühlenstraße 65 · 48 hours</div>
            </div>

            {/* Stats */}
            <div className="brutal-stat-cell">
              <FileText size={24} className="brutal-icon" />
              <div className="brutal-stat-val">1,100+</div>
              <div className="brutal-stat-label">Registrations</div>
            </div>
            <div className="brutal-stat-cell">
              <Users size={24} className="brutal-icon" />
              <div className="brutal-stat-val">200</div>
              <div className="brutal-stat-label">Builders Selected</div>
            </div>
            <div className="brutal-stat-cell">
              <Trophy size={24} className="brutal-icon" />
              <div className="brutal-stat-val">€10K+</div>
              <div className="brutal-stat-label">Cash, Hardware & Credits</div>
            </div>

            {/* Tracks */}
            <div className="brutal-stat-cell" style={{ gridColumn: '1 / -1' }}>
              <h4 className="brutal-mono-title">TRACKS</h4>
              <ul className="edition-tracks">
                {EDITION2_TRACKS.map((track, i) => (
                  <li key={track.name}>
                    <span className="edition-track-num">0{i + 1}</span>
                    <strong>{track.name}</strong>
                    <span>{track.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Partners */}
            <div className="brutal-stat-cell" style={{ gridColumn: '1 / -1' }}>
              <div className="edition-cohost">
                <h4 className="brutal-mono-title" style={{ margin: 0 }}>CO-ORGANIZED WITH</h4>
                <img src="/logos/brisa.png" alt="BRISA – Berlin Robotics & Intelligent Systems Association" className="edition-logo-mono" width={128} height={32} loading="lazy" decoding="async" />
              </div>
              <h4 className="brutal-mono-title">PARTNERS &amp; TECHNOLOGY PROVIDERS</h4>
              <ul className="edition-partner-grid">
                {EDITION2_PARTNERS.map(p => (
                  <li key={p.name} title={p.name}>
                    <img
                      src={`/logos/${p.file}`}
                      alt={p.name}
                      className={p.mono ? 'edition-logo-mono' : undefined}
                      style={'h' in p ? { maxHeight: `${p.h}px` } : undefined}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="brutal-stat-cell" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', borderBottom: 'none' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                Applications are closed and selected builders have been notified. Not selected? Spots always open up on the day: come to the venue early on Saturday.
              </p>
              <a
                href="https://luma.com/h0mcaqio"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-primary-btn"
                id="signup-edition2"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                VIEW EVENT ON LUMA <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS MARQUEE ─── */}
      <section className="brutal-marquee-section">
        <h2 className="brutal-marquee-header">TRUSTED BY INNOVATIVE COMPANIES</h2>
        <div className="brutal-marquee-container">
          <div className="brutal-marquee-content">
            {PARTNER_LOGOS.map((logo, i) => (
              <div key={i} className="brutal-partner-item">
                <img 
                  src={`/logos/${logo.file}`} 
                  alt={logo.name} 
                  className={logo.needsBg ? 'logo-needs-bg' : ''}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  style={logo.style} 
                />
              </div>
            ))}
            {/* Duplicate for infinite scroll */}
            {PARTNER_LOGOS.map((logo, i) => (
              <div key={`dup-${i}`} className="brutal-partner-item">
                <img 
                  src={`/logos/${logo.file}`} 
                  alt={logo.name} 
                  className={logo.needsBg ? 'logo-needs-bg' : ''}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  style={logo.style} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="brutal-footer">
        <div className="brutal-footer-inner">
          <div className="brutal-footer-links">
            <a 
              href="#articles" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (onArticlesClick) onArticlesClick(); 
              }}
              style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'underline', marginRight: '1rem' }}
            >
              📚 Articles & Insights
            </a>
            <button onClick={() => onLegalClick('privacy')}>Privacy Policy</button>
            <button onClick={() => onLegalClick('cookies')}>Cookies Policy</button>
            <button onClick={() => onLegalClick('legal')}>Legal Notice</button>
          </div>
          <div className="brutal-footer-copy">
            © 2026 HackLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
