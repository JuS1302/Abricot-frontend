'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import Tag from '@/components/ui/Tag'
import UserIcon from '@/components/ui/UserIcon'
import TaskCardFull from '@/components/ui/TaskCardFull'
import TaskModal from '@/components/ui/TaskModal'
import ProjectModal from '@/components/ui/ProjectModal'
import { getInitials } from '@/lib/utils'
import type { Project, Task } from '@/types'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { token, user } = useAuth()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditProject, setShowEditProject] = useState(false)

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

  const currentMember = project?.members?.find(m => m.user.id === user?.id)
  const role: 'admin' | 'contributor' | 'none' = !project
    ? 'none'
    : user?.id === project.owner?.id
      ? 'admin'
      : currentMember?.role === 'CONTRIBUTOR'
        ? 'contributor'
        : 'none'

  useEffect(() => {
    if (!isLoading && project && role === 'none') {
      router.push('/projects')
    }
  }, [isLoading, project, role, router])

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
    <>
    <main className="px-4 md:px-[100px] py-[60px] flex flex-col gap-10">

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

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-semibold text-2xl leading-none text-text-primary">
                {project.name}
              </h1>
              {role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setShowEditProject(true)}
                  className="font-sans text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  Modifier
                </button>
              )}
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
          <Button className="w-full md:w-auto px-6!" onClick={() => setShowCreateModal(true)}>Créer une tâche</Button>
          <button
            type="button"
            className="h-[50px] rounded-[10px] px-6 bg-primary text-white font-sans text-base flex items-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            ✦ IA
          </button>
        </div>
      </div>

      {/* Contributeurs */}
      <div className="bg-bg-tertiary rounded-[10px] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display font-semibold text-lg text-text-primary">Contributeurs</span>
          <span className="font-sans text-base text-text-muted">
            {members.length + (project.owner ? 1 : 0)} personne{members.length + (project.owner ? 1 : 0) > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Propriétaire */}
          {project.owner && (
            <div className="flex items-center gap-1.5">
              <UserIcon
                initials={getInitials(project.owner.name ?? project.owner.email)}
                size="sm"
                color="primary"
              />
              <Tag variant="owner" />
            </div>
          )}
          {/* Contributeurs */}
          {members
            .filter(m => m.user.id !== project.owner?.id)
            .map(member => (
              <div key={member.id ?? member.user.id} className="flex items-center gap-1.5">
                <UserIcon
                  initials={getInitials(member.user.name ?? member.user.email)}
                  size="sm"
                  color="neutral"
                />
                <Tag variant="member" label={member.user.name ?? member.user.email} />
              </div>
            ))
          }
        </div>
      </div>

      {/* Section tâches */}
      <div className="bg-bg-primary border border-border rounded-[10px] p-6 md:p-10 flex flex-col gap-10">

        {/* En-tête + filtres */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 shrink-0">
            <h2 className="font-display font-semibold text-lg text-text-primary leading-none">Tâches</h2>
            <p className="font-sans text-size-base text-text-muted leading-none">Par ordre de priorité</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">

            {/* Vue Liste / Calendrier */}
            <div className="flex gap-2" role="group" aria-label="Sélecteur de vue">
              <Chip view="liste"      active={true}  onClick={() => {}} />
              <Chip view="calendrier" active={false} onClick={() => {}} />
            </div>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filtrer par statut"
              className="h-[63px] w-[152px] border border-border rounded-[8px] pl-[32px] pr-[48px] font-sans text-sm text-text-muted bg-bg-primary outline-none focus:border-primary cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              <option value="">Statut</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
              <option value="CANCELLED">Annulée</option>
            </select>

            {/* Recherche */}
            <div className="relative flex-1">
              <Image
                src="/Loupe.svg" alt="" aria-hidden="true" width={14} height={14}
                className="absolute right-[32px] top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Rechercher une tâche"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Rechercher une tâche"
                className="h-[63px] w-full border border-border rounded-[8px] pl-[32px] pr-[52px] font-sans text-sm text-text-muted placeholder:text-text-muted bg-bg-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
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
                <TaskCardFull
                  task={task}
                  onEdit={setEditingTask}
                />
              </li>
            ))
          )}
        </ul>

      </div>
    </main>

    {showCreateModal && (
      <TaskModal
        projectId={id}
        owner={project.owner ?? undefined}
        members={project.members ?? []}
        onClose={() => setShowCreateModal(false)}
        onSaved={() => {
          setShowCreateModal(false)
          if (!token) return
          api.getTasksByProject(token, id).then(setTasks)
        }}
      />
    )}

    {editingTask && (
      <TaskModal
        projectId={id}
        owner={project.owner ?? undefined}
        members={project.members ?? []}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSaved={() => {
          setEditingTask(null)
          if (!token) return
          api.getTasksByProject(token, id).then(setTasks)
        }}
      />
    )}

    {showEditProject && (
      <ProjectModal
        project={project}
        onClose={() => setShowEditProject(false)}
        onSaved={() => {
          setShowEditProject(false)
          if (!token) return
          api.getProjectById(token, id)
            .then(p => setProject(p ?? null))
            .catch(() => router.push('/projects'))
        }}
      />
    )}
    </>
  )
}
