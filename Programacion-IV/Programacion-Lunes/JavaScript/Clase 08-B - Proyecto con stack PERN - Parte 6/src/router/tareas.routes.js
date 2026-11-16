import { Router } from "express";
import {
  getTareas,
  getTarea,
  createTarea,
  updateTarea,
  deleteTarea,
} from "../controllers/tareas.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { tareaSchema } from "../schemas/tareas.schema.js";

const router = Router();

router.get("/tareas", isAuth, getTareas);
router.get("/tareas/:id", isAuth, getTarea);
router.post("/tareas", isAuth, validateSchema(tareaSchema), createTarea);
router.put("/tareas/:id", isAuth, validateSchema(tareaSchema), updateTarea);
router.delete("/tareas/:id", isAuth, deleteTarea);

export default router;