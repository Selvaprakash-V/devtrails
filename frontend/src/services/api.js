// Mock API service using localStorage to persist state
const LS_USERS = 'devtrails_users'
const LS_PLANS = 'devtrails_plans'

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
