'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.replace('/login')
  }, [token, router])

  // return null pendant la vérification du token : évite d'afficher brièvement
  // le contenu protégé avant que la redirection ait eu le temps de s'exécuter
  if (!token) return null

  return <>{children}</>
}
