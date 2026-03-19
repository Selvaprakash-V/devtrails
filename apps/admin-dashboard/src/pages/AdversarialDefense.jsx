import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, Cell } from 'recharts';
import { MOCK_ADVERSARIAL } from '../services/mockData';
import AnimatedList from '../components/ui/AnimatedList';

const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-2)' };
const chartStyle = { fontSize: '0.75rem', fill: 'var(--text-4)' };

const IcoLocation = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoMove = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="5 12 3 12 12 3 21 12 19 12"/><polyline points="5 12 3 12 12 21 21 12 19 12"/>
  </svg>
);
const IcoCluster = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IcoClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoBrain = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/>
  </svg>
);
const IcoGraph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IcoTrust = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoScale = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l9-3 9 3"/><path d="M3 18l9 3 9-3"/>
  </svg>
);

const STRATEGIES = [
  { num: '01', title: 'Multi-Signal Location Validation', Icon: IcoLocation, color: '#6366f1', desc: 'GPS + IP + historical movement. distance(GPS, IP) > threshold → suspicious', tag: 'Core Defense' },
  { num: '02', title: 'Movement Consistency Check',       Icon: IcoMove,     color: '#8b5cf6', desc: 'Speed > 120 km/h = impossible. Zero movement + active claim = fake. Instant location jump = spoof.', tag: 'Behavioral' },
  { num: '03', title: 'Cluster Detection',                Icon: IcoCluster,  color: '#ef4444', desc: '87 workers sharing identical GPS coordinates. Same timestamp + same behavior = fraud ring.', tag: 'Critical' },
  { num: '04', title: 'Temporal Pattern Analysis',        Icon: IcoClock,    color: '#f59e0b', desc: 'All claims triggered within 2–5 minute window = coordinated attack signature.', tag: 'Attack Detection' },
  { num: '05', title: 'Behavioral Profiling',             Icon: IcoBrain,    color: '#10b981', desc: 'Normal: moves, irregular claims. Fraud: static, repeated claims, same zone always.', tag: 'ML-Assisted' },
  { num: '06', title: 'Graph-Based Detection',            Icon: IcoGraph,    color: '#06b6d4', desc: 'Workers as nodes, similarity as edges. Dense cluster = fraud ring. Isolated = genuine.', tag: 'Advanced' },
  { num: '07', title: 'Progressive Trust System',         Icon: IcoTrust,    color: '#84cc16', desc: 'New worker → low trust. Consistent worker → high trust. Low trust + high risk → flag.', tag: 'Fairness' },
  { num: '08', title: 'Soft vs Hard Blocking',            Icon: IcoScale,    color: '#f97316', desc: "Don't block instantly. Reduce payout → mark for review → protect genuine workers.", tag: 'Fairness' },
];

export default function AdversarialDefense() {
  const { attackSummary, clusterData, fraudScoreHistogram, claimBursts } = MOCK_ADVERSARIAL;

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(79,70,229,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.25rem' }}>Adversarial Defense Panel</p>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Multi-signal defense system capable of detecting coordinated fraud rings</p>
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#ef4444', fontStyle: 'italic' }}>
            "We moved from single-point GPS validation to a multi-signal adversarial defense system capable of detecting coordinated fraud rings."
          </p>
        </div>
      </div>

      {/* Attack Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Suspected Attackers', value: attackSummary.totalSuspected,                              color: '#ef4444' },
          { label: 'Fraud Rings Detected', value: attackSummary.coordinatedRings,                           color: '#f59e0b' },
          { label: 'Blocked Payouts',      value: attackSummary.blockedPayouts,                             color: '#6366f1' },
          { label: 'Amount Saved',         value: `₹${(attackSummary.savedAmount / 1000).toFixed(0)}K`,    color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</p>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Fraud Score Distribution</p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>Workers by score range — right tail = attack zone</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fraudScoreHistogram} barSize={36}>
              <XAxis dataKey="range" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {fraudScoreHistogram.map((_, i) => <Cell key={i} fill={i >= 3 ? '#ef4444' : '#6366f1'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
          <p className="section-title">Claim Burst Detection</p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6366f1' }}>— Normal</span>&nbsp;&nbsp;
            <span style={{ color: '#ef4444' }}>— Burst (Attack)</span>
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={claimBursts}>
              <XAxis dataKey="time" tick={chartStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Threshold', fill: '#f59e0b', fontSize: 10 }} />
              <Area type="monotone" dataKey="normal" stroke="#6366f1" fill="rgba(99,102,241,0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="burst"  stroke="#ef4444" fill="rgba(239,68,68,0.15)"  strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fraud Clusters */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p className="section-title">Detected Fraud Clusters</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {clusterData.map(cluster => (
            <div key={cluster.id} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>Ring #{cluster.id} — {cluster.city}</p>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '4px', fontWeight: 600 }}>
                  Score: {cluster.riskScore}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.75rem' }}>{cluster.type}</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>WORKERS</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>{cluster.workers}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>COORDINATES</p>
                  <p className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '0.2rem' }}>{cluster.lat}°N, {cluster.lng}°E</p>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                <div style={{ width: `${cluster.riskScore}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Defense Strategy Matrix */}
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem' }}>
        <p className="section-title">Defense Strategy Matrix</p>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>
          System avoids penalizing genuine workers by using multiple signals, progressive trust scoring, and manual review for borderline cases.
        </p>
        <AnimatedList
          items={STRATEGIES}
          className="al-flat"
          maxHeight={520}
          showGradients
          displayScrollbar
          enableArrowNavigation
          ariaLabel="Defense strategy matrix"
          getItemKey={(item) => item.num}
          renderItem={(item) => (
            <div style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.color}18`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                <item.Icon />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>{item.title}</p>
                  <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: `${item.color}18`, color: item.color, borderRadius: '3px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.tag}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginTop: '0.25rem', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
