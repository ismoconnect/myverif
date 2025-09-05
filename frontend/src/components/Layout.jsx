import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mainServices, giftCards } from '../constants/services'

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navLinkClass = ({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  
  const handleAttesterClick = () => {
    // Scroll vers le haut de la page après un petit délai pour laisser le temps à la navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  // Fermer le menu mobile quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden' // Empêcher le scroll du body
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Scroll vers le haut de la page à chaque changement de route ou actualisation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-full flex flex-col">
      <header className="fixed inset-x-0 top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="w-full pl-2 pr-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://res.cloudinary.com/dxvbuhadg/image/upload/v1756989186/Capture_d_%C3%A9cran_2025-09-04_133053-removebg-preview_hwwpfx.png" alt="Logo" className="h-22 w-22" />
          </Link>
          <nav className="hidden md:flex items-center gap-2 flex-1 pl-4">
            <div className="flex gap-2 ml-24 md:ml-40 lg:ml-64 xl:ml-72">
              <NavLink
                to="/"
                className={() => `inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-center bg-orange-500 text-black hover:bg-orange-600 hover:text-white`}
              >
                Accueil
              </NavLink>
              <NavLink to="/service" className={navLinkClass}>Service</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              <NavLink to="/tracking" className={navLinkClass}>Suivi</NavLink>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative group">
                <button className="nav-item" aria-haspopup="true">Attester mes coupons</button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block group-focus-within:block bg-white rounded-lg shadow-xl ring-1 ring-gray-100 min-w-[260px] z-10 transition duration-150 ease-out origin-top-right">
                  <div className="py-1">
                    {['toneofirst','transcash','pcs','neosurf','paysafecard']
                      .map(slug => mainServices.find(s => s.slug === slug))
                      .filter(Boolean)
                      .map(s => (
                        <Link key={s.slug} to={`/attester/${s.slug}`} onClick={handleAttesterClick} className="nav-item w-full">
                          Attester {s.name}
                        </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="nav-item" aria-haspopup="true">Attester mes cartes cadeaux</button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block group-focus-within:block bg-white rounded-lg shadow-xl ring-1 ring-gray-100 min-w-[260px] z-10 transition duration-150 ease-out origin-top-right">
                  <div className="py-1">
                    {giftCards.map(g => (
                      <Link key={g.slug} to={`/attester/${g.slug}`} onClick={handleAttesterClick} className="nav-item w-full">
                        Attester {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Menu mobile moderne */}
          <div className="md:hidden mobile-menu-container">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-lg"
              aria-label="Menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"></div>
            )}

            {/* Menu mobile */}
            <div className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Header du menu */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-500">
                <span className="text-white font-semibold">Menu</span>
                <button 
                  onClick={closeMobileMenu}
                  className="p-1 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu du menu */}
              <div className="h-full overflow-y-auto bg-white">
                <div className="p-4 space-y-2">
                  <NavLink 
                    to="/" 
                    onClick={closeMobileMenu} 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Accueil
                  </NavLink>
                  
                  <NavLink 
                    to="/service" 
                    onClick={closeMobileMenu} 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Services
                  </NavLink>
                  
                  <NavLink 
                    to="/contact" 
                    onClick={closeMobileMenu} 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </NavLink>
                  
                  <NavLink 
                    to="/tracking" 
                    onClick={closeMobileMenu} 
                    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Suivi
                  </NavLink>

                  {/* Séparateur */}
                  <div className="px-4 py-2">
                    <div className="border-t border-gray-200"></div>
                  </div>

                  {/* Section Attester mes coupons - liens directs */}
                  <div>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Attester mes coupons</div>
                    {['toneofirst','transcash','pcs','neosurf','paysafecard']
                      .map(slug => mainServices.find(s => s.slug === slug))
                      .filter(Boolean)
                      .map(s => (
                        <NavLink 
                          key={s.slug} 
                          to={`/attester/${s.slug}`} 
                          onClick={() => { closeMobileMenu(); handleAttesterClick(); }} 
                          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : ''}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          Attester {s.name}
                        </NavLink>
                    ))}
                  </div>

                  {/* Section Attester mes cartes cadeaux - liens directs */}
                  <div>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Attester mes cartes cadeaux</div>
                    {giftCards.map(g => (
                      <NavLink 
                        key={g.slug} 
                        to={`/attester/${g.slug}`} 
                        onClick={() => { closeMobileMenu(); handleAttesterClick(); }} 
                        className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : ''}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        Attester {g.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      <footer className="border-t bg-gray-900">
        {/* Footer simple pour mobile */}
        <div className="md:hidden px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <img src="https://res.cloudinary.com/dxvbuhadg/image/upload/v1756989186/Capture_d_%C3%A9cran_2025-09-04_133053-removebg-preview_hwwpfx.png" alt="Logo" className="h-8 w-8" />
              <span className="text-white font-semibold">Service d'attestation</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Plateforme sécurisée pour l'attestation de vos coupons et cartes cadeaux.
            </p>
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} Service d'attestation des tickets. Tous droits réservés.
            </div>
          </div>
        </div>

        {/* Footer complet pour ordinateur */}
        <div className="hidden md:block mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Section Logo et Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="https://res.cloudinary.com/dxvbuhadg/image/upload/v1756989186/Capture_d_%C3%A9cran_2025-09-04_133053-removebg-preview_hwwpfx.png" alt="Logo" className="h-12 w-12" />
                <span className="text-lg font-bold text-white">Service d'attestation</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Plateforme sécurisée pour l'attestation de vos coupons et cartes cadeaux. 
                Traitement rapide et fiable.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Section Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/service" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Nos services</Link></li>
                <li><Link to="/attester/toneofirst" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester Toneofirst</Link></li>
                <li><Link to="/attester/transcash" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester Transcash</Link></li>
                <li><Link to="/attester/neosurf" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester Neosurf</Link></li>
                <li><Link to="/attester/paysafecard" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester PaysafeCard</Link></li>
              </ul>
            </div>

            {/* Section Cartes Cadeaux */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Cartes Cadeaux</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/attester/steam" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester Steam</Link></li>
                <li><Link to="/attester/google-play" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester Google Play</Link></li>
                <li><Link to="/attester/itunes" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester iTunes</Link></li>
                <li><Link to="/attester/amazon" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester Amazon</Link></li>
                <li><Link to="/attester/paypal" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Attester PayPal</Link></li>
              </ul>
            </div>

            {/* Section Contact et Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm mb-4">
                <li><Link to="/contact" onClick={handleAttesterClick} className="text-gray-300 hover:text-orange-400 transition-colors">Contactez-nous</Link></li>
                <li><a href="mailto:support@attestation-coupons.com" className="text-gray-300 hover:text-orange-400 transition-colors">support@attestation-coupons.com</a></li>
                <li className="text-gray-300">Lun-Ven: 9h-18h</li>
                <li className="text-gray-300">Sam: 9h-12h</li>
              </ul>
              <div className="bg-orange-900 p-3 rounded-lg">
                <p className="text-xs text-orange-200 font-medium">⚡ Réponse sous 24h</p>
                <p className="text-xs text-orange-300">Traitement prioritaire</p>
              </div>
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 lg:mb-0">
                © {new Date().getFullYear()} Service d'attestation des tickets. Tous droits réservés.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Mentions légales</a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Politique de confidentialité</a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">CGU</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}