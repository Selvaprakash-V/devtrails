import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Register(){
  const [form, setForm] = useState({ name:'', platform:'Swiggy', city:'', zone:'', vehicle:'Bike', orders:10 })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const submit = async (e)=>{
    e.preventDefault(); setLoading(true); setMsg('')
    try{
      const res = await fetch('/api/workers/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(form)})
      const j = await res.json()
      setMsg(j.message || 'Registered')
    }catch(err){ setMsg('Error') }
    setLoading(false)
  }
  return (
    <div>
      <Navbar />
      <h2 className="text-xl font-bold mb-2">Worker Onboarding</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <select className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}>
          <option>Swiggy</option>
          <option>Zomato</option>
          <option>Dunzo</option>
        </select>
        <input className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
        <input className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800" placeholder="Delivery Zone" value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})} />
        <input className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800" placeholder="Vehicle Type" value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} />
        <input type="number" className="w-full p-3 rounded bg-gray-50 dark:bg-gray-800" placeholder="Avg orders/day" value={form.orders} onChange={e=>setForm({...form,orders:parseInt(e.target.value||0)})} />
        <button className="btn" disabled={loading}>{loading? 'Registering...':'Register Worker'}</button>
        {msg && <div className="text-sm text-gray-600">{msg}</div>}
      </form>
    </div>
  )
}
