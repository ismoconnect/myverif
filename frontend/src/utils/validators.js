export function isNumeric(value) {
  return /^\d+(?:[\.,]\d+)?$/.test(String(value ?? ''))
}

export function isEmail(value) {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
}


