/*
  Warnings:

  - You are about to drop the `caracteristicas_productos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_producto` to the `CARACTERISTICAS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `caracteristicas` ADD COLUMN `id_producto` INTEGER NOT NULL;

-- DropTable
DROP TABLE `caracteristicas_productos`;
