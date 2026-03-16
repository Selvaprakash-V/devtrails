export default function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body || {}
    // minimal validation
    if (!body.name) return res.status(400).json({ message: 'Missing name' })
    // simulate saved worker
    return res.status(200).json({ success:true, message: 'Worker registered', worker: { id: 'W-'+Math.floor(Math.random()*10000), ...body } })
  }
  res.status(405).end()
}
