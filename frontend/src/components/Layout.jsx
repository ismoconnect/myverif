import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { mainServices, giftCards } from '../constants/services'

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navLinkClass = ({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
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
                        <Link key={s.slug} to={`/attester/${s.slug}`} className="nav-item w-full">
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
                      <Link key={g.slug} to={`/attester/${g.slug}`} className="nav-item w-full">
                        Attester {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="list-none px-3 py-2 rounded-md text-sm font-medium bg-orange-500 text-black hover:bg-orange-600 cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
                <span className="sr-only">Menu</span>
              </span>
            </button>
            {isMobileMenuOpen && (
              <div className="absolute right-4 mt-2 bg-white rounded-lg shadow-xl ring-1 ring-gray-100 min-w-[240px] z-10 p-2 space-y-1">
                <NavLink to="/" onClick={closeMobileMenu} className={({isActive}) => `nav-item w-full ${isActive ? 'nav-item-active' : ''}`}>Accueil</NavLink>
                <NavLink to="/service" onClick={closeMobileMenu} className={({isActive}) => `nav-item w-full ${isActive ? 'nav-item-active' : ''}`}>Service</NavLink>
                <NavLink to="/contact" onClick={closeMobileMenu} className={({isActive}) => `nav-item w-full ${isActive ? 'nav-item-active' : ''}`}>Contact</NavLink>
                <div className="px-3 py-1 text-xs font-semibold uppercase text-gray-500">Attester mes coupons</div>
                {['toneofirst','transcash','pcs','neosurf','paysafecard']
                  .map(slug => mainServices.find(s => s.slug === slug))
                  .filter(Boolean)
                  .map(s => (
                    <NavLink key={s.slug} to={`/attester/${s.slug}`} onClick={closeMobileMenu} className={({isActive}) => `nav-item w-full ${isActive ? 'nav-item-active' : ''}`}>
                      Attester {s.name}
                    </NavLink>
                ))}
                <div className="px-3 py-1 text-xs font-semibold uppercase text-gray-500">Attester mes cartes cadeaux</div>
                {giftCards.map(g => (
                  <NavLink key={g.slug} to={`/attester/${g.slug}`} onClick={closeMobileMenu} className={({isActive}) => `nav-item w-full ${isActive ? 'nav-item-active' : ''}`}>
                    Attester {g.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-gray-500">© {new Date().getFullYear()} Coupons</div>
      </footer>
    </div>
  )
}


