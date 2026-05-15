'use client'

import { createContext, useContext, useState } from 'react'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

type AuthContextType = {
  token: string | null
  user: User | null
  initials: string
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  )
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const initials = user?.name ? getInitials(user.name) : ''

  return (
    <AuthContext.Provider value={{ token, user, initials, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}
