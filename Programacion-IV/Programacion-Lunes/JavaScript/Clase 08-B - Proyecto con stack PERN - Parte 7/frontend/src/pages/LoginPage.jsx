import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";import { useAuth } from "../context/AuthContext";
import { getErrors } from "../api/getErrors";
import ErrorList from "../components/ErrorList";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { signin, isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) navigate("/tareas");
  }, [isAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      await signin({ email, password });
      navigate("/tareas");
    } catch (error) {
      setErrors(getErrors(error));
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        <h3 className="text-2xl font-bold text-yellow-300 mb-4">
          Iniciar sesión
        </h3>

        <ErrorList errors={errors} />

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Ingrese su email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button>Ingresar</Button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-sky-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;