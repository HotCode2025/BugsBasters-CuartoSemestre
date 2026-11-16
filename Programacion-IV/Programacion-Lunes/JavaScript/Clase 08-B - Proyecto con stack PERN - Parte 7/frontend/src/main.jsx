import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TareasProvider } from "./context/TareasContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TareasProvider>
          <App />
        </TareasProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);