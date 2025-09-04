import { useParams, Navigate } from 'react-router-dom'
import { findServiceBySlug } from '../constants/services'
import CouponForm from '../components/CouponForm'

export default function Attester() {
  const { slug } = useParams()
  const service = findServiceBySlug(slug)
  if (!service) return <Navigate to="/" replace />
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">Attester ({service.name})</h1>
      <p className="text-gray-600 mb-4">{service.description || 'Carte cadeau'}</p>
      <CouponForm type={service.name} />
    </div>
  )
}


