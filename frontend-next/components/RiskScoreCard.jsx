export default function RiskScoreCard({ score, premium, coverage }) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">Risk Score</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Premium</div>
          <div className="font-semibold">₹{premium}/week</div>
          <div className="text-xs text-gray-500 mt-1">Coverage ₹{coverage}</div>
        </div>
      </div>
    </div>
  )
}
