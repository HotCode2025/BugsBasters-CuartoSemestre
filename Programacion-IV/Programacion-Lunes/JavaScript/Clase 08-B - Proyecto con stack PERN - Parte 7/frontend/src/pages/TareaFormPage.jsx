import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useTareas } from "../context/TareasContext";
import { getErrors } from "../api/getErrors";
import ErrorList from "../components/ErrorList";

function TareaFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { listarTarea, crearTarea, actualizarTarea } = useTareas();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelado = false;

    // Modo crear: formulario limpio
    if (!id) {
      setTitulo("");
      setDescripcion("");
      setErrors([]);
      setLoading(false);
      return;
    }

    // Modo editar: precargamos los datos de la tarea
    setLoading(true);

    const cargar = async () => {
      try {
        const tarea = await listarTarea(id);
        if (cancelado) return;
        setTitulo(tarea.titulo);
        setDescripcion(tarea.descripcion);
      } catch (error) {
        if (!cancelado) setErrors(getErrors(error));
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    cargar();

    return () => {
      cancelado = true;
    };
  }, [id, listarTarea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setErrors([]);
    setSubmitting(true);

    try {
      if (isEditing) {
        await actualizarTarea(id, { titulo, descripcion });
      } else {
        await crearTarea({ titulo, descripcion });
      }
      navigate("/tareas");
    } catch (error) {
      setErrors(getErrors(error));
      setSubmitting(false);
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

          <Button>{isEditing ? "Actualizar" : "Guardar"}</Button>
        </form>
      </Card>
    </div>
  );
}

export default TareaFormPage;