#insertamos los roles inicales
INSERT into roles (nombre,status) VALUES
('Administrador',1),
('Usuario',1),
('Invitado',1);

#insertamos un usuario demo con la contraseña demo1234
INSERT into usuarios (name, email, password, status) VALUES
('demo','demo@gmail.com','$2b$10$B85ah.6Ik0pez1LeZHZ1gOjVkFGtWNqUGUbeChyy0XTdkpXlL2Fru',1);

# le agregamos el rol de administrador
INSERT into usuarios_roles (id_usuario, id_rol) VALUES
(1,1);