export type UserRole = "PATIENT" | "PROFESSIONAL" | "ADMIN";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface CurrentUserResponse {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}
