import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuth, user, signout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-zinc-700 text-white"
        : "text-gray-300 hover:bg-zinc-800 hover:text-white"
    }`;

  const closeMenu = () => setOpen(false);

  const handleSignout = async () => {
    await signout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isAuth ? "/tareas" : "/"}
            className="text-white text-xl font-bold"
            onClick={closeMenu}
          >
            PERN Tareas
          </Link>

          {/* Botón hamburguesa (solo móvil) */}
          <button
            type="button"
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Links en pantallas grandes */}
          <ul className="hidden md:flex items-center gap-2">
            {isAuth ? (
              <>
                <li>
                  <NavLink to="/tareas" end className={linkClass}>
                    Tareas
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tareas/crear" className={linkClass}>
                    Crear Tarea
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/perfil" className={linkClass}>
                    Perfil
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleSignout}
                    className="ml-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-md"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={linkClass}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={linkClass}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Menú desplegable en móvil */}
        {open && (
          <ul className="md:hidden pb-4 space-y-1">
            {isAuth ? (
              <>
                <li>
                  <NavLink
                    to="/tareas"
                    end
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    Tareas
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tareas/crear"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    Crear Tarea
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/perfil"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    Perfil
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleSignout}
                    className="w-full text-left bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-2 rounded-md"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}