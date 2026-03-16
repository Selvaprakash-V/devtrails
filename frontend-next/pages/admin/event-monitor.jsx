import Navbar from '../../components/Navbar'

export default function EventMonitor(){
  return (
    <div>
      <Navbar />
      <h2 className="text-lg font-bold mb-2">Event Monitor</h2>
      <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">Live events list (mock)</div>
    </div>
  )
}
