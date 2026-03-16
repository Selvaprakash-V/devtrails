export default function ClaimCard({ claim }){
  return (
    <div className="card flex justify-between items-center">
      <div>
        <div className="font-medium">{claim.event}</div>
        <div className="muted">{claim.date}</div>
      </div>
      <div className="text-right">
        <div>₹{claim.payout}</div>
        <div className="muted">{claim.status}</div>
      </div>
    </div>
  )
}
