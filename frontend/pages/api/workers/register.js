export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body
    // minimal validation
    if (!name) return res.status(400).json({ error: 'name required' })
    // return mock success
    return res.status(200).json({ message: 'Worker registered (mock).', workerId: 'w_demo_1' })
  }
  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
