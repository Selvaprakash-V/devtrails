import Navbar from '../../components/Navbar'
import Link from 'next/link'

export default function Admin(){
  return (
    <div>
      <Navbar />
      <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
      <div className="space-y-2">
        <Link href="/admin/event-monitor"><a className="btn">Event Monitor</a></Link>
        <Link href="/admin/claims-review"><a className="btn bg-yellow-500">Claims Review</a></Link>
        <Link href="/admin/fraud-detection"><a className="btn bg-red-500">Fraud Detection</a></Link>
      </div>
    </div>
  )
}
