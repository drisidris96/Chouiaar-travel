import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "@/constants/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; verificationCode?: string; email?: string; error?: string }>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; verificationCode?: string; error?: string }>;
  verify: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendCode: (email: string) => Promise<{ success: boolean; verificationCode?: string; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        await AsyncStorage.removeItem("user");
      }
    } catch {
      const cached = await AsyncStorage.getItem("user");
      if (cached) setUser(JSON.parse(cached));
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.status === 403 && data.error === "not_verified") {
      return { success: false, needsVerification: true, verificationCode: data.verificationCode, email: data.email };
    }
    if (!res.ok) return { success: false, error: data.message };

    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    return { success: true };
  };

  const register = async (regData: { name: string; email: string; phone?: string; password: string }) => {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(regData),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    return { success: true, verificationCode: data.verificationCode };
  };

  const verify = async (email: string, code: string) => {
    const res = await apiFetch("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    setUser(data.user);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    return { success: true };
  };

  const resendCode = async (email: string) => {
    const res = await apiFetch("/auth/resend-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    return { success: true, verificationCode: data.verificationCode };
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verify, resendCode, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
