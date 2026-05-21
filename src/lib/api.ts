import mockData from "../data/mock-data.json"

// Passe à false quand le backend est lancé
const USE_MOCK = false
const API_URL = "http://localhost:8000"

export const api = {

  // ===== AUTH =====

  login: async (email: string, password: string) => {
    if (USE_MOCK) return mockData.auth
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
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
      body: JSON.stringify({ name, email, password })
    })
    if (!response.ok) throw new Error("Erreur lors de l'inscription")
    const json = await response.json()
    return json.data
  },

  // ===== USER =====

  getUserInfo: async (token: string) => {
    if (USE_MOCK) return mockData.userInfo
    const response = await fetch(`${API_URL}/users/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Impossible de récupérer les infos utilisateur")
    const json = await response.json()
    return json.data
  },

  // ===== PROJETS =====

  getProjects: async (token: string) => {
    if (USE_MOCK) return mockData.projects
    const response = await fetch(`${API_URL}/projects`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Impossible de récupérer les projets")
    const json = await response.json()
    return json.data.projects // { projects: [...] }
  },

  getProjectById: async (token: string, projectId: string) => {
    if (USE_MOCK) return mockData.projects.find(p => p.id === projectId)
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Projet introuvable")
    const json = await response.json()
    return json.data.project ?? json.data
  },

  // ===== TÂCHES =====

  // Charge les tâches de tous les projets et les retourne à plat
  getTasks: async (token: string) => {
    if (USE_MOCK) return mockData.tasks
    const projectsResponse = await fetch(`${API_URL}/projects`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!projectsResponse.ok) throw new Error("Impossible de récupérer les projets")
    const projectsJson = await projectsResponse.json()
    const projects: { id: string }[] = projectsJson.data.projects

    const taskArrays = await Promise.all(
      projects.map(async (project) => {
        const response = await fetch(`${API_URL}/projects/${project.id}/tasks`, {
          headers: { "Authorization": `Bearer ${token}` }
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
      headers: { "Authorization": `Bearer ${token}` }
    })
    if (!response.ok) throw new Error("Impossible de récupérer les tâches du projet")
    const json = await response.json()
    return json.data.tasks ?? json.data ?? []
  },

}
