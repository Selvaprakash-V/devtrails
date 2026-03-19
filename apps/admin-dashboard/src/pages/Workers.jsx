import { useState, useEffect } from 'react';
import { admin } from '../services/api';
import { MOCK_WORKERS } from '../services/mockData';

const STATUS_CLASS = { Active: 'badge-active', Idle: 'badge-idle', Suspicious: 'badge-suspicious' };

const RiskBar = ({ score }) => {
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: '0.75rem', color, fontWeight: 600, minWidth: '28px' }}>{score}</span>
    </div>
  );
};

export default function Workers() {
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    admin.getWorkers()
      .then(r => { if (r.data?.length) setWorkers(r.data); })
      .catch(() => {});
  }, []);

  const suspicious = workers.filter(w => w.status === 'Suspicious');
  const displayed = filter === 'All' ? workers : workers.filter(w => w.status === filter);

  return (
    <div>
      <p className="page-title">Worker Monitoring</p>
      <p className="page-subtitle">Track every worker — movement, risk, and behavioral signals</p>

      {/* Red Flag Banner */}
      {suspicious.length > 0 && (
        <div className="pulse-red" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 600, color: '#ef4444', fontSize: '0.875rem' }}>{suspicious.length} Suspicious Workers Detected</p>
            <p className="text-subtle" style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>
              {suspicious.map(w => w.name).join(', ')} — same location cluster detected
            </p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Workers', value: workers.length, color: '#6366f1' },
          { label: 'Active', value: workers.filter(w => w.status === 'Active').length, color: '#10b981' },
          { label: 'Idle', value: workers.filter(w => w.status === 'Idle').length, color: '#94a3b8' },
          { label: 'Suspicious', value: suspicious.length, color: '#ef4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</p>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['All', 'Active', 'Idle', 'Suspicious'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-btn${filter === f ? ' active' : ''}`}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table className="table-dark" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Worker ID</th><th>Name</th><th>Platform</th><th>City</th>
              <th>Risk Score</th><th>Last Location</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(w => (
              <tr key={w._id}>
                <td style={{ color: '#6366f1', fontFamily: 'monospace', fontSize: '0.8rem' }}>{w._id}</td>
                <td style={{ fontWeight: 500, color: 'var(--text-1)' }}>{w.name}</td>
                <td>
                  <span className="pill-indigo">
                    {w.platform}
                  </span>
                </td>
                <td style={{ color: 'var(--text-3)' }}>{w.city}</td>
                <td style={{ minWidth: '140px' }}><RiskBar score={w.riskScore} /></td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontFamily: 'monospace' }}>{w.location}</td>
                <td>
                  <span className={`${STATUS_CLASS[w.status] || 'badge-idle'}`} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                    {w.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Red Flag Signals */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', marginTop: '1.5rem' }}>
        <p className="section-title">Automated Red Flag Signals</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { title: 'Location Cluster', desc: '23 workers sharing identical GPS coordinates in Zone 4-B', severity: 'critical' },
            { title: 'No Movement',      desc: '7 workers with zero movement for 4+ hours while claiming',  severity: 'high' },
            { title: 'Instant Jump',     desc: '3 workers teleported 90km in under 3 minutes',              severity: 'high' },
          ].map(({ title, desc, severity }) => (
            <div key={title} style={{ background: severity === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: '10px', padding: '1rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severity === 'critical' ? '#ef4444' : '#f59e0b', marginBottom: '0.625rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>{title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
