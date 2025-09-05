export function isNumeric(value) {
  return /^\d+(?:[\.,]\d+)?$/.test(String(value ?? ''))
}

export function isEmail(value) {
  if (!value) return true
  // Validation stricte de l'email avec @ obligatoire
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
}

// Configuration des longueurs de codes par type de coupon
export const couponCodeLengths = {
  'toneofirst': 10,
  'transcash': 12,
  'paysafecard': 16,
  'neosurf': 10,
  'pcs': 10, // Valeur par défaut
  'cashlib': 10, // Valeur par défaut
  'flexepin': 10, // Valeur par défaut
  'ecopayz': 10, // Valeur par défaut
  // Gift cards
  'steam': 10,
  'google-play': 10,
  'itunes': 10,
  'amazon': 10,
  'paypal': 10,
  'netflix': 10,
  'spotify': 10,
}

// Validation du code de coupon selon le type
export function validateCouponCode(code, type) {
  if (!code || !type) return false
  
  const expectedLength = couponCodeLengths[type.toLowerCase()]
  if (!expectedLength) return false
  
  // Vérifier la longueur exacte
  if (code.length !== expectedLength) return false
  
  // Vérifier que le code ne contient que des caractères alphanumériques
  return /^[A-Za-z0-9]+$/.test(code)
}

// Message d'erreur pour la validation des codes
export function getCouponCodeErrorMessage(type) {
  const expectedLength = couponCodeLengths[type.toLowerCase()]
  if (!expectedLength) return 'Type de coupon non reconnu'
  
  return `Le code doit contenir exactement ${expectedLength} caractères alphanumériques`
}

// Validation de l'email avec message d'erreur personnalisé
export function validateEmail(email) {
  if (!email) return 'Email requis'
  if (!isEmail(email)) return 'Format d\'email invalide (exemple: nom@domaine.com)'
  return true
}


