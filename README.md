
# COCOLAND_STORE_BACKEND

Este proyecto es la parte Backend del proyecto [COCOLAND_STORE](https://github.com/CocolandDevs/COCOLAND_STORE.git) 
Para inicializar el proyecto primero es importante instalar las dependeciascon el comando `npm install`
el proyecto maneja un `.env` por lo mismo es importanjte generar el propio.


## API Reference

**Optional** -> No es necesario enviarlo
**Required** -> Es requerido enviarlo
**UrlRequired** -> Es requerido como parámetro de la ruta

#### 🔒AUTH

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Nombre del usuario |
| `email` | `string` | **Required**. Email del usuario |
| `password` | `string` | **Required**.  Contraseña del usuario |


```http
  POST /auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Email del usuario |
| `password` | `string` | **Required**.  Contraseña del usuario |


```http
  POST /auth/logout
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `anny`   | `anny`   | anny                       |


```http
  GET /auth/verify
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `anny`   | `anny`   | anny                       |

#### 👥 ROLES

```http
  GET /roles/get
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `anny`   | `anny`   | anny                       |


```http
  POST /roles/create
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `nombre` | `string` | **Required**. Nombre del rol |
| `status` | `bool` | **Optional**. estatus del rol |


```http
  POST /roles/update/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **UrlRequired**. identificador del rol |
| `nombre` | `string` | **Required**. Nombre del rol |
| `status` | `bool` | **Optional**. estatus del rol |


```http
  POST /roles/delete/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **UrlRequired**. identificador del rol |


#### 👤 USUARIOS

```http
  GET /usuarios/get
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `anny`   | `anny`   | anny                       |


```http
  GET /usuarios/get/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **UrlRequired**. identificador del usuario |

```http
  POST /usuarios/create
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Nombre del usuario |
| `email` | `string` | **Required**. email del usuario |
| `password` | `string` | **Required**. contraseña del usuario |
| `status` | `bool` | **Optional**. estatus del usuario |


```http
  POST /usuarios/update/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **UrlRequired**. identificador del rol |
| `username` | `string` | **Optional**. Nombre del usuario |
| `email` | `string` | **Optional**. email del usuario |
| `password` | `string` | **Optional**. contraseña del usuario |
| `status` | `bool` | **Optional**. estatus del usuario |


```http
  POST /usuarios/delete/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **UrlRequired**. identificador del usuario |


## Authors

- [@AdolfoVaz ](https://github.com/AdolfoVaz)
- [@Catakone ](https://github.com/Catakone)
- [@josepugap ](https://github.com/josepugap)
- [@LeonelRosado2407  ](https://github.com/LeonelRosado2407 )
