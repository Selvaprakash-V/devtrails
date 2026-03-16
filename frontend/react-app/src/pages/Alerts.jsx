import { useEffect, useState } from 'react'
import { getActiveEvents } from '../services/api'
import AlertCard from '../components/AlertCard'

export default function Alerts(){
  const [events,setEvents]=useState([])
  useEffect(()=>{ getActiveEvents().then(r=>setEvents(r)) },[])
  return (
    <div className="space-y-3">
      <h2 className="large">Active Alerts</h2>
      {events.map(e=> <AlertCard key={e.id} event={e} />)}
    </div>
  )
}
