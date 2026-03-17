import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getUser, triggerRain, fetchWeatherByCity, fetchWeatherByCoords } from '../services/api'
import PayoutHistory from '../components/PayoutHistory'
import Loading from '../components/Loading'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [message, setMessage] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherErr, setWeatherErr] = useState(null)
  const [geo, setGeo] = useState({ lat: null, lon: null })
  const [geoErr, setGeoErr] = useState(null)
  const [autoClaimed, setAutoClaimed] = useState(false)

  async function load() {
    setErr(null)
    const stored = JSON.parse(localStorage.getItem('devtrails_user') || 'null')
    if (!stored) { setErr('No user found. Please register.'); setLoading(false); return }
    try {
      const res = await getUser(stored.id)
      setUser(res.data)
      localStorage.setItem('devtrails_user', JSON.stringify(res.data))
      // kick off weather fetch using user city
      fetchWeather(res.data.city)
    } catch (e) { setErr('Failed to load user') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGeoErr('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setGeo({ lat: latitude, lon: longitude })
        fetchWeatherByLocation({ lat: latitude, lon: longitude })
      },
      (err) => {
        setGeoErr(err.message || 'Unable to get location')
        // fallback to user city
        if (user?.city) fetchWeather(user.city)
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 }
    )
  }, [user?.city])

  async function fetchWeather(city) {
    if (!city) return
    try {
      setWeatherErr(null)
      const data = await fetchWeatherByCity(city)
      setWeather({
        city: data.name,
        temp: Math.round(data.main.temp),
        feels: Math.round(data.main.feels_like),
        desc: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
        main: data.weather?.[0]?.main,
      })
      checkWeatherForClaims({
        temp: data.main.temp,
        main: data.weather?.[0]?.main,
        desc: data.weather?.[0]?.description,
      })
    } catch (e) {
      setWeatherErr(e.message || 'Weather unavailable')
    }
  }

  async function fetchWeatherByLocation({ lat, lon }) {
    if (lat == null || lon == null) return
    try {
      setWeatherErr(null)
      const data = await fetchWeatherByCoords(lat, lon)
      setWeather({
        city: data.name,
        temp: Math.round(data.main.temp),
        feels: Math.round(data.main.feels_like),
        desc: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
        main: data.weather?.[0]?.main,
      })
      checkWeatherForClaims({
        temp: data.main.temp,
        main: data.weather?.[0]?.main,
        desc: data.weather?.[0]?.description,
      })
    } catch (e) {
      setWeatherErr(e.message || 'Weather unavailable')
    }
  }

  function isSevereWeather({ temp, main, desc }) {
    const hot = temp >= 38
    const rainy = /rain|storm|thunder/i.test(desc || '') || /Rain|Thunderstorm|Drizzle/i.test(main || '')
    return hot || rainy
  }

  async function checkWeatherForClaims(payload) {
    if (!user || autoClaimed) return
    if (!isSevereWeather(payload)) return
    try {
      setAutoClaimed(true)
      const res = await triggerRain(user.id)
      setUser(res.data.user)
      localStorage.setItem('devtrails_user', JSON.stringify(res.data.user))
      setMessage(res.data.message || 'Automatic claim initiated due to severe weather')
    } catch (e) {
      setMessage('Attempted auto-claim but failed to submit')
    }
  }

  async function handleRain() {
    if (!user) return
    setTriggering(true)
    setMessage(null)
    try {
      const res = await triggerRain(user.id)
      setUser(res.data.user)
      localStorage.setItem('devtrails_user', JSON.stringify(res.data.user))
      setMessage(res.data.message)
    } catch (e) { setErr('Failed to trigger rain') }
    setTriggering(false)
  }

  if (loading) return <Loading />

  if (err) return <div className="max-w-md mx-auto mt-8 text-red-600">{err}</div>

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.1 }
        }
      }}
      className="space-y-6"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">Hi {user.name}, you are covered</h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Track your policy, simulate heavy rain, and view automatic payouts for past weather events.
        </p>
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
        className="card-glass p-4 md:p-5 border border-slate-700/70 flex items-center justify-between"
      >
        <div>
          <div className="text-xs text-slate-400">
            Weather where you are {weather?.city ? `(${weather.city})` : ''}
          </div>
          {weather ? (
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-sky-300">{weather.temp}°C</div>
              <div className="text-sm text-slate-300">Feels {weather.feels}°C · {weather.desc}</div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">{weatherErr || geoErr || 'Getting your location...'}</div>
          )}
          {geo.lat && geo.lon && (
            <div className="text-xs text-slate-500 mt-1">lat {geo.lat.toFixed(3)}, lon {geo.lon.toFixed(3)}</div>
          )}
        </div>
        {weather?.icon && (
          <img
            alt={weather.desc || 'weather'}
            className="w-12 h-12"
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          />
        )}
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
        className="card-glass p-4 md:p-6 flex justify-between items-center border border-slate-700/70"
      >
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
            className={`font-semibold ${user.policyStatus === 'ACTIVE' ? 'text-emerald-300' : 'text-slate-400'
              }`}
          >
            {user.policyStatus}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="card-glass p-4 md:p-6 border border-slate-700/70"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total payout received</div>
              <div className="text-2xl font-bold text-emerald-300">₹{user.totalPayout || 0}</div>
              <div className="text-xs text-slate-500 mt-2">Auto-claim triggers</div>
              <div className="text-sm text-slate-200">Rain storms or temp ≥ 38°C</div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Plan: {user.plan || 'Not selected'}</div>
              <div>Premium: ₹{user.weeklyPremium || 0} / week</div>
            </div>
          </div>

          {message && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-emerald-900/40 border border-emerald-500/40 text-sm text-emerald-100">
              {message}
            </div>
          )}
        </motion.div>

        <motion.div
          className="card-glass p-4 md:p-6 border border-slate-700/70"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        >
          <h3 className="font-semibold mb-3 text-slate-50">Payout history</h3>
          <PayoutHistory history={user.payoutHistory} />
        </motion.div>
      </div>
    </motion.div>
  )
}
