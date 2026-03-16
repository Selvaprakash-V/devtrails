import axios from 'axios'

const MOCK_DELAY = (v)=> new Promise(r=>setTimeout(()=>r(v),300))

const mock = {
  register: (payload)=> MOCK_DELAY({ ok:true, message:'registered (mock)', workerId:'w_demo' }),
  activatePolicy: ()=> MOCK_DELAY({ ok:true, message:'policy activated (mock)', policyId:'p_demo' }),
  dashboard: ()=> MOCK_DELAY({
    worker:{ name:'Ravi', platform:'Swiggy', zone:'Zone A', policyStatus:'Active', nextPremium:'2026-03-20' },
    risk:63, premium:28, coverage:350,
    earnings:[ { week:'W1', income:1200, payouts:200 }, { week:'W2', income:1500, payouts:300 } ],
    disruptions:[ { id:1, type:'Heavy Rain', zone:'Zone A', payout:300 } ]
  }),
  events: ()=> MOCK_DELAY([{ id:1, type:'Heavy Rain', zone:'Zone A' }, { id:2, type:'Flood', zone:'Zone B' }]),
  claims: ()=> MOCK_DELAY([{ id:'C1001', event:'Heavy Rain', payout:300, status:'Approved', date:'2026-03-10' }]),
  wallet: ()=> MOCK_DELAY({ totalPayouts:4200, lastPayout:300, transactions:[{id:1,desc:'Week payout',amount:350,date:'2026-03-12'}] })
}

const useMock = () => (typeof process !== 'undefined' && process.env.REACT_APP_USE_MOCK === 'true') || true

export async function registerWorker(payload){
  if(useMock()) return mock.register(payload)
  const res = await axios.post('/api/workers/register', payload); return res.data
}
export async function activatePolicy(payload){ if(useMock()) return mock.activatePolicy(); const res = await axios.post('/api/policy/activate', payload); return res.data }
export async function getDashboard(){ if(useMock()) return mock.dashboard(); const res = await axios.get('/api/workers/dashboard'); return res.data }
export async function getActiveEvents(){ if(useMock()) return mock.events(); const res = await axios.get('/api/events/active'); return res.data }
export async function getClaims(){ if(useMock()) return mock.claims(); const res = await axios.get('/api/claims'); return res.data }
export async function getWallet(){ if(useMock()) return mock.wallet(); const res = await axios.get('/api/wallet'); return res.data }
