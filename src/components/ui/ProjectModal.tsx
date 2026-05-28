'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { api } from '@/lib/api'
import type { Project } from '@/types'

type SearchUser = { id: string; email: string; name: string }

type Props = {
  project?: Project   // fourni → mode édition, absent → mode création
  onClose: () => void
  onSaved: () => void
}

export default function ProjectModal({ project, onClose, onSaved }: Props) {
  const { token } = useAuth()
  const isEditing = !!project

  const [name, setName]               = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Contributeurs sélectionnés
  const initialContributors: SearchUser[] = (project?.members ?? [])
    .filter(m => m.user.id !== project?.owner?.id)
    .map(m => ({ id: m.user.id, email: m.user.email, name: m.user.name ?? m.user.email }))

  const [selected, setSelected]         = useState<SearchUser[]>(initialContributors)
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching]   = useState(false)
  const [showResults, setShowResults]   = useState(false)
  const searchRef                       = useRef<HTMLDivElement>(null)

  const isValid = name.trim() !== '' && description.trim() !== ''

  // Fermer le dropdown résultats si clic en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recherche avec debounce 300ms
  const search = useCallback(async (query: string) => {
    if (!token || query.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }
    setIsSearching(true)
    try {
      const results = await api.searchUsers(token, query)
      const filtered = results.filter(u =>
        !selected.find(s => s.id === u.id) &&
        u.id !== project?.owner?.id
      )
      setSearchResults(filtered)
      setShowResults(true)
    } finally {
      setIsSearching(false)
    }
  }, [token, selected, project?.owner?.id])

  useEffect(() => {
    const timer = setTimeout(() => search(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery, search])

  function addContributor(user: SearchUser) {
    setSelected(prev => [...prev, user])
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  function removeContributor(userId: string) {
    setSelected(prev => prev.filter(u => u.id !== userId))
  }

  async function handleDelete() {
    if (!token || !project) return
    if (!window.confirm('Supprimer ce projet ? Cette action est irréversible.')) return
    setIsSubmitting(true)
    try {
      await api.deleteProject(token, project.id)
      onSaved()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting || !token) return
    setIsSubmitting(true)
    try {
      if (isEditing && project) {
        // 1. Mettre à jour nom + description
        await api.updateProject(token, project.id, {
          name: name.trim(),
          description: description.trim(),
        })
        // 2. Diff contributeurs : ajouter les nouveaux, retirer les supprimés
        const originalIds = initialContributors.map(c => c.id)
        const selectedIds  = selected.map(c => c.id)
        const toAdd    = selected.filter(c => !originalIds.includes(c.id))
        const toRemove = initialContributors.filter(c => !selectedIds.includes(c.id))
        await Promise.all([
          ...toAdd.map(c => api.addContributor(token, project.id, c.email)),
          ...toRemove.map(c => api.removeContributor(token, project.id, c.id)),
        ])
      } else {
        // Créer le projet
        const created = await api.createProject(token, {
          name: name.trim(),
          description: description.trim(),
        })
        // Ajouter les contributeurs sélectionnés
        if (created?.id && selected.length > 0) {
          await Promise.all(
            selected.map(c => api.addContributor(token, created.id, c.email))
          )
        }
      }
      onSaved()
    } finally {
      setIsSubmitting(false)
    }
  }

  const contributorLabel =
    selected.length === 0
      ? 'Choisir un ou plusieurs collaborateurs'
      : selected.length === 1
        ? selected[0].name
        : `${selected.length} collaborateurs`

  return (
    <Modal title={isEditing ? 'Modifier un projet' : 'Créer un projet'} onClose={onClose}>
      <div className="flex flex-col gap-6">

        <Input
          label={`Titre${!isEditing ? '*' : ''}`}
          name="project-name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        {/* Description */}
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="project-description" className="text-sm font-sans text-text-primary">
            {`Description${!isEditing ? '*' : ''}`}
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={1}
            className="rounded-[4px] border border-border px-[17px] py-[14px] text-base font-sans text-text-primary placeholder:text-text-disabled outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-white resize-none"
          />
        </div>

        {/* Contributeurs */}
        <div className="flex flex-col gap-[7px]">
          <span className="text-sm font-sans text-text-primary">Contributeurs</span>

          {/* Champ de recherche */}
          <div className="relative" ref={searchRef}>
            <div className="w-full min-h-[53px] rounded-[4px] border border-border px-[17px] py-3 flex items-center justify-between gap-2 bg-white">
              <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                {/* Tags des contributeurs sélectionnés */}
                {selected.map(user => (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 bg-bg-tertiary text-text-primary text-xs font-sans px-2 py-1 rounded-full"
                  >
                    {user.name}
                    <button
                      type="button"
                      onClick={() => removeContributor(user.id)}
                      aria-label={`Retirer ${user.name}`}
                      className="text-text-muted hover:text-text-primary focus-visible:outline-none"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
                {/* Input de recherche */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  placeholder={selected.length === 0 ? contributorLabel : ''}
                  aria-label="Rechercher un collaborateur"
                  className="flex-1 min-w-[120px] text-xs font-sans text-text-primary placeholder:text-text-disabled outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Résultats de recherche */}
            {showResults && (
              <ul className="absolute z-10 top-full mt-1 w-full bg-white border border-border rounded-[4px] shadow-md max-h-[180px] overflow-y-auto">
                {isSearching ? (
                  <li className="px-[17px] py-3 text-sm text-text-muted font-sans">Recherche…</li>
                ) : searchResults.length === 0 ? (
                  <li className="px-[17px] py-3 text-sm text-text-muted font-sans">Aucun résultat</li>
                ) : (
                  searchResults.map(user => (
                    <li key={user.id}>
                      <button
                        type="button"
                        onClick={() => addContributor(user)}
                        className="w-full text-left px-[17px] py-3 hover:bg-bg-secondary flex flex-col gap-0.5 focus-visible:outline-none focus-visible:bg-bg-secondary"
                      >
                        <span className="font-sans text-sm text-text-primary">{user.name}</span>
                        <span className="font-sans text-xs text-text-muted">{user.email}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between gap-3 w-full">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-fit disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:opacity-100"
        >
          {isEditing ? 'Enregistrer' : 'Ajouter un projet'}
        </Button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="w-fit h-[50px] px-6 rounded-[10px] font-sans text-base text-danger border border-danger hover:bg-danger-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Supprimer le projet
          </button>
        )}
      </div>
    </Modal>
  )
}
