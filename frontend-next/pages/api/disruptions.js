const mock = [{id:'D-1', title:'Heavy Rain', zone:'A', payout:350, created:'2026-03-10T08:00:00Z'}]
export default function handler(req, res){
  return res.status(200).json({ events: mock })
}
