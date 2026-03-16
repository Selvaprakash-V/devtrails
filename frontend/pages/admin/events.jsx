import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Events(){
  const [events,setEvents] = useState([])
  useEffect(()=>{axios.get('/api/admin/events').then(r=>setEvents(r.data))},[])
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Event Monitor</h2>
      <ul className="space-y-2">
        {events.map(e=> (
          <li key={e.id} className="p-3 bg-white dark:bg-gray-800 rounded flex justify-between">
            <div>
              <div className="font-medium">{e.type}</div>
              <div className="text-sm text-gray-500">{e.zone}</div>
            </div>
            <div className="text-sm">{e.count} events</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
