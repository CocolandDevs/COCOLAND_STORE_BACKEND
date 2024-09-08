/*
  Warnings:

  - Added the required column `id_metodo_pago` to the `COMPRAS_USUARIO` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `compras_usuario` ADD COLUMN `id_cupon` INTEGER NULL,
    ADD COLUMN `id_metodo_pago` INTEGER NOT NULL,
    MODIFY `cantidad` INTEGER NOT NULL DEFAULT 1,
    MODIFY `fecha_compra` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `productos` ADD COLUMN `en_descuento` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `id_usuario` INTEGER NULL,
    ADD COLUMN `precio_descuento` DECIMAL(65, 30) NULL,
    ADD COLUMN `stock` INTEGER NULL;

-- CreateTable
CREATE TABLE `CARRITO_COMPRA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_producto` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `METODOS_PAGO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `tipo` VARCHAR(100) NULL,
    `numero_tarjeta` VARCHAR(100) NULL,
    `fecha_vencimiento` DATETIME(3) NULL,
    `cvv` INTEGER NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_paypal` VARCHAR(100) NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CUPONES` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `porcentaje_descuento` DOUBLE NOT NULL,
    `limite_usos` INTEGER NULL DEFAULT 1,
    `fecha_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_fin` DATETIME(3) NOT NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
