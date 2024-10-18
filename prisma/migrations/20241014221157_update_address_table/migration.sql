/*
  Warnings:

  - You are about to drop the column `numero_exterior` on the `ubicaciones_usuario` table. All the data in the column will be lost.
  - You are about to drop the column `numero_interior` on the `ubicaciones_usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `metodos_pago` ADD COLUMN `id_stripe` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `ubicaciones_usuario` DROP COLUMN `numero_exterior`,
    DROP COLUMN `numero_interior`,
    ADD COLUMN `complemento` VARCHAR(255) NULL,
    ADD COLUMN `tipo_direccion` VARCHAR(50) NULL,
    MODIFY `codigo_postal` VARCHAR(20) NOT NULL,
    MODIFY `alias` VARCHAR(100) NULL,
    MODIFY `numero_telefonico` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `is_stripe_customer` VARCHAR(255) NULL;
