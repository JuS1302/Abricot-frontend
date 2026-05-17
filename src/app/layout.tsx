import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang="fr" obligatoire pour l'accessibilité : permet aux lecteurs d'écran
    // de choisir la bonne voix de synthèse (WCAG 3.1.1)
    <html lang="fr">
      <body className="bg-bg-secondary">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
