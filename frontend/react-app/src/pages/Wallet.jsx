import { useEffect, useState } from 'react'
import { getWallet } from '../services/api'
import WalletCard from '../components/WalletCard'

export default function Wallet(){
  const [data,setData]=useState(null)
  useEffect(()=>{ getWallet().then(r=>setData(r)) },[])
  if(!data) return <div className="muted">Loading...</div>
  return (
    <div className="space-y-3">
      <h2 className="large">Wallet</h2>
      <WalletCard wallet={data} />
    </div>
  )
}
