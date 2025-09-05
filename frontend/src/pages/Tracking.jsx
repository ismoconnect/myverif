import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
// Icônes SVG inline pour éviter les dépendances

// Fonction pour masquer partiellement les codes de coupons
const maskCouponCode = (code) => {
  if (!code || code.length < 4) return code
  const start = code.substring(0, 2)
  const end = code.substring(code.length - 2)
  const middle = '•'.repeat(Math.max(0, code.length - 4))
  return `${start}${middle}${end}`
}

// Fonction pour générer et télécharger le PDF
const downloadAttestationPDF = (submission) => {
  const { jsPDF } = window.jspdf
  
  // Créer un nouveau document PDF
  const doc = new jsPDF()
  
  // Configuration des couleurs
  const primaryColor = [255, 140, 0] // Orange
  const secondaryColor = [59, 130, 246] // Bleu
  const textColor = [31, 41, 55] // Gris foncé
  const successColor = [34, 197, 94] // Vert
  const errorColor = [239, 68, 68] // Rouge
  
  // En-tête avec logo et titre
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 30, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('ATTESTATION DE COUPONS', 105, 20, { align: 'center' })
  
  // Informations de l'entreprise
  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Service d\'attestation des tickets', 105, 35, { align: 'center' })
  doc.text('Plateforme sécurisée de vérification', 105, 40, { align: 'center' })
  
  // Ligne de séparation
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(20, 50, 190, 50)
  
  // Informations du client
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMATIONS CLIENT', 20, 65)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nom complet: ${submission.fullName}`, 20, 75)
  doc.text(`Email: ${submission.email}`, 20, 80)
  if (submission.phone) {
    doc.text(`Téléphone: ${submission.phone}`, 20, 85)
  }
  doc.text(`Pays: ${submission.country}`, 20, 90)
  
  // Informations de la demande
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DÉTAILS DE LA DEMANDE', 20, 105)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Type de coupon: ${submission.type}`, 20, 115)
  doc.text(`Nombre de coupons: ${submission.numCoupons}`, 20, 120)
  doc.text(`Montant total: ${submission.totalAmount ? `${submission.totalAmount.toFixed(2)} €` : 'N/A'}`, 20, 125)
  doc.text(`Date de soumission: ${new Date(submission.createdAt?.toDate ? submission.createdAt.toDate() : submission.createdAt).toLocaleDateString('fr-FR')}`, 20, 130)
  doc.text(`Numéro de référence: ${submission.id}`, 20, 135)
  
  // Statut de la demande
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('RÉSULTAT DE LA VÉRIFICATION', 20, 150)
  
  const isVerified = submission.status === 'verified' || submission.status === 'completed'
  const statusColor = isVerified ? successColor : errorColor
  const statusText = isVerified ? 'VÉRIFIÉ' : 'REJETÉ'
  const statusMessage = isVerified ? 'Tous les coupons sont valides' : 'Les coupons sont invalides'
  
  doc.setFillColor(...statusColor)
  doc.rect(20, 155, 170, 15, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(statusText, 105, 165, { align: 'center' })
  
  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(statusMessage, 20, 180)
  
  // Codes des coupons
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('CODES DES COUPONS', 20, 195)
  
  let yPosition = 205
  submission.coupons.forEach((coupon, index) => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`Coupon #${coupon.id}`, 20, yPosition)
    
    doc.setFont('helvetica', 'normal')
    const maskedCode = maskCouponCode(coupon.code)
    doc.text(`Code: ${maskedCode}`, 20, yPosition + 5)
    
    if (coupon.amount) {
      doc.text(`Montant: ${coupon.amount} €`, 20, yPosition + 10)
    }
    
    yPosition += 20
  })
  
  // Pied de page
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    
    // Ligne de séparation
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, 280, 190, 280)
    
    // Informations de pied de page
    doc.setTextColor(...textColor)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Document généré automatiquement', 20, 285)
    doc.text(`Page ${i} sur ${pageCount}`, 190, 285, { align: 'right' })
    doc.text(new Date().toLocaleDateString('fr-FR'), 105, 285, { align: 'center' })
  }
  
  // Télécharger le PDF
  const fileName = `attestation_${submission.id}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

export default function Tracking() {
  const { referenceNumber } = useParams()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!referenceNumber) {
      setError('Numéro de référence manquant')
      setLoading(false)
      return
    }

    // Écouter les changements en temps réel
    const unsubscribe = onSnapshot(
      doc(db, 'coupon_submissions', referenceNumber),
      (doc) => {
        if (doc.exists()) {
          setSubmission({ id: doc.id, ...doc.data() })
          setError(null)
        } else {
          setError('Aucune demande trouvée avec ce numéro de référence')
        }
        setLoading(false)
      },
      (error) => {
        console.error('Erreur lors du chargement:', error)
        setError('Erreur lors du chargement de la demande')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [referenceNumber])

  const getStatusIcon = (status) => {
    // Normaliser le statut (enlever les espaces, convertir en minuscules)
    const normalizedStatus = status?.toString().toLowerCase().trim()
    
    switch (normalizedStatus) {
      case 'pending':
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        )
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        )
      case 'completed':
        return (
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'verified':
        return (
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'rejected':
        return (
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        // Par défaut, afficher le spinner "en cours"
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        )
    }
  }

  const getStatusText = (status) => {
    // Normaliser le statut (enlever les espaces, convertir en minuscules)
    const normalizedStatus = status?.toString().toLowerCase().trim()
    
    switch (normalizedStatus) {
      case 'pending':
        return 'En cours'
      case 'processing':
        return 'En cours'
      case 'completed':
        return 'Vérifié'
      case 'verified':
        return 'Vérifié'
      case 'rejected':
        return 'Rejeté'
      default:
        // Debug temporaire - afficher le statut réel
        console.log('Statut non reconnu:', status, 'Type:', typeof status)
        return 'En cours' // Par défaut, considérer comme "en cours"
    }
  }

  const getStatusColor = (status) => {
    // Normaliser le statut (enlever les espaces, convertir en minuscules)
    const normalizedStatus = status?.toString().toLowerCase().trim()
    
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200' // Par défaut, bleu comme "en cours"
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre demande...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune donnée disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Suivi de votre demande</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Numéro de référence : <span className="font-mono font-bold text-orange-600 break-all">{submission.id}</span>
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {getStatusIcon(submission.status)}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Statut de la demande</h2>
                <p className="text-sm sm:text-base text-gray-600">{getStatusText(submission.status)}</p>
              </div>
            </div>
            <div className={`px-3 sm:px-4 py-2 rounded-full border-2 ${getStatusColor(submission.status)} self-start sm:self-auto`}>
              <span className="text-sm sm:text-base font-semibold">{getStatusText(submission.status)}</span>
            </div>
          </div>

          {/* Status Display */}
          <div className="mb-4 sm:mb-6">
            {(() => {
              const normalizedStatus = submission.status?.toString().toLowerCase().trim()
              if (normalizedStatus === 'pending' || normalizedStatus === 'processing') {
                return (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                    <span className="text-sm sm:text-base text-blue-800 font-medium">Traitement en cours...</span>
                  </div>
                )
              } else if (normalizedStatus === 'completed' || normalizedStatus === 'verified') {
                return (
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left mb-3">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm sm:text-base text-green-800 font-medium">Demande vérifiée avec succès - Tous vos coupons sont valides</span>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => downloadAttestationPDF(submission)}
                        className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">Télécharger l'attestation PDF</span>
                      </button>
                    </div>
                  </div>
                )
              } else if (normalizedStatus === 'rejected') {
                return (
                  <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left mb-3">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm sm:text-base text-red-800 font-medium">Demande rejetée - Vos coupons sont invalides</span>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => downloadAttestationPDF(submission)}
                        className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">Télécharger l'attestation PDF</span>
                      </button>
                    </div>
                  </div>
                )
              } else {
                // Par défaut, afficher "en cours"
                return (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                    <span className="text-sm sm:text-base text-blue-800 font-medium">Traitement en cours...</span>
                  </div>
                )
              }
            })()}
          </div>

          {/* Timeline */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Historique du traitement</h3>
            
            <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-900">Demande reçue</p>
                <p className="text-xs sm:text-sm text-gray-600">{formatDate(submission.createdAt)}</p>
              </div>
            </div>

            {submission.processingStartedAt && (
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900">Traitement en cours</p>
                  <p className="text-xs sm:text-sm text-gray-600">{formatDate(submission.processingStartedAt)}</p>
                </div>
              </div>
            )}

            {submission.processingCompletedAt && (
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900">Demande vérifiée</p>
                  <p className="text-xs sm:text-sm text-gray-600">{formatDate(submission.processingCompletedAt)}</p>
                </div>
              </div>
            )}

            {submission.emailSent && (
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900">Email de confirmation envoyé</p>
                  <p className="text-xs sm:text-sm text-gray-600">{formatDate(submission.emailSentAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Détails de la demande</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Client Info */}
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Informations client
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-600">Nom :</span>
                  <span className="text-sm sm:text-base font-medium">{submission.fullName}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-600 break-all">{submission.email}</span>
                </div>
                {submission.phone && (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-600">{submission.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-600">{submission.country}</span>
                </div>
              </div>
            </div>

            {/* Submission Info */}
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Informations de la demande
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-600">Type :</span>
                  <span className="text-sm sm:text-base font-medium">{submission.type}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-600">Nombre de coupons :</span>
                  <span className="text-sm sm:text-base font-medium">{submission.numCoupons}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-600">Montant total :</span>
                  <span className="text-sm sm:text-base font-medium text-green-600">{submission.totalAmount ? `${submission.totalAmount.toFixed(2)} €` : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-600">{formatDate(submission.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Codes des coupons</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {submission.coupons.map((coupon, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-blue-50 p-3 sm:p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Coupon #{coupon.id}</span>
                  <span className="text-xs sm:text-sm font-semibold text-green-600">
                    {coupon.amount ? `${coupon.amount} €` : 'N/A'}
                  </span>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded border">
                  <code className="text-xs sm:text-sm font-mono break-all">
                    {submission.hideCodes ? '••••••••••••' : coupon.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-gray-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Actualiser
          </button>
        </div>
      </div>
    </div>
  )
}
