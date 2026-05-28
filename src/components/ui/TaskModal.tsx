'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Tag from '@/components/ui/Tag'
import { api } from '@/lib/api'
import type { ProjectMember, Task, User } from '@/types'

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

type Props = {
  projectId: string
  owner?: User
  members: ProjectMember[]
  task?: Task        // fourni → mode édition, absent → mode création
  onClose: () => void
  onSaved: () => void
}

const statusOptions: { value: Status; variant: 'todo' | 'in_progress' | 'done'; label: string }[] = [
  { value: 'TODO',        variant: 'todo',        label: 'À faire'  },
  { value: 'IN_PROGRESS', variant: 'in_progress', label: 'En cours' },
  { value: 'DONE',        variant: 'done',        label: 'Terminée' },
]

function toInputDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().slice(0, 10)
}

export default function TaskModal({ projectId, owner, members, task, onClose, onSaved }: Props) {
  const { token } = useAuth()
  const isEditing = !!task

  const [title, setTitle]               = useState(task?.title ?? '')
  const [description, setDescription]   = useState(task?.description ?? '')
  const [dueDate, setDueDate]           = useState(toInputDate(task?.dueDate))
  const [assignees, setAssignees]       = useState<string[]>(
    task?.assignees?.map(a => a.user.id) ?? []
  )
  const [status, setStatus]             = useState<Status>((task?.status as Status) ?? 'TODO')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef                     = useRef<HTMLDivElement>(null)

  const isValid = title.trim() !== '' && dueDate !== ''

  const allAssignable = [
    ...(owner ? [{ id: owner.id, name: owner.name ?? owner.email }] : []),
    ...members
      .filter(m => m.user.id !== owner?.id)
      .map(m => ({ id: m.user.id, name: m.user.name ?? m.user.email })),
  ]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleAssignee(userId: string) {
    setAssignees(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  async function handleDelete() {
    if (!token || !task) return
    if (!window.confirm('Supprimer cette tâche ? Cette action est irréversible.')) return
    setIsSubmitting(true)
    try {
      await api.deleteTask(token, task.projectId, task.id)
      onSaved()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting || !token) return
    setIsSubmitting(true)
    try {
      if (isEditing) {
        await api.updateTask(token, task.projectId, task.id, {
          title: title.trim(), description: description.trim(), dueDate, status, assignees,
        })
      } else {
        await api.createTask(token, projectId, {
          title: title.trim(), description: description.trim(), dueDate, status, assignees,
        })
      }
      onSaved()
    } finally {
      setIsSubmitting(false)
    }
  }

  const assigneeLabel =
    assignees.length === 0
      ? 'Choisir un ou plusieurs collaborateurs'
      : assignees.length === 1
        ? (allAssignable.find(m => m.id === assignees[0])?.name ?? '1 collaborateur')
        : `${assignees.length} collaborateurs`

  const fieldLabel = (base: string) => isEditing ? base : `${base}*`

  return (
    <Modal title={isEditing ? 'Modifier' : 'Créer une tâche'} onClose={onClose}>
      <div className="flex flex-col gap-6">

        <Input
          label={fieldLabel('Titre')}
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Description */}
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="task-description" className="text-sm font-sans text-text-primary">
            {fieldLabel('Description')}
          </label>
          <textarea
            id="task-description"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={1}
            className="rounded-[4px] border border-border px-[17px] py-[14px] text-base font-sans text-text-primary placeholder:text-text-disabled outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-white resize-none"
          />
        </div>

        <Input
          label={fieldLabel('Échéance')}
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          inputClassName={!dueDate ? 'text-sm text-transparent! focus:text-text-primary!' : ''}
        />

        {/* Assigné à */}
        <div className="flex flex-col gap-[7px]">
          <span className="text-sm font-sans text-text-primary">Assigné à :</span>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(o => !o)}
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              className="w-full h-[53px] rounded-[4px] border border-border px-[17px] text-base font-sans text-left flex items-center justify-between bg-white outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span className={assignees.length === 0 ? 'text-text-disabled text-xs' : 'text-text-primary truncate pr-2'}>
                {assigneeLabel}
              </span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M1 1L6 6L11 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {dropdownOpen && (
              <ul
                role="listbox"
                aria-multiselectable="true"
                className="absolute z-10 top-full mt-1 w-full bg-white border border-border rounded-[4px] shadow-md max-h-[180px] overflow-y-auto"
              >
                {allAssignable.map(person => (
                  <li key={person.id} role="option" aria-selected={assignees.includes(person.id)}>
                    <label className="flex items-center gap-3 px-[17px] py-3 cursor-pointer hover:bg-bg-secondary">
                      <input
                        type="checkbox"
                        checked={assignees.includes(person.id)}
                        onChange={() => toggleAssignee(person.id)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="font-sans text-sm text-text-primary">{person.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Statut */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-sans text-text-primary">Statut :</span>
          <div className="flex items-center gap-2">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                aria-pressed={status === opt.value}
                className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  status === opt.value ? 'ring-2 ring-offset-1 ring-text-muted' : 'opacity-50'
                }`}
              >
                <Tag variant={opt.variant} label={opt.label} />
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-fit disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:opacity-100"
        >
          {isEditing ? 'Enregistrer' : '+ Ajouter une tâche'}
        </Button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="w-fit h-[50px] px-6 rounded-[10px] font-sans text-base text-danger border border-danger hover:bg-danger-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Supprimer la tâche
          </button>
        )}
      </div>
    </Modal>
  )
}
