import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config.js";
import authRoutes from "./router/auth.routes.js";
import tareasRoutes from "./router/tareas.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", tareasRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;