'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Logo from '@/components/ui/Logo'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Link from '@/components/ui/Link'
import { useLogin } from '@/hooks/useLogin'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin, error, isLoading } = useLogin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleLogin(email, password)
    if (success) router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">

      {/* ===== GAUCHE - Formulaire ===== */}
      <div className="w-full md:w-2/5 bg-white flex flex-col px-8 md:px-[100px] py-10 md:py-[60px]">
        <Logo width={253} height={32} className="self-center" />

        <div className="flex-1 flex flex-col justify-center gap-8">
          <h1 className="font-display font-bold text-3xl md:text-[40px] leading-none text-primary text-center">
            Connexion
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full"
            />
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full"
            />

            {/* role="alert" : le lecteur d'écran annonce l'erreur automatiquement (WCAG 4.1.3) */}
            {error && (
              <p role="alert" className="text-sm font-sans text-danger">{error}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full mt-2">
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

          </form>
        </div>

        <p className="text-sm font-sans text-text-muted text-center">
          Pas encore de compte ?{' '}
          <Link href="/register">Créer un compte</Link>
        </p>
      </div>

      {/* ===== DROITE - Photo (cachée sur mobile) ===== */}
      <div className="hidden md:block md:w-3/5 relative">
        <Image
          src="/Login.jpg"
          alt="Matériel de bureau rangé"
          fill
          className="object-cover"
        />
      </div>

    </div>
  )
}
