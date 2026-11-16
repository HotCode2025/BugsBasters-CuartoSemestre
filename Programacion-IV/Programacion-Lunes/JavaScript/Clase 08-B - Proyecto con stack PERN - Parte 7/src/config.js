import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "xyz123";

if (NODE_ENV === "production" && !process.env.TOKEN_SECRET) {
  console.warn("ATENCIÓN: falta TOKEN_SECRET en producción, se usa el valor por defecto.");
}

// Solo se pone en true si el frontend y el backend están en dominios distintos
export const CROSS_SITE_COOKIES = process.env.CROSS_SITE_COOKIES === "true";

// Orígenes permitidos por CORS: localhost (desarrollo) + los que pongas en
// FRONTEND_URL (separados por coma si son varios, sin barra final)
const extraOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...extraOrigins,
];