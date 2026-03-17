import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getUser, triggerRain } from '../services/api'
import PayoutHistory from '../components/PayoutHistory'
import Loading from '../components/Loading'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [message, setMessage] = useState(null)

  async function load(){
    setErr(null)
    const stored = JSON.parse(localStorage.getItem('devtrails_user') || 'null')
    if(!stored){ setErr('No user found. Please register.'); setLoading(false); return }
    try{
      const res = await getUser(stored.id)
      setUser(res.data)
      localStorage.setItem('devtrails_user', JSON.stringify(res.data))
    }catch(e){ setErr('Failed to load user') }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  async function handleRain(){
    if(!user) return
    setTriggering(true)
    setMessage(null)
    try{
      const res = await triggerRain(user.id)
      setUser(res.data.user)
      localStorage.setItem('devtrails_user', JSON.stringify(res.data.user))
      setMessage(res.data.message)
    }catch(e){ setErr('Failed to trigger rain') }
    setTriggering(false)
  }

  if(loading) return <Loading />

  if(err) return <div className="max-w-md mx-auto mt-8 text-red-600">{err}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">Hi {user.name}, you are covered</h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Track your policy, simulate heavy rain, and view automatic payouts for past weather events.
        </p>
      </div>

      <div className="card-glass p-6 flex justify-between items-center border border-slate-700/70">
        <div>
          <div className="text-xs text-slate-400">Name</div>
          <div className="font-semibold text-lg text-slate-50">{user.name}</div>
          <div className="text-xs text-slate-500 mt-3">City</div>
          <div className="font-medium text-slate-100">{user.city}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Selected plan</div>
          <div className="font-semibold text-sky-300">{user.plan || '—'}</div>
          <div className="text-xs text-slate-500 mt-3">Weekly premium</div>
          <div className="font-medium text-slate-100">₹{user.weeklyPremium || 0}</div>
          <div className="text-xs text-slate-500 mt-3">Policy status</div>
          <div
            className={`font-semibold ${
              user.policyStatus === 'ACTIVE' ? 'text-emerald-300' : 'text-slate-400'
            }`}
          >
            {user.policyStatus}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="card-glass p-6 border border-slate-700/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total payout received</div>
              <div className="text-2xl font-bold text-emerald-300">₹{user.totalPayout || 0}</div>
            </div>
            <div>
              <button
                onClick={handleRain}
                disabled={triggering}
                className="btn-primary px-4 py-2 disabled:opacity-70"
              >
                <span>{triggering ? 'Simulating weather…' : 'Simulate rain 🌧️'}</span>
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-sm text-emerald-100">
              {message}
            </div>
          )}
        </motion.div>

        <motion.div
          className="card-glass p-6 border border-slate-700/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold mb-3 text-slate-50">Payout history</h3>
          <PayoutHistory history={user.payoutHistory} />
        </motion.div>
      </div>
    </motion.div>
  )
}
