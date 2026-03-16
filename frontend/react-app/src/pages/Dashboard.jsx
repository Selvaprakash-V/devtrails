import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import EarningsChart from '../components/EarningsChart'
import WorkerCard from '../components/WorkerCard'

export default function Dashboard(){
  const [data,setData]=useState(null)
  useEffect(()=>{ getDashboard().then(r=>setData(r)) },[])
  if(!data) return <div className="muted">Loading...</div>
  return (
    <div className="space-y-4">
      <WorkerCard worker={data.worker} />
      <div className="grid grid-cols-1 gap-3">
        <EarningsChart data={data.earnings} />
        <div className="card">
          <div className="large">Disruptions</div>
          {data.disruptions.map(d=> <div key={d.id} className="p-2 border-t mt-2">{d.type} • Est ₹{d.payout}</div>)}
        </div>
      </div>
    </div>
  )
}
