import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Home(){
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      <p className="text-sm text-gray-600 mb-4">Quick access for delivery workers.</p>
      <div className="space-y-3">
        <Link href="/register"><a className="btn">Register Worker</a></Link>
        <Link href="/dashboard"><a className="btn bg-gray-700">Open Dashboard</a></Link>
      </div>
    </div>
  )
}
