import { ArrowUpRight } from 'lucide-react';

type LegalKey = 'privacy' | 'cookies' | 'legal';

export default function OpportunitiesPage({
  onLegalClick,
}: {
  onLegalClick?: (key: LegalKey) => void;
}) {
  return (
    <div className="opp-wrapper">
      <div className="opp-split-page">
        {/* JOBS HALF */}
        <a href="https://tally.so/r/pbMJxB" target="_blank" rel="noopener noreferrer" className="opp-half">
          <div className="opp-content">
            <h2 className="opp-title">LOOKING FOR A JOB</h2>
            <p className="opp-desc">We have placed engineers at Europe’s best AI startups.</p>
          </div>
          <div className="opp-footer">
            <div className="opp-action">
              Apply
              <div className="opp-arrow">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </a>

        {/* HIRING HALF */}
        <a href="https://tally.so/r/pbMRl8" target="_blank" rel="noopener noreferrer" className="opp-half">
          <div className="opp-content">
            <h2 className="opp-title">HIRING?</h2>
            <p className="opp-desc">Building a team? We'll find you the right people. <br /><br />We’ll get back to you within 24 hours.</p>
          </div>
          <div className="opp-footer">
            <div className="opp-action">
              Contact
              <div className="opp-arrow">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Footer */}
      <footer className="footer" style={{ padding: '2rem 0', borderTop: 'none' }}>
        <div className="container">
          {onLegalClick && (
            <div className="footer-links">
              <button className="footer-link" onClick={() => onLegalClick('privacy')}>Privacy Policy</button>
              <button className="footer-link" onClick={() => onLegalClick('cookies')}>Cookies Policy</button>
              <button className="footer-link" onClick={() => onLegalClick('legal')}>Legal Notice</button>
            </div>
          )}
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            © 2026 HackLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
