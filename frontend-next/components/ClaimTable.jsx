export default function ClaimTable({ claims = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-gray-500">
          <tr><th className="pb-2">Claim ID</th><th>Event</th><th>Status</th><th>Payout</th><th>Date</th></tr>
        </thead>
        <tbody>
          {claims.map(c => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.id}</td>
              <td>{c.event}</td>
              <td>
                <span className={`px-2 py-1 rounded text-xs ${c.status==='Approved'? 'bg-green-100 text-green-800' : c.status==='Rejected'? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {c.status}
                </span>
              </td>
              <td>₹{c.payout}</td>
              <td className="text-xs text-gray-500">{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
