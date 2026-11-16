import { useEffect, useState } from "react";
import api from "../api/axios";
import { getErrors } from "../api/getErrors";
import ErrorList from "../components/ErrorList";
import TareaCard from "../components/tareas/TareaCard";

export default function TareasPage() {
  const [tareas, setTareas] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTareas = async () => {
      try {
        const res = await api.get("/tareas");
        setTareas(res.data);
      } catch (error) {
        setErrors(getErrors(error));
      } finally {
        setLoading(false);
      }
    };

    loadTareas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;

    setErrors([]);

    try {
      await api.delete(`/tareas/${id}`);
      setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
    } catch (error) {
      setErrors(getErrors(error));
    }
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Cargando tareas...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold text-white mb-6">Mis tareas</h1>

      <ErrorList errors={errors} />

      {tareas.length === 0 ? (
        <p className="text-gray-400">
          Todavía no hay tareas. ¡Crea la primera!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tareas.map((tarea) => (
            <TareaCard key={tarea.id} tarea={tarea} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}