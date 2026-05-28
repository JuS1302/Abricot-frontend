'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ProjectCard from '@/components/ui/ProjectCard'
import ProjectModal from '@/components/ui/ProjectModal'
import type { Project, Task } from '@/types'

export default function ProjectsPage() {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)

  useEffect(() => {
    if (!token) return
    Promise.all([api.getProjects(token), api.getTasks(token)])
      .then(([projectsData, tasksData]) => {
        setProjects(projectsData)
        setTasks(tasksData)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  return (
    <main className="px-4 md:px-[100px] py-[60px]">

      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-15">
        <div className="flex flex-col gap-3">
          <h1 className="font-display font-semibold text-2xl leading-none text-text-primary">
            Mes projets
          </h1>
          <p className="font-sans text-lg text-text-muted leading-none">
            Gérez vos projets
          </p>
        </div>
        <Button className="w-full md:w-auto px-6!" onClick={() => setShowCreateProject(true)}>+ Créer un projet</Button>
      </div>

      {/* Grille de projets */}
      {isLoading ? (
        <p role="status" className="text-text-muted font-sans text-sm">
          Chargement…
        </p>
      ) : projects.length === 0 ? (
        <p className="text-text-muted font-sans text-sm text-center py-16">
          Aucun projet pour le moment.
        </p>
      ) : (
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Liste des projets"
        >
          {projects.map(project => (
            <li key={project.id} className="h-full">
              <Link href={`/projects/${project.id}`} className="block h-full">
                <ProjectCard
                  project={project}
                  tasks={tasks.filter(t => t.projectId === project.id)}
                />
              </Link>
            </li>
          ))}
        </ul>
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
