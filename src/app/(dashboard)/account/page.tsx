'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AccountPage() {
  const { token, user, updateUser } = useAuth()

  const nameParts = user?.name?.split(' ') ?? []
  const [firstName, setFirstName]         = useState(nameParts[0] ?? '')
  const [lastName, setLastName]           = useState(nameParts.slice(1).join(' '))
  const [email, setEmail]                 = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]     = useState('')
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [success, setSuccess]             = useState(false)
  const [error, setError]                 = useState('')

  async function handleSubmit() {
    if (!token) return

    // Si un des deux champs mot de passe est rempli, les deux sont requis
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      setError('Remplissez les deux champs mot de passe pour le modifier.')
      return
    }

    setIsSubmitting(true)
    setSuccess(false)
    setError('')
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
      await api.updateProfile(token, { name: fullName, email: email.trim() })
      updateUser({ ...user!, name: fullName, email: email.trim() })

      if (currentPassword && newPassword) {
        await api.updatePassword(token, { currentPassword, newPassword })
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="px-4 md:px-25 py-15">

      <div className="border border-border rounded-[10px] bg-bg-primary p-10 md:p-15 flex flex-col gap-10">

        {/* En-tête */}
        <div className="flex flex-col gap-3">
          <h1 className="font-display font-semibold text-2xl text-text-primary leading-none">
            Mon compte
          </h1>
          <p className="font-sans text-base text-text-muted leading-none">
            {user?.name}
          </p>
        </div>

        {/* Formulaire */}
        <div className="flex flex-col gap-6">
          <Input
            label="Nom"
            name="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            inputClassName="text-xs! text-text-muted!"
          />
          <Input
            label="Prénom"
            name="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            inputClassName="text-xs! text-text-muted!"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            inputClassName="text-xs! text-text-muted!"
          />
          <Input
            label="Mot de passe actuel"
            name="currentPassword"
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            inputClassName="text-xs! text-text-muted!"
          />
          <Input
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            inputClassName="text-xs! text-text-muted!"
          />
        </div>

        {/* role="alert" : le lecteur d'écran annonce le message automatiquement (WCAG 4.1.3) */}
        {success && (
          <p role="alert" className="font-sans text-sm text-primary">
            Informations mises à jour avec succès.
          </p>
        )}
        {error && (
          <p role="alert" className="font-sans text-sm text-danger">
            {error}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-fit disabled:opacity-50"
        >
          Modifier les informations
        </Button>

      </div>

    </main>
  )
}
