import { useNavigate } from 'react-router-dom'

export default function RiskResult(){
  const navigate = useNavigate()
  const risk = 63, premium = 28
  return (
    <div className="space-y-4">
      <h2 className="large">Risk Score</h2>
      <div className="card">
        <div className="text-4xl font-bold">{risk}</div>
        <div className="muted">Weekly Premium ₹{premium}</div>
      </div>
      <button className="btn btn-primary" onClick={()=>navigate('/policy')}>Activate Policy</button>
    </div>
  )
}
