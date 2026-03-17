import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPlans, selectPlan } from '../services/api'
import PlanCard from '../components/PlanCard'
import Loading from '../components/Loading'

export default function PlanSelection(){
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [err, setErr] = useState(null)
  const [selecting, setSelecting] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    async function load(){
      setErr(null)
      try{
        const res = await getPlans()
        setPlans(res.data)
      }catch(e){ setErr('Failed to load plans') }
      setLoadingPlans(false)
    }
    load()
  },[])

  async function onSelect(plan){
    const stored = JSON.parse(localStorage.getItem('devtrails_user') || 'null')
    if(!stored){ navigate('/') ; return }
    setSelecting(true)
    try{
      const res = await selectPlan({ userId: stored.id, planId: plan.id })
      localStorage.setItem('devtrails_user', JSON.stringify(res.data))
      navigate('/dashboard')
    }catch(e){ setErr('Failed to select plan') }
    setSelecting(false)
  }

  if(loadingPlans) return <Loading text="Loading tailored plans…" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">Choose your protection</h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Pick a plan that matches how often you are on the road. Payouts are triggered automatically when heavy rain hits your city.
        </p>
      </div>

      {err && <div className="text-sm text-rose-400 bg-rose-950/40 border border-rose-500/40 px-3 py-2 rounded-lg max-w-md">{err}</div>}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {plans.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <PlanCard plan={p} onSelect={onSelect} loading={selecting} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
