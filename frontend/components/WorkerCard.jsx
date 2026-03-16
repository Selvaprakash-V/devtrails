export default function WorkerCard({ worker }){
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded shadow flex items-center justify-between">
      <div>
        <div className="font-medium">{worker.name}</div>
        <div className="text-sm text-gray-500">{worker.platform} • {worker.zone}</div>
      </div>
      <div className="text-right">
        <div className="text-sm">{worker.policyStatus}</div>
        <div className="text-xs text-gray-500">Next: {worker.nextPremium}</div>
      </div>
    </div>
  )
}
