import { ArrowRight, Zap, Users, Trophy, FileText } from 'lucide-react';
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
];

export default function HomePage({ 
  onLegalClick, 
  onRegisterClick 
}: { 
  onLegalClick: (key: LegalKey) => void;
  onRegisterClick: () => void;
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

      {/* ─── EDITIONS WIDGET ─── */}
      <section className="editions-section">
        <h2>EDITIONS</h2>

        {/* Edition #1 */}
        <div className="edition-widget">
          <div className="brutal-stats-grid">
            {/* Main Info */}
            <div className="brutal-stat-cell brutal-col-span-2">
              <span className="brutal-mono-tag">EDITION #1 • JUNE 2026</span>
              <h3 className="brutal-stat-title">Berlin Robotics × Agentic AI Hackathon</h3>
              <p className="brutal-stat-desc">
                A weekend of innovation where 100+ top robotics engineers, software devs, and designers converged in Berlin to build the future of physical autonomous systems.
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
              <div className="brutal-stat-val">120+</div>
              <div className="brutal-stat-label">Participants</div>
            </div>
            <div className="brutal-stat-cell">
              <Zap size={24} className="brutal-icon" />
              <div className="brutal-stat-val">24</div>
              <div className="brutal-stat-label">Projects Built</div>
            </div>
            <div className="brutal-stat-cell">
              <Trophy size={24} className="brutal-icon" />
              <div className="brutal-stat-val">€5K+</div>
              <div className="brutal-stat-label">In Prizes</div>
            </div>

            {/* Sponsors */}
            <div className="brutal-stat-cell" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: 'none' }}>
              <h4 className="brutal-mono-title">CHALLENGES BY</h4>
              <ul className="brutal-sponsor-list" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '3rem' }}>
                <li>n8n</li>
                <li>Hugging Face</li>
                <li>Normacore</li>
                <li>ITQ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Edition #2 */}
        <div className="edition-widget edition-upcoming" style={{ marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
          {/* Upcoming glow badge */}
          <div className="edition-upcoming-badge">COMING SOON</div>
          <div className="brutal-stats-grid">
            {/* Main Info */}
            <div className="brutal-stat-cell brutal-col-span-2">
              <span className="brutal-mono-tag" style={{ color: 'var(--accent)' }}>EDITION #2 • NOVEMBER 2026</span>
              <h3 className="brutal-stat-title">Berlin Robotics × Agentic AI Hackathon II</h3>
              <p className="brutal-stat-desc">
                The second edition returns to Berlin with bigger challenges, <strong>€10,000+ in total prizes</strong> (cash, robotics hardware, cloud credits & more), and an expanded hardware playground. Push the limits of autonomous systems and agentic AI — applications open now.
              </p>
            </div>

            {/* Stats / Targets */}
            <div className="brutal-stat-cell">
              <FileText size={24} className="brutal-icon" />
              <div className="brutal-stat-val">1 000+</div>
              <div className="brutal-stat-label">Expected Applications</div>
            </div>
            <div className="brutal-stat-cell">
              <Users size={24} className="brutal-icon" />
              <div className="brutal-stat-val">200+</div>
              <div className="brutal-stat-label">Participants</div>
            </div>
            <div className="brutal-stat-cell">
              <Zap size={24} className="brutal-icon" />
              <div className="brutal-stat-val">30+</div>
              <div className="brutal-stat-label">Projects</div>
            </div>
            <div className="brutal-stat-cell">
              <Trophy size={24} className="brutal-icon" />
              <div className="brutal-stat-val">€10K+</div>
              <div className="brutal-stat-label">Cash, Hardware & Credits</div>
            </div>

            {/* CTA */}
            <div className="brutal-stat-cell" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', borderBottom: 'none' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                Secure your spot before applications close. Limited seats available.
              </p>
              <button className="brutal-primary-btn" onClick={onRegisterClick} id="signup-edition2">
                SIGN UP NOW <ArrowRight size={18} />
              </button>
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
