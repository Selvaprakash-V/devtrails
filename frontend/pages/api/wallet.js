export default function handler(req,res){
  return res.status(200).json({ totalEarnings: 12500, totalPayouts: 4200, transactions: [
    { id: 1, desc: 'Week payout', amount: 350, date: '2026-03-12' },
    { id: 2, desc: 'Claim payout', amount: 300, date: '2026-03-10' },
  ]})
}
