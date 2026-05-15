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
      <nav className="px-[100px] h-full flex items-center justify-between">

        <Logo />

        <div className="flex items-center gap-4">
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

        <Link href="/account">
          <UserIcon initials={initials} />
        </Link>

      </nav>
    </header>
  )
}
