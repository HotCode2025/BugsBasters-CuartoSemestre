import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const TareasContext = createContext();

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareas debe usarse dentro de un TareasProvider");
  }
  return context;
};

export function TareasProvider({ children }) {
  const { isAuth } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Si el usuario cierra sesión, vaciamos todo el estado de tareas
  useEffect(() => {
    if (!isAuth) {
      setTareas([]);
      setLoading(true);
    }
  }, [isAuth]);

  // Las funciones lanzan el error; cada página decide cómo mostrarlo.
  const listarTareas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/tareas");
      setTareas(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const listarTarea = useCallback(async (id) => {
    const res = await api.get(`/tareas/${id}`);
    return res.data;
  }, []);

  const crearTarea = async (tarea) => {
    const res = await api.post("/tareas", tarea);
    setTareas((prev) => [res.data, ...prev]);
    return res.data;
  };

  const eliminarTarea = async (id) => {
    await api.delete(`/tareas/${id}`);
    setTareas((prev) => prev.filter((t) => String(t.id) !== String(id)));
  };

  const actualizarTarea = async (id, tarea) => {
    const res = await api.put(`/tareas/${id}`, tarea);
    setTareas((prev) =>
      prev.map((t) => (String(t.id) === String(id) ? res.data : t))
    );
    return res.data;
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        loading,
        listarTareas,
        listarTarea,
        crearTarea,
        eliminarTarea,
        actualizarTarea,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
}