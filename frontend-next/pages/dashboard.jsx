import Navbar from '../components/Navbar'
import WorkerCard from '../components/WorkerCard'
import EarningsChart from '../components/EarningsChart'
import ClaimTable from '../components/ClaimTable'
import EventAlert from '../components/EventAlert'

const sample = {
  worker: { name:'Ravi', platform:'Swiggy', city:'Bengaluru', zone:'A', vehicle:'Bike' },
  chart: [
    { week:'W1', earnings:1200, payouts:200 },{ week:'W2', earnings:1500, payouts:300 },{ week:'W3', earnings:1100, payouts:100 },{ week:'W4', earnings:1400, payouts:250 }
  ],
  claims: [{id:'C-1001', event:'Heavy Rain', status:'Approved', payout:350, date:'2026-03-10'}, {id:'C-1002', event:'Strike', status:'Under Review', payout:0, date:'2026-03-12'}]
}

export default function Dashboard(){
  return (
    <div>
      <Navbar />
      <div className="space-y-3">
        <WorkerCard worker={sample.worker} />
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
            <div className="text-xs text-gray-500">Policy Status</div>
            <div className="font-semibold">Active • Next premium due in 4 days</div>
          </div>
          <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
            <div className="text-xs text-gray-500">Earnings vs Payouts</div>
            <EarningsChart data={sample.chart} />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2">Recent Disruptions</div>
            <EventAlert title="Heavy Rain Alert" zone="Zone A" payout={350} />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2">Claims History</div>
            <ClaimTable claims={sample.claims} />
          </div>
        </div>
      </div>
    </div>
  )
}
