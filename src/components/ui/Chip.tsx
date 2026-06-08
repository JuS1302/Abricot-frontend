'use client'

import Image from 'next/image'

type ChipView = 'liste' | 'kanban' | 'calendrier'

type ChipProps = {
  view: ChipView
  active: boolean
  onClick: () => void
}

// iconW/iconH correspondent aux proportions réelles de chaque SVG pour éviter
// le warning Next.js "width or height modified but not the other" (Tailwind height:auto)
const config: Record<ChipView, { label: string; icon: string; iconW: number; iconH: number }> = {
  liste:       { label: 'Liste',       icon: '/Liste.svg',  iconW: 16, iconH: 16 }, // viewBox 16×16
  kanban:      { label: 'Kanban',      icon: '/Kanban.svg', iconW: 15, iconH: 17 }, // viewBox 15×17
  calendrier:  { label: 'Calendrier',  icon: '/Kanban.svg', iconW: 15, iconH: 17 },
}

export default function Chip({ view, active, onClick }: ChipProps) {
  const { label, icon, iconW, iconH } = config[view]

  return (
    <button
      type="button"
      onClick={onClick}
      // aria-pressed indique aux lecteurs d'écran si le bouton est sélectionné (WCAG 4.1.2)
      aria-pressed={active}
      className={`
        inline-flex items-center gap-[10px]
        h-[45px] px-[16px] py-[14px] rounded-[8px]
        text-sm font-sans font-medium whitespace-nowrap
        transition-all duration-300 ease-out cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${active
          ? 'bg-primary-light text-primary'
          : 'bg-white text-primary'
        }
      `}
    >
      <Image src={icon} alt="" aria-hidden="true" width={iconW} height={iconH} className="shrink-0" />
      {label}
    </button>
  )
}
