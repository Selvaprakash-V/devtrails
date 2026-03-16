export default function EventAlert({ title, zone, payout }) {
  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-700 text-red-800 dark:text-white shadow-lg">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-sm">Zone: {zone}</div>
      <div className="mt-2 font-semibold">Automatic Claim Created • Est. payout ₹{payout}</div>
    </div>
  )
}
