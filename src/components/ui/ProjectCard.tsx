import type { Project, Task } from '@/types'
import Tag from '@/components/ui/Tag'
import UserIcon from '@/components/ui/UserIcon'
import { getInitials } from '@/lib/utils'
import Image from 'next/image'

type ProjectCardProps = {
  project: Project
  tasks: Task[]
}

export default function ProjectCard({ project, tasks }: ProjectCardProps) {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'DONE').length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const members = project.members ?? []
  const sorted = [
    ...members.filter(m => m.role === 'OWNER'),
    ...members.filter(m => m.role !== 'OWNER'),
  ]

  return (
    <article className="bg-bg-primary border border-border rounded-[10px] p-6 flex flex-col gap-5">

      {/* Nom + description */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-semibold text-lg text-text-primary leading-snug">
          {project.name}
        </h2>
        <p className="font-sans text-sm text-text-muted line-clamp-2 leading-snug">
          {project.description ?? '—'}
        </p>
      </div>

      {/* Progression */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-sans text-sm text-text-muted">Progression</span>
          <span className="font-sans text-sm font-medium text-text-primary">{progress}%</span>
        </div>
        <div
          className="h-1.5 w-full rounded-full bg-border"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression du projet : ${progress}%`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-sans text-xs text-text-muted">
          {done}/{total} tâche{total !== 1 ? 's' : ''} terminée{done !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Équipe */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-text-muted">
          <Image src="/Membres.svg" alt="" aria-hidden="true" width={12} height={11} />
          <span className="font-sans text-sm">Équipe ({members.length})</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {sorted.map(member => {
            const isOwner = member.role === 'OWNER'
            const initials = getInitials(member.user.name ?? member.user.email)
            return (
              <div
                key={member.id ?? member.user.id}
                className="flex items-center gap-1.5"
              >
                <div
                  title={member.user.name ?? member.user.email}
                  aria-label={member.user.name ?? member.user.email}
                >
                  <UserIcon initials={initials} size="sm" />
                </div>
                {isOwner && <Tag variant="owner" />}
              </div>
            )
          })}
        </div>
      </div>

    </article>
  )
}
