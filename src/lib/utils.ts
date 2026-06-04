import type { Task } from '@/types'

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

const STATUS_ORDER: Record<Task['status'], number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2, CANCELLED: 3 }

// Trie les tâches par statut (À faire → En cours → Terminée), puis par date d'échéance croissante
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (statusDiff !== 0) return statusDiff
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}
