import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { week: 'W1', earnings: 1200, payouts: 200 },
  { week: 'W2', earnings: 1500, payouts: 300 },
  { week: 'W3', earnings: 1000, payouts: 150 },
  { week: 'W4', earnings: 1800, payouts: 400 },
]

export default function EarningsChart(){
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded shadow">
      <div className="text-sm text-gray-500">Weekly Earnings vs Payouts</div>
      <div style={{ width: '100%', height: 200 }} className="mt-2">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="payouts" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
