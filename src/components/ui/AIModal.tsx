'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

type AITask = {
  id: string
  title: string
  description: string
}

type Props = {
  projectId: string
  projectName: string
  projectDescription?: string
  onClose: () => void
  onSaved: () => void
}

// Retourne la date dans 7 jours au format YYYY-MM-DD
function defaultDueDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

export default function AIModal({ projectId, projectName, projectDescription, onClose, onSaved }: Props) {
  const { token } = useAuth()

  const [tasks, setTasks]               = useState<AITask[]>([])
  const [prompt, setPrompt]             = useState('')
  const [isLoading, setIsLoading]       = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState('')

  // État d'édition inline d'une tâche suggérée
  const [editingId, setEditingId]         = useState<string | null>(null)
  const [editTitle, setEditTitle]         = useState('')
  const [editDescription, setEditDescription] = useState('')

  const hasTask = tasks.length > 0
  const title = hasTask ? '✦ Vos tâches...' : '✦ Créer une tâche'

  // Appelle la route API Next.js qui contacte OpenAI
  async function handleGenerate() {
    if (!prompt.trim() || isLoading) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectName, projectDescription }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur lors de la génération')
      // Ajoute un id local à chaque tâche pour les gérer dans le state
      const generated: AITask[] = data.tasks.map((t: { title: string; description: string }, i: number) => ({
        id: `ai-${Date.now()}-${i}`,
        title: t.title,
        description: t.description,
      }))
      setTasks(prev => [...prev, ...generated])
      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  // Supprime une tâche de la liste locale (pas encore créée dans le projet)
  function handleRemove(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (editingId === id) setEditingId(null)
  }

  // Passe une tâche en mode édition inline
  function startEdit(task: AITask) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  // Sauvegarde les modifications inline
  function saveEdit(id: string) {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, title: editTitle, description: editDescription } : t
    ))
    setEditingId(null)
  }

  // Crée toutes les tâches de la liste dans le projet via l'API backend
  async function handleAddAll() {
    if (!token || isSubmitting) return
    setIsSubmitting(true)
    try {
      await Promise.all(
        tasks.map(task =>
          api.createTask(token, projectId, {
            title: task.title,
            description: task.description,
            dueDate: defaultDueDate(),
            status: 'TODO',
            assignees: [],
          })
        )
      )
      onSaved()
    } catch {
      setError('Erreur lors de la création des tâches.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[10px] w-full max-w-[600px] flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >

        {/* En-tête */}
        <div className="relative px-[50px] pt-[50px] pb-6 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 className="font-display font-semibold text-2xl text-text-primary">
            <span className="text-primary">✦</span> {hasTask ? 'Vos tâches...' : 'Créer une tâche'}
          </h2>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-[50px]">
          {isLoading && (
            <p className="font-sans text-sm text-text-muted text-center py-8">
              Génération en cours…
            </p>
          )}

          {!isLoading && tasks.length > 0 && (
            <ul className="flex flex-col gap-4">
              {tasks.map(task => (
                <li key={task.id} className="border border-border rounded-[10px] p-5 flex flex-col gap-3">
                  {editingId === task.id ? (
                    // Mode édition inline
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        aria-label="Titre de la tâche"
                        className="font-display font-semibold text-lg text-text-primary border border-border rounded-[6px] px-3 py-1.5 outline-none focus:border-primary"
                      />
                      <textarea
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        rows={2}
                        aria-label="Description de la tâche"
                        className="font-sans text-sm text-text-muted border border-border rounded-[6px] px-3 py-2 outline-none focus:border-primary resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(task.id)}
                        className="self-start font-sans text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  ) : (
                    // Mode affichage
                    <>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-display font-semibold text-lg text-text-primary leading-none">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="font-sans text-sm text-text-muted">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleRemove(task.id)}
                          className="flex items-center gap-1.5 font-sans text-sm text-text-muted hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger rounded"
                        >
                          <svg width="12" height="14" viewBox="0 0 14 16" fill="none" aria-hidden="true">
                            <path d="M1 4h12M5 4V2h4v2M2 4l1 10a1 1 0 001 1h6a1 1 0 001-1L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Supprimer
                        </button>
                        <span aria-hidden="true" className="text-border">|</span>
                        <button
                          type="button"
                          onClick={() => startEdit(task)}
                          className="flex items-center gap-1.5 font-sans text-sm text-text-muted hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M11 2l3 3L5 14l-4 1 1-4L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Modifier
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pied de modal : bouton ajouter + input prompt */}
        <div className="px-[50px] pb-[50px] pt-6 flex flex-col gap-4 flex-shrink-0">
          {error && (
            <p className="font-sans text-sm text-danger">{error}</p>
          )}

          {hasTask && (
            <button
              type="button"
              onClick={handleAddAll}
              disabled={isSubmitting}
              className="w-full h-[50px] rounded-[10px] bg-text-primary text-white font-sans text-base hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
            >
              {isSubmitting ? 'Ajout en cours…' : '+ Ajouter les tâches'}
            </button>
          )}

          {/* Zone de prompt */}
          <div className="flex items-center gap-3 bg-bg-secondary rounded-full px-6 py-3">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }}
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              aria-label="Décrire les tâches à générer"
              className="flex-1 bg-transparent font-sans text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              aria-label="Générer les tâches"
              className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
