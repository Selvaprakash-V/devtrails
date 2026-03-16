import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', platform: 'Swiggy', city: '', zone: '', vehicle: '', avgOrders: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const submit = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const res = await axios.post('/api/workers/register', form)
      setMsg({ ok: true, text: res.data.message })
      setForm({ name: '', platform: 'Swiggy', city: '', zone: '', vehicle: '', avgOrders: '' })
    } catch (e) {
      setMsg({ ok: false, text: e?.response?.data?.error || 'Registration failed' })
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Worker Onboarding</h1>
      <div className="space-y-2">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="input" />
        <select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} className="input">
          <option>Swiggy</option>
          <option>Zomato</option>
          <option>Dunzo</option>
        </select>
        <input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="City" className="input" />
        <input value={form.zone} onChange={e=>setForm({...form,zone:e.target.value})} placeholder="Delivery zone" className="input" />
        <input value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} placeholder="Vehicle type" className="input" />
        <input value={form.avgOrders} onChange={e=>setForm({...form,avgOrders:e.target.value})} placeholder="Avg orders/day" className="input" />
      </div>
      <button onClick={submit} className="btn-primary w-full" disabled={loading}>{loading? 'Registering...' : 'Register Worker'}</button>
      {msg && <div className={`p-3 rounded ${msg.ok? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{msg.text}</div>}
    </div>
  )
}
