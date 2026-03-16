import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="mb-4 flex gap-2 text-sm">
      <Link href="/dashboard"><a className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Dashboard</a></Link>
      <Link href="/policy"><a className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Policy</a></Link>
      <Link href="/claims"><a className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Claims</a></Link>
      <Link href="/wallet"><a className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Wallet</a></Link>
      <Link href="/register"><a className="ml-auto px-3 py-2 rounded bg-green-500 text-white">Register</a></Link>
    </nav>
  )
}
