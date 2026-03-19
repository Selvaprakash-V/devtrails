import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import Disruptions from './pages/Disruptions';
import Claims from './pages/Claims';
import FraudAlerts from './pages/FraudAlerts';
import AdversarialDefense from './pages/AdversarialDefense';
import { auth } from './services/api';

export const ThemeContext = createContext('dark');

const IcoOverview = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IcoWorkers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoDisruptions = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);
const IcoClaims = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IcoFraud = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IcoDefense = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IcoSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IcoMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const NAV = [
  { to: '/dashboard',   Icon: IcoOverview,    label: 'Overview' },
  { to: '/workers',     Icon: IcoWorkers,     label: 'Workers' },
  { to: '/disruptions', Icon: IcoDisruptions, label: 'Disruptions' },
  { to: '/claims',      Icon: IcoClaims,      label: 'Claims & Payouts' },
  { to: '/fraud',       Icon: IcoFraud,       label: 'Fraud Detection' },
  { to: '/defense',     Icon: IcoDefense,     label: 'Adversarial Defense' },
];

function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async () => {
    if (u === 'admin' && p === 'admin123') {
      localStorage.setItem('adminToken', 'local-admin-token');
      onLogin();
      return;
    }
    try {
      const { data } = await auth.login(u, p);
      localStorage.setItem('adminToken', data.token);
      onLogin();
    } catch {
      setErr('Invalid credentials. Use admin / admin123');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)' }}>QuickClaim Admin</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Sign in to continue</p>
        </div>
        {err && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>{err}</p>}
        <input
          type="text" placeholder="Username" value={u} onChange={e => setU(e.target.value)}
          className="qc-input"
          style={{ marginBottom: '0.75rem' }}
        />
        <input
          type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="qc-input"
          style={{ marginBottom: '1.25rem' }}
        />
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '0.75rem', background: '#4f46e5', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function Sidebar({ onLogout, theme, onToggleTheme }) {
  const isLight = theme === 'light';
  const sidebarBg    = isLight ? '#ffffff' : '#0d0d1f';
  const borderColor  = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const titleColor   = isLight ? '#0f172a' : '#f1f5f9';
  const subtitleColor= isLight ? '#4f46e5' : '#4f46e5';

  return (
    <nav style={{ width: '220px', height: '100vh', position: 'sticky', top: 0, background: sidebarBg, borderRight: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden', transition: 'background 0.2s' }}>

      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: `1px solid ${borderColor}` }}>
        <p style={{ fontWeight: 700, color: titleColor, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>QuickClaim</p>
        <p style={{ fontSize: '0.65rem', color: subtitleColor, fontWeight: 500, marginTop: '0.15rem', letterSpacing: '0.08em' }}>ADMIN PANEL</p>
      </div>

      {/* Nav */}
      <div style={{ padding: '0.75rem 0.625rem', flex: 1 }}>
        {NAV.map(({ to, Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Theme toggle + Logout */}
      <div style={{ padding: '0.875rem 0.625rem', borderTop: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Toggle */}
        <button
          onClick={onToggleTheme}
          style={{ width: '100%', padding: '0.5rem 0.875rem', background: 'transparent', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '6px', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isLight ? <IcoMoon /> : <IcoSun />}
          {isLight ? 'Dark mode' : 'Light mode'}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{ width: '100%', padding: '0.5rem 0.875rem', background: 'transparent', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '6px', color: 'var(--text-3)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <IcoLogout />
          Sign out
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('adminToken'));
  const [theme, setTheme] = useState(localStorage.getItem('adminTheme') || 'dark');

  const logout = () => { localStorage.removeItem('adminToken'); setIsAuth(false); };
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('adminTheme', next);
    document.body.className = next;
  };

  // Apply theme class on mount
  useState(() => { document.body.className = theme; });

  if (!isAuth) return <Login onLogin={() => setIsAuth(true)} />;

  return (
    <ThemeContext.Provider value={theme}>
      <BrowserRouter>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar onLogout={logout} theme={theme} onToggleTheme={toggleTheme} />
          <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            <Routes>
              <Route path="/dashboard"   element={<Dashboard />} />
              <Route path="/workers"     element={<Workers />} />
              <Route path="/disruptions" element={<Disruptions />} />
              <Route path="/claims"      element={<Claims />} />
              <Route path="/fraud"       element={<FraudAlerts />} />
              <Route path="/defense"     element={<AdversarialDefense />} />
              <Route path="*"            element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
