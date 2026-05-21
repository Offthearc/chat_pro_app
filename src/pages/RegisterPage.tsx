import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthForm.css'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      register(username, email, password)
      navigate('/rooms', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="auth-form__title">Create an account</h1>

        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="auth-form__field">
          <label htmlFor="reg-username" className="auth-form__label">
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            className="auth-form__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="reg-email" className="auth-form__label">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className="auth-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="reg-password" className="auth-form__label">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            className="auth-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="auth-form__submit">
          Register
        </button>

        <p className="auth-form__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-form__link">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
