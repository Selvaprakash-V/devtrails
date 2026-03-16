export default function handler(req,res){
  return res.status(200).json([
    { id:1, type:'Heavy Rain', zone:'Zone A', count: 12 },
    { id:2, type:'Flood', zone:'Zone B', count: 4 }
  ])
}
