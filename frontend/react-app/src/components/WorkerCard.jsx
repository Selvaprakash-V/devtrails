export default function WorkerCard({ worker }){
  return (
    <div className="card flex justify-between items-center">
      <div>
        <div className="font-medium">{worker.name}</div>
        <div className="muted">{worker.platform} • {worker.zone}</div>
      </div>
      <div className="text-right">
        <div className="text-sm">{worker.policyStatus}</div>
        <div className="muted">Next {worker.nextPremium}</div>
      </div>
    </div>
  )
}
