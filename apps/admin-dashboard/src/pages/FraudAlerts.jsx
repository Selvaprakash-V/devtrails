import { useState, useEffect } from 'react';
import { admin } from '../services/api';

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data } = await admin.getFraudAlerts();
      setAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResolve = async (id) => {
    try {
      await admin.resolveAlert(id);
      loadAlerts();
    } catch (error) {
      alert('Failed to resolve alert');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fraud Alerts</h1>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg">{alert.workerId?.name}</p>
                <p className="text-sm text-gray-600">{alert.workerId?.phone}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {alert.severity}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Flag Type</p>
              <p className="font-medium">{alert.flagType}</p>
            </div>

            {alert.details && (
              <div className="mb-4 text-sm">
                <p className="text-gray-600">Details:</p>
                <pre className="bg-gray-50 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(alert.details, null, 2)}
                </pre>
              </div>
            )}

            <button
              onClick={() => handleResolve(alert._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Resolve
            </button>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <p className="text-gray-600 text-center py-8">No unresolved alerts</p>
        )}
      </div>
    </div>
  );
}
