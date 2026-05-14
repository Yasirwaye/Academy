import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Edit2, Shield, AlertTriangle, Lock, LogOut, Upload, Star, Video, Save, Users, Eye, EyeOff, Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, uploadFile } from '@/api/dataService';
import { supabase } from '@/api/supabaseClient';

// ─── Auth via base44 ──────────────────────────────────────────────────────────
// Fix #1: Photos handled by base44 file storage (UploadFile integration)
// Fix #2: Admin can upload highlight videos
// Fix #3: Spotlight is separate from player creation (up to 4 slots)
// Fix #4: Squad formation/lineup/substitutes

const FORMATIONS = ['4-3-3', '4-4-2', '5-3-2', '4-2-3-1', '3-5-2', '4-1-4-1'];
const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];
const MAX_SPOTLIGHT = 4;

const emptySquadForm = { name: '', age_group: '', formation: '4-3-3', coach_name: '', training_schedule: '', description: '', max_players: 25 };
// Inside PlayersTab component
const emptyPlayerForm = { 
  full_name: '', 
  position: 'CM', // Changed from 'Midfielder' to 'CM'
  squad_id: '', 
  photo_url: '', 
  stats_goals: 0, 
  stats_assists: 0, 
  stats_matches: 0, 
  notes: '', 
  email: '', 
  phone: '', 
  jersey_number: '', 
  status: 'active', 
  nationality: '', 
  date_of_birth: '' 
};
const emptyHighlightForm = { title: '', description: '', video_url: '', thumbnail_url: '', match_date: '', squad_id: '', is_featured: false };

