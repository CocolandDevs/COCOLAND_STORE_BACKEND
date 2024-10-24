-- Active: 1716360656951@@127.0.0.1@3306@cocoland_store
DROP PROCEDURE IF EXISTS sp_reset_bd;

CREATE Procedure sp_reset_bd()
BEGIN
    TRUNCATE TABLE perfil_usuario;
    TRUNCATE TABLE usuarios_roles;
    TRUNCATE TABLE ubicaciones_usuario;
    TRUNCATE TABLE compras_usuario;
    TRUNCATE TABLE usuarios;
    TRUNCATE TABLE roles;
    TRUNCATE TABLE productos;
    TRUNCATE TABLE categorias;
    TRUNCATE TABLE caracteristicas;
    TRUNCATE TABLE cupones;
    TRUNCATE TABLE cupon_uso;
    TRUNCATE TABLE productos_compra;
    TRUNCATE TABLE carrito_compra;
    TRUNCATE TABLE carrito_productos;
    INSERT into roles (nombre,status) VALUES
    ('Administrador',1),
    ('Usuario',1),
    ('Invitado',1);
    INSERT into usuarios (name, email, password, status) VALUES
    ('demo','demo@gmail.com','$2b$10$B85ah.6Ik0pez1LeZHZ1gOjVkFGtWNqUGUbeChyy0XTdkpXlL2Fru',1);
    INSERT into usuarios_roles (id_usuario, id_rol) VALUES
    (1,1);
END


CALL sp_reset_bd();