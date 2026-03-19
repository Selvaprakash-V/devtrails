import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { admin } from '../services/api';
import { MOCK_FRAUD_ALERTS, MOCK_ADVERSARIAL } from '../services/mockData';
import AnimatedList from '../components/ui/AnimatedList';

const SEV_STYLE = {
  critical: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#f87171', label: 'CRITICAL' },
  high:     { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24', label: 'HIGH' },
  medium:   { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', color: '#a5b4fc', label: 'MEDIUM' },
};

const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)' };

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
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Fraud Signal Types */}
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Fraud Signal Types</p>
          <AnimatedList
            items={SIGNALS}
            maxHeight={260}
            showGradients
            displayScrollbar
            enableArrowNavigation
            ariaLabel="Fraud signal types"
            getItemKey={(item) => item.signal}
            renderItem={(item) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: item.weight === 'Critical' ? '#ef4444' : '#f59e0b',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 500 }}>{item.signal}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>{item.desc}</p>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    background: item.weight === 'Critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: item.weight === 'Critical' ? '#ef4444' : '#f59e0b',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {item.weight}
                </span>
              </div>
            )}
          />
        </div>

        {/* Scatter Plot */}
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Normal vs Anomaly Workers</p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6366f1' }}>● Normal</span>&nbsp;&nbsp;
            <span style={{ color: '#ef4444' }}>● Anomaly</span>
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <XAxis dataKey="x" name="Claim Freq" tick={{ fontSize: '0.7rem', fill: 'var(--text-4)' }} axisLine={false} tickLine={false} label={{ value: 'Claim Frequency', position: 'insideBottom', offset: -2, fill: 'var(--text-3)', fontSize: 11 }} />
              <YAxis dataKey="y" name="Risk Score" tick={{ fontSize: '0.7rem', fill: 'var(--text-4)' }} axisLine={false} tickLine={false} label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: 'var(--text-3)', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: 'var(--text-3)' }} />
              <Scatter data={allPoints} isAnimationActive={false}>
                {allPoints.map((p, i) => <Cell key={i} fill={p.type === 'anomaly' ? '#ef4444' : '#6366f1'} fillOpacity={p.type === 'anomaly' ? 0.9 : 0.5} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Cards */}
      <p className="section-title">Active Fraud Alerts</p>
      {alerts.length > 0 ? (
        <AnimatedList
          items={alerts}
          className="al-flat"
          maxHeight={520}
          showGradients
          displayScrollbar
          enableArrowNavigation
          ariaLabel="Active fraud alerts"
          getItemKey={(alert) => alert._id}
          renderItem={(alert) => {
            const s = SEV_STYLE[alert.severity] || SEV_STYLE.medium;
            return (
              <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `conic-gradient(${s.color} ${alert.fraudScore * 3.6}deg, var(--border) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{alert.fraudScore}</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.95rem' }}>{alert.worker}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontFamily: 'monospace' }}>ID: {alert.workerId} · {alert.city}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>{alert.reason}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '4px', color: s.color, fontWeight: 700, letterSpacing: '0.05em' }}>{s.label}</span>
                    <span className="pill-indigo" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{alert.action}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.875rem' }}>
                  {alert.signals.map((sig, i) => (
                    <span key={i} className="chip">{sig}</span>
                  ))}
                </div>

                <button onClick={() => handleResolve(alert._id)} className="btn-outline" style={{ marginTop: '0.875rem' }}>
                  Mark Resolved
                </button>
              </div>
            );
          }}
        />
      ) : (
        <div className="glass" style={{ borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
          <p className="text-muted">No active fraud alerts</p>
        </div>
      )}
    </div>
  );
}
