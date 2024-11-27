import { Router } from "express";
import { validateschema } from "../../middlewares/validator.middleware.js";

import {
    getAllCupones,
    getCupon,
    createCupon,
    updateCupon,
    deleteCupon
  } from '../../controllers/Admin/cupones.controller.js';
  
import { cuponSchema } from '../../schemas/Admin/cupones.schema.js';
import { authRequired } from "../../middlewares/validateToken.js";

const router = Router();

router.get(
    "/cupones/get",
    authRequired,
    getAllCupones
);

router.get(
  "/cupones/get/:name",
  getCupon
);

router.post(
  "/cupones/create",
  authRequired,
  validateschema(cuponSchema),
  createCupon
);

router.put(
  "/cupones/update/:id",
  authRequired,
  validateschema(cuponSchema),
  updateCupon
);

router.delete(
  "/cupones/delete/:id",
  authRequired,
  deleteCupon
);

export default router;
