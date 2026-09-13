import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, user } = await api.login(email, password)
      login(token, user)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Connexion démo : active le mode démo (données fictives, sans backend)
  // puis se connecte avec des identifiants qui ne sont jamais vérifiés.
  const handleDemoLogin = async (): Promise<boolean> => {
    api.enableDemoMode()
    return handleLogin('demo@abricot.com', 'Demo1234!')
  }

  return { handleLogin, handleDemoLogin, error, isLoading }
}
