'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import MenuItem from '@/components/ui/MenuItem'
import UserIcon from '@/components/ui/UserIcon'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { initials, user } = useAuth()
  const pathname = usePathname()
  const isAccount = pathname === '/account'

  return (
    <header className="sticky top-0 z-50 w-full bg-white h-[94px] shadow-[0px_4px_12px_1px_#00000005]">
      {/* aria-label obligatoire quand plusieurs <nav> coexistent sur la page (WCAG 4.1.2) */}
      <nav aria-label="Navigation principale" className="px-4 md:px-[100px] h-full flex items-center justify-between">

        <Logo />

        <div className="flex items-center gap-2 md:gap-4">
          {/* Group.svg viewBox 24×24, Folder.svg viewBox 29×23 → height réel = 24×23/29 = 19 */}
          <MenuItem
            href="/dashboard"
            label="Tableau de bord"
            icon="/Group.svg"
            iconActive="/Group-white.svg"
            iconWidth={24}
            iconHeight={24}
          />
          <MenuItem
            href="/projects"
            label="Projets"
            icon="/Folder.svg"
            iconActive="/Folder-white.svg"
            iconWidth={24}
            iconHeight={19}
          />
        </div>

        {/* aria-label nécessaire : UserIcon n'a pas de texte visible pour les lecteurs d'écran */}
        <Link href="/account" aria-label="Mon compte" className="relative inline-block">
          <UserIcon initials={initials} color={isAccount ? 'active' : 'primary'} />
          {!user?.name && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white" />
          )}
        </Link>

      </nav>
    </header>
  )
}
