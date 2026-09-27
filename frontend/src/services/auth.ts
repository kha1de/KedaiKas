import { apiClient, setAuthToken, removeAuthToken } from "./api";
import { AuthResponse, User, UserLoginInput, UserRegisterInput } from "@/types/user";

export const authService = {
  async login(credentials: UserLoginInput): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.access_token) {
      setAuthToken(data.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("umkm_user", JSON.stringify(data.user));
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
    return apiClient<User>("/auth/me");
  },

  logout(): void {
    removeAuthToken();
  },

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("umkm_user");
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
