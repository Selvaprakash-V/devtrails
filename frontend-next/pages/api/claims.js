const mock = [{id:'C-1001', event:'Heavy Rain', status:'Approved', payout:350, date:'2026-03-10'}]
export default function handler(req, res){
  if (req.method === 'GET') return res.status(200).json({ claims: mock })
  res.status(405).end()
}
