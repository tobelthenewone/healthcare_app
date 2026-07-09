import api from "@/lib/api";
import {
  AuthResponse,
  CurrentUserResponse,
  LoginRequest,
  RefreshResponse,
} from "@/types/auth";

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "PATIENT" | "PROFESSIONAL";
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);

    return response.data;
  },
  async register(data: RegisterRequest): Promise<void> {
    await api.post("/auth/register", data);
  },
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const response = await api.post<RefreshResponse>("/auth/refresh", {
      refreshToken,
    });

    return response.data;
  },

  async logout(refreshToken: string) {
    await api.post("/auth/logout", {
      refreshToken,
    });
  },
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await api.get<CurrentUserResponse>("/auth/me");

    return response.data;
  },
};
