import { Router } from "express";
import { getMetodoPagoMasUsado,
    getVentasTemporadas,
    getTopVentas,
    getCategoriaMasVendida
 } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/dashboard/pagopopular", getMetodoPagoMasUsado);

router.get("/dashboard/ventas/temporada", getVentasTemporadas);

router.get("/dashboard/productos/top", getTopVentas);

router.get('/dashboard/productos/categorias/ventas', getCategoriaMasVendida);

export default router;

//ejemplo del metodo mas popular
//http://localhost:3000/api/dashboard/pagopopular?filtro=Mes
//ejemplo de ventas por temporada/año
//http://localhost:3000/api/dashboard/ventas/temporada?temporada=Invierno&year=2023
//ejemplo de top 5 de productos mas comprados por semana/mes/año
//http://localhost:3000/api/dashboard/productos/top?filtro=Mes
//ejemplo de categoria mas vendida
//http://localhost:3000/api/dashboard/productos/categorias/ventas?filtro=Mes