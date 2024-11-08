import { Router } from "express";
import { addCart, aplicarcupon, deleteCart, deleteProdcutCart, getCart, getShop , intentPayment, crearPago} from "../controllers/shop.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { shopSchema } from "../schemas/shop.schema.js";
import { authRequired } from "../middlewares/validateToken.js";
const router = Router();

//crear la compra
router.post(
    "/payment/create-payment-intent",
    authRequired,
    intentPayment
);

router.post(
    "/payment/create-payment",
    authRequired,
    crearPago
)

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
router.post(
    "/shop/deleteProduct",
    authRequired,
    deleteProdcutCart
);

router.post(
    "/shop/aplicarDescuento",
    authRequired,
    aplicarcupon
)

router.delete(
    "/shop/deleteCart",
    authRequired,
    deleteCart
)

export default router;