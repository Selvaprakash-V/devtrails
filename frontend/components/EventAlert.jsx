export default function EventAlert({ event }){
  if(!event) return null
  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800">
      <div className="font-bold text-lg">{event.title} Alert</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">Zone: {event.zone}</div>
      <div className="mt-2 font-semibold">Automatic Claim Created • Est. payout ₹{event.payout}</div>
    </div>
  )
}
