"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { authService } from "@/services/auth-service";
import { tokenStorage } from "@/lib/token";

import { CurrentUserResponse, LoginRequest, User } from "@/types/auth";

interface AuthContextType {
  loading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function restoreSession() {
      const accessToken = tokenStorage.getAccessToken();

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();

        setUser(user);
      } catch {
        tokenStorage.clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);

    tokenStorage.setTokens(response.accessToken, response.refreshToken);

    setUser({
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      role: response.role,
    });
  };

  async function logout() {
    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // ignore logout errors
    } finally {
      tokenStorage.clearTokens();

      setUser(null);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
