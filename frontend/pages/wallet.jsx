import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Wallet(){
  const [data,setData] = useState(null)
  useEffect(()=>{axios.get('/api/wallet').then(r=>setData(r.data))},[])
  if(!data) return <div className="loading">Loading...</div>
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Wallet</h2>
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <div className="text-sm text-gray-500">Total earnings</div>
        <div className="text-2xl font-bold">₹{data.totalEarnings}</div>
        <div className="mt-3 text-sm text-gray-500">Total payouts</div>
        <div className="text-lg">₹{data.totalPayouts}</div>
      </div>
      <div>
        <h3 className="font-medium">Recent</h3>
        <ul className="space-y-2 mt-2">
          {data.transactions.map(t=> (
            <li key={t.id} className="p-3 bg-white dark:bg-gray-800 rounded flex justify-between">
              <div>
                <div className="text-sm">{t.desc}</div>
                <div className="text-xs text-gray-500">{t.date}</div>
              </div>
              <div className="font-medium">₹{t.amount}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
