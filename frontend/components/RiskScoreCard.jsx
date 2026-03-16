export default function RiskScoreCard({ risk, premium, coverage, types=[] }){
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Risk Score</div>
          <div className="text-3xl font-bold">{risk}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Premium</div>
          <div className="font-bold">₹{premium}/week</div>
          <div className="text-sm text-gray-500">Coverage</div>
          <div>₹{coverage}</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">{types.join(' • ')}</div>
    </div>
  )
}
