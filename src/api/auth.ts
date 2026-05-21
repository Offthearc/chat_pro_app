import type { User } from '../types/index'

const USERS_KEY = 'chat_pro_app:users'
const CURRENT_USER_KEY = 'chat_pro_app:currentUser'

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as User[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function register(
  username: string,
  email: string,
  password: string,
): User {
  const users = readUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email is already registered')
  }
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: btoa(password),
    createdAt: new Date().toISOString(),
  }
  writeUsers([...users, user])
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  return user
}

export function login(email: string, password: string): User {
  const users = readUsers()
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.passwordHash === btoa(password),
  )
  if (!user) {
    throw new Error('Invalid email or password')
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  return user
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function getAllUsers(): User[] {
  return readUsers()
}
