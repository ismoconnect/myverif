import { Link } from 'react-router-dom'

export default function ServiceCard({ title, description, to, imageUrl }) {
  return (
    <div className="card overflow-hidden p-0">
      {imageUrl && (
        <div className="w-full flex justify-center">
          <img src={imageUrl} alt={title} className="max-h-48 w-auto object-contain" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-center text-blue-700">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">{description}</p>
        <Link to={to} className="btn-secondary w-full justify-center">
          Attester {title}
        </Link>
      </div>
    </div>
  )
}


