const MOCK = [
  { id: 'C-1001', type: 'Heavy Rain', status: 'Approved', payout: 300, date: '2026-03-10' },
  { id: 'C-1002', type: 'Vehicle Breakdown', status: 'Under Review', payout: 0, date: '2026-03-11' },
  { id: 'C-1003', type: 'Heavy Rain', status: 'Rejected', payout: 0, date: '2026-03-09' },
]

function Badge({ status }){
  const cls = status === 'Approved' ? 'bg-green-100 text-green-800' : status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{status}</span>
}

export default function ClaimTable({ admin=false }){
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-sm text-gray-500">
          <tr>
            <th className="p-3">Claim ID</th>
            <th>Event</th>
            <th>Status</th>
            <th>Payout</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map(c=> (
            <tr key={c.id} className="border-t border-gray-100 dark:border-gray-700">
              <td className="p-3 font-mono text-sm">{c.id}</td>
              <td className="p-3">{c.type}</td>
              <td className="p-3"><Badge status={c.status} /></td>
              <td className="p-3">₹{c.payout}</td>
              <td className="p-3 text-sm text-gray-500">{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
