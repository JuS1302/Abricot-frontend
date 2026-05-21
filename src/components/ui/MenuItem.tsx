'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type MenuItemProps = {
  href: string
  label: string
  icon: string
  iconActive: string
}

export default function MenuItem({ href, label, icon, iconActive }: MenuItemProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <Link
      href={href}
      // aria-current="page" indique aux lecteurs d'écran que c'est la page active (WCAG 4.1.2)
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex items-center justify-center gap-0 md:gap-[17px] transition-colors
        w-[48px] md:w-[248px] h-[48px] md:h-[78px] rounded-[10px]
        text-base font-normal font-sans leading-none tracking-normal
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${isActive
          ? 'bg-text-primary text-white'
          : 'bg-white text-primary'
        }
      `}
    >
      {/* alt="" car l'icône est décorative — le texte du lien suffit */}
      <Image
        src={isActive ? iconActive : icon}
        alt="Icon de menu"
        width={24}
        height={24}
        className="shrink-0"
      />
      {/* sr-only sur mobile : invisible visuellement mais lu par les lecteurs d'écran */}
      <span className="sr-only md:not-sr-only">{label}</span>
    </Link>
  )
}
