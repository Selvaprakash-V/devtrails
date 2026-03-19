import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import FraudAlerts from './pages/FraudAlerts';
import Workers from './pages/Workers';
import { auth } from './services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { data } = await auth.login(username, password);
      localStorage.setItem('adminToken', data.token);
      onLogin();
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold">QuickClaim Admin</h1>
        </div>
        <div className="space-y-2 px-4">
          <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/claims" className="block px-4 py-2 rounded hover:bg-gray-100">Claims</Link>
          <Link to="/fraud-alerts" className="block px-4 py-2 rounded hover:bg-gray-100">Fraud Alerts</Link>
          <Link to="/workers" className="block px-4 py-2 rounded hover:bg-gray-100">Workers</Link>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/fraud-alerts" element={<FraudAlerts />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
