"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token); 
    setUser(user);
    toast.success("Connexion réussie");
    
    if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Déconnexion réussie");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
