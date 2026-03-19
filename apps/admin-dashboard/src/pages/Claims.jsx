import { useState, useEffect } from 'react';
import { admin } from '../services/api';

export default function Claims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const { data } = await admin.getClaims();
      setClaims(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await admin.updateClaimStatus(id, status);
      loadClaims();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Claims Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {claims.map((claim) => (
              <tr key={claim._id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{claim.workerId?.name}</p>
                    <p className="text-sm text-gray-500">{claim.workerId?.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{claim.disruptionType}</td>
                <td className="px-6 py-4">₹{claim.payoutAmount.toFixed(0)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    claim.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    claim.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {claim.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    claim.status === 'paid' ? 'bg-green-100 text-green-800' :
                    claim.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {claim.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(claim._id, 'approved')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(claim._id, 'rejected')}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
