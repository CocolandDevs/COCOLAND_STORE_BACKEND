-- AlterTable
ALTER TABLE `roles` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;
