import { useState } from 'react'
import { registerWorker } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [form,setForm]=useState({name:'',platform:'Swiggy',city:'',zone:'',vehicle:'',avgOrders:''})
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()

  const submit = async ()=>{
    setLoading(true)
    try{
      await registerWorker(form)
      navigate('/risk')
    }catch(e){ alert('Failed') }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <h2 className="large">Register</h2>
      <input className="input p-3 w-full rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} className="input p-3 w-full rounded">
        <option>Swiggy</option>
        <option>Zomato</option>
        <option>Dunzo</option>
      </select>
      <input placeholder="City" className="input p-3 w-full rounded" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
      <input placeholder="Zone" className="input p-3 w-full rounded" value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})} />
      <input placeholder="Vehicle" className="input p-3 w-full rounded" value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} />
      <input placeholder="Avg orders/day" className="input p-3 w-full rounded" value={form.avgOrders} onChange={e=>setForm({...form,avgOrders:e.target.value})} />
      <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading? 'Registering...':'Submit'}</button>
    </div>
  )
}
