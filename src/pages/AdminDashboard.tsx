import { useState, useEffect } from 'react';
import {
  ShieldAlert, Users, UserCheck, UserX, Database,
  Upload, Trash2, Plus, Check, X, Search, Pencil,
  Crown, LogOut, LayoutDashboard, UserPlus
} from 'lucide-react';
import { supabase } from '../supabaseClient';

const ADMIN_EMAILS_KEY = 'hacklab_admins';
const getAdmins = (): string[] => {
  const raw = localStorage.getItem(ADMIN_EMAILS_KEY);
  if (raw) return JSON.parse(raw);
  const defaults = ['pedro@team-nexio.com'];
  localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(defaults));
  return defaults;
};

interface Partner {
  id: string;
  email: string;
  plan: string;
  status: string;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  name?: string;
  role?: string;
  age?: number | null;
  bio?: string | null;
  skills?: string[];
  hackathons?: string[];
  linkedin_url?: string | null;
  is_looking_for_job?: boolean;
  created_at?: string;
}

function getQualificationScore(p: Profile): number {
  let score = 0;
  if (p.name && p.name.trim() !== '') score += 15;
  if (p.email && p.email.trim() !== '') score += 15;
  if (p.role) score += 10;
  if (p.age) score += 10;
  if (p.bio && p.bio.trim() !== '') score += 10;
  if (p.linkedin_url && p.linkedin_url.trim() !== '') score += 10;
  if (p.skills && p.skills.length > 0) score += 15;
  if (p.hackathons && p.hackathons.length > 0) score += 15;
  return score;
}

type Tab = 'partner_overview' | 'requests' | 'profiles' | 'database' | 'admins' | 'remove_profiles' | 'add_partner';

