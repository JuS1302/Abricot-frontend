'use client'

import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import MenuItem from '@/components/ui/MenuItem'
import UserIcon from '@/components/ui/UserIcon'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { initials } = useAuth()

  return (
    <header className="w-full bg-white h-[94px] shadow-[0px_4px_12px_1px_#00000005]">
      {/* aria-label obligatoire quand plusieurs <nav> coexistent sur la page (WCAG 4.1.2) */}
      <nav aria-label="Navigation principale" className="px-4 md:px-[100px] h-full flex items-center justify-between">

        <Logo />

        <div className="flex items-center gap-2 md:gap-4">
          <MenuItem
            href="/dashboard"
            label="Tableau de bord"
            icon="/Group.svg"
            iconActive="/Group-white.svg"
          />
          <MenuItem
            href="/projects"
            label="Projets"
            icon="/Folder.svg"
            iconActive="/Folder-white.svg"
          />
        </div>

        {/* aria-label nécessaire : UserIcon n'a pas de texte visible pour les lecteurs d'écran */}
        <Link href="/account" aria-label="Mon compte">
          <UserIcon initials={initials} />
        </Link>

      </nav>
    </header>
  )
}
