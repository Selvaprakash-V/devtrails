export default function handler(req, res){
  if (req.method === 'POST') {
    return res.status(200).json({ success:true, activatedAt: new Date().toISOString() })
  }
  res.status(405).end()
}
