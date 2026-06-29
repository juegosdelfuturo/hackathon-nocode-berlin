import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, Linkedin, Plus, User, Briefcase, GraduationCap, Rocket, Code2, Palette, ChevronDown } from 'lucide-react';
import { supabase } from '../supabaseClient';

type Role = 'student' | 'founder' | 'developer' | 'designer' | 'other';

interface Profile {
  id: string;
  name: string;
  email?: string | null;
  role: Role;
  age?: number | null;
  bio?: string | null;
  skills: string[];
  hackathons: string[];
  linkedin_url?: string | null;
  avatar_url?: string | null;
  is_looking_for_job: boolean;
  created_at: string;
}

const ROLE_CONFIG: Record<Role, { label: string; color: string; icon: React.ReactNode }> = {
  student: { label: 'Student', color: '#7c3aed', icon: <GraduationCap size={12} /> },
  founder: { label: 'Founder', color: '#dc2626', icon: <Rocket size={12} /> },
  developer: { label: 'Developer', color: '#0066ff', icon: <Code2 size={12} /> },
  designer: { label: 'Designer', color: '#d97706', icon: <Palette size={12} /> },
  other: { label: 'Other', color: '#059669', icon: <User size={12} /> },
};

const AVATAR_COLORS = ['#0066ff', '#7c3aed', '#dc2626', '#d97706', '#059669', '#0891b2'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_PROFILES: Profile[] = [
  {
    id: '1', name: 'Lena Müller', email: 'lena@example.com', role: 'developer',
    age: 26, bio: 'Full-stack developer passionate about AI and robotics. Love building things that move in the physical world.',
    skills: ['Python', 'ROS2', 'React', 'ML'], hackathons: ['Berlin Robotics × AI 2026'],
    linkedin_url: 'https://linkedin.com', is_looking_for_job: true, created_at: new Date().toISOString(),
  },
  {
    id: '2', name: 'Amir Hassan', email: 'amir@example.com', role: 'founder',
    age: 31, bio: 'Serial entrepreneur. Building autonomous systems for smart logistics. Ex-Bosch.',
    skills: ['Leadership', 'Hardware', 'Fundraising', 'Go-to-Market'], hackathons: ['Berlin Robotics × AI 2026'],
    linkedin_url: 'https://linkedin.com', is_looking_for_job: false, created_at: new Date().toISOString(),
  },
  {
    id: '3', name: 'Sofía Ramírez', email: 'sofia@example.com', role: 'designer',
    age: 24, bio: 'UX/UI designer with a love for hardware interfaces. Designing the future of human-robot interaction.',
    skills: ['Figma', 'UX Research', 'Motion Design', 'Prototyping'], hackathons: ['Berlin Robotics × AI 2026'],
    linkedin_url: 'https://linkedin.com', is_looking_for_job: true, created_at: new Date().toISOString(),
  },
  {
    id: '4', name: 'Jonas Weber', email: 'jonas@example.com', role: 'student',
    age: 22, bio: 'MSc Robotics @ TU Berlin. Working on multi-agent coordination for drone swarms.',
    skills: ['C++', 'ROS', 'Control Theory', 'SLAM'], hackathons: ['Berlin Robotics × AI 2026'],
    linkedin_url: 'https://linkedin.com', is_looking_for_job: true, created_at: new Date().toISOString(),
  },
  {
    id: '5', name: 'Priya Sharma', email: 'priya@example.com', role: 'developer',
    age: 28, bio: 'ML engineer specializing in computer vision. Building perception stacks for mobile robots.',
    skills: ['PyTorch', 'OpenCV', 'CUDA', 'Kubernetes'], hackathons: ['Berlin Robotics × AI 2026'],
    linkedin_url: 'https://linkedin.com', is_looking_for_job: false, created_at: new Date().toISOString(),
  },
  {
    id: '6', name: 'Marco Bianchi', email: 'marco@example.com', role: 'founder',
    age: 35, bio: 'CTO & Co-founder of a stealth robotics startup. 10y building embedded systems.',
    skills: ['Embedded C', 'PCB Design', 'Team Building', 'Rust'], hackathons: ['Berlin Robotics × AI 2026'],
    linkedin_url: 'https://linkedin.com', is_looking_for_job: false, created_at: new Date().toISOString(),
  },
];

// ─── PROFILE CARD ────────────────────────────────────────────────────────────
function ProfileCard({ profile, onClick }: { profile: Profile; onClick: () => void }) {
  const roleConf = ROLE_CONFIG[profile.role];
  const avatarColor = getAvatarColor(profile.name);

  return (
    <div className="profile-card" onClick={onClick}>
      <div className="profile-card-header">
        <div className="profile-avatar" style={{ background: `${avatarColor}22`, border: `2px solid ${avatarColor}44` }}>
          <span style={{ color: avatarColor, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>
            {getInitials(profile.name)}
          </span>
        </div>
        <div className="profile-card-meta">
          <div className="profile-card-name">{profile.name}</div>
          {profile.age && <div className="profile-card-age mono">Age {profile.age}</div>}
        </div>
        {profile.is_looking_for_job && (
          <div className="profile-open-badge">
            <Briefcase size={10} />
            OPEN
          </div>
        )}
      </div>

      <div className="profile-role-badge" style={{ background: `${roleConf.color}18`, color: roleConf.color, borderColor: `${roleConf.color}33` }}>
        {roleConf.icon}
        {roleConf.label}
      </div>

      {profile.bio && <p className="profile-card-bio">{profile.bio}</p>}

      <div className="profile-skills">
        {profile.skills.slice(0, 4).map(s => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
        {profile.skills.length > 4 && <span className="skill-tag skill-tag-more">+{profile.skills.length - 4}</span>}
      </div>

      <div className="profile-card-footer">
        {profile.hackathons.length > 0 && (
          <span className="profile-hackathon-badge mono">
            {profile.hackathons[0]}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE MODAL ───────────────────────────────────────────────────────────
function ProfileModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const roleConf = ROLE_CONFIG[profile.role];
  const avatarColor = getAvatarColor(profile.name);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content profile-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        <div className="profile-modal-header">
          <div className="profile-avatar profile-avatar-lg" style={{ background: `${avatarColor}22`, border: `3px solid ${avatarColor}55` }}>
            <span style={{ color: avatarColor, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem' }}>
              {getInitials(profile.name)}
            </span>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{profile.name}</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="profile-role-badge" style={{ background: `${roleConf.color}18`, color: roleConf.color, borderColor: `${roleConf.color}33` }}>
                {roleConf.icon} {roleConf.label}
              </div>
              {profile.age && <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Age {profile.age}</span>}
              {profile.is_looking_for_job && (
                <div className="profile-open-badge"><Briefcase size={10} /> OPEN TO WORK</div>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="profile-modal-section">
            <div className="profile-modal-label mono">About</div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{profile.bio}</p>
          </div>
        )}

        <div className="profile-modal-section">
          <div className="profile-modal-label mono">Skills</div>
          <div className="profile-skills">
            {profile.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
          </div>
        </div>

        {profile.hackathons.length > 0 && (
          <div className="profile-modal-section">
            <div className="profile-modal-label mono">Hackathons</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {profile.hackathons.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ color: 'var(--fg)', fontSize: '0.95rem' }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(profile.email || profile.linkedin_url) && (
          <div className="profile-modal-section profile-modal-contacts">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="profile-contact-btn">
                {profile.email}
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="profile-contact-btn profile-contact-linkedin">
                <Linkedin size={16} /> LinkedIn <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADD PROFILE MODAL ────────────────────────────────────────────────────────
function AddProfileModal({ onClose, onSaved }: { onClose: () => void; onSaved: (p: Profile) => void }) {
  const [form, setForm] = useState({
    name: '', email: '', role: 'developer' as Role, age: '',
    bio: '', skills: '', hackathons: '', linkedin_url: '', is_looking_for_job: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    setLoading(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      role: form.role,
      age: form.age ? parseInt(form.age) : null,
      bio: form.bio.trim() || null,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      hackathons: form.hackathons.split(',').map(s => s.trim()).filter(Boolean),
      linkedin_url: form.linkedin_url.trim() || null,
      is_looking_for_job: form.is_looking_for_job,
    };
    try {
      const { data, error: sbError } = await supabase.from('profiles').insert([payload]).select().single();
      if (sbError) throw sbError;
      onSaved(data as Profile);
      onClose();
    } catch (err: unknown) {
      // Fallback: add locally with mock ID
      const mock: Profile = { ...payload, id: Date.now().toString(), created_at: new Date().toISOString(), skills: payload.skills, hackathons: payload.hackathons, is_looking_for_job: payload.is_looking_for_job };
      onSaved(mock);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>NEW PROFILE</div>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Add Participant</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label mono">Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className="form-field">
              <label className="form-label mono">Age</label>
              <input className="form-input" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="25" min={16} max={99} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label mono">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="form-field">
              <label className="form-label mono">Role</label>
              <div className="form-select-wrapper">
                <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}>
                  <option value="student">Student</option>
                  <option value="founder">Founder</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label mono">Bio</label>
            <textarea className="form-input form-textarea" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short description..." rows={3} />
          </div>
          <div className="form-field">
            <label className="form-label mono">Skills <span style={{ color: 'var(--muted)' }}>(comma separated)</span></label>
            <input className="form-input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Python, React, ROS2" />
          </div>
          <div className="form-field">
            <label className="form-label mono">Hackathons <span style={{ color: 'var(--muted)' }}>(comma separated)</span></label>
            <input className="form-input" value={form.hackathons} onChange={e => setForm({ ...form, hackathons: e.target.value })} placeholder="Berlin Robotics × AI 2026" />
          </div>
          <div className="form-field">
            <label className="form-label mono">LinkedIn URL</label>
            <input className="form-input" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
          </div>
          <label className="form-checkbox-label">
            <input type="checkbox" checked={form.is_looking_for_job} onChange={e => setForm({ ...form, is_looking_for_job: e.target.checked })} className="form-checkbox" />
            <span>Open to job opportunities</span>
          </label>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'SAVING...' : 'ADD PROFILE'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CommunityPage: React.FC<{ subscriptionTier?: 'none' | 'data_partner' | 'track_partner' }> = ({ subscriptionTier }) => {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [jobFilter, setJobFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Try to load from Supabase, fallback to mock data
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    
    if (subscriptionTier === 'data_partner') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      query = query.gte('created_at', oneMonthAgo.toISOString());
    }

    query.then(({ data }) => { if (data && data.length > 0) setProfiles(data as Profile[]); });
  }, [subscriptionTier]);

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.bio?.toLowerCase().includes(q) || p.skills.some(s => s.toLowerCase().includes(q));
    const matchRole = roleFilter === 'all' || p.role === roleFilter;
    const matchJob = !jobFilter || p.is_looking_for_job;
    return matchSearch && matchRole && matchJob;
  });

  return (
    <div className="platform-page">
      {/* Hero */}
      <div className="platform-page-hero">
        <div className="container">
          <span className="card-tag mono">Community</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Meet the <span style={{ color: 'var(--accent)' }}>Builders</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 560 }}>
            Our internal directory of hackathon participants, founders, and tech talent from the HackLab community.
          </p>
          <div className="platform-stats">
            <div className="platform-stat"><span>{profiles.length}</span> Profiles</div>
            <div className="platform-stat-divider" />
            <div className="platform-stat"><span>{profiles.filter(p => p.is_looking_for_job).length}</span> Open to Work</div>
            <div className="platform-stat-divider" />
            <div className="platform-stat"><span>{[...new Set(profiles.flatMap(p => p.hackathons))].length}</span> Hackathons</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="platform-toolbar">
        <div className="container">
          <div className="toolbar-inner">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by name, skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
            </div>
            <div className="filter-pills">
              {(['all', 'student', 'founder', 'developer', 'designer', 'other'] as const).map(r => (
                <button key={r} className={`filter-pill ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
                  {r === 'all' ? 'All Roles' : ROLE_CONFIG[r].label}
                </button>
              ))}
              <button className={`filter-pill ${jobFilter ? 'active' : ''}`} onClick={() => setJobFilter(!jobFilter)}>
                <Briefcase size={11} /> Open to Work
              </button>
            </div>
            <button className="btn btn-sm" onClick={() => setShowAddModal(true)} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={14} style={{ marginRight: '0.4rem' }} /> Add Profile
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding: '3rem 2rem 6rem' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <User size={40} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
            <p>No profiles found. Try different filters.</p>
          </div>
        ) : (
          <div className="profiles-grid">
            {filtered.map(p => <ProfileCard key={p.id} profile={p} onClick={() => setSelectedProfile(p)} />)}
          </div>
        )}
      </div>

      {selectedProfile && <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
      {showAddModal && (
        <AddProfileModal
          onClose={() => setShowAddModal(false)}
          onSaved={p => setProfiles(prev => [p, ...prev])}
        />
      )}
    </div>
  );
};

export default CommunityPage;
