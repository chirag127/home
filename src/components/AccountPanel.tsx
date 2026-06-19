/**
 * Account panel — sign in / sign out via Firebase Auth.
 * Lives at /account/ and is shared mental-model across every oriz subdomain
 * (auth.oriz.in custom domain means the user object follows them).
 */
import { useEffect, useState } from 'react'
import { Github, Loader2, LogOut, Mail } from 'lucide-react'
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '~/lib/firebase'

export default function AccountPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const handleGoogle = async () => {
    setError(null)
    setBusy('google')
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (e) {
      setError(asMessage(e))
    } finally {
      setBusy(null)
    }
  }

  const handleGithub = async () => {
    setError(null)
    setBusy('github')
    try {
      await signInWithPopup(auth, new GithubAuthProvider())
    } catch (e) {
      setError(asMessage(e))
    } finally {
      setBusy(null)
    }
  }

  const handleEmailLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setBusy('email')
    try {
      const url = `${window.location.origin}/account/finish-sign-in/`
      await sendSignInLinkToEmail(auth, email, { url, handleCodeInApp: true })
      window.localStorage.setItem('oriz:emailForSignIn', email)
      setLinkSent(true)
    } catch (e) {
      setError(asMessage(e))
    } finally {
      setBusy(null)
    }
  }

  const handleAnon = async () => {
    setError(null)
    setBusy('anon')
    try {
      await signInAnonymously(auth)
    } catch (e) {
      setError(asMessage(e))
    } finally {
      setBusy(null)
    }
  }

  const handleSignOut = async () => {
    setError(null)
    setBusy('out')
    try {
      await signOut(auth)
    } catch (e) {
      setError(asMessage(e))
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <div className="card centered">
        <Loader2 className="spin" size={20} aria-hidden="true" />
        <p>Loading…</p>
        <Styles />
      </div>
    )
  }

  if (user) {
    return (
      <div className="card">
        <div className="me">
          {user.photoURL && (
            <img src={user.photoURL} alt="" className="avatar" referrerPolicy="no-referrer" />
          )}
          <div>
            <p className="me-name">{user.displayName ?? user.email ?? 'Signed in'}</p>
            {user.email && <p className="me-email">{user.email}</p>}
            {user.isAnonymous && <p className="me-email">Anonymous session</p>}
          </div>
        </div>
        <p className="muted">
          You are signed in across every oriz site. Visit any subdomain and
          your session is already there.
        </p>
        <button
          type="button"
          className="btn"
          onClick={handleSignOut}
          disabled={busy === 'out'}
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
        {error && <p className="err">{error}</p>}
        <Styles />
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="h">Sign in</h2>
      <div className="providers">
        <button type="button" className="provider" onClick={handleGoogle} disabled={busy !== null}>
          {busy === 'google' ? <Loader2 className="spin" size={16} /> : <GoogleSvg />}
          <span>Continue with Google</span>
        </button>
        <button type="button" className="provider" onClick={handleGithub} disabled={busy !== null}>
          {busy === 'github' ? <Loader2 className="spin" size={16} /> : <Github size={16} />}
          <span>Continue with GitHub</span>
        </button>
      </div>

      <div className="sep"><span>or with email</span></div>

      <form onSubmit={handleEmailLink} className="email-form">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy !== null || linkSent}
        />
        <button type="submit" className="btn btn-primary" disabled={busy !== null || linkSent}>
          {busy === 'email' ? <Loader2 className="spin" size={16} /> : <Mail size={16} />}
          {linkSent ? 'Link sent' : 'Send sign-in link'}
        </button>
      </form>
      {linkSent && (
        <p className="muted">
          Check your inbox at <strong>{email}</strong>. The link is valid for 1 hour.
        </p>
      )}

      <button type="button" className="anon-link" onClick={handleAnon} disabled={busy !== null}>
        Just browsing — continue anonymously
      </button>

      {error && <p className="err">{error}</p>}
      <Styles />
    </div>
  )
}

function asMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  return String(e)
}

function GoogleSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function Styles() {
  return (
    <style>{`
      .card {
        margin-block: 2rem;
        padding: 1.75rem;
        background: var(--color-bg-soft);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-card);
      }
      .centered { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding-block: 2.5rem; }
      .h { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; margin: 0 0 1.25rem; }
      .providers { display: flex; flex-direction: column; gap: 0.5rem; }
      .provider {
        display: flex; align-items: center; justify-content: center; gap: 0.625rem;
        height: 44px; padding-inline: 1rem;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-button);
        color: var(--color-fg);
        font-family: inherit; font-size: 0.9375rem;
        cursor: pointer;
      }
      .provider:hover:not(:disabled) { border-color: color-mix(in oklab, var(--color-accent) 50%, var(--color-border)); }
      .provider:disabled { opacity: 0.6; cursor: not-allowed; }
      .sep {
        display: flex; align-items: center; gap: 0.75rem;
        margin-block: 1.5rem;
        color: var(--color-fg-soft); font-size: 0.8125rem;
      }
      .sep::before, .sep::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
      .email-form { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      .email-form input {
        flex: 1; min-width: 200px;
        height: 44px; padding-inline: 0.875rem;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-button);
        color: var(--color-fg);
        font-family: inherit; font-size: 0.9375rem;
      }
      .email-form input:focus { outline: none; border-color: color-mix(in oklab, var(--color-accent) 60%, var(--color-border)); }
      .btn, .btn-primary {
        display: inline-flex; align-items: center; gap: 0.5rem;
        height: 44px; padding-inline: 1rem;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-button);
        color: var(--color-fg);
        font-family: inherit; font-size: 0.9375rem; font-weight: 500;
        cursor: pointer;
      }
      .btn-primary { background: var(--color-accent); color: var(--color-accent-fg); border-color: var(--color-accent); }
      .btn-primary:disabled, .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .anon-link {
        display: block; width: 100%; margin-top: 1rem;
        background: transparent; border: 0;
        color: var(--color-fg-muted); font-size: 0.875rem;
        text-align: center; cursor: pointer; text-decoration: underline;
        text-underline-offset: 0.2em;
      }
      .anon-link:hover { color: var(--color-fg); }
      .me { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
      .avatar { width: 56px; height: 56px; border-radius: 999px; }
      .me-name { font-weight: 600; margin: 0; }
      .me-email { color: var(--color-fg-muted); font-size: 0.875rem; margin: 0.125rem 0 0; }
      .muted { color: var(--color-fg-muted); margin-block: 1rem; line-height: 1.5; }
      .err { margin-top: 1rem; padding: 0.75rem 1rem; background: color-mix(in oklab, #f43f5e 15%, transparent); border: 1px solid color-mix(in oklab, #f43f5e 40%, transparent); border-radius: var(--radius-button); color: var(--color-fg); font-size: 0.875rem; }
      .spin { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  )
}
