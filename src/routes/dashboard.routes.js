import { Router } from "express";
import { getMetodoPagoMasUsado } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/dashboard/pagopopular", getMetodoPagoMasUsado);

export default router;

//ejemplo
//http://localhost:3000/api/dashboard/pagopopular?filtro=Mes