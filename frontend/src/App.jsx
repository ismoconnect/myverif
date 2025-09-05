import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Attester from './pages/Attester.jsx'
import Service from './pages/Service.jsx'
import Contact from './pages/Contact.jsx'
import Tracking from './pages/Tracking.jsx'
import TrackingSearch from './pages/TrackingSearch.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/attester/:slug" element={<Attester />} />
        <Route path="/tracking" element={<TrackingSearch />} />
        <Route path="/tracking/:referenceNumber" element={<Tracking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}


