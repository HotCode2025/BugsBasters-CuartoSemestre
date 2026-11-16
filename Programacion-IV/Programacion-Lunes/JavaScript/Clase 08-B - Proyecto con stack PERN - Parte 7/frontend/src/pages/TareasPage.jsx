import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTareas } from "../context/TareasContext";
import { getErrors } from "../api/getErrors";
import ErrorList from "../components/ErrorList";
import TareaCard from "../components/tareas/TareaCard";

function TareasPage() {
  const { tareas, loading, listarTareas } = useTareas();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    listarTareas().catch((error) => setErrors(getErrors(error)));
  }, [listarTareas]);

  // Solo mostramos "Cargando" si todavía no hay nada que mostrar (evita parpadeos)
  if (loading && tareas.length === 0) {
    return <p className="text-center text-white mt-10">Cargando tareas...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold text-white mb-6">Mis tareas</h1>

      <ErrorList errors={errors} />

      {tareas.length === 0 ? (
        <p className="text-gray-400">
          Todavía no hay tareas.{" "}
          <Link to="/tareas/crear" className="text-sky-400 hover:underline">
            Crea la primera
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tareas.map((tarea) => (
            <TareaCard
              key={tarea.id}
              tarea={tarea}
              onError={(error) => setErrors(getErrors(error))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TareasPage;