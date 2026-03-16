import Navbar from '../components/Navbar'
import ClaimTable from '../components/ClaimTable'

const mock = [{id:'C-1001', event:'Rain', status:'Approved', payout:350, date:'2026-03-10'}, {id:'C-1002', event:'Road Block', status:'Rejected', payout:0, date:'2026-03-11'}]

export default function Claims(){
  return (
    <div>
      <Navbar />
      <h2 className="text-xl font-bold mb-2">Claims</h2>
      <ClaimTable claims={mock} />
    </div>
  )
}
