import Navbar from '../../components/Navbar'
import FraudAlertPanel from '../../components/FraudAlertPanel'

const alerts = [{id:1,title:'Multiple claims same device',details:'3 claims from same phone in 2 days'},{id:2,title:'Fake GPS',details:'Worker location jumps 10km within 10 minutes'}]

export default function Fraud(){
  return (
    <div>
      <Navbar />
      <h2 className="text-lg font-bold mb-2">Fraud Detection</h2>
      <FraudAlertPanel alerts={alerts} />
    </div>
  )
}
