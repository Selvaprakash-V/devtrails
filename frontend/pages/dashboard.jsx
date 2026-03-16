import WorkerCard from '../components/WorkerCard'
import EarningsChart from '../components/EarningsChart'
import EventAlert from '../components/EventAlert'
import ClaimTable from '../components/ClaimTable'

export default function Dashboard(){
  const worker = { name: 'Ravi', platform: 'Swiggy', zone: 'Zone A', policyStatus: 'Active', nextPremium: '2026-03-20' }
  const disruptions = [{id:1,title:'Heavy Rain', zone:'Zone A', payout:300}]
  return (
    <div className="space-y-4">
      <WorkerCard worker={worker} />
      <div className="grid grid-cols-1 gap-4">
        <EarningsChart />
        <EventAlert event={disruptions[0]} />
        <ClaimTable />
      </div>
    </div>
  )
}
