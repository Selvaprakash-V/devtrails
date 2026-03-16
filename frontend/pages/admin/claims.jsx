import ClaimTable from '../../components/ClaimTable'

export default function AdminClaims(){
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Claims Queue</h2>
      <ClaimTable admin />
    </div>
  )
}
