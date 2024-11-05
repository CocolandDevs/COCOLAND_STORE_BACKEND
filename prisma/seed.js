import prisma from "../src/libs/client.js";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../src/libs/bycript.js";

async function main() {
    //eliminamos primero los datos de la base de datos
    await prisma.usuarios.deleteMany({
        where: {
            id: {
                not: 1
            }
        }
    });
    await prisma.usuarios_roles.deleteMany({
        where: {
            id_usuario: {
                not: 1
            }
        }
    });

    await prisma.perfil_usuario.deleteMany({});
    await prisma.compras_usuario.deleteMany({});
    await prisma.productos_compra.deleteMany({});
    await prisma.caracteristicas.deleteMany({});
    await prisma.productos.deleteMany({});
    await prisma.categorias.deleteMany({});
    await prisma.cupones.deleteMany({});
    await prisma.cupon_uso.deleteMany({});

    await createUsers();
    await createCategories();
    await createProductos();
    await createCupones();

    //recuperamos los usuarios creados
    const usuarios = (await prisma.usuarios.findMany({})).map(usuario => usuario.id);
    //recuperamos los productos creados
    const productos = (await prisma.productos.findMany({})).map(producto => producto.id);
    const productosObj = await prisma.productos.findMany({});
    

    usuarios.forEach(async (usuario) => {
        //creamos las compras de los usuarios
        for (let index = 0; index < parseInt(faker.number.int({min: 10, max:15})); index++) {
            let totalCompra = 0;
            let fechaCompra = faker.date.past({years:5});
            let compra = await prisma.compras_usuario.create({
                data: {
                    // id_usuario: faker.helpers.arrayElement(usuarios),
                    id_usuario: usuario,
                    id_ubicacion: faker.helpers.arrayElement([1, 2, 3, 4]),
                    id_metodo_pago: faker.helpers.arrayElement([1, 2, 3, 4]),
                    id_cupon: faker.helpers.arrayElement([1, 2, 3, 4]),
                    total: faker.commerce.price(),
                    subtotal: faker.commerce.price(),
                    tipo_pago: faker.helpers.arrayElement(['Tarjeta', 'OxxoPay', 'PayPal']),
                    fecha_compra: fechaCompra,
                    created_at: fechaCompra,
                    updated_at: faker.date.recent()
                }
            });

            for (let index = 0; index < faker.number.int({min:3 , max:10}); index++) {
                //agregamos los productos a la compra
                let productoSelected = faker.helpers.arrayElement(productos);
                let precio = productosObj.find(producto => producto.id == productoSelected).precio;
                totalCompra += parseFloat(precio);
                await prisma.productos_compra.create({
                    data: {
                        id_compra: compra.id,
                        id_producto: productoSelected,
                        cantidad: faker.number.int({min:1, max:5}),
                        precio: precio,
                        created_at: faker.date.past({years:5}),
                        updated_at: faker.date.recent()
                    }
                });
            }
            //actualizamos el total de la compra
            await prisma.compras_usuario.update({
                where: {
                    id: compra.id
                },
                data: {
                    total: totalCompra,
                    subtotal: totalCompra
                }
            });
        }
    })


}

const createCategories = async () => {
    const categorias = await prisma.categorias.createMany({
        data: [
            {
                nombre: 'Videojuegos',
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            },
            {
                nombre: 'Ropa',
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            },
            {
                nombre: 'Mercancía',
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            },
            {
                nombre: 'Otros',
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            }
        ]
    })
}
const createCupones = async () => {
    const cupones = await prisma.cupones.createMany({
        data: [
            {
                nombre: 'CHICHAN',
                descripcion:'CUPON ANIVERSARIO DE CHICHAN',
                porcentaje_descuento:20,
                limite_usos:1000,
                fecha_inicio:faker.date.past({years:5}),
                fecha_fin:faker.date.recent(),
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            },
            {
                nombre: 'TCM',
                descripcion:'CUPON DE LANZAMIENTO DE TCM',
                porcentaje_descuento:10,
                limite_usos:1000,
                fecha_inicio:faker.date.past({years:5}),
                fecha_fin:faker.date.recent(),
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            },
            {
                nombre: 'BODOKE',
                descripcion:'CUPON COLOBORACON CON BODOKE',
                porcentaje_descuento:5,
                limite_usos:1000,
                fecha_inicio:faker.date.past({years:5}),
                fecha_fin:faker.date.recent(),
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            },
            {
                nombre: 'VERANO',
                descripcion:'CUPON REVAJAS DE VERANO',
                porcentaje_descuento:40,
                limite_usos:1500,
                fecha_inicio:faker.date.past({years:5}),
                fecha_fin:faker.date.recent(),
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            }
        ]
    })
}

