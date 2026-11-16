import { useNavigate } from "react-router-dom";
import { useTareas } from "../../context/TareasContext";

export default function TareaCard({ tarea, onError }) {
  const navigate = useNavigate();
  const { eliminarTarea } = useTareas();

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;

    try {
      await eliminarTarea(tarea.id);
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <div className="bg-zinc-800 p-5 rounded-md border border-zinc-700 flex flex-col justify-between">
      <div>
        <h2 className="text-white text-xl font-bold mb-2 break-words">
          {tarea.titulo}
        </h2>
        <p className="text-gray-300 break-words">{tarea.descripcion}</p>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={() => navigate(`/tareas/${tarea.id}/editar`)}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2 rounded-md"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-md"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}