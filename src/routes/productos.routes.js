import { Router } from "express";
import { validateschema } from "../middlewares/validator.middleware.js";
import { productosSchema } from "../schemas/productos.schema.js";
import { 
  getProductos,
  createProducto,
  updateProductos,
  deleteProducto,
  getImageProducto,
 } from "../controllers/productos.controller.js";
 
import { authRequired } from "../middlewares/validateToken.js";


const router = Router();
//para crear la ruta primero ponemos el nombre de laruta + si es que validaremos algo + la función que se ejecutará

router.get("/productos/get", getProductos);
router.get("/productos/get/:id", getProductos);

router.post(
  "/productos/create",
  authRequired,
  validateschema(productosSchema),
  createProducto
);

router.put(
  "/productos/update/:id", 
  authRequired,
  validateschema(productosSchema), 
  updateProductos
);
router.delete(
  "/productos/delete/:id", 
  authRequired, 
  deleteProducto
);

router.get(
  "/productos/getImage/:id",
  getImageProducto
)

export default router;
