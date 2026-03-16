import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function EarningsChart({ data=[] }){
  const chartData = data.length ? data : [ { week:'W1', income:1200, payouts:200 }, { week:'W2', income:1500, payouts:300 } ]
  return (
    <div className="card">
      <div className="muted">Weekly income</div>
      <div style={{ width:'100%', height:180 }} className="mt-2">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line dataKey="income" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            <Line dataKey="payouts" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
