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
  guardarTarjeta,
  confirmarPagoOxxo,
} from "../controllers/shop.controller.js";

const router = Router();

//crear la compra
router.post(
    "/payment/create-payment-intent",
    intentPayment
);
//guardar la tarjeta
router.post(
    "/payment/save-card",
    guardarTarjeta
)
//confirmar la compra
router.post(
    "/payment/create-payment",
    crearPago
)

//confirmas compras tardias
router.post(
    "/payment/webhok",
    confirmarPagoOxxo
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