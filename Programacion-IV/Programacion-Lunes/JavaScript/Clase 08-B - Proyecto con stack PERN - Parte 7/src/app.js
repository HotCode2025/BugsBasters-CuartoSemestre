import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { ALLOWED_ORIGINS, NODE_ENV } from "./config.js";
import authRoutes from "./router/auth.routes.js";
import tareasRoutes from "./router/tareas.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Railway está detrás de un proxy: necesario para cookies seguras
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      // Sin origin = misma web o herramientas como Postman
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", authRoutes);
app.use("/api", tareasRoutes);

// En producción Express también sirve el frontend compilado
if (NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "frontend", "dist");

  app.use(express.static(distPath));

  // Cualquier GET que no sea /api devuelve index.html (para React Router)
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;