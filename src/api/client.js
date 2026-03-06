import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL, timeout: 120000 })

// ── AUTH ─────────────────────────────────────────────────────────
export const authAPI = {
  login:  (email, password)            => api.post('/auth/login', { email, password }),
  signup: (email, password, name, age) => api.post('/auth/signup', { email, password, name, age }),
  reset:  (email, new_password)        => api.post('/auth/reset-password', { email, new_password }),
  delete: (user_id)                    => api.delete('/auth/account', { data: { user_id } }),

  // Saves transactions tagged with filename so Statement History can group by file
  saveStatements: (user_id, records, filename) =>
    api.post('/auth/save-statements', { user_id, records, filename }),

  // Loads all saved transactions for this user
  loadStatements: (user_id) =>
    api.get(`/auth/statements/${user_id}`),
}

// ── UPLOAD ───────────────────────────────────────────────────────
export const uploadAPI = {
  upload: (file, password = '') => {
    const form = new FormData()
    form.append('file', file)
    form.append('password', password)
    return api.post('/api/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ── FORECAST ─────────────────────────────────────────────────────
export const forecastAPI = {
  // main.py: POST /api/forecast expects { transactions }
  forecast: (transactions) =>
    api.post('/api/forecast', { transactions }),
}

// ── AI CHAT ──────────────────────────────────────────────────────
export const chatAPI = {
  // main.py: POST /api/chat expects { message, history, transactions, currency }
  send: (message, history, transactions, currency = 'IN') =>
    api.post('/api/chat', { message, history, transactions, currency }),
}

// ── SMARTCASH ────────────────────────────────────────────────────
export const smartCashAPI = {
  // main.py: GET /api/smartcash/cards?currency=IN
  getCards: (currency = 'IN') =>
    api.get('/api/smartcash/cards', { params: { currency } }),

  // BUG FIX: was '/api/smartcash/analyse' — main.py uses 'analyze' (no trailing e)
  // main.py: POST /api/smartcash/analyze expects { transactions, wallet, currency }
  analyze: (transactions, wallet, currency = 'IN') =>
    api.post('/api/smartcash/analyze', { transactions, wallet, currency }),
}

// ── INVEST ───────────────────────────────────────────────────────
export const investAPI = {
  // main.py: POST /api/invest/analyze expects { transactions, threshold }
  analyze: (transactions, threshold = 10) =>
    api.post('/api/invest/analyze', { transactions, threshold }),
}

export default api