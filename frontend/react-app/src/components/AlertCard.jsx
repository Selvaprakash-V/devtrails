export default function AlertCard({ event }){
  return (
    <div className="card border-l-4 border-red-400">
      <div className="font-medium">{event.type}</div>
      <div className="muted">Zone: {event.zone}</div>
    </div>
  )
}
