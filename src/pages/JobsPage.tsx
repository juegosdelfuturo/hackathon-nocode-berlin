import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, Plus, Briefcase, MapPin, Clock, ChevronDown, Building2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

type JobType = 'full-time' | 'part-time' | 'internship' | 'contract';

interface Job {
  id: string;
  company: string;
  title: string;
  description?: string;
  type: JobType;
  skills: string[];
  location?: string;
  url?: string;
  posted_by?: string;
  created_at: string;
}

const TYPE_CONFIG: Record<JobType, { label: string; color: string }> = {
  'full-time':  { label: 'Full-time',  color: '#0066ff' },
  'part-time':  { label: 'Part-time',  color: '#7c3aed' },
  'internship': { label: 'Internship', color: '#059669' },
  'contract':   { label: 'Contract',   color: '#d97706' },
};

function isNew(dateStr: string) {
  return (Date.now() - new Date(dateStr).getTime()) < 7 * 24 * 60 * 60 * 1000;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_JOBS: Job[] = [
  {
    id: '1', company: 'Franka Robotics', title: 'Senior Robotics Software Engineer',
    description: 'Join our core stack team building motion planning algorithms for next-gen collaborative robots.',
    type: 'full-time', skills: ['C++', 'ROS2', 'Motion Planning', 'Python'],
    location: 'Berlin, Germany', url: 'https://franka.de', posted_by: 'HR Team',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2', company: 'Apify', title: 'Machine Learning Engineer (Remote)',
    description: 'Work on our AI agents pipeline, building intelligent web scrapers and data extraction tools.',
    type: 'full-time', skills: ['Python', 'PyTorch', 'NLP', 'Docker'],
    location: 'Remote', url: 'https://apify.com', posted_by: 'Talent Team',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3', company: 'Normacore', title: 'Frontend Developer Internship',
    description: 'Build beautiful UIs for our robotics dashboard. 6-month internship, full-time.',
    type: 'internship', skills: ['React', 'TypeScript', 'Three.js'],
    location: 'Berlin, Germany', url: 'https://normacore.io', posted_by: 'CTO',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4', company: 'Stealth Robotics Startup', title: 'Co-Founder / CTO',
    description: 'Early-stage autonomous drone startup looking for a technical co-founder. Equity-based.',
    type: 'contract', skills: ['Embedded C', 'Drone Systems', 'Leadership', 'Fundraising'],
    location: 'Berlin, Germany', url: undefined, posted_by: 'Founder',
    created_at: new Date().toISOString(),
  },
  {
    id: '5', company: 'IBC Advanced Alloys', title: 'AI Research Intern',
    description: 'Apply ML to materials science. Analyze manufacturing processes with computer vision.',
    type: 'internship', skills: ['Python', 'OpenCV', 'Data Analysis', 'Research'],
    location: 'Berlin, Germany', url: 'https://ibc.com', posted_by: 'Research Lead',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6', company: 'HackLab', title: 'Community Manager (Part-time)',
    description: 'Help us grow and nurture the HackLab community. Organize events and onboard new participants.',
    type: 'part-time', skills: ['Community', 'Social Media', 'Event Planning'],
    location: 'Berlin / Remote', url: undefined, posted_by: 'Pedro',
    created_at: new Date().toISOString(),
  },
];

// ─── JOB CARD ─────────────────────────────────────────────────────────────────
function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const typeConf = TYPE_CONFIG[job.type];
  const _new = isNew(job.created_at);

  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-card-top">
        <div className="job-company-avatar">
          {job.company.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div className="job-company mono">{job.company}</div>
          <div className="job-title">{job.title}</div>
        </div>
        {_new && <div className="job-new-badge">NEW</div>}
      </div>

      {job.description && (
        <p className="job-description">{job.description.slice(0, 120)}{job.description.length > 120 ? '…' : ''}</p>
      )}

      <div className="job-meta">
        <div className="job-meta-item">
          <div className="job-type-badge" style={{ background: `${typeConf.color}18`, color: typeConf.color, borderColor: `${typeConf.color}33` }}>
            {typeConf.label}
          </div>
        </div>
        {job.location && (
          <div className="job-meta-item">
            <MapPin size={12} style={{ color: 'var(--muted)' }} />
            <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.65rem' }}>{job.location}</span>
          </div>
        )}
        <div className="job-meta-item" style={{ marginLeft: 'auto' }}>
          <Clock size={12} style={{ color: 'var(--muted)' }} />
          <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.65rem' }}>{timeAgo(job.created_at)}</span>
        </div>
      </div>

      <div className="profile-skills" style={{ marginTop: '1rem' }}>
        {job.skills.slice(0, 4).map(s => <span key={s} className="skill-tag">{s}</span>)}
        {job.skills.length > 4 && <span className="skill-tag skill-tag-more">+{job.skills.length - 4}</span>}
      </div>
    </div>
  );
}

