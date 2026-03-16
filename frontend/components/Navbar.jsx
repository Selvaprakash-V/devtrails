import Link from 'next/link'
import { useTheme } from '../utils/theme'

export default function Navbar(){
  const { theme, toggle } = useTheme()
  return (
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-4xl mx-auto p-3 flex items-center justify-between">
        <div className="font-bold">DevTrails</div>
        <div className="flex items-center space-x-2">
          <Link href="/register"><a className="text-sm">Register</a></Link>
          <Link href="/dashboard"><a className="text-sm">Dashboard</a></Link>
          <Link href="/claims"><a className="text-sm">Claims</a></Link>
          <button onClick={toggle} className="ml-2 btn-ghost">{theme==='dark' ? 'Light' : 'Dark'}</button>
        </div>
      </div>
    </nav>
  )
}
