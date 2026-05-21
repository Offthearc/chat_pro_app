import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User } from '../types/index'
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
} from '../api/auth'

interface AuthContextValue {
  user: User | null
  register: (username: string, email: string, password: string) => User
  login: (email: string, password: string) => User
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())

  const register = useCallback(
    (username: string, email: string, password: string): User => {
      const newUser = apiRegister(username, email, password)
      setUser(newUser)
      return newUser
    },
    [],
  )

  const login = useCallback((email: string, password: string): User => {
    const loggedIn = apiLogin(email, password)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
