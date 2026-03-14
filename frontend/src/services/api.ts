import { API_URL } from "@/lib/constants";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      const message =
        data.error?.message || data.message || "Une erreur est survenue";
      throw new Error(message);
    }

    return data;
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: HeadersInit = {};
    const token = this.getToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  async get<T>(
    url: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const fullUrl = `${this.baseUrl}${url}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(url: string, formData: FormData): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  async uploadPut<T>(url: string, formData: FormData): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  async downloadBlob(url: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement");
    }

    return response.blob();
  }
}

const api = new ApiClient();
export default api;
