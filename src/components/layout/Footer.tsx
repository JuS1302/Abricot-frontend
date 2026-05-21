import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    // role="contentinfo" est le rôle sémantique natif du <footer> — explicite pour les lecteurs d'écran
    <footer className="w-full h-[68px] bg-bg-primary px-4 md:px-[100px] flex items-center justify-between">
      <Logo src="/Logo-noir.svg" />
      <p className="font-sans text-sm text-text-muted">Abricot 2025</p>
    </footer>
  )
}
