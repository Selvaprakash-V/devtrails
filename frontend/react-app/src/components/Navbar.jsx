import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="font-bold">DevTrails</div>
      <div className="flex space-x-2 text-sm">
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/alerts">Alerts</Link>
      </div>
    </div>
  )
}
