const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("umkm_auth_token");
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("umkm_auth_token", token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("umkm_auth_token");
    localStorage.removeItem("umkm_user");
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = getAuthToken();
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");

    let responseData: unknown = null;
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let errorMessage = "Terjadi kesalahan pada server.";
      if (responseData && typeof responseData === "object" && "detail" in responseData) {
        const detail = (responseData as { detail: unknown }).detail;
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((d: { msg?: string }) => d.msg || JSON.stringify(d)).join(", ");
        }
      }
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Tidak dapat terhubung ke server backend.";
    throw new ApiError(message, 0);
  }
}
