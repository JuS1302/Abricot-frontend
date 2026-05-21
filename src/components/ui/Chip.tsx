'use client'

import Image from 'next/image'

type ChipView = 'liste' | 'kanban' | 'calendrier'

type ChipProps = {
  view: ChipView
  active: boolean
  onClick: () => void
}

const config: Record<ChipView, { label: string; icon: string }> = {
  liste:       { label: 'Liste',       icon: '/Liste.svg' },
  kanban:      { label: 'Kanban',      icon: '/Kanban.svg' },
  calendrier:  { label: 'Calendrier',  icon: '/Kanban.svg' },
}

export default function Chip({ view, active, onClick }: ChipProps) {
  const { label, icon } = config[view]

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
      <Image src={icon} alt="Icon" width={16} height={16} className="shrink-0" />
      {label}
    </button>
  )
}
