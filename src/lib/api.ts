import mockData from "../data/mock-data.json"

// Passe à false quand le backend est lancé
const USE_MOCK = true
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"


function getToken(): string {
  return localStorage.getItem('token') ?? ''
}

function authHeaders() {
  return { "Authorization": `Bearer ${getToken()}` }
}

export const api = {

  // ===== AUTH =====

  login: async (email: string, password: string) => {
    if (USE_MOCK) {
      return mockData.auth
    }
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error("Identifiants incorrects")
    return response.json()
  },

  register: async (name: string, email: string, password: string) => {
    if (USE_MOCK) {
      return mockData.auth
    }
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    if (!response.ok) throw new Error("Erreur lors de l'inscription")
    return response.json()
  },

  // ===== USER =====

  getUserInfo: async () => {
    if (USE_MOCK) {
      return mockData.userInfo
    }
    const response = await fetch(`${API_URL}/users/me`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error("Impossible de récupérer les infos utilisateur")
    return response.json()
  },

  // ===== PROJETS =====

  getProjects: async () => {
    if (USE_MOCK) {
      return mockData.projects
    }
    const response = await fetch(`${API_URL}/projects`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error("Impossible de récupérer les projets")
    return response.json()
  },

  getProjectById: async (projectId: string) => {
    if (USE_MOCK) {
      return mockData.projects.find(p => p.id === projectId)
    }
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error("Projet introuvable")
    return response.json()
  },

  // ===== TÂCHES =====

  getTasks: async () => {
    if (USE_MOCK) {
      return mockData.tasks
    }
    const response = await fetch(`${API_URL}/tasks`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error("Impossible de récupérer les tâches")
    return response.json()
  },

  getTasksByProject: async (projectId: string) => {
    if (USE_MOCK) {
      return mockData.tasks.filter(t => t.projectId === projectId)
    }
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
      headers: authHeaders()
    })
    if (!response.ok) throw new Error("Impossible de récupérer les tâches du projet")
    return response.json()
  },

}
