import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import RiskResult from './pages/RiskResult'
import Policy from './pages/Policy'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Claims from './pages/Claims'
import Wallet from './pages/Wallet'
import Navbar from './components/Navbar'

export default function App(){
  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/risk" element={<RiskResult />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </div>
  )
}
