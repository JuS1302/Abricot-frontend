'use client'

import { useState } from 'react'
import Image from 'next/image'
import Tag, { statusToVariant } from '@/components/ui/Tag'
import UserIcon from '@/components/ui/UserIcon'
import { getInitials } from '@/lib/utils'
import type { Task } from '@/types'

type TaskCardFullProps = {
  task: Task
}

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function TaskCardFull({ task }: TaskCardFullProps) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const date = formatDate(task.dueDate)
  const commentCount = task.comments?.length ?? 0
  const statusVariant = statusToVariant(task.status)

  return (
    <article className="relative bg-bg-primary border border-border rounded-[10px] p-6 flex flex-col gap-4">

      {/* Bouton ··· en position absolue pour ne pas gonfler la hauteur du titre */}
      <button
        type="button"
        aria-label="Options de la tâche"
        className="absolute top-6 right-6 w-[57px] h-[57px] rounded-[10px] border border-border flex items-center justify-center text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <svg width="16" height="4" viewBox="0 0 16 4" fill="none" aria-hidden="true">
          <circle cx="2" cy="2" r="2" fill="currentColor" />
          <circle cx="8" cy="2" r="2" fill="currentColor" />
          <circle cx="14" cy="2" r="2" fill="currentColor" />
        </svg>
      </button>

      {/* Titre + statut + description */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap pr-[73px]">
          <h3 className="font-display font-semibold text-lg text-text-primary leading-none">
            {task.title}
          </h3>
          <Tag variant={statusVariant} />
        </div>

        {task.description && (
          <p className="font-sans text-sm text-text-muted leading-snug">
            {task.description}
          </p>
        )}
      </div>

      {/* Échéance */}
      {date && (
        <div className="flex items-center gap-2 font-sans text-xs text-text-primary">
          <span>Échéance :</span>
          <Image src="/Calendrier-noir.svg" alt="Icon" aria-hidden="true" width={14} height={14} />
          <span>{date}</span>
        </div>
      )}

      {/* Assignés */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-xs text-text-muted">Assigné à :</span>
          {task.assignees.map((assignee, index) => (
            <div key={assignee.userId ?? assignee.user.id ?? index} className="flex items-center gap-1.5">
              <UserIcon
                initials={getInitials(assignee.user.name ?? assignee.user.email)}
                size="sm"
                color="neutral"
              />
              <Tag variant="member" label={assignee.user.name ?? assignee.user.email} />
            </div>
          ))}
        </div>
      )}

      {/* Séparateur */}
      <hr className="border-border" />

      {/* Commentaires (accordéon) */}
      <button
        type="button"
        onClick={() => setCommentsOpen(o => !o)}
        aria-expanded={commentsOpen}
        className="flex justify-between items-center w-full font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
      >
        <span>Commentaires ({commentCount})</span>
        <svg
          width="12" height="7" viewBox="0 0 12 7"
          fill="none" aria-hidden="true"
          className={`transition-transform duration-200 ${commentsOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Contenu des commentaires */}
      {commentsOpen && (
        <div className="flex flex-col gap-3">
          {commentCount === 0 ? (
            <p className="font-sans text-sm text-text-muted">Aucun commentaire.</p>
          ) : (
            task.comments?.map(comment => (
              <div key={comment.id} className="flex flex-col gap-2 p-3 bg-bg-secondary rounded-[8px]">
                <div className="flex items-center gap-2">
                  <UserIcon
                    initials={getInitials(comment.author.name ?? comment.author.email)}
                    size="sm"
                    color="neutral"
                  />
                  <span className="font-sans text-sm font-medium text-text-primary">
                    {comment.author.name ?? comment.author.email}
                  </span>
                </div>
                <p className="font-sans text-sm text-text-muted">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}

    </article>
  )
}