export default function AdminPanel({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('squads');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: window.location.origin,
    });
    if (error) setForgotError(error.message);
    else setForgotSent(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#0a0e1a' }}>
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm glass rounded-2xl p-8 relative z-10">
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Club logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://media.base44.com/images/public/69e6d8a7ff5a5c713dec19d2/d3de99d56_WhatsAppImage2026-03-08at172254.jpeg"
              alt="Eastleigh FC"
              className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/20 mb-3"
            />
            <h1 className="text-xl font-black font-display text-white tracking-wide">EASTLEIGH FC</h1>
            <p className="text-cyan-400 text-xs mt-0.5">Academy Admin</p>
          </div>

          {!forgotMode ? (
            <>
              <h2 className="text-white text-base font-bold mb-5 text-center">Sign in to your account</h2>
              {authError && (
                <p className="text-red-400 text-sm mb-4 text-center bg-red-500/10 rounded-lg py-2 px-3">{authError}</p>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@eastleighfc.com"
                      className="w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      style={inputStyle}
                    />
                  </div>
                </div>
                {/* Password */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all mt-2"
                >
                  Sign In
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => { setForgotMode(true); setForgotEmail(email); setForgotError(''); setForgotSent(false); }}
                  className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-base font-bold mb-2 text-center">Reset your password</h2>
              <p className="text-gray-400 text-sm text-center mb-5">Enter your email and we'll send you a reset link.</p>

              {forgotSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold mb-1">Reset link sent!</p>
                  <p className="text-gray-400 text-sm">Check your email inbox.</p>
                </div>
              ) : (
                <>
                  {forgotError && <p className="text-red-400 text-sm mb-4 text-center bg-red-500/10 rounded-lg py-2 px-3">{forgotError}</p>}
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          placeholder="admin@eastleighfc.com"
                          className="w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                      Send Reset Link
                    </button>
                  </form>
                </>
              )}

              <div className="text-center mt-4">
                <button
                  onClick={() => setForgotMode(false)}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a', color: 'white' }}>
      {/* Header */}
      <div className="glass-strong border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img
            src="https://media.base44.com/images/public/69e6d8a7ff5a5c713dec19d2/d3de99d56_WhatsAppImage2026-03-08at172254.jpeg"
            alt="Eastleigh FC"
            className="w-9 h-9 rounded-full object-cover border border-cyan-400/30"
          />
          <div>
            <h1 className="font-black font-display text-white tracking-wider">ADMIN PANEL</h1>
            <p className="text-cyan-400 text-xs">Eastleigh FC Academy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="glass px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <button onClick={onClose} className="glass p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: 'squads', label: 'Squads', icon: Shield },
            { id: 'players', label: 'Players', icon: Users },
            { id: 'lineup', label: 'Lineup', icon: Save },
            { id: 'spotlight', label: 'Spotlight', icon: Star },
            { id: 'highlights', label: 'Highlights', icon: Video },
            { id: 'applications', label: 'Applications', icon: AlertTriangle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {activeTab === 'squads' && <SquadsTab queryClient={queryClient} />}
        {activeTab === 'players' && <PlayersTab queryClient={queryClient} />}
        {activeTab === 'lineup' && <LineupTab queryClient={queryClient} />}
        {activeTab === 'spotlight' && <SpotlightTab queryClient={queryClient} />}
        {activeTab === 'highlights' && <HighlightsTab queryClient={queryClient} />}
        {activeTab === 'applications' && <ApplicationsTab queryClient={queryClient} />}
      </div>
    </div>
  );
}

// ─── SQUADS TAB ───────────────────────────────────────────────────────────────
function SquadsTab({ queryClient }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptySquadForm);
  const [editingId, setEditingId] = useState(null);

  const { data: squads = [], isLoading } = useQuery({ queryKey: ['squads'], queryFn: () => db.Squad.list('-created_date') });
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: () => db.Player.list() });

  const save = useMutation({
    mutationFn: (data) => editingId ? db.Squad.update(editingId, data) : db.Squad.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['squads'] }); setShowForm(false); setForm(emptySquadForm); setEditingId(null); },
  });
  const del = useMutation({
    mutationFn: (id) => db.Squad.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['squads'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black font-display">Squads</h2>
        <button onClick={() => { setShowForm(true); setForm(emptySquadForm); setEditingId(null); }} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Squad
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl p-6 mb-6">
          <h3 className="font-bold text-white mb-4">{editingId ? 'Edit' : 'New'} Squad</h3>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-400 mb-1 block">Name *</label>
              <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Age Group</label>
              <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.age_group} onChange={e => setForm({ ...form, age_group: e.target.value })} /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Formation</label>
              <select className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={form.formation} onChange={e => setForm({ ...form, formation: e.target.value })}>
                {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Head Coach</label>
              <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.coach_name} onChange={e => setForm({ ...form, coach_name: e.target.value })} /></div>
            <div className="md:col-span-2"><label className="text-xs text-gray-400 mb-1 block">Training Schedule</label>
              <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.training_schedule} onChange={e => setForm({ ...form, training_schedule: e.target.value })} placeholder="e.g. Mon & Wed, 4:00 PM" /></div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="glass px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg text-sm">Save</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <div className="text-center text-gray-400 py-10">Loading...</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squads.map(s => (
            <div key={s.id} className="glass rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-white">{s.name}</h3>
                  <p className="text-cyan-400 text-xs">{s.age_group} • {s.formation}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setForm({ name: s.name, age_group: s.age_group || '', formation: s.formation || '4-3-3', coach_name: s.coach_name || '', training_schedule: s.training_schedule || '', description: s.description || '', max_players: s.max_players || 25 }); setEditingId(s.id); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => del.mutate(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-xs text-gray-400">{players.filter(p => p.squad_id === s.id).length} players</p>
              {s.coach_name && <p className="text-xs text-gray-400">Coach: {s.coach_name}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PLAYERS TAB ──────────────────────────────────────────────────────────────
function PlayersTab({ queryClient }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPlayerForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = React.useRef();

  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: () => db.Player.list('-created_at') });
  const { data: squads = [] } = useQuery({ queryKey: ['squads'], queryFn: () => db.Squad.list() });

  const save = useMutation({
    mutationFn: (data) => editingId
      ? db.Player.update(editingId, data)
      : db.Player.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['players'] }); setShowForm(false); setForm(emptyPlayerForm); setEditingId(null); },
  });
  const del = useMutation({
    mutationFn: (id) => db.Player.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await uploadFile(file);
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black font-display">Players</h2>
        <button onClick={() => { setShowForm(true); setForm(emptyPlayerForm); setEditingId(null); }} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Player
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl p-6 mb-6">
          <h3 className="font-bold text-white mb-4">{editingId ? 'Edit' : 'New'} Player</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            save.mutate({
              ...form,
              jersey_number: form.jersey_number ? Number(form.jersey_number) : undefined,
              stats_goals: Number(form.stats_goals) || 0,
              stats_assists: Number(form.stats_assists) || 0,
              stats_matches: Number(form.stats_matches) || 0,
            });
          }} className="space-y-4">
            {/* Photo upload */}
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors bg-white/5"
                onClick={() => fileRef.current?.click()}
              >
                {form.photo_url ? (
                  <img src={form.photo_url} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="glass px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
                <p className="text-xs text-gray-500 mt-1">Player photo</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
                <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Position *</label>
                <select 
                  className="w-full rounded-lg px-3 py-2 text-white text-sm" 
                  style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} 
                  value={form.position} 
                  onChange={e => setForm({ ...form, position: e.target.value })} 
                  required
                >
                  <option value="GK">Goalkeeper</option>
                  <option value="CB">Centre Back</option>
                  <option value="LB">Left Back</option>
                  <option value="RB">Right Back</option>
                  <option value="CM">Midfielder (CM)</option>
                  <option value="CDM">Defensive Midfielder</option>
                  <option value="CAM">Attacking Midfielder</option>
                  <option value="LW">Left Winger</option>
                  <option value="RW">Right Winger</option>
                  <option value="ST">Striker / Forward</option>
                </select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Squad *</label>
                <select className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={form.squad_id} onChange={e => setForm({ ...form, squad_id: e.target.value })} required>
                  <option value="">Select squad</option>
                  {squads.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Jersey #</label>
                <input type="number" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.jersey_number} onChange={e => setForm({ ...form, jersey_number: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Date of Birth</label>
                <input type="date" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Nationality</label>
                <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Email</label>
                <input type="email" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Phone</label>
                <input type="tel" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Status</label>
                <select className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {['active','injured','suspended','inactive'].map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Goals</label>
                <input type="number" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.stats_goals} onChange={e => setForm({ ...form, stats_goals: e.target.value })} min="0" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Assists</label>
                <input type="number" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.stats_assists} onChange={e => setForm({ ...form, stats_assists: e.target.value })} min="0" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Matches</label>
                <input type="number" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.stats_matches} onChange={e => setForm({ ...form, stats_matches: e.target.value })} min="0" /></div>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">Notes / Quote</label>
              <textarea className="w-full rounded-lg px-3 py-2 text-white text-sm resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="glass px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg text-sm">Save Player</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <div className="text-center text-gray-400 py-10">Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              <th className="text-left text-gray-400 font-medium py-3 pr-4">Player</th>
              <th className="text-left text-gray-400 font-medium py-3 pr-4">Position</th>
              <th className="text-left text-gray-400 font-medium py-3 pr-4">Squad</th>
              <th className="text-left text-gray-400 font-medium py-3 pr-4">Status</th>
              <th className="py-3" />
            </tr></thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 shrink-0">
                        {p.photo_url ? <img src={p.photo_url} alt={p.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{p.full_name?.[0]}</div>}
                      </div>
                      <span className="text-white font-medium">{p.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-cyan-400">{p.position}</td>
                  <td className="py-3 pr-4 text-gray-400">{squads.find(s => s.id === p.squad_id)?.name || '—'}</td>
                  <td className="py-3 pr-4"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : p.status === 'injured' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.status}</span></td>
                  <td className="py-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => { setForm({ full_name: p.full_name || '', position: p.position || 'Midfielder', squad_id: p.squad_id || '', photo_url: p.photo_url || '', stats_goals: p.stats_goals || 0, stats_assists: p.stats_assists || 0, stats_matches: p.stats_matches || 0, notes: p.notes || '', email: p.email || '', phone: p.phone || '', jersey_number: p.jersey_number || '', status: p.status || 'active', nationality: p.nationality || '', date_of_birth: p.date_of_birth || '' }); setEditingId(p.id); setShowForm(true); }} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => del.mutate(p.id)} className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── LINEUP TAB ───────────────────────────────────────────────────────────────
function LineupTab({ queryClient }) {
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState(Array(11).fill(''));
  const [substitutes, setSubstitutes] = useState([]);

  const { data: squads = [] } = useQuery({ queryKey: ['squads'], queryFn: () => db.Squad.list() });
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: () => db.Player.list() });

  const squad = squads.find(s => s.id === selectedSquadId);
  const squadPlayers = players.filter(p => p.squad_id === selectedSquadId);

  useEffect(() => {
    if (squad) {
      setFormation(squad.formation || '4-3-3');
      const l = squad.lineup || [];
      setLineup([...l, ...Array(11).fill('')].slice(0, 11));
      setSubstitutes(squad.substitutes || []);
    } else {
      setLineup(Array(11).fill(''));
      setSubstitutes([]);
    }
  }, [selectedSquadId, squads]);

  const saveMutation = useMutation({
    mutationFn: () => db.Squad.update(selectedSquadId, { formation, lineup: lineup.filter(Boolean), substitutes }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['squads'] }); alert('Lineup saved!'); },
  });

  const setSlot = (idx, val) => {
    const nl = [...lineup];
    const prev = nl.indexOf(val);
    if (prev !== -1 && prev !== idx) nl[prev] = '';
    nl[idx] = val;
    setLineup(nl);
    if (val) setSubstitutes(s => s.filter(id => id !== val));
  };

  const toggleSub = (id) => {
    if (substitutes.includes(id)) {
      setSubstitutes(s => s.filter(x => x !== id));
    } else {
      setSubstitutes(s => [...s, id]);
      setLineup(l => l.map(x => x === id ? '' : x));
    }
  };

  const getPlayerName = (id) => { const p = players.find(x => x.id === id); return p ? p.full_name : ''; };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black font-display">Squad Lineup</h2>
        {selectedSquadId && (
          <button onClick={() => saveMutation.mutate()} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Save className="w-4 h-4" /> Save Lineup
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Squad</label>
          <select className="rounded-lg px-3 py-2 text-white text-sm min-w-[180px]" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={selectedSquadId} onChange={e => setSelectedSquadId(e.target.value)}>
            <option value="">Choose squad...</option>
            {squads.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        {selectedSquadId && (
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Formation</label>
            <select className="rounded-lg px-3 py-2 text-white text-sm" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={formation} onChange={e => setFormation(e.target.value)}>
              {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        )}
      </div>

      {selectedSquadId && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 11 slots */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Starting XI — {formation}</h3>
            <div className="space-y-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-5">{i + 1}</span>
                  <select
                    className="flex-1 rounded-lg px-3 py-2 text-white text-sm"
                    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                    value={lineup[i] || ''}
                    onChange={e => setSlot(i, e.target.value)}
                  >
                    <option value="">— Empty slot —</option>
                    {squadPlayers.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.position})</option>)}
                  </select>
                  {lineup[i] && <span className="text-xs text-cyan-400 whitespace-nowrap">{squadPlayers.find(p => p.id === lineup[i])?.position}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Substitutes */}
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Substitutes</h3>
            <div className="space-y-2">
              {squadPlayers.map(p => {
                const inLineup = lineup.includes(p.id);
                const inSubs = substitutes.includes(p.id);
                return (
                  <div key={p.id} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${inLineup ? 'border-cyan-400/30 bg-cyan-400/5' : inSubs ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-white/5'}`}>
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 shrink-0">
                      {p.photo_url ? <img src={p.photo_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">{p.full_name?.[0]}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{p.full_name}</p>
                      <p className="text-xs text-gray-400">{p.position} {p.jersey_number ? `#${p.jersey_number}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {inLineup && <span className="text-xs text-cyan-400">XI</span>}
                      {inSubs && <span className="text-xs text-yellow-400">SUB</span>}
                      <button onClick={() => toggleSub(p.id)} disabled={inLineup} className={`text-xs px-2 py-1 rounded ${inSubs ? 'bg-red-500/20 text-red-400' : 'glass text-gray-300 hover:text-white'} disabled:opacity-30`}>
                        {inSubs ? 'Remove' : 'Sub'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SPOTLIGHT TAB ────────────────────────────────────────────────────────────
function SpotlightTab({ queryClient }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [highlightText, setHighlightText] = useState('');

  const { data: spotlights = [] } = useQuery({ queryKey: ['spotlights'], queryFn: () => db.Spotlight.list('order') });
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: () => db.Player.list() });

  const add = useMutation({
    mutationFn: (data) => db.Spotlight.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['spotlights'] }); setSelectedPlayerId(''); setHighlightText(''); },
  });
  const del = useMutation({
    mutationFn: (id) => db.Spotlight.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spotlights'] }),
  });

  const isFull = spotlights.length >= MAX_SPOTLIGHT;
  const spotlightedIds = spotlights.map(s => s.player_id);
  const available = players.filter(p => !spotlightedIds.includes(p.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black font-display">Player Spotlight</h2>
        <span className="text-sm text-gray-400">{spotlights.length}/{MAX_SPOTLIGHT} slots</span>
      </div>
      <p className="text-gray-400 text-sm mb-6">Choose up to {MAX_SPOTLIGHT} players to feature in the spotlight section. This is separate from creating players.</p>

      {/* Slot indicators */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: MAX_SPOTLIGHT }).map((_, i) => (
          <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${i < spotlights.length ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' : 'border-white/20 text-gray-600'}`}>{i + 1}</div>
        ))}
      </div>

      {/* Add form */}
      {!isFull && (
        <div className="glass rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-300 mb-4">Add Player to Spotlight</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-gray-400 mb-1 block">Player</label>
              <select className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={selectedPlayerId} onChange={e => setSelectedPlayerId(e.target.value)}>
                <option value="">Select player...</option>
                {available.map(p => <option key={p.id} value={p.id}>{p.full_name} — {p.position}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-gray-400 mb-1 block">Custom description (optional)</label>
              <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={highlightText} onChange={e => setHighlightText(e.target.value)} placeholder="e.g. Top scorer this season..." />
            </div>
            <button disabled={!selectedPlayerId} onClick={() => add.mutate({ player_id: selectedPlayerId, highlight_text: highlightText, order: spotlights.length + 1 })} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-40">
              Add
            </button>
          </div>
        </div>
      )}

      {/* Current spotlight */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {spotlights.map(spot => {
          const p = players.find(x => x.id === spot.player_id);
          if (!p) return null;
          return (
            <div key={spot.id} className="glass rounded-xl overflow-hidden group relative">
              <button onClick={() => del.mutate(spot.id)} className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="aspect-square bg-gray-800 overflow-hidden">
                {p.photo_url ? <img src={p.photo_url} alt={p.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-600 font-display">{p.full_name?.[0]}</div>}
              </div>
              <div className="p-3">
                <p className="font-bold text-white text-sm">{p.full_name}</p>
                <p className="text-cyan-400 text-xs">{p.position}</p>
                {spot.highlight_text && <p className="text-gray-400 text-xs mt-1 italic">"{spot.highlight_text}"</p>}
              </div>
            </div>
          );
        })}
        {spotlights.length === 0 && <div className="col-span-4 text-center text-gray-500 py-8">No players in spotlight yet.</div>}
      </div>
    </div>
  );
}

// ─── HIGHLIGHTS TAB ───────────────────────────────────────────────────────────
function HighlightsTab({ queryClient }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyHighlightForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [saveError, setSaveError] = useState('');
  const videoRef = React.useRef();
  const thumbRef = React.useRef();

  const { data: highlights = [], isLoading } = useQuery({ queryKey: ['highlights'], queryFn: () => db.Highlight.list() });
  const { data: squads = [] } = useQuery({ queryKey: ['squads'], queryFn: () => db.Squad.list() });

  const save = useMutation({
    mutationFn: (data) => editingId ? db.Highlight.update(editingId, data) : db.Highlight.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['highlights'] }); setShowForm(false); setForm(emptyHighlightForm); setEditingId(null); setSaveError(''); },
    onError: (err) => setSaveError(err?.message || JSON.stringify(err)),
  });
  const del = useMutation({
    mutationFn: (id) => db.Highlight.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['highlights'] }),
  });

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await uploadFile(file);
    setForm(f => ({ ...f, video_url: file_url }));
    setUploading(false);
  };
  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    const { file_url } = await uploadFile(file);
    setForm(f => ({ ...f, thumbnail_url: file_url }));
    setUploadingThumb(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black font-display">Highlight Videos</h2>
        <button onClick={() => { setShowForm(true); setForm(emptyHighlightForm); setEditingId(null); }} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Highlight
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-xl p-6 mb-6">
          <h3 className="font-bold text-white mb-4">{editingId ? 'Edit' : 'New'} Highlight</h3>
          <form onSubmit={(e) => { e.preventDefault(); setSaveError(''); const data = { ...form }; if (!data.squad_id) delete data.squad_id; if (!data.match_date) delete data.match_date; save.mutate(data); }} className="space-y-4">
            {saveError && <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{saveError}</p>}
            <div><label className="text-xs text-gray-400 mb-1 block">Title *</label>
              <input className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>

            {/* Video upload */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Video</label>
              <div className="flex gap-3 items-center flex-wrap">
                <button type="button" onClick={() => videoRef.current?.click()} disabled={uploading} className="glass px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
                <span className="text-gray-500 text-xs">or</span>
                <input className="flex-1 min-w-[200px] rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} placeholder="Paste YouTube or video URL" value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} />
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </div>
              {form.video_url && <p className="text-xs text-cyan-400 mt-1 truncate">✓ {form.video_url}</p>}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Thumbnail Image</label>
              <div className="flex gap-3 items-center flex-wrap">
                {form.thumbnail_url && <img src={form.thumbnail_url} alt="thumb" className="w-16 h-10 object-cover rounded" />}
                <button type="button" onClick={() => thumbRef.current?.click()} disabled={uploadingThumb} className="glass px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {uploadingThumb ? 'Uploading...' : 'Upload Thumbnail'}
                </button>
                <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 mb-1 block">Match Date</label>
                <input type="date" className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} value={form.match_date} onChange={e => setForm({ ...form, match_date: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Squad</label>
                <select className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} value={form.squad_id} onChange={e => setForm({ ...form, squad_id: e.target.value })}>
                  <option value="">All squads</option>
                  {squads.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
            </div>
            <div><label className="text-xs text-gray-400 mb-1 block">Description</label>
              <textarea className="w-full rounded-lg px-3 py-2 text-white text-sm resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="accent-cyan-400" />
              <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Feature this highlight (pin to top)</label>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="glass px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" disabled={!form.title} className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e1a] font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-40">Save</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? <div className="text-center text-gray-400 py-10">Loading...</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map(h => (
            <div key={h.id} className="glass rounded-xl overflow-hidden group">
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {h.thumbnail_url ? <img src={h.thumbnail_url} alt={h.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Video className="w-10 h-10 text-gray-600" /></div>}
                {h.is_featured && <div className="absolute top-2 left-2 bg-cyan-400 text-[#0a0e1a] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Featured</div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white flex-1 line-clamp-2">{h.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setForm({ title: h.title || '', description: h.description || '', video_url: h.video_url || '', thumbnail_url: h.thumbnail_url || '', match_date: h.match_date || '', squad_id: h.squad_id || '', is_featured: h.is_featured || false }); setEditingId(h.id); setShowForm(true); }} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => del.mutate(h.id)} className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {highlights.length === 0 && <div className="col-span-3 text-center text-gray-500 py-10">No highlights yet. Upload your first video.</div>}
        </div>
      )}
    </div>
  );
}

// ─── APPLICATIONS TAB ─────────────────────────────────────────────────────────
function ApplicationsTab({ queryClient }) {
  const { data: applications = [], isLoading } = useQuery({ queryKey: ['applications'], queryFn: () => db.Application.list('-created_at') });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => db.Application.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
  const del = useMutation({
    mutationFn: (id) => db.Application.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  const statusConfig = {
    pending:  { label: 'Pending',  color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    reviewed: { label: 'Reviewed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    accepted: { label: 'Accepted', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    rejected: { label: 'Declined', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  };

  return (
    <div>
      <h2 className="text-xl font-black font-display mb-6">Applications ({applications.length})</h2>
      {isLoading ? <div className="text-center text-gray-400 py-10">Loading...</div> : (
        <div className="space-y-4">
          {applications.map(a => {
            const status = a.status || 'pending';
            const cfg = statusConfig[status] || statusConfig.pending;
            return (
              <div key={a.id} className="glass rounded-xl p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{a.first_name} {a.last_name}</h3>
                    <p className="text-cyan-400 text-sm">{a.position}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status badge with icon */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
                      {status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      {status === 'reviewed' && <Eye className="w-3.5 h-3.5" />}
                      {cfg.label}
                    </div>
                    {/* Status selector */}
                    <select
                      className="rounded-lg px-2 py-1 text-xs font-medium text-white"
                      style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                      value={status}
                      onChange={e => updateStatus.mutate({ id: a.id, status: e.target.value })}
                    >
                      {['pending','reviewed','accepted','rejected'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <button onClick={() => del.mutate(a.id)} className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm border-t border-white/5 pt-4">
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-[90px]">Email</span>
                    <span className="text-gray-200">{a.email}</span>
                  </div>
                  {a.phone && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 min-w-[90px]">Phone</span>
                      <span className="text-gray-200">{a.phone}</span>
                    </div>
                  )}
                  {a.date_of_birth && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 min-w-[90px]">Date of Birth</span>
                      <span className="text-gray-200">{a.date_of_birth}</span>
                    </div>
                  )}
                  {a.previous_club && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 min-w-[90px]">Previous Club</span>
                      <span className="text-gray-200">{a.previous_club}</span>
                    </div>
                  )}
                </div>

                {/* Message / Why join */}
                {a.message && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-gray-500 text-xs mb-1">Why they want to join</p>
                    <p className="text-gray-300 text-sm italic">"{a.message}"</p>
                  </div>
                )}
              </div>
            );
          })}
          {applications.length === 0 && <div className="text-center text-gray-500 py-10">No applications yet.</div>}
        </div>
      )}
    </div>
  );
}