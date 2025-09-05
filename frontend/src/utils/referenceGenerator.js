// Générateur de numéros de référence uniques
export function generateReferenceNumber() {
  const timestamp = Date.now().toString(36) // Base 36 pour plus de compacité
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  // Format: REF-XXXXXX-YYYYYY (REF + timestamp + random)
  return `REF-${timestamp}-${randomPart}`
}

// Validation du format de numéro de référence
export function isValidReferenceNumber(reference) {
  const pattern = /^REF-[a-z0-9]+-[A-Z0-9]+$/
  return pattern.test(reference)
}

// Exemple de numéro généré: REF-1a2b3c4d-EFGHIJ
