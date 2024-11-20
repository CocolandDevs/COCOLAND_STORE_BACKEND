import { Router } from "express";
import {
  addCart,
  aplicarcupon,
  deleteCart,
  deleteProdcutCart,
  getCart,
  getShop,
  intentPayment,
  crearPago,
} from "../controllers/shop.controller.js";

const router = Router();

//crear la compra
router.post(
    "/payment/create-payment-intent",
    intentPayment
);

router.post(
    "/payment/create-payment",
    crearPago
)

//historial de compras
router.post(
    "/shop/get",
    getShop
);

//agregar al carrito
router.post(
    "/shop/addCart",
    addCart
)

//obtener carrito
router.post(
    "/shop/getCart",
    getCart
)

//eliminar carrito
router.post(
    "/shop/deleteProduct",
    deleteProdcutCart
);

router.post(
    "/shop/aplicarDescuento",
    aplicarcupon
)

router.delete(
    "/shop/deleteCart",
    deleteCart
)

export default router;