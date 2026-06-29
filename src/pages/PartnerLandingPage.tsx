
import { LogIn } from 'lucide-react';

export default function PartnerLandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="platform-page" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="platform-page-hero" style={{ padding: '6rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="card-tag mono" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>For Companies</span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>
            Accelerate your technical recruiting.
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn" onClick={onLoginClick} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              <LogIn size={20} style={{ marginRight: '0.75rem' }} />
              PARTNER LOGIN / SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
