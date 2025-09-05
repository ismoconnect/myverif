import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { euCountries } from '../constants/euCountries'
import { useNavigate } from 'react-router-dom'
import { FirestoreService } from '../services/firestoreService'
import { validateCouponCode, getCouponCodeErrorMessage, validateEmail, couponCodeLengths } from '../utils/validators'

export default function CouponForm({ type }) {
  const [showProcessingDialog, setShowProcessingDialog] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      type,
      civility: 'Monsieur',
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      country: 'France',
      hideCodes: false,
      coupons: [{ code: '', amount: '' }],
      numCoupons: 1,
    }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'coupons' })
  const numCoupons = watch('numCoupons')
  const hideCodes = watch('hideCodes')

  // Fonction pour convertir le code en majuscules
  const handleCodeChange = (index, value) => {
    const upperValue = value.toUpperCase()
    setValue(`coupons.${index}.code`, upperValue)
  }

  // Fonction pour obtenir le nombre de caractères restants
  const getRemainingChars = (currentValue) => {
    const maxLength = couponCodeLengths[type.toLowerCase()] || 10
    return maxLength - (currentValue?.length || 0)
  }

  // Ensure number of coupon boxes matches numCoupons
  useEffect(() => {
    const target = Math.max(1, Math.min(30, Number(numCoupons) || 1)) // Limiter à 30 maximum
    if (fields.length < target) {
      // Garder le focus sur le champ "Nombre de coupons"
      const numCouponsInput = document.querySelector('input[name="numCoupons"]')
      for (let i = fields.length; i < target; i++) append({ code: '', amount: '' })
      // Remettre le focus sur le champ "Nombre de coupons" après ajout des champs
      if (numCouponsInput) {
        setTimeout(() => {
          numCouponsInput.focus()
        }, 50)
      }
    } else if (fields.length > target) {
      for (let i = fields.length - 1; i >= target; i--) remove(i)
    }
  }, [numCoupons, fields.length, append, remove])

  const onSubmit = async (values) => {
    try {
      // Afficher la boîte de dialogue de traitement
      setShowProcessingDialog(true)
      
      console.log('Données du formulaire:', values)
      
      // Utiliser le service Firestore pour enregistrer
      const result = await FirestoreService.submitCouponSubmission(values)
      
      if (result.success) {
        console.log('Soumission enregistrée avec succès:', result)
        
        // Simuler un délai de traitement (2 secondes)
        setTimeout(() => {
          setShowProcessingDialog(false)
          toast.success(`Demande d'attestation enregistrée avec succès !`)
          // Rediriger vers la page de suivi avec le numéro de référence
          navigate(`/tracking/${result.referenceNumber}`)
        }, 2000)
      } else {
        throw new Error(result.error || 'Erreur inconnue lors de l\'enregistrement')
      }
      
    } catch (err) {
      setShowProcessingDialog(false)
      console.error('Erreur détaillée lors de l\'enregistrement:', err)
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Erreur lors de l\'enregistrement de votre demande'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err.code) {
        switch (err.code) {
          case 'permission-denied':
            errorMessage = 'Erreur de permissions. Vérifiez la configuration Firebase.'
            break
          case 'unavailable':
            errorMessage = 'Service temporairement indisponible. Réessayez plus tard.'
            break
          case 'unauthenticated':
            errorMessage = 'Erreur d\'authentification. Vérifiez la configuration.'
            break
          default:
            errorMessage = `Erreur Firebase: ${err.code}`
        }
      }
      
      toast.error(errorMessage)
    }
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-orange-100">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Attestation de {type}</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">Remplissez le formulaire ci-dessous pour attester vos coupons</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <input type="hidden" value={type} {...register('type')} />

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
              <input className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" placeholder="Votre nom" {...register('lastName', { required: true, maxLength: 80 })} />
              {errors.lastName && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Nom requis
              </p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Prénoms *</label>
              <input className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" placeholder="Vos prénoms" {...register('firstName', { required: true, maxLength: 80 })} />
              {errors.firstName && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Prénoms requis
              </p>}
            </div>
          </div>
        </div>

        {/* Section Contact */}
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Informations de contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Email *</label>
              <input className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" type="email" placeholder="votre@email.com" {...register('email', { 
                required: true, 
                maxLength: 128,
                validate: validateEmail
              })} />
              {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message || 'Email requis'}
              </p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Téléphone</label>
              <input className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" type="tel" placeholder="+33 6 12 34 56 78" {...register('phone', { maxLength: 32 })} />
            </div>
          </div>
        </div>

        {/* Section Localisation et Configuration */}
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Localisation et configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Pays (UE) *</label>
              <select className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" {...register('country', { required: true })}>
                {euCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Nombre de coupons *</label>
              <input className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" type="number" min={1} max={30} placeholder="1-30" {...register('numCoupons', { valueAsNumber: true, min: 1, max: 30, required: true })} />
              {errors.numCoupons && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Maximum 30 coupons autorisés
              </p>}
            </div>
          </div>
        </div>

        {/* Section Options */}
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Options de sécurité
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <input id="hideCodes" type="checkbox" className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2" {...register('hideCodes')} />
            <label htmlFor="hideCodes" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
              Cacher mes codes lors de la saisie
            </label>
          </div>
        </div>

        {/* Section Coupons */}
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Codes de vos coupons
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} data-coupon-index={index} className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-orange-100 hover:border-orange-200 transition-all duration-200">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm font-bold">
                    {index + 1}
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">Coupon {index + 1}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">
                      Code coupon * 
                      <span className="text-orange-600 font-normal">
                        ({couponCodeLengths[type.toLowerCase()] || 10} caractères)
                      </span>
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white font-mono uppercase" 
                        type={hideCodes ? 'password' : 'text'} 
                        autoComplete="off" 
                        placeholder={`Entrez le code (${couponCodeLengths[type.toLowerCase()] || 10} caractères)`}
                        maxLength={couponCodeLengths[type.toLowerCase()] || 10}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        {...register(`coupons.${index}.code`, { 
                          required: true,
                          validate: (value) => {
                            if (!value) return 'Code requis'
                            if (!validateCouponCode(value, type)) {
                              return getCouponCodeErrorMessage(type)
                            }
                            return true
                          }
                        })} 
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {getRemainingChars(watch(`coupons.${index}.code`))}
                      </div>
                    </div>
                    {errors.coupons?.[index]?.code && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.coupons[index].code.message}
                    </p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Montant (€)</label>
                    <input className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-center focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white" placeholder="Ex: 50" {...register(`coupons.${index}.amount`, { pattern: /^\d+(?:[\.,]\d+)?$/ })} />
                    {errors.coupons?.[index]?.amount && <p className="text-xs sm:text-sm text-red-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Montant invalide
                    </p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="text-center">
          <button disabled={isSubmitting} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center mx-auto w-full sm:min-w-[200px] sm:w-auto text-sm sm:text-base">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Attester mon coupon
              </>
            )}
          </button>
        </div>
      </form>

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
              Veuillez patienter pendant que nos équipes s'occupent du traitement de votre demande.
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


