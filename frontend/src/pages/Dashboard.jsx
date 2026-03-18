import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getUser, triggerRain, fetchWeatherByCity, fetchWeatherByCoords, fetchForecastByCoords, fetchForecastByCity, computeWeeklyEarnings, payWeeklyEarnings } from '../services/api'
import PayoutHistory from '../components/PayoutHistory'
import Loading from '../components/Loading'
import CurrentWeather from '../components/CurrentWeather'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [triggering, setTriggering] = useState(false)
  const [message, setMessage] = useState(null)
  const [weather, setWeather] = useState(null)
  const [weatherErr, setWeatherErr] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [riskScore, setRiskScore] = useState(null)
  const [geo, setGeo] = useState({ lat: null, lon: null })
  const [geoErr, setGeoErr] = useState(null)
  const [autoClaimed, setAutoClaimed] = useState(false)
  const [weeklyEarnings, setWeeklyEarnings] = useState(0)
  const [lastWeekPaid, setLastWeekPaid] = useState(null)

  async function load() {
    setErr(null)
    const stored = JSON.parse(localStorage.getItem('devtrails_user') || 'null')
    if (!stored) {
      // Allow dashboard (and weather) to render even if the
      // demo registration flow hasn't been completed yet.
      // Use a lightweight fallback profile instead of blocking.
      let fallbackName = 'Rider'
      try {
        const onboardingRaw = localStorage.getItem('devtrails_onboarding')
        if (onboardingRaw) {
          const onboarding = JSON.parse(onboardingRaw)
          fallbackName =
            (onboarding.profile && onboarding.profile.fullName) ||
            onboarding.phone ||
            'Rider'
        }
      } catch (e) {
        // ignore parsing errors, keep default name
      }
      setUser({
        id: null,
        name: fallbackName,
        city: '',
        plan: null,
        weeklyPremium: 0,
        policyStatus: 'INACTIVE',
        totalPayout: 0,
        payoutHistory: [],
      })
      setLoading(false)
      return
    }
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
    if (user) loadWeeklyEarnings(user.id)
  }, [user?.id])

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
      // fetch forecast and compute risk
      try {
        const fc = await fetchForecastByCoords(lat, lon)
        setForecast(fc)
        setRiskScore(computeRiskFromForecast(fc, data))
      } catch (e) {
        // ignore
      }
      // fetch forecast and compute risk
      try {
        const fc = await fetchForecastByCity(data.name)
        setForecast(fc)
        setRiskScore(computeRiskFromForecast(fc, data))
      } catch (e) {
        // ignore forecast errors
      }
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

  function startOfWeek(date = new Date()) {
    const d = new Date(date)
    const day = (d.getDay() + 6) % 7 // Monday = 0
    d.setHours(0,0,0,0)
    d.setDate(d.getDate() - day)
    return d
  }

  function computeRiskFromForecast(forecastData, current) {
    if (!forecastData || !forecastData.list) return 0
    const slots = forecastData.list.slice(0, 8)
    const rainSlots = slots.filter(s => {
      const desc = (s.weather && s.weather[0] && s.weather[0].description) || ''
      const hasRain = /rain|storm|drizzle|thunder/i.test(desc)
      const hasRainVal = s.rain && (s.rain['3h'] || s.rain['1h'])
      return hasRain || Boolean(hasRainVal)
    }).length
    const rainFactor = (rainSlots / slots.length) * 60
    const temp = current?.main?.temp || (slots[0] && slots[0].main && slots[0].main.temp) || 0
    const tempFactor = temp >= 38 ? 20 : temp >= 32 ? 8 : 0
    const base = 10
    let score = Math.round(Math.min(100, base + rainFactor + tempFactor))
    return score
  }

  async function loadWeeklyEarnings(uid) {
    try {
      const res = await computeWeeklyEarnings(uid)
      setWeeklyEarnings(res.data.earnings || 0)
      setLastWeekPaid(res.data.since)
    } catch (e) {
      // ignore
    }
  }

  async function handleMarkWeekPaid() {
    if (!user) return
    try {
      const res = await payWeeklyEarnings(user.id)
      setUser(res.data.user)
      setWeeklyEarnings(0)
      setLastWeekPaid(res.data.user.lastWeekPaid)
    } catch (e) {
      // ignore
    }
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
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)]">Hi {user.name}, you are covered</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-xl">
          Track your policy, weather-linked payouts, and active protection.
        </p>
        {weather && (
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Current location: {weather.city}
            {geo.lat != null && geo.lon != null && (
              <span> (lat {geo.lat.toFixed(3)}, lon {geo.lon.toFixed(3)})</span>
            )}
            {' · '}Weather: {weather.desc || weather.main} ({weather.temp}°C, feels {weather.feels}°C)
          </p>
        )}
        {weatherErr && !weather && (
          <p className="text-xs text-[var(--accent)] mt-1">{weatherErr}</p>
        )}
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="card-glass p-4 md:p-6 border border-[var(--border)]"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-stretch justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--text-muted)]">Risk analysis</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="text-2xl font-bold text-[var(--accent)]">{riskScore ?? '—'}</div>
              <div className="w-full">
                <div className="w-full bg-[var(--bg-muted)] rounded-full h-2">
                  <div className="bg-[var(--accent)] h-2 rounded-full" style={{ width: `${riskScore || 0}%` }} />
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Estimated chance of weather affecting your work in next 24h</div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[220px]">
            <CurrentWeather />
          </div>

          <div className="text-right lg:ml-4">
            <div className="text-xs text-[var(--text-muted)]">Weekly earnings</div>
            <div className="text-2xl font-semibold text-[var(--accent)]">₹{weeklyEarnings}</div>
            <div className="text-xs text-[var(--text-muted)]">Since {new Date(lastWeekPaid || startOfWeek()).toLocaleDateString()}</div>
            <div className="mt-3">
              <button onClick={handleMarkWeekPaid} className="btn-primary px-3 py-2">Mark week paid</button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
        className="card-glass p-4 md:p-6 flex justify-between items-center border border-[var(--border)]"
      >
        <div>
          <div className="text-xs text-[var(--text-muted)]">Name</div>
          <div className="font-semibold text-lg text-[var(--text)]">{user.name}</div>
          <div className="text-xs text-[var(--text-muted)] mt-3">City</div>
          <div className="font-medium text-[var(--text)]">{user.city}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--text-muted)]">Selected plan</div>
          <div className="font-semibold text-[var(--accent)]">{user.plan || '—'}</div>
          <div className="text-xs text-[var(--text-muted)] mt-3">Weekly premium</div>
          <div className="font-medium text-[var(--text)]">₹{user.weeklyPremium || 0}</div>
          <div className="text-xs text-[var(--text-muted)] mt-3">Policy status</div>
          <div
            className={`font-semibold ${user.policyStatus === 'ACTIVE' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              }`}
          >
            {user.policyStatus}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          className="card-glass p-4 md:p-6 border border-[var(--border)]"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[var(--text-muted)]">Total payout received</div>
              <div className="text-2xl font-bold text-[var(--accent)]">₹{user.totalPayout || 0}</div>
              <div className="text-xs text-[var(--text-muted)] mt-2">Auto-claim triggers</div>
              <div className="text-sm text-[var(--text)]">Rain storms or temp ≥ 38°C</div>
            </div>
            <div className="text-right text-xs text-[var(--text-muted)]">
              <div>Plan: {user.plan || 'Not selected'}</div>
              <div>Premium: ₹{user.weeklyPremium || 0} / week</div>
            </div>
          </div>

          {message && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-sm text-[var(--accent)]">
              {message}
            </div>
          )}
        </motion.div>

        <motion.div
          className="card-glass p-4 md:p-6 border border-[var(--border)]"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        >
          <h3 className="font-semibold mb-3 text-[var(--text)]">Payout history</h3>
          <PayoutHistory history={user.payoutHistory} />
        </motion.div>
      </div>
    </motion.div>
  )
}
