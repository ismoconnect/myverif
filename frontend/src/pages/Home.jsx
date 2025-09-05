import ServiceCard from '../components/ServiceCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import { mainServices } from '../constants/services'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <HeroSlider
            slides={[
              { src: 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756987470/slider-49_j89qxt.png', title: "Attestez vos coupons en quelques minutes", text: "Soumettez vos codes en toute confiance, notre équipe vérifie et atteste rapidement pour vous faire gagner du temps.", align: 'right', mobileAlign: 'left', bare: true, overlayClass: 'text-white font-bold sm:text-black drop-shadow-[0_3px_6px_rgba(255,255,255,0.55)]' },
              { src: 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756987473/slider-47_ayvj9m.png', title: "Transcash, PCS, Neosurf et plus", text: "Une seule plateforme pour tous vos coupons: Transcash, PCS, Neosurf, Cashlib, Paysafecard, Flexepin et plus encore.", align: 'right', mobileAlign: 'right', bare: true, overlayClass: 'text-white font-bold drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]', maskClass: 'bg-gradient-to-l from-black/40 to-transparent' },
              { src: 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756987468/toneo-first-mastercard_cbts1v.png', title: "Zéro compte requis", text: "Pas d’inscription nécessaire: entrez vos informations, ajoutez vos coupons et recevez votre attestation—simple et efficace.", align: 'left', mobileAlign: 'left', bare: true, overlayClass: 'text-white font-bold sm:text-black drop-shadow-[0_3px_6px_rgba(255,255,255,0.55)]' }
            ]}
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Service d'attestation des tickets</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Soumettez vos tickets et coupons pour une attestation rapide et un suivi simplifié. Aucune authentification requise.</p>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mainServices.map(s => (
          <ServiceCard
            key={s.slug}
            title={s.name}
            description={s.description}
            to={`/attester/${s.slug}`}
            imageUrl={
              s.slug === 'toneofirst'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756945228/toneofirst-1_cuqqko.png'
                : s.slug === 'transcash'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756946889/2cartes-faces_tc_MIN2-q6u7r7ukv71pgctqo27kumjllmmdmfmeoiq9dfcw00_ni5eqw.png'
                : s.slug === 'pcs'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756947242/HomeCartes.4c669f864a36cc34dba7_ohbptf.png'
                : s.slug === 'neosurf'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756947644/images_myo6ak.jpg'
                : s.slug === 'cashlib'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756986822/gfk_j2kumy.png'
                : s.slug === 'paysafecard'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756985441/images-paysafe-card_kzwmdp.png'
                : s.slug === 'flexepin'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756986025/flexepin-30_ub24d4.png'
                : s.slug === 'ecopayz'
                ? 'https://res.cloudinary.com/dxvbuhadg/image/upload/v1756986231/index3-1_wzxqhn.png'
                : undefined
            }
          />
        ))}
      </section>

      {/* Section Comment ça marche */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-gray-600">Un processus simple en 3 étapes pour attester vos coupons</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">1</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sélectionnez votre service</h3>
            <p className="text-gray-600">Choisissez le type de coupon ou carte cadeau que vous souhaitez attester parmi nos services disponibles</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">2</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Remplissez le formulaire</h3>
            <p className="text-gray-600">Entrez vos informations personnelles et les codes de vos coupons. Vous pouvez traiter jusqu'à 30 coupons en une fois</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">3</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Recevez votre attestation</h3>
            <p className="text-gray-600">Notre équipe vérifie et valide vos coupons. Vous recevez votre attestation en quelques minutes</p>
          </div>
        </div>
      </section>
    </div>
  )
}