const createProductos = async () => {
    for (let index = 0; index < 10; index++) {
        let producto = await prisma.productos.create({
            data: {
            nombre: faker.commerce.productName(),
            stock: faker.number.int({min: 1, max: 100}),
            descripcion: faker.commerce.productDescription(),
            precio: faker.commerce.price(),
            precio_descuento: faker.commerce.price(),
            en_descuento: faker.datatype.boolean(),
            stock: faker.number.int({min: 1, max: 100}),
            created_at: faker.date.past({years:5}),
            updated_at: faker.date.recent(),
            id_usuario: 1,
            id_categoria: faker.helpers.arrayElement([1, 2, 3, 4])
            }
        });

        let caracteristicasData = [];

        if (producto.id_categoria == 2) {
            caracteristicasData = [
            {
                nombre: 'Color',
                valor: faker.color.human(),
                id_producto: producto.id
            },
            {
                nombre: 'Talla',
                valor: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                id_producto: producto.id
            },
            {
                nombre: 'Peso',
                valor: faker.commerce.productMaterial(),
                id_producto: producto.id
            }
            ];
        } else if (producto.id_categoria == 1) {
            caracteristicasData = [
            {
                nombre: 'Plataforma',
                valor: faker.helpers.arrayElement(['PlayStation', 'Xbox', 'Nintendo', 'PC']),
                id_producto: producto.id
            },
            {
                nombre: 'Desarrollador',
                valor: faker.company.name(),
                id_producto: producto.id
            },
            {
                nombre: 'Género',
                valor: faker.helpers.arrayElement(['Aventura', 'Acción', 'Deportes', 'Carreras']),
                id_producto: producto.id
            }
            ];
        } else if (producto.id_categoria == 3) {
            caracteristicasData = [
            {
                nombre: 'Material',
                valor: faker.commerce.productMaterial(),
                id_producto: producto.id
            },
            {
                nombre: 'Tipo',
                valor: faker.helpers.arrayElement(['Taza', 'Camiseta', 'Gorra', 'Llavero']),
                id_producto: producto.id
            },
            {
                nombre: 'Color',
                valor: faker.color.human(),
                id_producto: producto.id
            }
            ];
        } else if (producto.id_categoria == 4) {
            caracteristicasData = [
            {
                nombre: 'Material',
                valor: faker.commerce.productMaterial(),
                id_producto: producto.id
            },
            {
                nombre: 'Tipo',
                valor: faker.helpers.arrayElement(['Taza', 'Camiseta', 'Gorra', 'Llavero']),
                id_producto: producto.id
            },
            {
                nombre: 'Color',
                valor: faker.color.human(),
                id_producto: producto.id
            }
            ];
        }

        await prisma.caracteristicas.createMany({
            data: caracteristicasData
        });

    }
}

const createUsers = async () => {
    for (let index = 0; index <= 500; index++) {
        let email;
        let existingUser;

        do {
            email = faker.internet.email();
            existingUser = await prisma.usuarios.findUnique({
            where: { email: email }
            });
        } while (existingUser);

        let usuario = await prisma.usuarios.create({
            data: {
            name: faker.name.firstName(),
            email: email,
            password: faker.internet.password({ length: 8 }),
            created_at: faker.date.past({ years: 5 }),
            updated_at: faker.date.recent()
            }
        });

        let usuario_rol = await prisma.usuarios_roles.create({
            data: {
                id_usuario: usuario.id,
                id_rol: 2 ,
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            }
        });

        let perfil = await prisma.perfil_usuario.create({
            data: {
                id_usuario: usuario.id,
                nombres: faker.name.firstName(),
                apellidos: faker.name.lastName(),
                genero: faker.helpers.arrayElement(['Masculino', 'Femenino', 'Otro']),
                fecha_nacimiento: faker.date.past(),
                telefono: parseInt(faker.helpers.fromRegExp("[0-9]{10}")),
                created_at: faker.date.past({years:5}),
                updated_at: faker.date.recent()
            }
        });

        for (let index = 0; index <= 4; index++) {
            let ubicacion = await prisma.ubicaciones_usuario.create({
                data: {
                    id_usuario: usuario.id,
                    direccion: faker.location.streetAddress(),
                    complemento: faker.location.secondaryAddress(),
                    codigo_postal: faker.location.zipCode(),
                    tipo_direccion: faker.helpers.arrayElement(['Casa', 'Oficina', 'Departamento']),
                    alias: faker.helpers.arrayElement(['Casa', 'Trabajo', 'Otro']),
                    ciudad: faker.location.city(),
                    estado: faker.location.state(),
                    pais: faker.location.country(),
                    numero_telefonico: faker.phone.number({style:'national'}),
                    created_at: faker.date.past({years:5}),
                    updated_at: faker.date.recent()
                }
            });            
        }
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
