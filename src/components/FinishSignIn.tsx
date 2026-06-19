/**
 * Email-link finishing page. The user clicked the link in their email; we
 * complete the sign-in and redirect to /account/.
 */
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '~/lib/firebase'

export default function FinishSignIn() {
  const [status, setStatus] = useState<'working' | 'need-email' | 'done' | 'error'>('working')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      setStatus('error')
      setError('This link is invalid or expired.')
      return
    }
    const stored = window.localStorage.getItem('oriz:emailForSignIn')
    if (stored) void finish(stored)
    else setStatus('need-email')
  }, [])

  const finish = async (e: string) => {
    setStatus('working')
    setError(null)
    try {
      await signInWithEmailLink(auth, e, window.location.href)
      window.localStorage.removeItem('oriz:emailForSignIn')
      setStatus('done')
      window.setTimeout(() => {
        window.location.href = '/account/'
      }, 1200)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  if (status === 'working') {
    return (
      <div className="state">
        <Loader2 className="spin" size={28} aria-hidden="true" />
        <p>Signing you in…</p>
        <Styles />
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="state">
        <p className="ok">Signed in. Redirecting to your account…</p>
        <Styles />
      </div>
    )
  }

  if (status === 'need-email') {
    return (
      <div className="state">
        <p>Please confirm the email address you used:</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void finish(email)
          }}
          className="inline-form"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <button type="submit" className="btn-primary">Continue</button>
        </form>
        <Styles />
      </div>
    )
  }

  return (
    <div className="state">
      <p className="err">{error ?? 'Sign-in failed.'}</p>
      <a href="/account/" className="btn-primary">Back to sign in</a>
      <Styles />
    </div>
  )
}

function Styles() {
  return (
    <style>{`
      .state { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
      .ok { color: var(--color-fg); font-size: 1.0625rem; }
      .err {
        padding: 0.875rem 1.25rem;
        background: color-mix(in oklab, #f43f5e 15%, transparent);
        border: 1px solid color-mix(in oklab, #f43f5e 40%, transparent);
        border-radius: var(--radius-button);
        color: var(--color-fg);
      }
      .inline-form { display: flex; gap: 0.5rem; max-width: 360px; width: 100%; }
      .inline-form input {
        flex: 1; height: 44px; padding-inline: 0.875rem;
        background: var(--color-bg-soft);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-button);
        color: var(--color-fg); font-family: inherit; font-size: 0.9375rem;
      }
      .btn-primary {
        display: inline-flex; align-items: center; gap: 0.5rem;
        height: 44px; padding-inline: 1.25rem;
        background: var(--color-accent);
        color: var(--color-accent-fg);
        border: 0;
        border-radius: var(--radius-button);
        font-family: inherit; font-size: 0.9375rem; font-weight: 500;
        cursor: pointer; text-decoration: none;
      }
      .spin { animation: spin 1s linear infinite; color: var(--color-accent); }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  )
}
