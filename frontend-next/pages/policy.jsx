import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import RiskScoreCard from '../components/RiskScoreCard'

export default function Policy(){
  const [policy, setPolicy] = useState({ score:62, premium:28, coverage:350, types:['Rain','Accident'] })
  const [loading, setLoading] = useState(false)
  const activate = async ()=>{
    setLoading(true)
    const res = await fetch('/api/policy/activate',{method:'POST'})
    const j = await res.json()
    setLoading(false)
    if (j.success) alert('Policy activated')
  }
  return (
    <div>
      <Navbar />
      <h2 className="text-xl font-bold mb-2">Policy Activation</h2>
      <RiskScoreCard score={policy.score} premium={policy.premium} coverage={policy.coverage} />
      <div className="mt-3 space-y-2">
        {policy.types.map(t=> <div key={t} className="text-sm text-gray-600">● {t}</div>)}
      </div>
      <div className="mt-4">
        <button className="btn" onClick={activate} disabled={loading}>{loading? 'Activating...':'Activate Policy'}</button>
      </div>
    </div>
  )
}
