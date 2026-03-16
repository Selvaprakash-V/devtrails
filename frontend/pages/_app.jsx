import '../styles/globals.css'
import { ThemeProvider } from '../utils/theme'
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  )
}
