import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthForm.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      login(email, password)
      navigate('/rooms', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-form__title">Welcome back</h1>

        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="auth-form__field">
          <label htmlFor="login-email" className="auth-form__label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="auth-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="login-password" className="auth-form__label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="auth-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="auth-form__submit">
          Log in
        </button>

        <p className="auth-form__footer">
          No account yet?{' '}
          <Link to="/register" className="auth-form__link">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
