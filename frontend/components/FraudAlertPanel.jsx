export default function FraudAlertPanel(){
  const alerts = [ {id:1, desc:'Multiple claims same device', severity: 'High'}, {id:2, desc:'Unusual payout pattern', severity:'Medium'}]
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-3">
      <div className="text-sm text-gray-500">Fraud Alerts</div>
      <ul className="mt-2 space-y-2">
        {alerts.map(a=> (
          <li key={a.id} className="p-2 rounded border border-gray-100 dark:border-gray-700 flex justify-between">
            <div className="text-sm">{a.desc}</div>
            <div className={`text-xs font-medium ${a.severity==='High'? 'text-red-600':'text-yellow-600'}`}>{a.severity}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
