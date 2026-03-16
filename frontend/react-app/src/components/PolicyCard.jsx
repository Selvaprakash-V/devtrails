export default function PolicyCard({ policy }){
  return (
    <div className="card">
      <div className="muted">Coverage</div>
      <div className="text-xl font-bold">₹{policy.coverage}</div>
      <div className="muted">Premium</div>
      <div>₹{policy.premium}/week</div>
    </div>
  )
}
