import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('Chennai')
  const [platform, setPlatform] = useState('Swiggy')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await register({ name, city, platform })
      // store in localStorage for demo
      localStorage.setItem('devtrails_user', JSON.stringify(res.data))
      navigate('/plans')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.05, delayChildren: 0.1 }
        }
      }}
      className="max-w-md mx-auto w-full"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mb-5">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50 mb-1">Get covered in minutes</h2>
        <p className="text-sm text-slate-400">
          Tell us where you ride and we will set up a smart policy that pays out when heavy rain slows you down.
        </p>
      </motion.div>
      <motion.form
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        onSubmit={handleSubmit}
        className="space-y-4 card-glass p-4 md:p-6 border border-slate-700/70 shadow-glow"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
          <label className="block text-xs font-medium mb-1 text-slate-300">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
          <label className="block text-xs font-medium mb-1 text-slate-300">City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            <option>Chennai</option>
            <option>Bangalore</option>
            <option>Delhi</option>
            <option>Coimbatore</option>
          </select>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
          <label className="block text-xs font-medium mb-1 text-slate-300">Platform</label>
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
          >
            <option>Swiggy</option>
            <option>Zomato</option>
            <option>Blinkit</option>
          </select>
        </motion.div>

        {error && (
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-xs text-rose-300 bg-rose-950/50 border border-rose-500/40 px-3 py-2 rounded-lg">
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={!loading ? { scale: 0.96 } : {}}
          className="btn-primary w-full disabled:opacity-70 mt-2"
        >
          <span>{loading ? 'Setting things up…' : 'Start protection'}</span>
        </motion.button>
      </motion.form>
    </motion.div>
  )
}
