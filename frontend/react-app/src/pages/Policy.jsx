import { useState } from 'react'
import { activatePolicy } from '../services/api'

export default function Policy(){
  const [loading,setLoading]=useState(false)
  const data = { coverage:350, premium:28, start:'2026-03-16' }
  const activate = async ()=>{ setLoading(true); await activatePolicy(); setLoading(false); alert('Activated (mock)') }
  return (
    <div className="space-y-3">
      <h2 className="large">Policy</h2>
      <div className="card">
        <div className="muted">Coverage</div>
        <div className="text-xl font-bold">₹{data.coverage}</div>
        <div className="muted">Premium</div>
        <div>₹{data.premium}/week</div>
        <div className="muted mt-2">Start</div>
        <div>{data.start}</div>
      </div>
      <button className="btn btn-primary" onClick={activate} disabled={loading}>{loading? 'Activating...':'Activate'}</button>
    </div>
  )
}
