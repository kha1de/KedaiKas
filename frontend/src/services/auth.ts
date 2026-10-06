import { apiClient, setAuthToken, removeAuthToken } from "./api";
import {
  AuthResponse,
  User,
  UserLoginInput,
  UserRegisterInput,
  UserCreateStaff,
  UserUpdateRole,
} from "@/types/user";

const USER_STORAGE_KEY = "umkm_user";

export const authService = {
  async login(credentials: UserLoginInput): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.access_token) {
      setAuthToken(data.access_token);
      if (typeof window !== "undefined") {
        // Simpan seluruh user object termasuk role dan id_usaha
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
    }
    return data;
  },

  async register(input: UserRegisterInput): Promise<User> {
    return apiClient<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async getMe(): Promise<User> {
    const user = await apiClient<User>("/auth/me");
    // Selalu sync ke localStorage agar data role terbaru tersedia
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  logout(): void {
    removeAuthToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  },
};

// ─── User Management Service (Owner-only) ───────────────────────────────────

export const userManagementService = {
  async listUsers(): Promise<User[]> {
    return apiClient<User[]>("/users");
  },

  async createStaff(data: UserCreateStaff): Promise<User> {
    return apiClient<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateRole(userId: number, data: UserUpdateRole): Promise<User> {
    return apiClient<User>(`/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteUser(userId: number): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};
