import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on app load
    const stored = localStorage.getItem("vibekit_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch("/api/auth-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data.user);
    localStorage.setItem("vibekit_user", JSON.stringify(data.user));
    return data.user;
  };

  const signup = async (email, password) => {
    const res = await fetch("/api/auth-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data.user);
    localStorage.setItem("vibekit_user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    await fetch("/api/auth-logout", { method: "POST", credentials: "include" });
    setUser(null);
    localStorage.removeItem("vibekit_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
