import { Router } from "express";
import { createShop, getShop } from "../controllers/shop.controller.js";
import { validateschema } from "../middlewares/validator.middleware.js";
import { shopSchema } from "../schemas/shop.schema.js";

const router = Router();

router.post(
    "/shop/create",
    validateschema(shopSchema),
    createShop
);

router.post(
    "/shop/get",
    getShop
);

export default router;