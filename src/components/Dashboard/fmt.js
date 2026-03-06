export default function fmt(amount, currency = 'IN') {
  const syms = { IN:'₹', US:'$', UK:'£', CA:'C$', AU:'A$' }
  const sym = syms[currency] || '₹'
  if (currency === 'IN') {
    if (amount >= 1e7) return `${sym}${(amount/1e7).toFixed(1)}Cr`
    if (amount >= 1e5) return `${sym}${(amount/1e5).toFixed(1)}L`
    if (amount >= 1e3) return `${sym}${(amount/1e3).toFixed(1)}K`
    return `${sym}${Math.round(amount).toLocaleString()}`
  }
  if (amount >= 1e6) return `${sym}${(amount/1e6).toFixed(1)}M`
  if (amount >= 1e3) return `${sym}${(amount/1e3).toFixed(1)}K`
  return `${sym}${Math.round(amount).toLocaleString()}`
}