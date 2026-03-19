import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { admin } from '../services/api';
import { MOCK_DASHBOARD } from '../services/mockData';

const chartStyle = { fontSize: '0.75rem', fill: 'var(--text-4)' };
const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)' };

const IcoUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoPolicy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IcoAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IcoPayout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IcoShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CARDS = (data) => [
  { label: 'Total Workers Active', value: data.totalWorkers.toLocaleString(), sub: 'across all platforms', variant: '', Icon: IcoUsers },
  { label: 'Active Policies',      value: data.activePolicies.toLocaleString(), sub: 'currently enrolled', variant: 'success', Icon: IcoPolicy },
  { label: 'Live Disruptions',     value: data.liveDisruptions, sub: 'active weather events', variant: 'warning', Icon: IcoAlert },
  { label: 'Total Payouts Today',  value: `₹${(data.totalPayoutsToday / 1000).toFixed(0)}K`, sub: 'disbursed today', variant: 'success', Icon: IcoPayout },
  { label: 'Fraud Alerts',         value: data.fraudAlerts, sub: 'require immediate action', variant: data.fraudAlerts > 10 ? 'danger' : '', Icon: IcoShield },
  { label: 'System Status',        value: 'LIVE', sub: 'all services operational', variant: '', Icon: IcoCheck },
];

const StatCard = ({ label, value, sub, variant, Icon }) => (
  <div className={`stat-card ${variant}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p className="stat-label" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p className="stat-value" style={{ fontSize: '1.875rem', fontWeight: 700, lineHeight: 1 }}>{value}</p>
        {sub && <p className="stat-sub" style={{ fontSize: '0.75rem', marginTop: '0.375rem' }}>{sub}</p>}
      </div>
      <span className="stat-icon" style={{ marginTop: '0.1rem' }}><Icon /></span>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(MOCK_DASHBOARD);

  useEffect(() => {
    admin.getDashboard()
      .then(r => setData({ ...MOCK_DASHBOARD, ...r.data }))
      .catch(() => {});
  }, []);

  // Strip emojis from insight strings
  const cleanInsights = data.insights.map(s => s.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim());

  return (
    <div>
      <p className="page-title">Overview</p>
      <p className="page-subtitle">Platform health at a glance</p>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {CARDS(data).map(card => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Insights */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p className="section-title">Live Insights</p>
        {cleanInsights.map((insight, i) => (
          <div key={i} className="insight-banner">{insight}</div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Payout Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.payoutTrend}>
              <XAxis dataKey="time" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, 'Payout']} />
              <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Risk Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {data.riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-3)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Claims per City */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
        <p className="section-title">Claims per City</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.claimsPerCity} barSize={32}>
            <XAxis dataKey="city" tick={chartStyle} axisLine={false} tickLine={false} />
            <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="claims" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
