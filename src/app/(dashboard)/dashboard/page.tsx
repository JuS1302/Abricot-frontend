'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import Image from 'next/image'
import { sortTasks } from '@/lib/utils'
import Chip from '@/components/ui/Chip'
import TaskCard from '@/components/ui/TaskCard'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import TaskModal from '@/components/ui/TaskModal'
import ProjectModal from '@/components/ui/ProjectModal'
import type { Task, Project } from '@/types'

type View = 'liste' | 'kanban'

const KANBAN_COLUMNS = [
  { status: 'TODO',        label: 'À faire' },
  { status: 'IN_PROGRESS', label: 'En cours' },
  { status: 'DONE',        label: 'Terminées' },
]

export default function DashboardPage() {
  const { token, user } = useAuth()
  const [view, setView] = useState<View>('liste')
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showCreateProject, setShowCreateProject] = useState(false)

  useEffect(() => {
    if (!token) return
    Promise.all([api.getTasks(token), api.getProjects(token)])
      .then(([tasksData, projectsData]) => {
        setTasks(tasksData)
        setProjects(projectsData)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const getProjectName = (projectId: string) =>
    projects.find(p => p.id === projectId)?.name ?? projectId

  async function handleEditTask(task: Task) {
    if (!token) return
    const project = await api.getProjectById(token, task.projectId)
    setEditingProject(project)
    setEditingTask(task)
  }

  function handleModalClose() {
    setEditingTask(null)
    setEditingProject(null)
  }

  function handleModalSaved() {
    handleModalClose()
    if (!token) return
    api.getTasks(token).then(setTasks)
  }

  const filteredTasks = sortTasks(tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  ))

  return (
    <main className="px-4 md:px-[100px] py-[60px]">

      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-15">
        <div className="flex flex-col gap-3">
          <h1 className="font-display font-semibold text-2xl leading-none text-text-primary">
            Tableau de bord
          </h1>
          <p className="font-sans text-lg text-text-muted leading-none">
            Bonjour {user?.name}, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <Button className="w-full md:w-auto px-6!" onClick={() => setShowCreateProject(true)}>+ Créer un projet</Button>
      </div>

      {/* Sélecteur de vue Liste / Kanban */}
      <div className="flex gap-2 mb-7" role="group" aria-label="Sélecteur de vue">
        <Chip view="liste"  active={view === 'liste'}  onClick={() => setView('liste')} />
        <Chip view="kanban" active={view === 'kanban'} onClick={() => setView('kanban')} />
      </div>

      {isLoading ? (
        <p role="status" className="text-text-muted font-sans text-sm">
          Chargement…
        </p>
      ) : view === 'liste' ? (
        <VueListe
          tasks={filteredTasks}
          search={search}
          onSearch={setSearch}
          getProjectName={getProjectName}
          onEdit={handleEditTask}
        />
      ) : (
        <VueKanban tasks={filteredTasks} getProjectName={getProjectName} onEdit={handleEditTask} />
      )}

      {editingTask && editingProject && (
        <TaskModal
          projectId={editingTask.projectId}
          owner={editingProject.owner}
          members={editingProject.members ?? []}
          task={editingTask}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
        />
      )}

      {showCreateProject && (
        <ProjectModal
          onClose={() => setShowCreateProject(false)}
          onSaved={() => {
            setShowCreateProject(false)
            if (!token) return
            api.getProjects(token).then(setProjects)
          }}
        />
      )}

    </main>
  )
}

// ─── Vue Liste ────────────────────────────────────────────────────────────────

function VueListe({ tasks, search, onSearch, getProjectName, onEdit }: {
  tasks: Task[]
  search: string
  onSearch: (value: string) => void
  getProjectName: (id: string) => string
  onEdit: (task: Task) => void
}) {
  return (
    <section
      aria-label="Vue liste des tâches"
      className="border bg-bg-primary border-border rounded-[10px] p-4 md:p-[40px]"
    >
      {/* En-tête de la section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-13">
        <div className="flex flex-col gap-3">
          <h2 className="font-display font-semibold text-lg text-text-primary leading-none">
            Mes tâches assignées
          </h2>
          <p className="font-sans text-sm text-text-muted leading-none">Par ordre de priorité</p>
        </div>

        {/* Champ de recherche */}
        <div className="relative w-full md:w-[280px]">
          <Image
            src="/Loupe.svg"
            alt="Icon Loupe"
            aria-hidden="true"
            width={14}
            height={14}
            className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher une tâche"
            value={search}
            onChange={e => onSearch(e.target.value)}
            aria-label="Rechercher une tâche"
            className="
              h-[63px] w-full
              border border-border rounded-[10px] pl-5 pr-10
              font-sans text-sm text-text-primary placeholder:text-text-disabled
              bg-bg-primary outline-none
              focus:border-primary focus:ring-2 focus:ring-primary/30
            "
          />
        </div>
      </div>

      {/* Liste */}
      <ul className="flex flex-col gap-4" aria-label="Liste des tâches">
        {tasks.length === 0 ? (
          <li className="text-text-muted font-sans text-sm text-center py-8">
            Aucune tâche trouvée
          </li>
        ) : (
          tasks.map(task => (
            <li key={task.id}>
              <TaskCard
                task={task}
                variant="liste"
                projectName={getProjectName(task.projectId)}
                onView={id => { const t = tasks.find(t => t.id === id); if (t) onEdit(t) }}
              />
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

// ─── Vue Kanban ───────────────────────────────────────────────────────────────

function VueKanban({ tasks, getProjectName, onEdit }: {
  tasks: Task[]
  getProjectName: (id: string) => string
  onEdit: (task: Task) => void
}) {
  return (
    <section
      aria-label="Vue kanban des tâches"
      // Sur mobile les colonnes s'empilent, sur desktop elles sont côte à côte
      className="flex flex-col md:flex-row gap-4 md:gap-6"
    >
      {KANBAN_COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status)
        return (
          <div key={col.status} className="flex-1 border border-danger-light rounded-[10px] p-6">

            {/* En-tête de colonne */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display font-semibold text-lg text-text-primary">
                {col.label}
              </h2>
              <Tag
                variant="member"
                label={String(colTasks.length)}
                aria-label={`${colTasks.length} tâche${colTasks.length > 1 ? 's' : ''}`}
              />
            </div>

            {/* Cartes de la colonne */}
            <ul className="flex flex-col gap-4">
              {colTasks.length === 0 ? (
                <li className="text-text-muted font-sans text-sm text-center py-4">
                  Aucune tâche
                </li>
              ) : (
                colTasks.map(task => (
                  <li key={task.id}>
                    <TaskCard
                      task={task}
                      variant="kanban"
                      projectName={getProjectName(task.projectId)}
                      onView={id => { const t = tasks.find(t => t.id === id); if (t) onEdit(t) }}
                    />
                  </li>
                ))
              )}
            </ul>

          </div>
        )
      })}
    </section>
  )
}
