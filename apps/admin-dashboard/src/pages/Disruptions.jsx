import { useState, useEffect } from 'react';
import { admin } from '../services/api';
import { MOCK_DISRUPTIONS } from '../services/mockData';
import AnimatedList from '../components/ui/AnimatedList';

const SEV_STYLE = {
  Critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#f87171', dot: '#ef4444' },
  High:     { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24', dot: '#f59e0b' },
  Medium:   { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', color: '#a5b4fc', dot: '#6366f1' },
  Low:      { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#34d399', dot: '#10b981' },
};

const IcoCloud = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);
const IcoThermo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
  </svg>
);
const IcoWind = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>
);
const IcoAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const TYPE_ICON = {
  Rain: <IcoCloud />,
  'Heat Wave': <IcoThermo />,
  'AQI Spike': <IcoWind />,
  'Cyclone Warning': <IcoAlert />,
};

export default function Disruptions() {
  const [events, setEvents] = useState(MOCK_DISRUPTIONS);

  useEffect(() => {
    admin.getDisruptions()
      .then(r => { if (r.data?.length) setEvents(r.data); })
      .catch(() => {});
  }, []);

  const totalAffected = events.reduce((s, e) => s + e.affectedWorkers, 0);
  const critical = events.filter(e => e.severity === 'Critical').length;

  const systemInsights = [
    'Rain threshold exceeded in 3 zones — automatic payout triggers activated for 1,240 workers',
    'Cyclone warning in Chennai — 2,100 workers eligible for emergency payout tier',
    'AQI 287 in Mumbai exceeds safe threshold — outdoor work advisory issued',
  ];

  return (
    <div>
      <p className="page-title">Disruption Intelligence</p>
      <p className="page-subtitle">Live weather & environmental events affecting worker safety</p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Active Events',    value: events.length,                                    color: '#6366f1' },
          { label: 'Critical Alerts',  value: critical,                                         color: '#ef4444' },
          { label: 'Workers Affected', value: totalAffected.toLocaleString(),                   color: '#f59e0b' },
          { label: 'Cities Impacted',  value: [...new Set(events.map(e => e.city))].length,     color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ borderRadius: '10px', padding: '1.25rem' }}>
            <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Insight Banner */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p className="section-title">System Insights</p>
        <AnimatedList
          items={systemInsights}
          maxHeight={190}
          showGradients
          enableArrowNavigation
          displayScrollbar
          ariaLabel="System insights"
        />
      </div>

      {/* Event Timeline */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
        <p className="section-title">Event Timeline</p>
        <div style={{ position: 'relative' }}>
          {events.map((event, i) => {
            const s = SEV_STYLE[event.severity] || SEV_STYLE.Low;
            return (
              <div key={event.id} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.dot, marginTop: '1.25rem', flexShrink: 0 }} />
                  {i < events.length - 1 && <div style={{ width: '1px', flex: 1, background: 'var(--border)', minHeight: '2rem' }} />}
                </div>
                <div style={{ flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: s.color }}>{TYPE_ICON[event.type] || <IcoAlert />}</span>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>{event.type} — {event.city}</p>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>{event.timestamp}</p>
                      </div>
                    </div>
                    <span style={{ padding: '0.2rem 0.75rem', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '20px', fontSize: '0.7rem', color: s.color, fontWeight: 600 }}>
                      {event.severity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                      { k: 'THRESHOLD', v: event.threshold, c: 'var(--text-3)' },
                      { k: 'ACTUAL', v: event.actual, c: s.color },
                      { k: 'WORKERS AFFECTED', v: event.affectedWorkers.toLocaleString(), c: 'var(--text-1)' },
                      { k: 'EVENT ID', v: event.id, c: '#6366f1' },
                    ].map(({ k, v, c }) => (
                      <div key={k}>
                        <p className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>{k}</p>
                        <p style={{ fontSize: '0.875rem', color: c, fontWeight: 600, fontFamily: k === 'EVENT ID' ? 'monospace' : 'inherit' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
