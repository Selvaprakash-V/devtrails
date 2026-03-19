import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { admin } from '../services/api';
import { MOCK_FRAUD_ALERTS, MOCK_ADVERSARIAL } from '../services/mockData';

const SEV_STYLE = {
  critical: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#f87171', label: 'CRITICAL' },
  high:     { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24', label: 'HIGH' },
  medium:   { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', color: '#a5b4fc', label: 'MEDIUM' },
};

const tooltipStyle = { background: '#1e1e3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' };

const SIGNALS = [
  { signal: 'GPS vs IP Mismatch',      desc: 'Device location differs from network location', weight: 'High' },
  { signal: 'Speed Anomaly',           desc: 'Movement > 120 km/h detected',                  weight: 'High' },
  { signal: 'Duplicate Claims',        desc: 'Same worker, multiple claims in minutes',        weight: 'Critical' },
  { signal: 'Inactive Worker Claiming',desc: 'No movement + active claim',                     weight: 'High' },
  { signal: 'Cluster Anomaly',         desc: 'Many workers at exact same coordinates',         weight: 'Critical' },
];

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState(MOCK_FRAUD_ALERTS);
  const scatter = MOCK_ADVERSARIAL.scatterData;

  useEffect(() => {
    admin.getFraudAlerts()
      .then(r => { if (r.data?.length) setAlerts(r.data); })
      .catch(() => {});
  }, []);

  const handleResolve = async (id) => {
    try {
      await admin.resolveAlert(id);
      setAlerts(prev => prev.filter(a => a._id !== id));
    } catch { alert('Failed to resolve'); }
  };

  const allPoints = [
    ...scatter.normal.map(p => ({ ...p, type: 'normal' })),
    ...scatter.anomaly.map(p => ({ ...p, type: 'anomaly' })),
  ];

  return (
    <div>
      <p className="page-title">Fraud Detection</p>
      <p className="page-subtitle">Rule-based multi-signal fraud intelligence — every alert is evidence</p>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Active Alerts',   value: alerts.length,                                                                          color: '#ef4444' },
          { label: 'Critical',        value: alerts.filter(a => a.severity === 'critical').length,                                   color: '#f87171' },
          { label: 'High',            value: alerts.filter(a => a.severity === 'high').length,                                       color: '#fbbf24' },
          { label: 'Avg Fraud Score', value: Math.round(alerts.reduce((s, a) => s + a.fraudScore, 0) / (alerts.length || 1)),        color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Fraud Signal Types */}
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Fraud Signal Types</p>
          {SIGNALS.map(({ signal, desc, weight }) => (
            <div key={signal} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: weight === 'Critical' ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', color: '#e2e8f0', fontWeight: 500 }}>{signal}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</p>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: weight === 'Critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: weight === 'Critical' ? '#f87171' : '#fbbf24', borderRadius: '4px', fontWeight: 600 }}>
                {weight}
              </span>
            </div>
          ))}
        </div>

        {/* Scatter Plot */}
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Normal vs Anomaly Workers</p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6366f1' }}>● Normal</span>&nbsp;&nbsp;
            <span style={{ color: '#ef4444' }}>● Anomaly</span>
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <XAxis dataKey="x" name="Claim Freq" tick={{ fontSize: '0.7rem', fill: '#64748b' }} axisLine={false} tickLine={false} label={{ value: 'Claim Frequency', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 11 }} />
              <YAxis dataKey="y" name="Risk Score" tick={{ fontSize: '0.7rem', fill: '#64748b' }} axisLine={false} tickLine={false} label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} />
              <Scatter data={allPoints} isAnimationActive={false}>
                {allPoints.map((p, i) => <Cell key={i} fill={p.type === 'anomaly' ? '#ef4444' : '#6366f1'} fillOpacity={p.type === 'anomaly' ? 0.9 : 0.5} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Cards */}
      <p className="section-title">Active Fraud Alerts</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map(alert => {
          const s = SEV_STYLE[alert.severity] || SEV_STYLE.medium;
          return (
            <div key={alert._id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Fraud Score Circle */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `conic-gradient(${s.color} ${alert.fraudScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{alert.fraudScore}</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.95rem' }}>{alert.worker}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>ID: {alert.workerId} · {alert.city}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>{alert.reason}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '4px', color: s.color, fontWeight: 700, letterSpacing: '0.05em' }}>{s.label}</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '4px', color: '#a5b4fc' }}>{alert.action}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.875rem' }}>
                {alert.signals.map((sig, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#94a3b8' }}>
                    {sig}
                  </span>
                ))}
              </div>

              <button onClick={() => handleResolve(alert._id)} style={{ marginTop: '0.875rem', padding: '0.375rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}>
                Mark Resolved
              </button>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <div className="glass" style={{ borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>No active fraud alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}
