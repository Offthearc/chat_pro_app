import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import {
  register,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
} from '../src/api/auth'
import { AuthProvider, useAuth } from '../src/context/AuthContext'
import { LoginPage } from '../src/pages/LoginPage'
import { RegisterPage } from '../src/pages/RegisterPage'
import { NavBar } from '../src/components/NavBar'

function renderWithProviders(ui: React.ReactElement, initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  )
}

describe('auth API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('registers a new user and stores in localStorage', () => {
    const user = register('alice', 'alice@example.com', 'secret')
    expect(user.username).toBe('alice')
    expect(user.email).toBe('alice@example.com')
    expect(user.id).toBeTruthy()
    expect(getAllUsers()).toHaveLength(1)
  })

  it('persists current user in localStorage after register', () => {
    register('alice', 'alice@example.com', 'secret')
    const current = getCurrentUser()
    expect(current).not.toBeNull()
    expect(current?.username).toBe('alice')
  })

  it('throws when registering duplicate email', () => {
    register('alice', 'alice@example.com', 'secret')
    expect(() => register('alice2', 'alice@example.com', 'other')).toThrow(
      /already registered/i,
    )
  })

  it('logs in with correct credentials', () => {
    register('alice', 'alice@example.com', 'secret')
    logout()
    const user = login('alice@example.com', 'secret')
    expect(user.username).toBe('alice')
    expect(getCurrentUser()?.username).toBe('alice')
  })

  it('throws on wrong password', () => {
    register('alice', 'alice@example.com', 'secret')
    logout()
    expect(() => login('alice@example.com', 'wrong')).toThrow(
      /invalid email or password/i,
    )
  })

  it('throws on unknown email', () => {
    expect(() => login('nobody@example.com', 'pass')).toThrow(
      /invalid email or password/i,
    )
  })

  it('logout clears current user from localStorage', () => {
    register('alice', 'alice@example.com', 'secret')
    logout()
    expect(getCurrentUser()).toBeNull()
  })

  it('auth state persists across simulated page refresh', () => {
    register('alice', 'alice@example.com', 'secret')
    const current = getCurrentUser()
    expect(current?.username).toBe('alice')
  })
})

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders username, email, password fields and submit button', () => {
    renderWithProviders(<RegisterPage />, '/register')
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /register/i }),
    ).toBeInTheDocument()
  })

  it('shows inline error for duplicate email', async () => {
    register('existing', 'taken@example.com', 'pass')
    renderWithProviders(<RegisterPage />, '/register')
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/username/i), 'newuser')
    await user.type(screen.getByLabelText(/email/i), 'taken@example.com')
    await user.type(screen.getByLabelText(/password/i), 'mypass')
    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/already registered/i)
  })
})

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders email, password fields and submit button', () => {
    renderWithProviders(<LoginPage />, '/login')
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows inline error for wrong password', async () => {
    register('alice', 'alice@example.com', 'secret')
    renderWithProviders(<LoginPage />, '/login')
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      /invalid email or password/i,
    )
  })
})

describe('NavBar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows username when logged in', () => {
    register('alice', 'alice@example.com', 'secret')
    renderWithProviders(<NavBar />, '/')
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('shows logout button when logged in', () => {
    register('alice', 'alice@example.com', 'secret')
    renderWithProviders(<NavBar />, '/')
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('does not show username or logout when not logged in', () => {
    renderWithProviders(<NavBar />, '/')
    expect(screen.queryByRole('button', { name: /logout/i })).toBeNull()
  })

  it('logout button clears auth state', async () => {
    register('alice', 'alice@example.com', 'secret')
    renderWithProviders(<NavBar />, '/')
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /logout/i }))

    expect(getCurrentUser()).toBeNull()
  })
})

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides user from localStorage on initial render', () => {
    register('bob', 'bob@example.com', 'pass')

    function TestComponent() {
      const { user } = useAuth()
      return <span>{user?.username ?? 'no user'}</span>
    }

    renderWithProviders(<TestComponent />, '/')
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('updates user state after logout via context', async () => {
    register('bob', 'bob@example.com', 'pass')

    function TestComponent() {
      const { user, logout: ctxLogout } = useAuth()
      return (
        <>
          <span>{user?.username ?? 'no user'}</span>
          <button onClick={ctxLogout}>logout</button>
        </>
      )
    }

    renderWithProviders(<TestComponent />, '/')
    expect(screen.getByText('bob')).toBeInTheDocument()

    const user = userEvent.setup()
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'logout' }))
    })

    expect(screen.getByText('no user')).toBeInTheDocument()
  })
})
