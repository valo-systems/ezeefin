import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { DemoRibbon, SiteFooter, SiteHeader } from './ui'
import Home from './pages/home'
import { HowItWorks, FinanceAssistance, InsuranceTracker } from './pages/services'
import { About, FAQs, Contact, Privacy, Terms } from './pages/about'
import { FindMeAVehicle, FoundAVehicle, Fleet } from './pages/journeys'
import Portal from './pages/portal'
import Admin from './pages/admin'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const inPortal = pathname.startsWith('/portal') || pathname.startsWith('/customer') || pathname.startsWith('/admin')
  return (
    <>
      <DemoRibbon />
      <ScrollTop />
      {!inPortal && <SiteHeader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/services/finance-assistance" element={<FinanceAssistance />} />
        <Route path="/services/insurance-and-tracker" element={<InsuranceTracker />} />
        <Route path="/find-me-a-vehicle" element={<FindMeAVehicle />} />
        <Route path="/found-a-vehicle" element={<FoundAVehicle />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/portal/*" element={<Portal />} />
        <Route path="/customer/*" element={<Portal />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!inPortal && <SiteFooter />}
    </>
  )
}
