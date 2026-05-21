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

  return (
    <article className="bg-bg-primary border border-border rounded-[10px] p-8 flex flex-col gap-14 h-full">

      {/* Nom + description */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display font-semibold text-[18px] leading-none text-text-primary">
          {project.name}
        </h2>
        <p className="font-sans text-[14px] leading-none text-text-muted line-clamp-2">
          {project.description ?? '—'}
        </p>
      </div>

      {/* Progression */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-sans text-[12px] leading-none text-text-muted">Progression</span>
          <span className="font-sans text-[12px] leading-none text-text-primary">{progress}%</span>
        </div>
        <div
          className="h-[7px] w-full rounded-[40px] bg-border"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression du projet : ${progress}%`}
        >
          <div
            className="h-full rounded-[40px] bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-sans text-[10px] leading-none text-text-muted">
          {done}/{total} tâche{total !== 1 ? 's' : ''} terminée{done !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Équipe */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-text-muted">
          <Image src="/Membres.svg" alt="" aria-hidden="true" width={12} height={11} />
          <span className="font-sans text-[10px] leading-none">Équipe ({members.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Owner : avatar + tag "Propriétaire" */}
          {members
            .filter(m => m.role === 'OWNER')
            .map(member => (
              <div key={member.id ?? member.user.id} className="flex items-center gap-1.5">
                <div title={member.user.name ?? member.user.email} aria-label={member.user.name ?? member.user.email}>
                  <UserIcon initials={getInitials(member.user.name ?? member.user.email)} size="sm" color="primary" />
                </div>
                <Tag variant="owner" />
              </div>
            ))
          }

          {/* Autres membres : avatar stack avec chevauchement */}
          <div className="flex items-center">
            {members
              .filter(m => m.role !== 'OWNER')
              .map((member, index) => (
                <div
                  key={member.id ?? member.user.id}
                  className={index > 0 ? '-ml-2' : ''}
                  title={member.user.name ?? member.user.email}
                  aria-label={member.user.name ?? member.user.email}
                >
                  <UserIcon
                    initials={getInitials(member.user.name ?? member.user.email)}
                    size="sm"
                    color="neutral"
                    className="ring-2 ring-white"
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>

    </article>
  )
}
