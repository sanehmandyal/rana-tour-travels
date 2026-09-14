import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await client.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("rana_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    if (data.token) {
      localStorage.setItem("rana_token", data.token);
    }
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    localStorage.removeItem("rana_token");
    try {
      await client.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  };

  const registerAdmin = async (name, email, password, adminSecretKey) => {
    const { data } = await client.post("/auth/register-admin", {
      name,
      email,
      password,
      adminSecretKey,
    });
    setUser(data.user);
    return data.user;
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerAdmin, isAdmin, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
