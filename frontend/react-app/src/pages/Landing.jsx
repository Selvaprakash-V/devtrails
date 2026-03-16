import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insurance for Delivery Workers</h1>
      <p className="muted">Protection during weather disruptions</p>
      <div className="space-y-3">
        <Link to="/register"><button className="btn btn-primary">Register</button></Link>
        <Link to="/dashboard"><button className="btn btn-success">Login (demo)</button></Link>
      </div>
    </div>
  )
}
