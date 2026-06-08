import Link from 'next/link'
import Logo from '@/components/ui/Logo'

// Affichée automatiquement par Next.js pour toute URL introuvable
export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center gap-8 px-4">
      <Logo />

      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display font-bold text-[80px] leading-none text-primary">
          404
        </h1>
        <p className="font-display font-semibold text-2xl text-text-primary">
          Page introuvable
        </p>
        <p className="font-sans text-base text-text-muted max-w-sm">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="h-[50px] px-8 rounded-[10px] bg-text-primary text-white font-sans text-base flex items-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Retour au tableau de bord
      </Link>
    </div>
  )
}