export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('partner_overview');

  // --- State ---
  const [partners, setPartners] = useState<Partner[]>([]);
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileSearch, setProfileSearch] = useState('');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const [admins, setAdmins] = useState<string[]>(getAdmins());
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerPlan, setNewPartnerPlan] = useState('Monthly Plan (150€)');
  const [addingPartner, setAddingPartner] = useState(false);

  useEffect(() => {
    fetchPartners();
    fetchProfiles();
  }, []);

  const fetchPartners = async () => {
    const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
    if (!error && data) setPartners(data as Partner[]);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && data) setProfiles(data as Profile[]);
  };

  const acceptPartner = async (id: string) => {
    await supabase.from('partners').update({ status: 'ACTIVE' }).eq('id', id);
    fetchPartners();
  };

  const rejectPartner = async (id: string) => {
    await supabase.from('partners').update({ status: 'REJECTED' }).eq('id', id);
    fetchPartners();
  };

  const deletePartner = async (id: string) => {
    if (!confirm('Remove this partner?')) return;
    await supabase.from('partners').delete().eq('id', id);
    fetchPartners();
  };

  const addPartner = async () => {
    if (!newPartnerEmail.trim()) return;
    setAddingPartner(true);
    const { error } = await supabase.from('partners').insert([{
      email: newPartnerEmail.trim().toLowerCase(),
      plan: newPartnerPlan,
      status: 'ACTIVE'
    }]);
    if (error) alert('Error: ' + error.message);
    else { setNewPartnerEmail(''); fetchPartners(); setActiveTab('partner_overview'); }
    setAddingPartner(false);
  };

  const deleteProfile = async (id: string) => {
    if (!confirm('Remove this profile from the database?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchProfiles();
  };

  const saveProfile = async () => {
    if (!editingProfile) return;
    const { error } = await supabase.from('profiles').update({
      name: editingProfile.name,
      role: editingProfile.role,
      email: editingProfile.email
    }).eq('id', editingProfile.id);
    if (error) alert(error.message);
    else {
      setEditingProfile(null);
      fetchProfiles();
    }
  };

  const addAdmin = () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || admins.includes(email)) return;
    const updated = [...admins, email];
    setAdmins(updated);
    localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(updated));
    setNewAdminEmail('');
  };

  const removeAdmin = (email: string) => {
    if (email === 'pedro@team-nexio.com') return; // protect root admin
    const updated = admins.filter(a => a !== email);
    setAdmins(updated);
    localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(updated));
  };

  const processCsv = async () => {
    if (!csvFile) return;
    setImporting(true);
    const text = await csvFile.text();
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const emailIdx = headers.indexOf('email');
    if (emailIdx === -1) {
      alert('CSV must have an "email" column');
      setImporting(false);
      return;
    }
    let success = 0, skipped = 0;
    const errors: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const email = values[emailIdx];
      if (!email) continue;
      const { data: existing } = await supabase.from('profiles').select('id').eq('email', email).single();
      if (existing) { skipped++; continue; }
      const payload: any = { email, privacy_accepted: true };
      headers.forEach((h, idx) => {
        if (h === 'name') payload.name = values[idx] || 'Unknown';
        if (h === 'surname') payload.surname = values[idx];
        if (h === 'role') payload.role = values[idx] || 'other';
        if (h === 'skills') payload.skills = values[idx] ? values[idx].split(';') : [];
      });
      if (!payload.name) payload.name = 'Imported User';
      const { error } = await supabase.from('profiles').insert([payload]);
      if (error) errors.push(`Row ${i}: ${error.message}`);
      else success++;
    }
    setImporting(false);
    fetchProfiles();
  };

  // --- Derived State ---
  const activePartners = partners.filter(p => p.status === 'ACTIVE');
  const pendingPartners = partners.filter(p => p.status === 'PENDING');
  const filteredProfiles = profiles.filter(p =>
    profileSearch === '' ||
    (p.email || '').toLowerCase().includes(profileSearch.toLowerCase()) ||
    (p.name || '').toLowerCase().includes(profileSearch.toLowerCase()) ||
    (p.role || '').toLowerCase().includes(profileSearch.toLowerCase())
  );

  const [dbFilter, setDbFilter] = useState<'all' | 'partners' | 'profiles'>('all');
  const [profileSort, setProfileSort] = useState<'recent' | 'qualification'>('recent');

  const sortedProfilesForDb = [...profiles].sort((a, b) => {
    if (profileSort === 'qualification') {
      return getQualificationScore(b) - getQualificationScore(a);
    }
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA; // recent first
  });

  const statusColor = (s: string) => {
    if (s === 'ACTIVE') return { bg: 'rgba(52,211,153,0.12)', color: '#34d399' };
    if (s === 'PENDING') return { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' };
    return { bg: 'rgba(248,113,113,0.12)', color: '#f87171' };
  };

  const navItemStyle = (tab: Tab) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
    background: activeTab === tab ? 'var(--accent)' : 'transparent',
    color: activeTab === tab ? '#000' : 'var(--muted)',
    transition: 'all 0.2s', textAlign: 'left' as const
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: 'var(--card-bg)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ width: 40, height: 40, background: 'rgba(220,38,38,0.1)', color: '#ef4444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Admin Panel</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Restricted Access</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginBottom: '0.5rem', marginTop: '1rem' }}>MAIN</div>
          <button style={navItemStyle('partner_overview')} onClick={() => setActiveTab('partner_overview')}>
            <LayoutDashboard size={18} /> Partner Overview
          </button>
          <button style={navItemStyle('requests')} onClick={() => setActiveTab('requests')}>
            <UserX size={18} /> Invitations & Requests
            {pendingPartners.length > 0 && <span style={{ marginLeft: 'auto', background: activeTab === 'requests' ? '#000' : '#fbbf24', color: activeTab === 'requests' ? '#fff' : '#000', borderRadius: '12px', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>{pendingPartners.length}</span>}
          </button>
          <button style={navItemStyle('profiles')} onClick={() => setActiveTab('profiles')}>
            <Users size={18} /> Profile Directory
          </button>
          <button style={navItemStyle('database')} onClick={() => setActiveTab('database')}>
            <Database size={18} /> Database Overview
          </button>

          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginBottom: '0.5rem', marginTop: '1.5rem' }}>MANAGEMENT</div>
          <button style={navItemStyle('admins')} onClick={() => setActiveTab('admins')}>
            <Crown size={18} /> Manage Admins
          </button>
          <button style={navItemStyle('remove_profiles')} onClick={() => setActiveTab('remove_profiles')}>
            <Trash2 size={18} /> Remove Profiles
          </button>
          <button style={navItemStyle('add_partner')} onClick={() => setActiveTab('add_partner')}>
            <UserPlus size={18} /> Add New Partner
          </button>
        </nav>

        {onLogout && (
          <button onClick={onLogout} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', justifyContent: 'center' }}>
            <LogOut size={16} /> Sign Out
          </button>
        )}
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
        
        {/* Tab 1: Partner Overview */}
        {activeTab === 'partner_overview' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LayoutDashboard size={24} color="var(--accent)" /> Partner Overview
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {activePartners.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>No active partners found.</p>
              ) : activePartners.map(p => (
                <div key={p.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck size={20} color="#34d399" />
                    </div>
                    <span style={{ ...statusColor(p.status), padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>{p.status}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{p.email}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>Plan: {p.plan}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button onClick={() => deletePartner(p.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Invitations & Requests */}
        {activeTab === 'requests' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <UserX size={24} color="#fbbf24" /> Invitations & Requests
            </h1>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
              {pendingPartners.length === 0 ? (
                <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>No pending partner requests at this time.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pendingPartners.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>{p.email}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Requested: {new Date(p.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => acceptPartner(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#34d399', border: 'none', color: '#000', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                          <Check size={16} /> Accept
                        </button>
                        <button onClick={() => rejectPartner(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(248,113,113,0.1)', border: 'none', color: '#f87171', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                          <X size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Directory */}
        {activeTab === 'profiles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={24} color="var(--accent)" /> Profile Directory
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                <Search size={16} color="var(--muted)" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={profileSearch}
                  onChange={e => setProfileSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--fg)', fontSize: '0.9rem', width: '250px' }}
                />
              </div>
            </div>

            {/* CSV Import */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={16} color="var(--accent)" /> Mass Import Profiles (CSV)
              </h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label htmlFor="csv-upload" style={{ cursor: 'pointer', padding: '0.6rem 1.2rem', border: '1px dashed var(--border)', borderRadius: '8px', color: csvFile ? 'var(--accent)' : 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Upload size={14} style={{ marginRight: 6, display: 'inline' }} />
                  {csvFile ? csvFile.name : 'Select CSV file'}
                </label>
                <input type="file" accept=".csv" id="csv-upload" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && setCsvFile(e.target.files[0])} />
                <button className="btn" onClick={processCsv} disabled={!csvFile || importing} style={{ padding: '0.6rem 1.5rem' }}>
                  {importing ? 'Importing...' : 'Start Import'}
                </button>
              </div>
            </div>

            {/* Profile Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {filteredProfiles.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>No profiles found.</p>
              ) : filteredProfiles.map(p => (
                <div key={p.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
                  {editingProfile?.id === p.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" value={editingProfile.name || ''} onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)' }} placeholder="Name" />
                      <input type="text" value={editingProfile.email} onChange={e => setEditingProfile({ ...editingProfile, email: e.target.value })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)' }} placeholder="Email" />
                      <input type="text" value={editingProfile.role || ''} onChange={e => setEditingProfile({ ...editingProfile, role: e.target.value })} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)' }} placeholder="Role" />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={saveProfile} style={{ flex: 1, background: '#34d399', border: 'none', color: '#000', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                        <button onClick={() => setEditingProfile(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                        {(p.name || p.email).charAt(0).toUpperCase()}
                      </div>
                      <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name || 'Anonymous'}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</p>
                      <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{p.role || 'Participant'}</span>
                      
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => setEditingProfile(p)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '0.4rem' }}>
                          <Pencil size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Database Overview */}
        {activeTab === 'database' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Database size={24} color="#3b82f6" /> Database Overview
              </h1>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={dbFilter} 
                  onChange={e => setDbFilter(e.target.value as any)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--fg)', fontSize: '0.85rem' }}
                >
                  <option value="all">All Records</option>
                  <option value="profiles">Profiles Only</option>
                  <option value="partners">Partners Only</option>
                </select>

                {(dbFilter === 'all' || dbFilter === 'profiles') && (
                  <select 
                    value={profileSort} 
                    onChange={e => setProfileSort(e.target.value as any)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--fg)', fontSize: '0.85rem' }}
                  >
                    <option value="recent">Sort Profiles: Most Recent</option>
                    <option value="qualification">Sort Profiles: Most Qualified</option>
                  </select>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Profiles</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{profiles.length}</div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Highly Qualified (≥80%)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#34d399' }}>
                  {profiles.filter(p => getQualificationScore(p) >= 80).length}
                </div>
              </div>
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Avg. Qualification</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#3b82f6' }}>
                  {profiles.length > 0 ? Math.round(profiles.reduce((sum, p) => sum + getQualificationScore(p), 0) / profiles.length) : 0}%
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', background: 'rgba(255,255,255,0.02)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                <span>TYPE</span>
                <span>EMAIL</span>
                <span>JOIN DATE</span>
                <span>STATUS / SCORE</span>
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {(dbFilter === 'all' || dbFilter === 'partners') && partners.map(p => (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600 }}>Partner</span>
                    <span style={{ fontSize: '0.9rem' }}>{p.email}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                    <span><span style={{ ...statusColor(p.status), padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem' }}>{p.status}</span></span>
                  </div>
                ))}
                {(dbFilter === 'all' || dbFilter === 'profiles') && sortedProfilesForDb.map(p => {
                  const score = getQualificationScore(p);
                  let scoreColor = '#f87171'; // Red for low
                  if (score >= 80) scoreColor = '#34d399'; // Green for high
                  else if (score >= 50) scoreColor = '#fbbf24'; // Yellow for medium

                  return (
                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>Participant</span>
                      <span style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column' }}>
                        <span>{p.email}</span>
                        {p.name && <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.name}</span>}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</span>
                      <span>
                        <span style={{ 
                          background: `rgba(${scoreColor === '#34d399' ? '52,211,153' : scoreColor === '#fbbf24' ? '251,191,36' : '248,113,113'}, 0.12)`, 
                          color: scoreColor, 
                          padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 
                        }}>
                          {score}% Qualified
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Manage Admins */}
        {activeTab === 'admins' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Crown size={24} color="#fbbf24" /> Manage Admins
            </h1>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', maxWidth: '600px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Users listed below have full access to this control panel, including deleting records and approving partners.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAdmin()}
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)', fontSize: '0.95rem' }}
                />
                <button onClick={addAdmin} className="btn" style={{ padding: '0.75rem 1.5rem' }}>
                  <Plus size={16} /> Add Admin
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {admins.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Crown size={16} color={a === 'pedro@team-nexio.com' ? '#fbbf24' : 'var(--muted)'} />
                      <span style={{ fontSize: '1rem' }}>{a}</span>
                      {a === 'pedro@team-nexio.com' && <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>ROOT OWNER</span>}
                    </div>
                    {a !== 'pedro@team-nexio.com' && (
                      <button onClick={() => removeAdmin(a)} style={{ background: 'rgba(248,113,113,0.1)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                        Revoke Access
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Remove Profiles */}
        {activeTab === 'remove_profiles' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Trash2 size={24} color="#f87171" /> Remove Profiles
            </h1>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Danger Zone: Permanently delete participant profiles from the database.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {profiles.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(248,113,113,0.02)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{p.name || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{p.email}</div>
                  </div>
                  <button onClick={() => deleteProfile(p.id)} style={{ flexShrink: 0, background: '#f87171', border: 'none', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Add New Partner */}
        {activeTab === 'add_partner' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <UserPlus size={24} color="var(--accent)" /> Add New Partner
            </h1>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', maxWidth: '500px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Manually register a partner. Partners added here will bypass the signup approval queue and instantly become ACTIVE.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Partner Email</label>
                  <input
                    type="email"
                    placeholder="partner@company.com"
                    value={newPartnerEmail}
                    onChange={e => setNewPartnerEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Assigned Plan</label>
                  <select
                    value={newPartnerPlan}
                    onChange={e => setNewPartnerPlan(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', fontSize: '0.95rem' }}
                  >
                    <option value="Visibility Package">Visibility Package (€1500)</option>
                    <option value="Participant Profiles">Participant Profiles (€2000)</option>
                    <option value="Partner Package">Partner Package (€4500+)</option>
                  </select>
                </div>
                
                <button onClick={addPartner} disabled={addingPartner || !newPartnerEmail.trim()} className="btn" style={{ padding: '0.8rem', marginTop: '1rem', justifyContent: 'center' }}>
                  {addingPartner ? 'Creating...' : 'Create Active Partner'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
