import Navbar from '../components/Navbar'

export default function Wallet(){
  const data = { earnings: 4800, payouts: 650, tx: [{id:'T1', amount:400, type:'Earning', date:'2026-03-12'}, {id:'T2', amount:350, type:'Payout', date:'2026-03-10'}] }
  return (
    <div>
      <Navbar />
      <h2 className="text-xl font-bold mb-2">Wallet</h2>
      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-500">Total Earnings</div>
          <div className="text-2xl font-bold">₹{data.earnings}</div>
        </div>
        <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-500">Total Payouts</div>
          <div className="text-2xl font-bold">₹{data.payouts}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">Recent Transactions</div>
          <div className="space-y-2">
            {data.tx.map(t=> <div key={t.id} className="p-2 rounded bg-white dark:bg-gray-800 flex justify-between"><div>{t.type}</div><div>₹{t.amount}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
