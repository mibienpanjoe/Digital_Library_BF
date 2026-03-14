import { ApiResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function fetchWrapper<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...customOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  // Get token from local storage for client-side fetches
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""; 

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const finalHeaders = { ...defaultHeaders, ...headers };
  // If we are sending FormData, fetch automatically sets Content-Type (removes the default)
  if (customOptions.body instanceof FormData) {
    delete (finalHeaders as Record<string, string>)["Content-Type"];
  }

  const response = await fetch(url, { ...customOptions, headers: finalHeaders });

  let data;
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (isJson) {
    data = await response.json();
  } else {
    // For downloads
    if (response.ok) {
      return response.blob() as unknown as T;
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error?.message || response.statusText;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, params?: Record<string, any>) =>
    fetchWrapper<T>(url, { method: "GET", params }),
  post: <T>(url: string, body?: any) =>
    fetchWrapper<T>(url, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: any) =>
    fetchWrapper<T>(url, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string) =>
    fetchWrapper<T>(url, { method: "DELETE" }),
  upload: <T>(url: string, formData: FormData) =>
    fetchWrapper<T>(url, { method: "POST", body: formData }),
};
