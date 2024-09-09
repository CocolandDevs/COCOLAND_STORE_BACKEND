import { Router } from "express";
import { validateMetodoPago } from "../middlewares/validator.middleware.js";
import { createMethodPayment, deleteMethodPayment, getMethodsPayment, updateMethodPayment } from "../controllers/metodosPago.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { paymentMethodSchema } from "../schemas/metodosPago.schema.js";

const router = Router();

router.get(
    "/metodosPago/get", 
    authRequired, 
    getMethodsPayment
);

router.get(
    "/metodosPago/get/:id", 
    authRequired, 
    getMethodsPayment
);

router.post(
    "/metodosPago/create",
    authRequired,
    validateMetodoPago(paymentMethodSchema),
    createMethodPayment
);

router.put(
    "/metodosPago/update/:id",
    authRequired,
    validateMetodoPago(paymentMethodSchema),
    updateMethodPayment
);

router.delete(
    "/metodosPago/delete/:id",
    authRequired,
    deleteMethodPayment
);

export default router;