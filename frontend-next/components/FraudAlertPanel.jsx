export default function FraudAlertPanel({ alerts = [] }) {
  return (
    <div className="space-y-2">
      {alerts.map(a => (
        <div key={a.id} className="p-3 rounded bg-yellow-50 dark:bg-yellow-800 text-yellow-800 dark:text-white">
          <div className="text-sm font-semibold">{a.title}</div>
          <div className="text-xs">{a.details}</div>
        </div>
      ))}
    </div>
  )
}
