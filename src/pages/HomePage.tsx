import { ArrowRight, Zap, Users, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';

type LegalKey = 'privacy' | 'cookies' | 'legal';

const HACKATHON_PHOTOS = [
  { src: '/hackathon1.png', caption: 'Participants listening to keynote presentations' },
  { src: '/hackathon2.png', caption: 'Teams working on robotics hardware' },
  { src: '/hackathon3.png', caption: 'Late-night hacking sessions in full swing' },
];

const PARTNER_LOGOS = [
  { file: 'Logo ITQ con eslogan.png', needsBg: false },
  { file: 'apify.svg', needsBg: false },
  { file: 'cic.png', needsBg: false },
  { file: 'huggingface.webp', needsBg: false },
  { file: 'lovable.png', needsBg: false },
  { file: 'migrapreneur-community-logo-black.svg', needsBg: true },
  { file: 'mybotshop.png', needsBg: false },
  { file: 'n8nlogo.png', needsBg: false },
  { file: 'normacore.png', needsBg: false, style: { transform: 'scale(1.5)' } },
  { file: 'spiced.png', needsBg: false, style: { transform: 'scale(1.5)' } },
  { file: 'redbull.png', needsBg: false },
  { file: 'konvo.png', needsBg: false },
  { file: 'basquetrade.png', needsBg: false, style: { transform: 'scale(1.5)' } },
  { file: 'pdm_gelbe_seiten.png', needsBg: false },
  { file: 'marso.png', needsBg: false },
  { file: 'mistral.png', needsBg: false },
  { file: 'aws_builder_center.png', needsBg: false },
  { file: 'ibc.png', needsBg: false, style: { transform: 'scale(1.4)' } },
];

export default function HomePage({ 
  onLegalClick, 
  onRegisterClick 
}: { 
  onLegalClick: (key: LegalKey) => void;
  onRegisterClick: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveSlide(prev => (prev + 1) % HACKATHON_PHOTOS.length);
        setFading(false);
      }, 400);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero container animate-up" style={{ textAlign: 'left' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left: text */}
          <div>
            <span className="card-tag mono">HackLab Community</span>
            <h1 style={{ marginTop: '2rem', textAlign: 'left' }}>THE BEST <br /> <span>ROBOTICS COMPETITIONS</span> FOR COMPANIES.</h1>
            <p style={{ textAlign: 'left' }}>
              We organize high-impact robotics competitions where top engineers, designers, and innovators solve real-world challenges for leading tech companies. Join us to discover breakthrough solutions and elite talent.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-start' }}>
              <button className="btn" onClick={onRegisterClick}>
                REGISTER TO JOIN THE COMMUNITY <ArrowRight size={18} style={{ marginLeft: '10px' }} />
              </button>
            </div>
          </div>

          {/* Right: auto carousel */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              aspectRatio: '16/9',
              position: 'relative',
              background: '#000',
            }}>
              <img
                src={HACKATHON_PHOTOS[activeSlide].src}
                alt={HACKATHON_PHOTOS[activeSlide].caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: fading ? 0 : 1,
                  transition: 'opacity 0.4s ease',
                  display: 'block',
                }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '1.5rem 1rem 1rem',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', margin: 0, fontFamily: 'var(--font-mono)' }}>
                  {HACKATHON_PHOTOS[activeSlide].caption}
                </p>
              </div>
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              {HACKATHON_PHOTOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setFading(true); setTimeout(() => { setActiveSlide(i); setFading(false); }, 400); }}
                  style={{
                    width: i === activeSlide ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: i === activeSlide ? 'var(--accent)' : 'var(--border)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREVIOUS HACKATHONS ─── */}
      <section className="previous-hackathons">
        <div className="container" style={{ padding: '4rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Previous Editions</h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>See the impact of our past hackathons.</p>
          </div>

          <div style={{ 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '2.5rem',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' 
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <span className="card-tag mono" style={{ marginBottom: '1rem', display: 'inline-block' }}>EDITION #1 • JUNE 2026</span>
                <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--fg)', marginBottom: '1rem' }}>
                  Berlin Robotics × Agentic AI Hackathon
                </h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.6', maxWidth: '500px', marginBottom: '1.5rem' }}>
                  A weekend of innovation where 100+ top robotics engineers, software devs, and designers converged in Berlin to build the future of physical autonomous systems.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg)', fontSize: '0.85rem' }}>
                    <Users size={16} color="var(--accent)" /> 120+ Participants
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg)', fontSize: '0.85rem' }}>
                    <Zap size={16} color="var(--accent)" /> 24 Projects Built
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--fg)', fontSize: '0.85rem' }}>
                    <Trophy size={16} color="var(--accent)" /> €5,000+ Prizes
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(0,102,255,0.05)', 
                border: '1px solid rgba(0,102,255,0.2)', 
                borderRadius: '8px', 
                padding: '1.5rem',
                minWidth: '250px'
              }}>
                <h4 style={{ color: 'var(--fg)', fontSize: '0.9rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>CHALLENGES BY:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>• n8n</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>• Hugging Face</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>• Normacore</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>• ITQ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section className="partners">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '2rem' }}>TRUSTED BY INNOVATIVE COMPANIES</h2>
          <div className="partners-marquee-container">
            <div className="partners-marquee-content">
              {PARTNER_LOGOS.map((logo, i) => (
                <div key={i} className="partner-logo-item">
                  <img 
                    src={`/logos/${logo.file}`} 
                    alt={`Partner ${i + 1}`} 
                    className={logo.needsBg ? 'logo-needs-bg' : ''}
                    style={logo.style} 
                  />
                </div>
              ))}
              {/* Duplicate for infinite scroll */}
              {PARTNER_LOGOS.map((logo, i) => (
                <div key={`dup-${i}`} className="partner-logo-item">
                  <img 
                    src={`/logos/${logo.file}`} 
                    alt={`Partner ${i + 1}`} 
                    className={logo.needsBg ? 'logo-needs-bg' : ''}
                    style={logo.style} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <button className="footer-link" onClick={() => onLegalClick('privacy')}>Privacy Policy</button>
            <button className="footer-link" onClick={() => onLegalClick('cookies')}>Cookies Policy</button>
            <button className="footer-link" onClick={() => onLegalClick('legal')}>Legal Notice</button>
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            © 2026 HackLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
