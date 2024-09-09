import { Router } from "express";
import { addCart, createShop, deleteCart, deleteProdcutCart, getCart, getShop } from "../controllers/shop.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { shopSchema } from "../schemas/shop.schema.js";
import { authRequired } from "../middlewares/validateToken.js";
const router = Router();

//crear la compra
router.post(
    "/shop/create",
    authRequired,
    validateschema(shopSchema),
    createShop
);

//historial de compras
router.post(
    "/shop/get",
    authRequired,
    getShop
);

//agregar al carrito
router.post(
    "/shop/addCart",
    authRequired,
    addCart
)

//obtener carrito
router.post(
    "/shop/getCart",
    authRequired,
    getCart
)

//eliminar carrito
router.delete(
    "/shop/deleteProduct",
    authRequired,
    deleteProdcutCart
);

router.delete(
    "/shop/deleteCart",
    authRequired,
    deleteCart
)

export default router;