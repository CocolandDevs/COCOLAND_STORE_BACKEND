# COCOLAND_STORE_BACKEND

Este proyecto es la parte Backend del proyecto [COCOLAND_STORE](https://github.com/CocolandDevs/COCOLAND_STORE.git)
Para inicializar el proyecto primero es importante instalar las dependeciascon el comando `npm install`
el proyecto maneja un `.env` por lo mismo es importante generar el propio.

## API Reference

Tipos de Parámetros:

- **Optional** -> No es necesario enviarlo
- **Required** -> Es requerido enviarlo
- **UrlRequired** -> Es requerido como parámetro de la ruta

#### 🔒AUTH

```http
  POST /auth/register
```

| Parameter  | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| `username` | `string` | **Required**. Nombre del usuario     |
| `email`    | `string` | **Required**. Email del usuario      |
| `password` | `string` | **Required**. Contraseña del usuario |

```http
  POST /auth/login
```

| Parameter  | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| `email`    | `string` | **Required**. Email del usuario      |
| `password` | `string` | **Required**. Contraseña del usuario |

```http
  POST /auth/logout
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `anny`    | `anny` | anny        |

```http
  GET /auth/verify
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `anny`    | `anny` | anny        |

#### 👥 ROLES

```http
  GET /roles/get
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `anny`    | `anny` | anny        |

```http
  POST /roles/create
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `nombre`  | `string` | **Required**. Nombre del rol  |
| `status`  | `bool`   | **Optional**. estatus del rol |

```http
  POST /roles/update/:id
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `int`    | **UrlRequired**. identificador del rol |
| `nombre`  | `string` | **Required**. Nombre del rol           |
| `status`  | `bool`   | **Optional**. estatus del rol          |

```http
  POST /roles/delete/:id
```

| Parameter | Type  | Description                            |
| :-------- | :---- | :------------------------------------- |
| `id`      | `int` | **UrlRequired**. identificador del rol |

#### 👤 USUARIOS

```http
  GET /usuarios/get
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `anny`    | `anny` | anny        |

```http
  GET /usuarios/get/:id
```

| Parameter | Type  | Description                                |
| :-------- | :---- | :----------------------------------------- |
| `id`      | `int` | **UrlRequired**. identificador del usuario |

```http
  POST /usuarios/create
```

| Parameter  | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| `username` | `string` | **Required**. Nombre del usuario     |
| `email`    | `string` | **Required**. email del usuario      |
| `password` | `string` | **Required**. contraseña del usuario |
| `status`   | `bool`   | **Optional**. estatus del usuario    |

```http
  POST /usuarios/update/:id
```

| Parameter  | Type     | Description                            |
| :--------- | :------- | :------------------------------------- |
| `id`       | `int`    | **UrlRequired**. identificador del rol |
| `username` | `string` | **Optional**. Nombre del usuario       |
| `email`    | `string` | **Optional**. email del usuario        |
| `password` | `string` | **Optional**. contraseña del usuario   |
| `status`   | `bool`   | **Optional**. estatus del usuario      |

```http
  POST /usuarios/delete/:id
```

| Parameter | Type  | Description                                |
| :-------- | :---- | :----------------------------------------- |
| `id`      | `int` | **UrlRequired**. identificador del usuario |

```http
  POST /usuarios/agregarPerfil
```

| Parameter           | Type          | Description                                                        |
| :------------------ | :------------ | :----------------------------------------------------------------- |
| `id_usuario`        | `int`         | **UrlRequired**. identificador del usuario                         |
| `nombres`           | `string`      | **Optional**. Nombres del usuario                                  |
| `apellidos`         | `string`      | **Optional**. Apellidos del usuario                                |
| `genero`            | `string`      | **Optional**. Género del usuario                                   |
| `ubicacion_default` | `int`         | **Optional**. identificador de la ubicación que estara por defecto |
| `fecha_nacimiento`  | `DateTime`    | **Optional**. Fecha de nacimiento del usuario                      |
| `telefono`          | `Int`         | **Optional**. Numero de contacto del usuario                       |
| `imagen`            | `por definir` | **Optional**. Imagen del usuario                                   |

#### 🛻Ubicaciones

```http
  GET /usuarios/getUbicaciones
```

| Parameter    | Type  | Description                             |
| :----------- | :---- | :-------------------------------------- |
| `id_usuario` | `int` | **Required**. identificador del usuario |

```http
  POST /usuarios/agregarUbicacion
```

| Parameter           | Type     | Description                                 |
| :------------------ | :------- | :------------------------------------------ |
| `id_usuario`        | `int`    | **Required**. identificador del usuario     |
| `direccion`         | `string` | **Required**. dirreción                     |
| `codigo_postal`     | `int`    | **Required**. Código postal                 |
| `ciudad`            | `string` | **Required**. Nombre de la Ciudad           |
| `estado`            | `string` | **Required**. Nombre del Estado             |
| `pais`              | `string` | **Required**. Nombre del País               |
| `numero_interior`   | `string` | **Optional**. Número Interior               |
| `numero_exterior`   | `string` | **Optional**. Número Exterior               |
| `alias`             | `string` | **Optional**. Alias de la ubicación         |
| `numero_telefonico` | `int`    | **Required**. Número telefónico de contacto |
| `status`            | `bool`   | **Optional**. estatus de la ubicación       |

```http
  PUT /usuarios/updateUbicacion
```

| Parameter           | Type     | Description                                 |
| :------------------ | :------- | :------------------------------------------ |
| `id_usuario`        | `int`    | **Required**. identificador del usuario     |
| `direccion`         | `string` | **Required**. dirreción                     |
| `codigo_postal`     | `int`    | **Required**. Código postal                 |
| `ciudad`            | `string` | **Required**. Nombre de la Ciudad           |
| `estado`            | `string` | **Required**. Nombre del Estado             |
| `pais`              | `string` | **Required**. Nombre del País               |
| `numero_interior`   | `string` | **Optional**. Número Interior               |
| `numero_exterior`   | `string` | **Optional**. Número Exterior               |
| `alias`             | `string` | **Optional**. Alias de la ubicación         |
| `numero_telefonico` | `int`    | **Required**. Número telefónico de contacto |
| `status`            | `bool`   | **Optional**. estatus de la ubicación       |

```http
  DELETE /usuarios/deleteUbicacion
```

| Parameter | Type  | Description                                 |
| :-------- | :---- | :------------------------------------------ |
| `id`      | `int` | **Required**. identificador de la ubicación |

#### 📝 Caracteísticas

```http
  GET /caracteristicas/get
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `anny`    | `anny` | anny        |

```http
  POST /caracteristicas/create
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `nombre`  | `string` | **Required**. Nombre de la característica  |
| `valor`   | `string` | **Required**. valor de la característica   |
| `status`  | `bool`   | **Optional**. Estatus de la característica |

```http
  PUT /caracteristicas/update/:id
```

| Parameter | Type     | Description                                         |
| :-------- | :------- | :-------------------------------------------------- |
| `id`      | `int`    | **UrlRequired**. Identificador de la característica |
| `nombre`  | `string` | **Required**. Nombre de la característica           |
| `valor`   | `string` | **Required**. valor de la característica            |
| `status`  | `bool`   | **Optional**. Estatus de la característica          |

```http
  DELETE /caracteristicas/delete/:id
```

| Parameter | Type  | Description                                      |
| :-------- | :---- | :----------------------------------------------- |
| `id`      | `int` | **Required**. identificador de la característica |

#### 🔠 Categorías

```http
  GET /categoria/get
```

| Parameter | Type   | Description |
| :-------- | :----- | :---------- |
| `anny`    | `anny` | anny        |

```http
  POST /categoria/create
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `nombre`  | `string` | **Required**. Nombre de la categoria  |
| `status`  | `bool`   | **Optional**. Estatus de la categoria |

```http
  PUT /categoria/update/:id
```

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `id`      | `int`    | **UrlRequired**. Identificador de la categoria |
| `nombre`  | `string` | **Required**. Nombre de la categoria           |
| `status`  | `bool`   | **Optional**. Estatus de la categoria          |

```http
  DELETE /categoria/delete/:id
```

| Parameter | Type  | Description                                 |
| :-------- | :---- | :------------------------------------------ |
| `id`      | `int` | **Required**. identificador de la categoria |

## Authors

- [@AdolfoVaz ](https://github.com/AdolfoVaz)
- [@Catakone ](https://github.com/Catakone)
- [@josepugap ](https://github.com/josepugap)
- [@LeonelRosado2407 ](https://github.com/LeonelRosado2407)
