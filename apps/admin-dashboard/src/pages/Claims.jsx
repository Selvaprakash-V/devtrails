import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { admin } from '../services/api';
import { MOCK_CLAIMS } from '../services/mockData';

const STATUS_CLASS = { Approved: 'badge-approved', Flagged: 'badge-flagged', Rejected: 'badge-rejected', Pending: 'badge-pending', paid: 'badge-approved' };
const RISK_CLASS = { high: 'badge-rejected', medium: 'badge-flagged', low: 'badge-approved' };

const tooltipStyle = { background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' };
const chartStyle = { fontSize: '0.75rem', fill: '#64748b' };

const PAYOUT_TREND = [
  { hour: '08h', amount: 8200 }, { hour: '09h', amount: 14500 }, { hour: '10h', amount: 19000 },
  { hour: '11h', amount: 28000 }, { hour: '12h', amount: 41000 }, { hour: '13h', amount: 35000 },
  { hour: '14h', amount: 52000 }, { hour: '15h', amount: 63000 },
];
const AVG_PAYOUT = [
  { city: 'Chennai', avg: 420 }, { city: 'Mumbai', avg: 310 }, { city: 'Bangalore', avg: 290 },
  { city: 'Delhi', avg: 350 }, { city: 'Hyderabad', avg: 260 }, { city: 'Pune', avg: 280 },
];

export default function Claims() {
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    admin.getClaims()
      .then(r => { if (r.data?.length) setClaims(r.data.map(c => ({ ...c, worker: c.workerId?.name || c.worker, city: c.workerId?.city || c.city }))); })
      .catch(() => {});
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await admin.updateClaimStatus(id, status);
      setClaims(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    } catch { alert('Failed to update'); }
  };

  const displayed = filter === 'All' ? claims : claims.filter(c => (c.status || '').toLowerCase() === filter.toLowerCase());
  const totalPayout = claims.reduce((s, c) => s + (c.payoutAmount || 0), 0);

  return (
    <div>
      <p className="page-title">Claims & Payout Engine</p>
      <p className="page-subtitle">Financial flow — every rupee tracked and verified</p>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Claims', value: claims.length, color: '#6366f1' },
          { label: 'Approved', value: claims.filter(c => ['Approved','paid'].includes(c.status)).length, color: '#10b981' },
          { label: 'Flagged', value: claims.filter(c => c.status === 'Flagged').length, color: '#f59e0b' },
          { label: 'Total Payout', value: `₹${totalPayout.toLocaleString()}`, color: '#34d399' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Payout Trend (Today)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={PAYOUT_TREND}>
              <XAxis dataKey="hour" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, 'Payout']} />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Avg Payout per City</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={AVG_PAYOUT} barSize={24}>
              <XAxis dataKey="city" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v}`, 'Avg Payout']} />
              <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['All', 'Pending', 'Approved', 'Flagged', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.375rem 1rem', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer',
            background: filter === f ? '#4f46e5' : 'rgba(255,255,255,0.05)',
            border: filter === f ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
            color: filter === f ? '#fff' : '#94a3b8',
          }}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table className="table-dark" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Claim ID</th><th>Worker</th><th>City</th><th>Trigger</th>
              <th>Payout</th><th>Risk</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(c => (
              <tr key={c._id}>
                <td style={{ color: '#6366f1', fontFamily: 'monospace', fontSize: '0.8rem' }}>{c._id}</td>
                <td style={{ fontWeight: 500, color: '#e2e8f0' }}>{c.worker || c.workerId?.name}</td>
                <td style={{ color: '#94a3b8' }}>{c.city || c.workerId?.city}</td>
                <td>
                  <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(99,102,241,0.1)', borderRadius: '4px', fontSize: '0.75rem', color: '#a5b4fc' }}>
                    {c.triggerType || c.disruptionType}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: '#34d399' }}>₹{(c.payoutAmount || 0).toFixed(0)}</td>
                <td>
                  <span className={RISK_CLASS[c.riskLevel] || 'badge-idle'} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                    {c.riskLevel}
                  </span>
                </td>
                <td>
                  <span className={STATUS_CLASS[c.status] || 'badge-idle'} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.status === 'Pending' || c.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleStatus(c._id, 'Approved')} style={{ padding: '0.2rem 0.6rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '4px', color: '#34d399', fontSize: '0.75rem', cursor: 'pointer' }}>✓ Approve</button>
                      <button onClick={() => handleStatus(c._id, 'Rejected')} style={{ padding: '0.2rem 0.6rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>✗ Reject</button>
                    </div>
                  ) : <span style={{ color: '#475569', fontSize: '0.75rem' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
