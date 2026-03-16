import axios from 'axios'
import RiskScoreCard from '../components/RiskScoreCard'
import { useState } from 'react'

export default function Policy() {
  const [data] = useState({ risk: 62, premium: 28, coverage: 350, types: ['Weather disruption', 'Vehicle breakdown'] })
  const [loading,setLoading] = useState(false)
  const [msg,setMsg] = useState(null)

  const activate = async () => {
    setLoading(true); setMsg(null)
    try {
      const res = await axios.post('/api/policy/activate', { workerId: 'demo' })
      setMsg({ ok: true, text: res.data.message })
    } catch (e) {
      setMsg({ ok: false, text: 'Activation failed' })
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Policy Activation</h2>
      <RiskScoreCard risk={data.risk} premium={data.premium} coverage={data.coverage} types={data.types} />
      <button className="btn-primary w-full" onClick={activate} disabled={loading}>{loading? 'Activating...' : 'Activate Policy'}</button>
      {msg && <div className={`p-3 rounded ${msg.ok? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{msg.text}</div>}
    </div>
  )
}
