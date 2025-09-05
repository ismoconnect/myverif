import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { db } from '../lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProcessingDialog, setShowProcessingDialog] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      civility: 'Monsieur',
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Afficher la boîte de dialogue de traitement
      setShowProcessingDialog(true)
      
      const payload = { 
        ...values, 
        createdAt: serverTimestamp(), 
        userAgent: navigator.userAgent,
        type: 'contact'
      }
      await addDoc(collection(db, 'contact_messages'), payload)
      
      // Simuler un délai de traitement (2 secondes)
      setTimeout(() => {
        setShowProcessingDialog(false)
        toast.success('Message envoyé avec succès !')
        reset()
      }, 2000)
      
    } catch (err) {
      setShowProcessingDialog(false)
      toast.error(err?.message || 'Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
        <p className="text-xl text-gray-600">Une question ? Un problème ? Notre équipe est là pour vous aider</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Formulaire de contact */}
                    <div className="bg-gradient-to-br from-orange-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-orange-100">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                <p className="text-sm sm:text-base text-gray-600 px-2">Nous vous répondrons dans les plus brefs délais</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                {/* Section Informations personnelles */}
                <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Civilité</label>
                      <select className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" {...register('civility')}>
                        <option>Monsieur</option>
                        <option>Madame</option>
                        <option>Mademoiselle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Nom *</label>
                      <input 
                        className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" 
                        placeholder="Votre nom"
                        {...register('lastName', { required: true, maxLength: 80 })} 
                      />
                      {errors.lastName && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Nom requis
                      </p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Prénom *</label>
                      <input 
                        className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" 
                        placeholder="Votre prénom"
                        {...register('firstName', { required: true, maxLength: 80 })} 
                      />
                      {errors.firstName && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Prénom requis
                      </p>}
                    </div>
                  </div>
                </div>

                {/* Section Contact */}
                <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Informations de contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Email *</label>
                      <input 
                        className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" 
                        type="email" 
                        placeholder="votre@email.com"
                        {...register('email', { required: true, maxLength: 128 })} 
                      />
                      {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email requis
                      </p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Téléphone</label>
                      <input 
                        className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" 
                        type="tel" 
                        placeholder="+33 6 12 34 56 78"
                        {...register('phone', { maxLength: 32 })} 
                      />
                    </div>
                  </div>
                </div>

                {/* Section Message */}
                <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Votre message
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Sujet *</label>
                      <select className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" {...register('subject', { required: true })}>
                        <option value="">Sélectionnez un sujet</option>
                        <option value="question">Question générale</option>
                        <option value="probleme">Problème technique</option>
                        <option value="attestation">Demande d'attestation</option>
                        <option value="partenariat">Partenariat</option>
                        <option value="autre">Autre</option>
                      </select>
                      {errors.subject && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Sujet requis
                      </p>}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Message *</label>
                      <textarea 
                        className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base min-h-[100px] sm:min-h-[120px] resize-vertical focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" 
                        placeholder="Décrivez votre demande en détail..."
                        {...register('message', { required: true, minLength: 10, maxLength: 1000 })} 
                      />
                      {errors.message && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Message requis (minimum 10 caractères)
                      </p>}
                    </div>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <div className="text-center">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center mx-auto w-full sm:min-w-[200px] sm:w-auto text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Envoyer le message
                      </>
                    )}
                  </button>
                </div>
          </form>
        </div>

        {/* Informations de contact */}
        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">support@attestation-coupons.com</p>
                  <p className="text-sm text-gray-500">Réponse sous 24h</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Horaires</h3>
                  <p className="text-gray-600">Lundi - Vendredi : 9h - 18h</p>
                  <p className="text-gray-600">Samedi : 9h - 12h</p>
                  <p className="text-sm text-gray-500">Heure de Paris (CET)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Réponse rapide</h3>
                  <p className="text-gray-600">Traitement prioritaire</p>
                  <p className="text-sm text-gray-500">Sous 2h pour les urgences</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 bg-gradient-to-r from-orange-50 to-blue-50">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Besoin d'aide ?</h3>
            <div className="space-y-3 text-gray-700">
              <p>• <strong>Problème technique</strong> : Décrivez l'erreur rencontrée</p>
              <p>• <strong>Question sur l'attestation</strong> : Précisez le type de coupon</p>
              <p>• <strong>Demande spéciale</strong> : Expliquez votre situation</p>
              <p>• <strong>Partenariat</strong> : Détaillez votre projet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Boîte de dialogue de traitement */}
      {showProcessingDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {/* Cercle de chargement */}
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="w-20 h-20 border-4 border-orange-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* Titre */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Traitement en cours</h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Veuillez patienter pendant que nos équipes s'occupent du traitement de votre message.
              <br />
              <span className="font-semibold text-orange-600">Vous recevrez un email de confirmation.</span>
            </p>
            
            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowProcessingDialog(false)
                  // Recharger le formulaire
                  window.location.reload()
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Retour au formulaire
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


