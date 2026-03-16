export default function handler(req, res){
  return res.status(200).json({ disruptions:12, claims:8, fraudAlerts:2, payoutDistribution: { small:6, medium:2, large:0 } })
}
