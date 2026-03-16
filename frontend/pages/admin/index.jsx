import Link from 'next/link'

export default function Admin(){
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 gap-3">
        <Link href="/admin/events"><a className="card">Event Monitor</a></Link>
        <Link href="/admin/claims"><a className="card">Claims Review</a></Link>
        <Link href="/admin/fraud"><a className="card">Fraud Detection</a></Link>
      </div>
    </div>
  )
}
