export default function handler(req,res){
  if(req.method==='POST'){
    return res.status(200).json({ message: 'Policy activated (mock)', policyId: 'p_demo_1' })
  }
  res.setHeader('Allow',['POST'])
  res.status(405).end()
}
