'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import UserIcon from '@/components/ui/UserIcon'
import TaskCardFull from '@/components/ui/TaskCardFull'
import { getInitials } from '@/lib/utils'
import type { Project, Task } from '@/types'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token } = useAuth()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    Promise.all([api.getProjectById(token, id), api.getTasksByProject(token, id)])
      .then(([projectData, tasksData]) => {
        setProject(projectData ?? null)
        setTasks(tasksData)
      })
      .finally(() => setIsLoading(false))
  }, [token, id])

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter ? t.status === statusFilter : true
    return matchSearch && matchStatus
  })

  const members = project?.members ?? []

  if (isLoading) {
    return (
      <main className="px-4 md:px-[100px] py-[60px]">
        <p role="status" className="text-text-muted font-sans text-sm">Chargement…</p>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="px-4 md:px-[100px] py-[60px]">
        <p className="text-text-muted font-sans text-sm">Projet introuvable.</p>
      </main>
    )
  }

  return (
    <main className="px-4 md:px-[100px] py-[60px] flex flex-col gap-8">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div className="flex items-start gap-4">

          {/* Bouton retour */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour aux projets"
            className="w-[40px] h-[40px] rounded-full border border-border flex items-center justify-center text-text-primary hover:bg-bg-secondary transition-colors flex-shrink-0 mt-1"
          >
            ←
          </button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-semibold text-[24px] leading-none text-text-primary">
                {project.name}
              </h1>
              <button
                type="button"
                className="font-sans text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Modifier
              </button>
            </div>
            {project.description && (
              <p className="font-sans text-sm text-text-muted leading-none">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Boutons actions */}
        <div className="flex items-center gap-3">
          <Button className="w-full md:w-auto px-6!">Créer une tâche</Button>
          <button
            type="button"
            className="h-[50px] rounded-[10px] px-6 bg-primary text-white font-sans text-base flex items-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            ✦ IA
          </button>
        </div>
      </div>

      {/* Contributeurs */}
      <div className="bg-bg-primary border border-border rounded-[10px] px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display font-semibold text-base text-text-primary">Contributeurs</span>
          <span className="font-sans text-sm text-text-muted">
            {members.length} personne{members.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {members.map(member => {
            const isOwner = member.role === 'OWNER'
            return (
              <div key={member.id ?? member.user.id} className="flex items-center gap-1.5">
                <UserIcon
                  initials={getInitials(member.user.name ?? member.user.email)}
                  size="sm"
                  color={isOwner ? 'primary' : 'neutral'}
                />
                {isOwner
                  ? <Tag variant="owner" />
                  : <Tag variant="member" label={member.user.name ?? member.user.email} />
                }
              </div>
            )
          })}
        </div>
      </div>

      {/* Section tâches */}
      <div className="bg-bg-primary border border-border rounded-[10px] p-6 md:p-10 flex flex-col gap-6">

        {/* En-tête + filtres */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-semibold text-lg text-text-primary leading-none">Tâches</h2>
            <p className="font-sans text-sm text-text-muted leading-none">Par ordre de priorité</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* Vue Liste / Calendrier */}
            <div className="flex rounded-[10px] border border-border overflow-hidden">
              <button
                type="button"
                className="flex items-center gap-2 px-4 h-[40px] bg-primary-light text-primary font-sans text-sm"
                aria-pressed="true"
              >
                <Image src="/Liste.svg" alt="" aria-hidden="true" width={14} height={14} />
                Liste
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-4 h-[40px] text-text-muted font-sans text-sm hover:bg-bg-secondary transition-colors"
                aria-pressed="false"
              >
                <Image src="/Date.svg" alt="" aria-hidden="true" width={14} height={14} />
                Calendrier
              </button>
            </div>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filtrer par statut"
              className="h-[40px] border border-border rounded-[10px] px-4 pr-8 font-sans text-sm text-text-primary bg-bg-primary outline-none focus:border-primary cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="">Statut</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
              <option value="CANCELLED">Annulée</option>
            </select>

            {/* Recherche */}
            <div className="relative">
              <Image
                src="/Loupe.svg" alt="" aria-hidden="true" width={14} height={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Rechercher une tâche"
                className="h-[40px] w-full md:w-[200px] border border-border rounded-[10px] pl-4 pr-10 font-sans text-sm text-text-primary placeholder:text-text-disabled bg-bg-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Liste des tâches */}
        <ul className="flex flex-col gap-4" aria-label="Liste des tâches du projet">
          {filteredTasks.length === 0 ? (
            <li className="text-text-muted font-sans text-sm text-center py-8">
              Aucune tâche trouvée.
            </li>
          ) : (
            filteredTasks.map(task => (
              <li key={task.id}>
                <TaskCardFull task={task} />
              </li>
            ))
          )}
        </ul>

      </div>
    </main>
  )
}
