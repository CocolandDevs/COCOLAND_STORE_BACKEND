-- AlterTable
ALTER TABLE `compras_usuario` ADD COLUMN `descuento` DECIMAL(65, 30) NULL DEFAULT 0,
    ADD COLUMN `id_stripe_transaccion` VARCHAR(255) NULL,
    MODIFY `id_ubicacion` INTEGER NULL;
