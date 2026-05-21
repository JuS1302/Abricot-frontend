import Image from 'next/image'
import Tag, { statusToVariant } from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import type { Task } from '@/types'

type TaskCardProps = {
  task: Task
  variant: 'liste' | 'kanban'
  // Nom du projet passé depuis le parent (task ne contient que projectId)
  projectName?: string
  onView: (taskId: string) => void
}

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  })
}

export default function TaskCard({ task, variant, projectName, onView }: TaskCardProps) {
  const date = formatDate(task.dueDate)
  const commentCount = task.comments?.length ?? 0
  const statusVariant = statusToVariant(task.status)

  // Métadonnées communes aux deux variants
  const Meta = (
    <div className="flex items-center gap-3 text-xs font-sans text-text-muted">
      <span className="flex items-center gap-1">
        {/* alt="" : icônes décoratives, le texte adjacent suffit */}
        <Image src="/Nom-projet.svg" alt="Icon" width={14} height={14} />
        {projectName ?? task.projectId}
      </span>
      {date && (
        <>
          <span aria-hidden="true">|</span>
          <span className="flex items-center gap-1">
            <Image src="/Date.svg" alt="Icon" width={14} height={14} />
            {date}
          </span>
        </>
      )}
      <span aria-hidden="true">|</span>
      <span className="flex items-center gap-1">
        <Image src="/Commentaire.svg" alt="Icon" width={14} height={14} />
        <span>
          <span className="sr-only">Commentaires : </span>
          {commentCount}
        </span>
      </span>
    </div>
  )

  const baseClasses = 'bg-bg-primary border border-border rounded-[10px] px-4 py-4 md:px-[40px] md:py-[25px]'

  if (variant === 'liste') {
    return (
      <article aria-label={task.title} className={`${baseClasses} w-full`}>
        {/* Mobile : layout vertical — Desktop : layout horizontal */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-stretch md:h-[112px]">

          {/* Titre + description + méta */}
          <div className="flex flex-col justify-between gap-3 md:gap-0">
            <div className="flex flex-col gap-3">
              {/* Sur mobile : titre + tag sur la même ligne */}
              <div className="flex justify-between items-start gap-2 md:block">
                <h3 className="font-display font-semibold text-lg text-text-primary leading-none">
                  {task.title}
                </h3>
                <div className="md:hidden">
                  <Tag variant={statusVariant} />
                </div>
              </div>
              {task.description && (
                <p className="font-sans text-sm text-text-muted leading-none">
                  {task.description}
                </p>
              )}
            </div>
            {Meta}
          </div>

          {/* Desktop uniquement : tag en haut, bouton en bas à droite */}
          <div className="hidden md:flex flex-col justify-between items-end">
            <Tag variant={statusVariant} />
            <Button
              onClick={() => onView(task.id)}
              className="w-[121px] px-6!"
              aria-label={`Voir la tâche : ${task.title}`}
            >
              Voir
            </Button>
          </div>

          {/* Mobile uniquement : bouton pleine largeur en bas */}
          <Button
            onClick={() => onView(task.id)}
            className="md:hidden w-full mt-4 px-6!"
            aria-label={`Voir la tâche : ${task.title}`}
          >
            Voir
          </Button>

        </div>
      </article>
    )
  }

  return (
    <article
      aria-label={task.title}
      // w-full sur mobile, largeur fixe sur desktop
      className={`${baseClasses} flex flex-col gap-[32px] w-full md:w-[371px]`}
    >
      {/* Haut : titre + tag inline, puis description */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-semibold text-lg text-text-primary leading-none">
            {task.title}
          </h3>
          <Tag variant={statusVariant} />
        </div>
        {task.description && (
          <p className="font-sans text-sm text-text-muted leading-none">
            {task.description}
          </p>
        )}
      </div>

      {/* Bas : méta + bouton */}
      <div className="flex flex-col gap-[32px]">
        {Meta}
        <Button
          onClick={() => onView(task.id)}
          className="w-full md:w-[121px] px-6!"
          aria-label={`Voir la tâche : ${task.title}`}
        >
          Voir
        </Button>
      </div>
    </article>
  )
}
