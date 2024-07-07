/*
  Warnings:

  - You are about to drop the column `imagen_defualt` on the `productos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `productos` DROP COLUMN `imagen_defualt`,
    ADD COLUMN `imagen_default` VARCHAR(255) NULL;
