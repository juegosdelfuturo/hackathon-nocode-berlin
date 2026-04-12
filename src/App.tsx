import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Rocket, ArrowRight, Calendar, Zap, Target, Bot, Code2, Users, Linkedin } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    work_position: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if email already exists
      const { data: existingLead, error: checkError } = await supabase
        .from('leads')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLead) {
        setError('ESTE EMAIL YA ESTÁ REGISTRADO. ¡TE CONTACTAREMOS PRONTO!');
        return;
      }

      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([formData]);

      if (supabaseError) throw supabaseError;

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      setError(err.message || 'Error al guardar el registro. Asegúrate de que las variables de Supabase estén configuradas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Top Banner Marquee */}
      {bannerVisible && (
        <div className="top-banner">
          <div className="banner-marquee">
            <div className="banner-content">
              <span>OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • </span>
            </div>
            <div className="banner-content">
              <span>OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • OVER €1,500 IN PRIZES • </span>
            </div>
          </div>
          <button className="banner-close" onClick={() => setBannerVisible(false)}>
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header>
        <div className="container nav-inner">
          <a href="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            <span style={{ color: 'var(--fg)' }}>ROBOTICS × </span>
            <span style={{ color: 'var(--accent)', marginLeft: '10px' }}>NO CODE</span>
          </a>


          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#about" className="mono" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: '0.7rem' }}>ABOUT</a>
            <a href="#prizes" className="mono" style={{ textDecoration: 'none', color: 'var(--muted)', fontSize: '0.7rem' }}>PRIZES</a>
            <a href="https://luma.com/1857f2wa?tk=hUbfYk" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>
              REGISTER
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero container animate-up">
        <span className="card-tag mono">Berlin | 20 & 21 June 2026</span>
        <h1 style={{ marginTop: '2rem' }}>FOR THOSE WHO <br /> <span>BUILD</span> THE FUTURE WITHOUT CODE.</h1>
        <p>
          Join us for a 48 hour robotics challenge where AI brains meet robotic bodies using no code tools to solve real world problems.
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
                <div className="date-banner-value">20 & 21 JUNE 2026</div>
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
                <div className="date-banner-value">ROBOTICS × NO CODE</div>
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

      {/* ─── EARLY ACCESS CTA ─── */}
      <section className="early-access-banner">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}>👁 EXCLUSIVE</span>
          <h2 className="early-access-title">If you're seeing this,<br />you have <span>Early Access.</span></h2>
          <p className="early-access-sub">You're one of the first to know. Secure your spot before we open to the public.</p>
          <a href="https://luma.com/1857f2wa?tk=hUbfYk" target="_blank" rel="noopener noreferrer" className="btn early-access-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            CLAIM YOUR SPOT <ArrowRight size={18} style={{ marginLeft: '10px' }} />
          </a>
        </div>
      </section>

      {/* Registration */}
      <section id="register" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid">
            <div className="card full form-container">
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <span className="card-tag mono">01 / REGISTRATION</span>
                <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--fg)' }}>REGISTER NOW.</h2>
                <div style={{ marginBottom: '3rem' }}>
                  <a href="https://luma.com/1857f2wa?tk=hUbfYk" target="_blank" rel="noopener noreferrer" className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '1rem 2rem' }}>
                    OPEN LUMA REGISTRATION <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                  </a>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
                  <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Or join our internal waitlist to stay updated:</p>
                </div>

                {submitted ? (
                  <div className="animate-up" style={{ padding: '3rem', border: '1px solid var(--accent)', textAlign: 'center', background: '#fff' }}>
                    <Rocket size={48} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
                    <h3 style={{ marginBottom: '1rem' }}>YOU ARE IN.</h3>
                    <p style={{ color: 'var(--muted)' }}>We'll email you the details once the application window opens. Stay building.</p>
                    <button onClick={() => setSubmitted(false)} className="btn" style={{ marginTop: '2rem' }}>
                      BACK TO TOP
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <label className="label">FULL NAME</label>
                      <input
                        type="text"
                        name="name"
                        className="input"
                        placeholder=""
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group">
                      <label className="label">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        name="email"
                        className="input"
                        placeholder=""
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group">
                      <label className="label">LINKEDIN PROFILE URL</label>
                      <input
                        type="url"
                        name="linkedin"
                        className="input"
                        placeholder=""
                        required
                        value={formData.linkedin}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group">
                      <label className="label">CURRENT ROLE</label>
                      <input
                        type="text"
                        name="work_position"
                        className="input"
                        placeholder=""
                        required
                        value={formData.work_position}
                        onChange={handleChange}
                      />
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>ERROR: {error}</p>}

                    <button type="submit" className="btn" style={{ width: '100%', padding: '1.5rem' }} disabled={loading}>
                      {loading ? 'PROCESSING...' : 'CONFIRM APPLICATION'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Grid Section - About */}
      <section id="about" style={{ borderTop: '1px solid var(--border)', background: '#fff' }}>
        <div className="container">
          <div className="grid">
            <div className="card full">
              <span className="card-tag mono">02 / THE MISSION</span>
              <h2>THE FUTURE ISN'T JUST ROBOTS.<br />IT'S WHO GETS TO CONTROL THEM.</h2>
              <p style={{ marginTop: '1.5rem', maxWidth: '720px', color: 'var(--muted)', fontSize: '1.1rem' }}>
                For decades, the power to build physical automation was held by a few. Today, we're giving that power to everyone. Join us to bridge the gap between AI brains and robotic bodies using no code tools to solve real world problems in 48 hours.
              </p>
            </div>

            <div className="card">
              <Bot size={32} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
              <h3>AGENTIC AI + ROBOTICS</h3>
              <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
                The industry has shifted from rigid programming to Agentic AI. VLA Models have reduced manipulation errors by 65% and ignited the Humanoid Boom.
              </p>
            </div>

            <div className="card">
              <Code2 size={32} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
              <h3>NO CODE POWER</h3>
              <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
                You don't need to touch a compiler. Use the best no code and AI tools to build automation pipelines that talk to real robots.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ─── OBJECTIVES ─── */}
      <section style={{ borderTop: '1px solid var(--border)', background: '#fff' }}>
        <div className="container">
          <span className="card-tag mono">03 / OBJECTIVES</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem', marginBottom: '3rem' }}>WHAT WE ARE BUILDING TOGETHER.</h2>
          <div className="info-cards">
            <div className="info-card objective-card">
              <Users size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>GATHER TALENT</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                We bring experts together to solve real world problems. The perfect place to launch new ideas and find the best talent in AI and Robotics.
              </p>
            </div>
            <div className="info-card objective-card">
              <Rocket size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>LAUNCHING STARTUPS</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Be the launchpad for people to build the pathway to a successful robotics startup in Berlin's innovation ecosystem.
              </p>
            </div>
            <div className="info-card objective-card">
              <Target size={28} style={{ color: 'var(--accent)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>VISIBILITY</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Connect your products and services directly with a community of AI and Robotics specialists at the forefront of the Berlin innovation scene.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* ─── PRIZES ─── */}
      <section id="prizes" style={{ borderTop: '1px solid var(--border)', background: '#fff' }}>
        <div className="container">
          <span className="card-tag mono">04 / PRIZES</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem' }}>THE REWARDS.</h2>
          <div className="prize-pool-banner">
            <div className="prize-pool-amount">€1,500</div>
            <div className="prize-pool-label mono">IN PRIZES  TO BE DISTRIBUTED AMONG TOP 3 TEAMS</div>
          </div>
          <div className="prizes-grid">
            <div className="prize-card">
              <div className="prize-icon">🥇</div>
              <div className="mono prize-place">1ST PLACE</div>
              <div className="prize-coming-soon-badge">AMOUNT COMING SOON</div>
              <div className="prize-shimmer-lines"><div /><div /></div>
            </div>
            <div className="prize-card">
              <div className="prize-icon">🥈</div>
              <div className="mono prize-place">2ND PLACE</div>
              <div className="prize-coming-soon-badge">AMOUNT COMING SOON</div>
              <div className="prize-shimmer-lines"><div /><div /></div>
            </div>
            <div className="prize-card">
              <div className="prize-icon">🥉</div>
              <div className="mono prize-place">3RD PLACE</div>
              <div className="prize-coming-soon-badge">AMOUNT COMING SOON</div>
              <div className="prize-shimmer-lines"><div /><div /></div>
            </div>
          </div>
          <p style={{ marginTop: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
            Prize breakdown will be revealed progressively. Follow our channels to stay updated.
          </p>
        </div>
      </section>


      {/* ─── PARTNERS MARQUEE ─── */}
      <section style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '6rem 0' }}>
        <div className="container" style={{ marginBottom: '4rem' }}>
          <span className="card-tag mono">05 / PARTNERS</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem' }}>SUPPORTED BY INNOVATION LEADERS</h2>
        </div>
        
        <div className="partners-marquee-container">
          <div className="partners-marquee-content">
            {/* First set of logos */}
            <div className="partner-logo-item">
              <img src="/assets/mondragon_logo_final.png" alt="Mondragon Unibertsitatea" />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/travelling_u_logo.png" alt="Travelling U" />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/cic_logo.png" alt="CIC Berlin" />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/hf-logo.png" alt="Hugging Face" style={{ height: '50px' }} />
            </div>

            <div className="partner-logo-item">
              <img src="/assets/logo_42_berlin_v2.svg" alt="42 Berlin" style={{ height: '50px' }} />
            </div>
            <div className="partner-soon-tag">KEY PARTNER REVEALING SOON</div>
            <div className="partner-soon-tag">COMMUNITY REVEALING SOON</div>
            <div className="partner-soon-tag">SPONSOR REVEALING SOON</div>
            <div className="partner-soon-tag">ECOSYSTEM PARTNER REVEALING SOON</div>
            <div className="partner-soon-tag">MEDIA PARTNER REVEALING SOON</div>

            {/* Duplicate for infinite effect */}
            <div className="partner-logo-item">
              <img src="/assets/mondragon_logo_final.png" alt="Mondragon Unibertsitatea" />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/travelling_u_logo.png" alt="Travelling U" />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/cic_logo.png" alt="CIC Berlin" />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/hf-logo.png" alt="Hugging Face" style={{ height: '50px' }} />
            </div>
            <div className="partner-logo-item">
              <img src="/assets/logo_42_berlin_v2.svg" alt="42 Berlin" style={{ height: '50px' }} />
            </div>
            <div className="partner-soon-tag">KEY PARTNER REVEALING SOON</div>
            <div className="partner-soon-tag">COMMUNITY REVEALING SOON</div>
            <div className="partner-soon-tag">SPONSOR REVEALING SOON</div>
            <div className="partner-soon-tag">ECOSYSTEM PARTNER REVEALING SOON</div>
            <div className="partner-soon-tag">MEDIA PARTNER REVEALING SOON</div>
          </div>
        </div>
      </section>

      {/* ─── JUDGES ─── */}
      <section className="info-section">
        <div className="container">
          <span className="card-tag mono">06 / JUDGES</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '2rem' }}>MEET THE PANEL</h2>
          <div className="info-cards">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="info-card info-card-soon">
                <div className="soon-avatar" />
                <div style={{ width: '100%' }}>
                  <div className="soon-lines">
                    <div style={{ width: '60%', margin: '0 auto' }} />
                    <div style={{ width: '40%', margin: '0.5rem auto 0' }} />
                  </div>
                </div>
                <span className="soon-badge">COMING SOON</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VENUE ─── */}
      <section className="info-section" style={{ background: '#fff' }}>
        <div className="container">
          <span className="card-tag mono">07 / VENUE</span>
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

      {/* ─── ORGANIZERS / CONTACT ─── */}
      <section id="contact" className="info-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="contact-banner">
            <h2>Contact</h2>
          </div>
          <p style={{ color: 'var(--muted)', marginTop: '2rem', marginBottom: '4rem', fontSize: '1rem' }}>
            If you want to collaborate, contact us.
          </p>

          <div className="organizers-grid">
            {/* Pedro */}
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

            {/* Beñat */}
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
            © 2026 NO CODE HACKATHON. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Social links removed */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
