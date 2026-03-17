import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchForecastByCoords, fetchForecastByCity } from '../services/api'
import Loading from '../components/Loading'

export default function Forecast() {
  const [forecast, setForecast] = useState([])
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setErr('Geolocation not supported; using city fallback (Chennai)')
      loadByCity('Chennai')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadByCoords(pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        setErr('Location denied; using city fallback (Chennai)')
        loadByCity('Chennai')
      },
      { timeout: 7000, maximumAge: 300000 }
    )
  }, [])

  async function loadByCoords(lat, lon) {
    try {
      setErr(null)
      const data = await fetchForecastByCoords(lat, lon)
      setForecast(normalize(data))
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadByCity(city) {
    try {
      const data = await fetchForecastByCity(city)
      setForecast(normalize(data))
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  function normalize(data) {
    if (!data?.list) return []
    // Grab next 5 timeblocks (3h each)
    return data.list.slice(0, 5).map((slot) => ({
      dt: slot.dt_txt,
      temp: Math.round(slot.main.temp),
      feels: Math.round(slot.main.feels_like),
      desc: slot.weather?.[0]?.description,
      icon: slot.weather?.[0]?.icon,
    }))
  }

  if (loading) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-3xl mx-auto space-y-4"
    >
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Forecast</h1>
        <p className="text-sm text-[var(--text-muted)]">Next few hours in your area.</p>
        {err && <p className="text-xs text-[var(--accent)] mt-1">{err}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {forecast.map((slot) => (
          <div key={slot.dt} className="card-glass border border-[var(--border)] p-3 flex items-center gap-3">
            {slot.icon && (
              <img
                alt={slot.desc}
                className="w-12 h-12"
                src={`https://openweathermap.org/img/wn/${slot.icon}@2x.png`}
              />
            )}
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">{slot.temp}°C</div>
              <div className="text-xs text-[var(--text-muted)]">Feels {slot.feels}°C · {slot.desc}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{slot.dt}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
