/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `cupones` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `carrito_compra` ADD COLUMN `aplica_cupon` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `id_cupon` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cupones_nombre_key` ON `cupones`(`nombre`);
