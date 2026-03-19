import { useState, useEffect } from 'react';
import { admin } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await admin.getDashboard();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Workers</p>
          <p className="text-3xl font-bold">{stats.totalWorkers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Claims</p>
          <p className="text-3xl font-bold">{stats.totalClaims}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Pending Claims</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingClaims}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Payouts</p>
          <p className="text-3xl font-bold text-green-600">₹{stats.totalPayouts.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Fraud Alerts</h2>
        <p className="text-2xl font-bold text-red-600">{stats.fraudFlags}</p>
        <p className="text-sm text-gray-600">Unresolved alerts</p>
      </div>
    </div>
  );
}
