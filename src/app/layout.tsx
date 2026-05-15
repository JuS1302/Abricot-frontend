import React from 'react'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-bg-secondary">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