// ─── JOB DETAIL MODAL ─────────────────────────────────────────────────────────
function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const typeConf = TYPE_CONFIG[job.type];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content profile-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        <div className="profile-modal-header">
          <div className="job-company-avatar job-company-avatar-lg">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="mono" style={{ color: 'var(--muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>{job.company}</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{job.title}</h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="job-type-badge" style={{ background: `${typeConf.color}18`, color: typeConf.color, borderColor: `${typeConf.color}33` }}>
                {typeConf.label}
              </div>
              {job.location && (
                <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={11} /> {job.location}
                </span>
              )}
              <span className="mono" style={{ color: 'var(--muted)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={11} /> {timeAgo(job.created_at)}
              </span>
            </div>
          </div>
        </div>

        {job.description && (
          <div className="profile-modal-section">
            <div className="profile-modal-label mono">Description</div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{job.description}</p>
          </div>
        )}

        <div className="profile-modal-section">
          <div className="profile-modal-label mono">Required Skills</div>
          <div className="profile-skills">
            {job.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
          </div>
        </div>

        {job.posted_by && (
          <div className="profile-modal-section">
            <div className="profile-modal-label mono">Posted by</div>
            <span style={{ color: 'var(--fg)' }}>{job.posted_by}</span>
          </div>
        )}

        <div className="profile-modal-section profile-modal-contacts">
          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ textDecoration: 'none' }}>
              Apply Now <ExternalLink size={14} style={{ marginLeft: '0.5rem' }} />
            </a>
          ) : (
            <div className="btn btn-secondary" style={{ cursor: 'default', opacity: 0.6 }}>
              Contact via community
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── POST JOB MODAL ───────────────────────────────────────────────────────────
function PostJobModal({ onClose, onSaved }: { onClose: () => void; onSaved: (j: Job) => void }) {
  const [form, setForm] = useState({
    company: '', title: '', description: '', type: 'full-time' as JobType,
    skills: '', location: '', url: '', posted_by: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.title.trim()) return setError('Company and title are required');
    setLoading(true); setError('');
    const payload = {
      company: form.company.trim(), title: form.title.trim(),
      description: form.description.trim() || null, type: form.type,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      location: form.location.trim() || null, url: form.url.trim() || null,
      posted_by: form.posted_by.trim() || null,
    };
    try {
      const { data, error: sbError } = await supabase.from('jobs').insert([payload]).select().single();
      if (sbError) throw sbError;
      onSaved(data as Job);
      onClose();
    } catch {
      const mock: Job = { ...payload, id: Date.now().toString(), created_at: new Date().toISOString(), skills: payload.skills, description: payload.description ?? undefined, location: payload.location ?? undefined, url: payload.url ?? undefined, posted_by: payload.posted_by ?? undefined };
      onSaved(mock);
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>POST A JOB</div>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>New Job Offer</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label mono">Company *</label>
              <input className="form-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
            </div>
            <div className="form-field">
              <label className="form-label mono">Type</label>
              <div className="form-select-wrapper">
                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as JobType })}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label mono">Job Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Senior Engineer, ML Intern..." />
          </div>
          <div className="form-field">
            <label className="form-label mono">Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What will they work on?" rows={3} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label mono">Location</label>
              <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Berlin / Remote" />
            </div>
            <div className="form-field">
              <label className="form-label mono">Apply URL</label>
              <input className="form-input" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label mono">Skills <span style={{ color: 'var(--muted)' }}>(comma separated)</span></label>
              <input className="form-input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Python, React, ROS2" />
            </div>
            <div className="form-field">
              <label className="form-label mono">Posted by</label>
              <input className="form-input" value={form.posted_by} onChange={e => setForm({ ...form, posted_by: e.target.value })} placeholder="Your name" />
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'POSTING...' : 'POST JOB'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<JobType | 'all'>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    supabase.from('jobs').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setJobs(data as Job[]); });
  }, []);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q));
    const matchType = typeFilter === 'all' || j.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="platform-page">
      {/* Hero */}
      <div className="platform-page-hero">
        <div className="container">
          <span className="card-tag mono">Jobs</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Find your next <span style={{ color: 'var(--accent)' }}>opportunity</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 560 }}>
            Job offers curated for the HackLab community — robotics, AI, and frontier tech.
          </p>
          <div className="platform-stats">
            <div className="platform-stat"><span>{jobs.length}</span> Open Positions</div>
            <div className="platform-stat-divider" />
            <div className="platform-stat"><span>{jobs.filter(j => isNew(j.created_at)).length}</span> Posted this week</div>
            <div className="platform-stat-divider" />
            <div className="platform-stat"><span>{[...new Set(jobs.map(j => j.company))].length}</span> Companies</div>
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
                placeholder="Search job, company, skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
            </div>
            <div className="filter-pills">
              {(['all', 'full-time', 'part-time', 'internship', 'contract'] as const).map(t => (
                <button key={t} className={`filter-pill ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
                  {t === 'all' ? 'All Types' : TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>
            <button className="btn btn-sm" onClick={() => setShowPostModal(true)} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={14} style={{ marginRight: '0.4rem' }} /> Post a Job
            </button>
          </div>
        </div>
      </div>

      {/* Jobs list */}
      <div className="container" style={{ padding: '3rem 2rem 6rem' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
            <p>No jobs found. Try different filters.</p>
          </div>
        ) : (
          <div className="jobs-list">
            {/* Featured row */}
            <div className="jobs-featured-row">
              <Building2 size={14} style={{ color: 'var(--accent)' }} />
              <span className="mono" style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>FEATURED OPPORTUNITIES</span>
            </div>
            {filtered.map(j => <JobCard key={j.id} job={j} onClick={() => setSelectedJob(j)} />)}
          </div>
        )}
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {showPostModal && (
        <PostJobModal
          onClose={() => setShowPostModal(false)}
          onSaved={j => setJobs(prev => [j, ...prev])}
        />
      )}
    </div>
  );
};

export default JobsPage;
