import { Router } from "express";
import { validateschema } from "../middlewares/validator.middleware.js";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createCaracteristicas,
  deleteCaracteristicas,
  getCaracteristicas,
  updateCaracteristicas,
} from "../controllers/caracteristicas.controller.js";
import { caracteristicasSchema } from "../schemas/caracteristicas.schema.js";

const router = Router();

router.get(
  "/caracteristicas/get", 
  authRequired, 
  getCaracteristicas
);

router.get(
  "/caracteristicas/get/:id", 
  authRequired, 
  getCaracteristicas
);

router.post(
  "/caracteristicas/create",
  authRequired,
  validateschema(caracteristicasSchema),
  createCaracteristicas
);

router.put(
  "/caracteristicas/update/:id",
  authRequired,
  validateschema(caracteristicasSchema),
  updateCaracteristicas
);

router.delete(
  "/caracteristicas/delete/:id",
  authRequired,
  deleteCaracteristicas
);

export default router;
