import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TareasPage from "./pages/TareasPage";
import TareaFormPage from "./pages/TareaFormPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/tareas" element={<TareasPage />} />
            <Route path="/tareas/crear" element={<TareaFormPage />} />
            <Route path="/tareas/:id/editar" element={<TareaFormPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          <Route
            path="*"
            element={
              <p className="text-center text-white mt-10">
                Página no encontrada
              </p>
            }
          />
        </Routes>
      </div>
    </>
  );
}