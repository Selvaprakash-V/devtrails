import { useEffect, useState } from 'react'
import { getClaims } from '../services/api'
import ClaimCard from '../components/ClaimCard'

export default function Claims(){
  const [claims,setClaims]=useState([])
  useEffect(()=>{ getClaims().then(r=>setClaims(r)) },[])
  return (
    <div className="space-y-3">
      <h2 className="large">Claims</h2>
      {claims.map(c=> <ClaimCard key={c.id} claim={c} />)}
    </div>
  )
}
