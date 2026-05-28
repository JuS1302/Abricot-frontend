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
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Token et user stockés uniquement en mémoire React (pas de localStorage)
  // déconnexion automatique au rafraîchissement de la page
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const login = (token: string, user: User) => {
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  const initials = user?.name ? getInitials(user.name) : ''

  return (
    <AuthContext.Provider value={{ token, user, initials, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}
