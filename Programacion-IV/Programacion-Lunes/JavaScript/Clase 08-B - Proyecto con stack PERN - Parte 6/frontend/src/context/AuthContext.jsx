import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Las funciones lanzan el error; cada página decide cómo mostrarlo.
  const signup = async (data) => {
    const res = await api.post("/signup", data);
    setUser(res.data);
    setIsAuth(true);
    return res.data;
  };

  const signin = async (data) => {
    const res = await api.post("/signin", data);
    setUser(res.data);
    setIsAuth(true);
    return res.data;
  };

  const signout = async () => {
    try {
      await api.post("/signout");
    } finally {
      setUser(null);
      setIsAuth(false);
    }
  };

  // Al abrir la app, preguntamos al backend si la cookie sigue siendo válida
  // (la cookie es httpOnly, así que JavaScript no puede leerla directamente).
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data);
        setIsAuth(true);
      } catch {
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuth, loading, signup, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
}