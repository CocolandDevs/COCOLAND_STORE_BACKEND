
# COCOLAND_STORE_BACKEND

Este proyecto es la parte Backend del proyecto [COCOLAND_STORE](https://github.com/CocolandDevs/COCOLAND_STORE.git) 
Para inicializar el proyecto primero es importante instalar las dependeciascon el comando `npm install`
el proyecto maneja un `.env` por lo mismo es importanjte generar el propio.


## API Reference

#### 🔒AUTH

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Nombre del usuario |
| `email` | `string` | **Required**. Email del usuario |
| `password` | `string` | **Required**.  Contraseña del usuario |
| `isAdmin` | `bool` | **Required**. Identificador del tipo de usuario |

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

## Authors

- [@AdolfoVaz ](https://github.com/AdolfoVaz)
- [@Catakone ](https://github.com/Catakone)
- [@josepugap ](https://github.com/josepugap)
- [@LeonelRosado2407  ](https://github.com/LeonelRosado2407 )
