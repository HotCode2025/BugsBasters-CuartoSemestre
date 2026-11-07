import express from "express";
import morgan from "morgan";
import tareasRoutes from "./router/tareas.routes.js"
import authRoutes from "./router/auth.routes.js"

const app = express();
//Middlewares
app.use(morgan("dev"));
ap.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get("/", (req, res) => res.json({ message: "Bienvenidos a mi Proyecto" }));
app.use(tareasRoutes);
app.use(authRoutes)

//Manejando errores
app.use(req, res, next) => {
    res.status(500).json ({
        status: "error",
        message: err.message
    });
};

export default app;