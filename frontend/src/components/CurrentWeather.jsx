import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import { fetchCurrentWeatherFromApi, fetchWeatherByCity } from '../services/api'

export default function CurrentWeather() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weather, setWeather] = useState(null)
  const [geo, setGeo] = useState({ lat: null, lon: null })

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      // Try browser geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          try {
            const { latitude, longitude } = pos.coords
            setGeo({ lat: latitude, lon: longitude })
            const data = await fetchCurrentWeatherFromApi(latitude, longitude)
            setWeather({
              city: data.city,
              temp: Math.round(data.temp),
              feels: Math.round(data.temp),
              desc: data.description,
              icon: null,
              main: data.weatherId,
            })
          } catch (e) {
            setError(e.message || 'Failed to fetch weather')
          } finally {
            setLoading(false)
          }
        }, async (err) => {
          // fallback to IP/city lookup if geolocation denied
          try {
            // try to fetch by a default city
            const data = await fetchWeatherByCity('Chennai')
            setWeather({
              city: data.name,
              temp: Math.round(data.main.temp),
              feels: Math.round(data.main.feels_like),
              desc: data.weather?.[0]?.description,
              icon: data.weather?.[0]?.icon,
              main: data.weather?.[0]?.main,
            })
          } catch (e2) {
            setError(e2.message || 'Weather unavailable')
          } finally {
            setLoading(false)
          }
        }, { timeout: 7000 })
      } else {
        // no geolocation
        try {
          const data = await fetchWeatherByCity('Chennai')
          setWeather({
            city: data.name,
            temp: Math.round(data.main.temp),
            feels: Math.round(data.main.feels_like),
            desc: data.weather?.[0]?.description,
            icon: data.weather?.[0]?.icon,
            main: data.weather?.[0]?.main,
          })
        } catch (e) {
          setError(e.message || 'Weather unavailable')
        } finally {
          setLoading(false)
        }
      }
    }

    load()
  }, [])

  if (loading) return <Loading text="Fetching weather…" />
  if (error) return <div className="text-sm text-[var(--text-muted)]">{error}</div>

  return (
    <div className="card-glass p-4 md:p-5 border border-[var(--border)] flex items-center justify-between">
      <div>
        <div className="text-xs text-[var(--text-muted)]">Weather where you are {weather?.city ? `(${weather.city})` : ''}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-[var(--accent)]">{weather.temp}°C</div>
          <div className="text-sm text-[var(--text-muted)]">Feels {weather.feels}°C · {weather.desc}</div>
        </div>
        {geo.lat && geo.lon && (
          <div className="text-xs text-[var(--text-muted)] mt-1">lat {geo.lat.toFixed(3)}, lon {geo.lon.toFixed(3)}</div>
        )}
      </div>
      {weather?.icon && (
        <img alt={weather.desc || 'weather'} className="w-12 h-12" src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
      )}
    </div>
  )
}
