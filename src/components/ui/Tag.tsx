// Mapping variant → classes Tailwind + label par défaut
const variants = {
  // Statuts
  todo:        { classes: 'bg-danger-light text-danger',   defaultLabel: 'À faire' },
  in_progress: { classes: 'bg-warning-light text-warning', defaultLabel: 'En cours' },
  done:        { classes: 'bg-success-light text-success', defaultLabel: 'Terminé' },
  cancelled:   { classes: 'bg-gray-light text-gray',       defaultLabel: 'Annulé' },
  // Priorités
  low:         { classes: 'bg-success-light text-success', defaultLabel: 'Faible' },
  medium:      { classes: 'bg-warning-light text-warning', defaultLabel: 'Moyenne' },
  high:        { classes: 'bg-primary-light text-primary', defaultLabel: 'Haute' },
  urgent:      { classes: 'bg-danger-light text-danger',   defaultLabel: 'Urgente' },
  // Rôles
  owner:       { classes: 'bg-primary-light text-primary', defaultLabel: 'Propriétaire' },
  member:      { classes: 'bg-gray-light text-gray',       defaultLabel: '' },
  // Générique
  info:        { classes: 'bg-info-light text-info',       defaultLabel: 'Info' },
} as const

export type TagVariant = keyof typeof variants

type TagProps = {
  variant: TagVariant
  // Optionnel : override le label par défaut (ex: nom d'un membre)
  label?: string
  className?: string
  'aria-label'?: string
}

export default function Tag({ variant, label, className = '', 'aria-label': ariaLabel }: TagProps) {
  const { classes, defaultLabel } = variants[variant]
  const text = label ?? defaultLabel

  return (
    <span
      aria-label={ariaLabel}
      className={`inline-flex items-center px-4 h-[25px] rounded-full text-xs font-sans font-medium whitespace-nowrap ${classes} ${className}`}
    >
      {text}
    </span>
  )
}

// Helpers pour convertir les valeurs de l'API en variant Tag
export function statusToVariant(status: string): TagVariant {
  const map: Record<string, TagVariant> = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
    CANCELLED: 'cancelled',
  }
  return map[status] ?? 'info'
}

export function priorityToVariant(priority: string): TagVariant {
  const map: Record<string, TagVariant> = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
  }
  return map[priority] ?? 'info'
}

export function roleToVariant(role: string): TagVariant {
  return role === 'OWNER' ? 'owner' : 'member'
}
