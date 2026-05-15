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
      className={`
        flex items-center justify-center gap-[17px] transition-colors
        w-[248px] h-[78px] rounded-[10px]
        text-base font-normal font-sans leading-none tracking-normal
        ${isActive
          ? 'bg-text-primary text-white'
          : 'bg-white text-primary'
        }
      `}
    >
      <Image
        src={isActive ? iconActive : icon}
        alt=""
        width={24}
        height={24}
        className="shrink-0"
      />
      {label}
    </Link>
  )
}
