export default function WalletCard({ wallet }){
  return (
    <div className="card">
      <div className="muted">Total Payouts</div>
      <div className="text-2xl font-bold">₹{wallet.totalPayouts}</div>
      <div className="muted mt-2">Last payout</div>
      <div>₹{wallet.lastPayout}</div>
      <div className="muted mt-2">Recent</div>
      <ul className="mt-2 space-y-2">
        {wallet.transactions.map(t=> <li key={t.id} className="flex justify-between"><div className="muted">{t.desc}</div><div>₹{t.amount}</div></li>)}
      </ul>
    </div>
  )
}
