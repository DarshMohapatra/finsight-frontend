import { useState, useRef, useEffect } from 'react'
import api from '../../api/client'

const SCOPES        = 'https://www.googleapis.com/auth/gmail.readonly'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function useGmailToken() {
  const [token,   setToken]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const clientRef = useRef(null)

  // Load GSI script once
  useEffect(() => {
    if (document.getElementById('gsi-script')) return
    const s    = document.createElement('script')
    s.id       = 'gsi-script'
    s.src      = 'https://accounts.google.com/gsi/client'
    s.async    = true
    document.body.appendChild(s)
  }, [])

  function requestToken() {
    setError('')
    if (!GOOGLE_CLIENT_ID) {
      setError('VITE_GOOGLE_CLIENT_ID is not set in your .env file.')
      return
    }

    function tryInit() {
      if (!window.google?.accounts?.oauth2) {
        setTimeout(tryInit, 300)
        return
      }
      clientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope:     SCOPES,
        callback:  async (resp) => {
          if (resp.error) {
            setError(`Google sign-in failed: ${resp.error}`)
            setLoading(false)
            return
          }
          // Validate scope server-side before proceeding
          try {
            const res = await api.post('/api/gmail/validate', { access_token: resp.access_token })
            if (!res.data.success) {
              setError(res.data.error || 'Token validation failed')
              setLoading(false)
              return
            }
            setToken(resp.access_token)
          } catch {
            setError('Could not validate token with server.')
          }
          setLoading(false)
        },
      })
      setLoading(true)
      clientRef.current.requestAccessToken()
    }
    tryInit()
  }

  async function revokeToken(t) {
    const tok = t || token
    if (!tok) return
    try {
      await api.post('/api/gmail/revoke', { access_token: tok })
    } catch { /* best effort */ }
    if (window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(tok)
    }
    setToken('')
  }

  return { token, loading, error, requestToken, revokeToken }
}