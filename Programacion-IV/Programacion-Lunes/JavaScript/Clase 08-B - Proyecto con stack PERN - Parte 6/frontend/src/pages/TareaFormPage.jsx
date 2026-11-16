import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import api from "../api/axios";
import { getErrors } from "../api/getErrors";
import ErrorList from "../components/ErrorList";

function TareaFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;

    const loadTarea = async () => {
      try {
        const res = await api.get(`/tareas/${id}`);
        setTitulo(res.data.titulo);
        setDescripcion(res.data.descripcion);
      } catch (error) {
        setErrors(getErrors(error));
      } finally {
        setLoading(false);
      }
    };

    loadTarea();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      if (isEditing) {
        await api.put(`/tareas/${id}`, { titulo, descripcion });
      } else {
        await api.post("/tareas", { titulo, descripcion });
      }
      navigate("/tareas");
    } catch (error) {
      setErrors(getErrors(error));
    }
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Cargando tarea...</p>;
  }

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        <h3 className="text-2xl font-bold text-yellow-300 mb-4">
          {isEditing ? "Editar tarea" : "Crear tarea"}
        </h3>

        <ErrorList errors={errors} />

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            rows="4"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="bg-zinc-700 text-white px-3 py-2 block my-2 w-full rounded-md"
          />

          <Button>Guardar</Button>
        </form>
      </Card>
    </div>
  );
}

export default TareaFormPage;