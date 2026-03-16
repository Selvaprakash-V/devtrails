export default function RiskScoreCard({ risk, premium }){
  return (
    <div className="card">
      <div className="text-sm muted">Risk Score</div>
      <div className="text-3xl font-bold">{risk}</div>
      <div className="muted">Weekly Premium ₹{premium}</div>
    </div>
  )
}
