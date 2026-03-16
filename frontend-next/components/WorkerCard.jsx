export default function WorkerCard({ worker }) {
  return (
    <div className="p-3 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{worker.name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">{worker.platform} • {worker.vehicle}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{worker.city}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Zone {worker.zone}</div>
        </div>
      </div>
    </div>
  )
}
