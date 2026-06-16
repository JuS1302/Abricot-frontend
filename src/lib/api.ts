import mockData from "../data/mock-data.json"

// Passe à false quand le backend est lancé
const USE_MOCK = false
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export const api = {

  // ===== AUTH =====

  login: async (email: string, password: string) => {
    if (USE_MOCK) return mockData.auth
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) throw new Error("Identifiants incorrects")
    const json = await response.json()
    return json.data // { token, user }
  },

  register: async (name: string, email: string, password: string) => {
    if (USE_MOCK) return mockData.auth
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) throw new Error("Erreur lors de l'inscription")
    const json = await response.json()
    return json.data
  },

  // ===== UTILISATEURS =====

  getUserInfo: async (token: string) => {
    if (USE_MOCK) return mockData.userInfo
    const response = await fetch(`${API_URL}/users/me`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de récupérer les infos utilisateur")
    const json = await response.json()
    return json.data
  },

  updateProfile: async (token: string, data: { name?: string; email?: string }) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Impossible de modifier le profil")
    const json = await response.json()
    return json.data
  },

  updatePassword: async (token: string, data: { currentPassword: string; newPassword: string }) => {
    const response = await fetch(`${API_URL}/auth/password`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Impossible de modifier le mot de passe")
  },

  searchUsers: async (token: string, query: string) => {
    const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de rechercher des utilisateurs")
    const json = await response.json()
    return json.data.users as { id: string; email: string; name: string }[]
  },

  // ===== PROJETS =====

  getProjects: async (token: string) => {
    if (USE_MOCK) return mockData.projects
    const response = await fetch(`${API_URL}/projects`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de récupérer les projets")
    const json = await response.json()
    return json.data.projects
  },

  getProjectById: async (token: string, projectId: string) => {
    if (USE_MOCK) return mockData.projects.find(p => p.id === projectId)
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Projet introuvable")
    const json = await response.json()
    return json.data.project ?? json.data
  },

  createProject: async (token: string, data: { name: string; description: string }) => {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Impossible de créer le projet")
    const json = await response.json()
    return json.data.project ?? json.data
  },

  updateProject: async (token: string, projectId: string, data: { name: string; description: string }) => {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Impossible de modifier le projet")
    const json = await response.json()
    return json.data.project ?? json.data
  },

  deleteProject: async (token: string, projectId: string) => {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de supprimer le projet")
  },

  addContributor: async (token: string, projectId: string, email: string) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/contributors`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: "CONTRIBUTOR" }),
    })
    if (!response.ok) throw new Error("Impossible d'ajouter le contributeur")
  },

  removeContributor: async (token: string, projectId: string, userId: string) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/contributors/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de retirer le contributeur")
  },

  // ===== TÂCHES =====

  // Charge les tâches de tous les projets et les retourne à plat
  getTasks: async (token: string) => {
    if (USE_MOCK) return mockData.tasks
    const projectsResponse = await fetch(`${API_URL}/projects`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!projectsResponse.ok) throw new Error("Impossible de récupérer les projets")
    const projectsJson = await projectsResponse.json()
    const projects: { id: string }[] = projectsJson.data.projects

    const taskArrays = await Promise.all(
      projects.map(async (project) => {
        const response = await fetch(`${API_URL}/projects/${project.id}/tasks`, {
          headers: { "Authorization": `Bearer ${token}` },
        })
        if (!response.ok) return []
        const json = await response.json()
        return json.data.tasks ?? json.data ?? []
      })
    )
    return taskArrays.flat()
  },

  getTasksByProject: async (token: string, projectId: string) => {
    if (USE_MOCK) return mockData.tasks.filter(t => t.projectId === projectId)
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de récupérer les tâches du projet")
    const json = await response.json()
    return json.data.tasks ?? json.data ?? []
  },

  createTask: async (token: string, projectId: string, data: {
    title: string
    description: string
    dueDate: string
    status: string
    assignees: string[]
  }) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, priority: "MEDIUM" }),
    })
    if (!response.ok) throw new Error("Impossible de créer la tâche")
    const json = await response.json()
    return json.data
  },

  updateTask: async (token: string, projectId: string, taskId: string, data: {
    title: string
    description: string
    dueDate: string
    status: string
    assignees: string[]
  }) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.message ?? `Erreur ${response.status} : impossible de modifier la tâche`)
    }
    const json = await response.json()
    return json.data
  },

  deleteTask: async (token: string, projectId: string, taskId: string) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Impossible de supprimer la tâche")
  },

  // ===== COMMENTAIRES =====

  createComment: async (token: string, projectId: string, taskId: string, content: string) => {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    if (!response.ok) throw new Error("Impossible d'ajouter le commentaire")
    const json = await response.json()
    return json.data
  },

}
