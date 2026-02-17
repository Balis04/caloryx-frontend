import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { getValidToken, logout as doLogout } from "@/lib/auth";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getValidToken();
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    doLogout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
