-- AlterTable
ALTER TABLE `perfil_usuario` ADD COLUMN `ubicacion_default` INTEGER NULL;

-- CreateTable
CREATE TABLE `UBICACIONES_USUARIO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `codigo_postal` INTEGER NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `estado` VARCHAR(100) NOT NULL,
    `pais` VARCHAR(100) NOT NULL,
    `numero_interior` VARCHAR(50) NULL,
    `numero_exterior` VARCHAR(50) NULL,
    `alias` VARCHAR(50) NULL,
    `numero_telefonico` INTEGER NOT NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COMPRAS_USUARIO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_producto` INTEGER NOT NULL,
    `id_ubicacion` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `fecha_compra` DATETIME(3) NOT NULL,
    `tipo_pago` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CATEGORIAS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CARACTERISTICAS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `valor` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CARACTERISTICAS_PRODUCTOS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_producto` INTEGER NOT NULL,
    `id_caracteristica` INTEGER NOT NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `id_categoria` INTEGER NOT NULL,
    `precio` DECIMAL(65, 30) NOT NULL,
    `imagen_defualt` VARCHAR(255) NULL,
    `status` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
