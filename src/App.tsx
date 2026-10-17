import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BottomNav from './components/BottomNav'
import DreamcatcherCharm from './components/DreamcatcherCharm'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-[1] flex min-h-svh flex-col">
        <Navbar />
        <main className="max-w-[100vw] flex-1 overflow-x-clip pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <DreamcatcherCharm />
        <WhatsAppButton />
        <BottomNav />
      </div>
    </MotionConfig>
  )
}
