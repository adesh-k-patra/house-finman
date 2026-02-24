/**
 * API Client Service
 * Secure HTTP client with auth token handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    errorId?: string
  }
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.accessToken) {
      ;(headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Include cookies
      })

      const data = await response.json()

      // Handle token refresh if needed
      if (response.status === 401 && data.error?.code === "TOKEN_EXPIRED") {
        const refreshed = await this.refreshToken()
        if (refreshed) {
          // Retry the original request
          return this.request<T>(endpoint, options)
        }
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Unable to connect to server",
        },
      }
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.accessToken) {
          this.accessToken = data.data.accessToken
          return true
        }
      }
      return false
    } catch {
      return false
    }
  }

  // Auth methods
  async login(email: string, password: string, rememberMe = false) {
    const response = await this.request<{ user: unknown; accessToken: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe }),
      },
    )

    if (response.success && response.data?.accessToken) {
      this.accessToken = response.data.accessToken
    }

    return response
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request<{ user: unknown; accessToken: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      },
    )

    if (response.success && response.data?.accessToken) {
      this.accessToken = response.data.accessToken
    }

    return response
  }

  async logout() {
    const response = await this.request("/auth/logout", {
      method: "POST",
    })
    this.accessToken = null
    return response
  }

  async getMe() {
    return this.request<{ user: unknown }>("/auth/me")
  }

  // Generic CRUD methods
  async get<T>(endpoint: string) {
    return this.request<T>(endpoint)
  }

  async post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }

  // Resource-specific methods
  async getLeads(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params)}` : ""
    return this.get(`/leads${query}`)
  }

  async getLead(id: string) {
    return this.get(`/leads/${id}`)
  }

  async createLead(data: unknown) {
    return this.post("/leads", data)
  }

  async updateLead(id: string, data: unknown) {
    return this.put(`/leads/${id}`, data)
  }

  async deleteLead(id: string) {
    return this.delete(`/leads/${id}`)
  }

  async getDashboard() {
    return this.get("/dashboard")
  }

  async getAnalytics(
    type: "leads" | "revenue" | "performance",
    params?: Record<string, string>,
  ) {
    const query = params ? `?${new URLSearchParams(params)}` : ""
    return this.get(`/analytics/${type}${query}`)
  }
}

// Singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

export default apiClient
