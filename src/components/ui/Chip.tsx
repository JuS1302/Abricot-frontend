'use client'

import Image from 'next/image'

type ChipView = 'liste' | 'kanban' | 'calendrier'

type ChipProps = {
  view: ChipView
  active: boolean
  onClick: () => void
}

const config: Record<ChipView, { label: string; icon: string }> = {
  liste:       { label: 'Liste',       icon: '/Liste.png' },
  kanban:      { label: 'Kanban',      icon: '/Kanban.png' },
  calendrier:  { label: 'Calendrier',  icon: '/Kanban.png' },
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
        flex items-center justify-center gap-[10px]
        w-[139px] h-[45px] px-[16px] rounded-[8px]
        text-sm font-sans font-medium
        transition-all duration-300 ease-out cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${active
          ? 'bg-primary-light text-primary'
          : 'bg-white text-text-secondary'
        }
      `}
    >
      <Image src={icon} alt="Icon" width={20} height={20} className="shrink-0" />
      {label}
    </button>
  )
}
