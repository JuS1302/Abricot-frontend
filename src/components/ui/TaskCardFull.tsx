'use client'

import { useState } from 'react'
import Image from 'next/image'
import Tag, { statusToVariant } from '@/components/ui/Tag'
import UserIcon from '@/components/ui/UserIcon'
import { getInitials } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { Task, Comment } from '@/types'

type TaskCardFullProps = {
  task: Task
  projectId: string
  onEdit: (task: Task) => void
}

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function TaskCardFull({ task, projectId, onEdit }: TaskCardFullProps) {
  const { token, user } = useAuth()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(task.comments ?? [])
  const [newComment, setNewComment] = useState('')
  const [isSending, setIsSending] = useState(false)
  const date = formatDate(task.dueDate)
  const statusVariant = statusToVariant(task.status)

  async function handleAddComment() {
    if (!token || !user || newComment.trim() === '') return
    setIsSending(true)
    try {
      const created = await api.createComment(token, projectId, task.id, newComment.trim())
      // L'API ne renvoie pas toujours l'author peuplé, on le construit avec l'utilisateur connecté
      const comment: Comment = {
        id: created?.id ?? crypto.randomUUID(),
        content: newComment.trim(),
        taskId: task.id,
        authorId: user.id,
        author: user,
      }
      setComments(prev => [...prev, comment])
      setNewComment('')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <article className="relative bg-bg-primary border border-border rounded-[10px] p-6 flex flex-col gap-4">

      {/* Bouton action en position absolue */}
      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label="Modifier la tâche"
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
          <Image src="/Calendrier-noir.svg" alt="" aria-hidden="true" width={14} height={16} />
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
        <span>Commentaires ({comments.length})</span>
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
          {/* Liste des commentaires existants */}
          {comments.length === 0 ? (
            <p className="font-sans text-sm text-text-muted">Aucun commentaire.</p>
          ) : (
            comments.map(comment => (
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

          {/* Formulaire d'ajout de commentaire */}
          <div className="flex gap-2 mt-1">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire…"
              rows={1}
              aria-label="Nouveau commentaire"
              className="flex-1 rounded-[4px] border border-border px-3 py-2 font-sans text-sm text-text-primary placeholder:text-text-disabled outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-white resize-none"
            />
            <button
              type="button"
              onClick={handleAddComment}
              disabled={isSending || newComment.trim() === ''}
              aria-label="Envoyer le commentaire"
              className="h-[38px] self-end px-4 rounded-[6px] bg-primary text-white font-sans text-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

    </article>
  )
}
