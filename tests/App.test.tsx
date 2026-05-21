import { render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../src/context/AuthContext'
import App from '../src/App'

function renderApp(initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows login page at /login', () => {
    renderApp('/login')
    expect(
      screen.getByRole('heading', { name: /welcome back/i }),
    ).toBeInTheDocument()
  })

  it('shows register page at /register', () => {
    renderApp('/register')
    expect(
      screen.getByRole('heading', { name: /create an account/i }),
    ).toBeInTheDocument()
  })

  it('redirects unauthenticated user from /rooms to /login', () => {
    renderApp('/rooms')
    expect(
      screen.getByRole('heading', { name: /welcome back/i }),
    ).toBeInTheDocument()
  })
})
