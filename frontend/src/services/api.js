// Mock API service using localStorage to persist state
// plus real backend integration for onboarding flows

const LS_USERS = 'devtrails_users'
const LS_PLANS = 'devtrails_plans'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const OPEN_WEATHER_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function initPlans() {
  const existing = load(LS_PLANS, null)
  if (!existing) {
    const plans = [
      { id: 'basic', name: 'Basic', price: 30, payout: 200 },
      { id: 'standard', name: 'Standard', price: 50, payout: 300 },
      { id: 'premium', name: 'Premium', price: 70, payout: 500 }
    ]
    save(LS_PLANS, plans)
    return plans
  }
  return existing
}

initPlans()

function delay(res, ms = 600) {
  return new Promise((resolve) => setTimeout(() => resolve(res), ms))
}

// Generic JSON fetch helper for backend API
async function jsonFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data
  try {
    data = await res.json()
  } catch (e) {
    data = null
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      'Request failed. Please try again.'
    throw new Error(message)
  }

  return data
}

function getOnboardingToken() {
  try {
    return localStorage.getItem('devtrails_onboarding_token')
  } catch (e) {
    return null
  }
}

export async function register(user) {
  const users = load(LS_USERS, [])
  const id = 'u_' + Date.now()
  const newUser = {
    id,
    name: user.name,
    city: user.city,
    platform: user.platform,
    plan: null,
    weeklyPremium: 0,
    policyStatus: 'INACTIVE',
    totalPayout: 0,
    payoutHistory: []
  }
  users.push(newUser)
  save(LS_USERS, users)
  return delay({ data: newUser })
}

export async function getPlans() {
  const plans = load(LS_PLANS, [])
  return delay({ data: plans })
}

export async function selectPlan({ userId, planId }) {
  const users = load(LS_USERS, [])
  const plans = load(LS_PLANS, [])
  const user = users.find(u => u.id === userId)
  const plan = plans.find(p => p.id === planId)
  if (!user || !plan) return delay(Promise.reject(new Error('User or Plan not found')))
  user.plan = plan.name
  user.weeklyPremium = plan.price
  user.policyStatus = 'ACTIVE'
  save(LS_USERS, users)
  return delay({ data: user })
}

export async function getUser(userId) {
  const users = load(LS_USERS, [])
  const user = users.find(u => u.id === userId)
  if (!user) return delay(Promise.reject(new Error('User not found')))
  return delay({ data: user })
}

export async function triggerRain(userId) {
  const users = load(LS_USERS, [])
  const user = users.find(u => u.id === userId)
  if (!user) return delay(Promise.reject(new Error('User not found')))
  // Payout amount based on user's plan
  const payoutMap = { 'Basic': 200, 'Standard': 300, 'Premium': 500 }
  const amount = payoutMap[user.plan] || 0
  const event = { type: 'Rain', amount, date: new Date().toISOString() }
  user.payoutHistory = user.payoutHistory || []
  user.payoutHistory.unshift(event)
  user.totalPayout = (user.totalPayout || 0) + amount
  save(LS_USERS, users)
  return delay({ data: { message: `₹${amount} credited due to heavy rain`, event, user } }, 800)
}

export async function getSummary() {
  const users = load(LS_USERS, [])
  const totalUsers = users.length
  const activePolicies = users.filter(u => u.policyStatus === 'ACTIVE').length
  const totalPayout = users.reduce((s, u) => s + (u.totalPayout || 0), 0)
  const cityCounts = users.reduce((acc, u) => { acc[u.city] = (acc[u.city] || 0) + 1; return acc }, {})
  const mostAffected = Object.keys(cityCounts).sort((a,b)=>cityCounts[b]-cityCounts[a])[0] || null
  return delay({ data: { totalUsers, activePolicies, totalPayout, mostAffected } }, 400)
}

// Onboarding backend integration

export async function sendOnboardingOtp(phone) {
  return jsonFetch('/auth/send-otp', {
    method: 'POST',
    body: { phone },
  })
}

export async function verifyOnboardingOtp(phone, otp, language) {
  const payload = { phone, otp }
  if (language) {
    payload.language = language
  }

  const data = await jsonFetch('/auth/verify-otp', {
    method: 'POST',
    body: payload,
  })

  // Persist token for subsequent onboarding calls
  if (data && data.token) {
    try {
      localStorage.setItem('devtrails_onboarding_token', data.token)
    } catch (e) {
      // ignore storage errors
    }
  }

  return data
}

export async function updateOnboardingLocation({ city, area, lat, lng }) {
  const token = getOnboardingToken()
  return jsonFetch('/user/location', {
    method: 'POST',
    token,
    body: { city, area, lat, lng },
  })
}

export async function updateOnboardingWorkSettings({ vehicleType, workArea, workTime }) {
  const token = getOnboardingToken()
  return jsonFetch('/user/work-settings', {
    method: 'POST',
    token,
    body: { vehicleType, workArea, workTime },
  })
}

export async function updateOnboardingProfile({ fullName, age, gender }) {
  const token = getOnboardingToken()
  return jsonFetch('/user/profile', {
    method: 'POST',
    token,
    body: { name: fullName, age: Number(age), gender },
  })
}

export async function updateOnboardingBank({ accountNumber, confirmAccount, ifsc, bankName }) {
  const token = getOnboardingToken()
  return jsonFetch('/user/bank', {
    method: 'POST',
    token,
    body: {
      accountNumber,
      confirmAccountNumber: confirmAccount,
      ifsc,
      bankName,
    },
  })
}

export async function updateOnboardingDocuments({ primaryIdType, primaryIdNumber }) {
  const token = getOnboardingToken()

  // Map UI label to backend enum
  let type = primaryIdType
  if (type === 'Voter ID') type = 'VoterID'

  return jsonFetch('/user/documents', {
    method: 'POST',
    token,
    body: {
      type,
      idNumber: primaryIdNumber,
    },
  })
}

// Weather
export async function fetchWeatherByCity(city) {
  if (!OPEN_WEATHER_KEY) throw new Error('OpenWeather API key missing')
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPEN_WEATHER_KEY}`
  )
  const data = await res.json()
  if (!res.ok) {
    const message = data?.message || 'Failed to fetch weather'
    throw new Error(message)
  }
  return data
}

export async function fetchWeatherByCoords(lat, lon) {
  if (!OPEN_WEATHER_KEY) throw new Error('OpenWeather API key missing')
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${OPEN_WEATHER_KEY}`
  )
  const data = await res.json()
  if (!res.ok) {
    const message = data?.message || 'Failed to fetch weather'
    throw new Error(message)
  }
  return data
}
