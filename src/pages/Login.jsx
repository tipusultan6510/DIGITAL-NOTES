import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(email, password)
      else await signup(email, password)
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
        <p className="font-semibold text-lg text-ink text-center">My Agency Knowledge</p>
        <p className="text-sm text-ink-muted text-center mt-1 mb-5">Your private travel agency notebook</p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" className="w-full rounded-xl border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-accent-400"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" className="w-full rounded-xl border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-accent-400"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit" disabled={busy}
            className="w-full rounded-xl bg-navy text-white py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-sm text-accent-600 mt-4"
        >
          {mode === 'login' ? "New here? Create an account" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
