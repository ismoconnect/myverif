export const mainServices = [
  { slug: 'toneofirst', name: 'Toneofirst', description: 'coupons prépayés' },
  { slug: 'transcash', name: 'Transcash', description: 'cartes rechargeables' },
  { slug: 'pcs', name: 'PCS', description: 'coupons prépayés' },
  { slug: 'neosurf', name: 'Neosurf', description: 'coupons prépayés' },
  { slug: 'paysafecard', name: 'PaysafeCard', description: 'coupons internationaux' },
  { slug: 'cashlib', name: 'Cashlib', description: 'vouchers prépayés' },
  { slug: 'flexepin', name: 'Flexepin', description: 'vouchers numériques' },
  { slug: 'ecopayz', name: 'ecoPayz', description: 'portefeuille électronique' },
]

export const giftCards = [
  { slug: 'steam', name: 'Steam Wallet' },
  { slug: 'google-play', name: 'Google Play' },
  { slug: 'itunes', name: 'iTunes/Apple Store' },
  { slug: 'amazon', name: 'Amazon' },
  { slug: 'paypal', name: 'PayPal vouchers' },
  { slug: 'netflix', name: 'Netflix' },
  { slug: 'spotify', name: 'Spotify' },
]

export function findServiceBySlug(slug) {
  return mainServices.find(s => s.slug === slug) || giftCards.find(s => s.slug === slug)
}


