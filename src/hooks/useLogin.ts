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
      console.log(token);
      login(token, user)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, error, isLoading }
}
