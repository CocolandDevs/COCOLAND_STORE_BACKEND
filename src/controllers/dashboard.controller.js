import prisma from "../libs/client.js";

export const getMetodoPagoMasUsado = async (req, res) => {
  const { filtro } = req.query; // Obtener el filtro de la consulta (Semana, Mes, Año, Siempre)

  try {
    // Definir el rango de fechas según el filtro
    let fechaInicio;
    const fechaFin = new Date(); // Fecha actual

    if (filtro === "Semana") {
      fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (filtro === "Mes") {
      fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    } else if (filtro === "Año") {
      fechaInicio = new Date();
      fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
    } else if (filtro === "Siempre") {
      fechaInicio = new Date("1970-01-01"); // Fecha muy antigua para considerar todas las compras
    } else {
      return res.status(400).json(["Filtro inválido"]);
    }

    const metodosPago = await prisma.cOMPRAS_USUARIO.groupBy({
      by: ["tipo_pago"],
      _count: {
        tipo_pago: true, 
      },
      where: {
        fecha_compra: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: {
        _count: {
          tipo_pago: "desc",
        },
      },
    });

    return res.status(200).json(metodosPago);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};





//Endpoint 2: Obtener los productos más vendidos por temporada con un filtro por año ejemplo: invierno/2024
export const getVentasTemporadas = async (req, res) => {
  const { temporada, year } = req.query; // Obtener la temporada (Primavera, Verano, Otoño, Invierno) y año

  try {
    // Definir el rango de fechas según la temporada y el año
    let fechaInicio;
    let fechaFin;
    const anio = parseInt(year, 10); // Convertir el año a entero

    if (isNaN(anio)) {
      return res.status(400).json(["Año inválido"]);
    }

    switch (temporada) {
      case "Primavera":
        fechaInicio = new Date(anio, 2, 21); // 21 de marzo
        fechaFin = new Date(anio, 5, 20); // 20 de junio
        break;
      case "Verano":
        fechaInicio = new Date(anio, 5, 21); // 21 de junio
        fechaFin = new Date(anio, 8, 20); // 20 de septiembre
        break;
      case "Otoño":
        fechaInicio = new Date(anio, 8, 21); // 21 de septiembre
        fechaFin = new Date(anio, 11, 20); // 20 de diciembre
        break;
      case "Invierno":
        fechaInicio = new Date(anio - 1, 11, 21); // 21 de diciembre del año anterior
        fechaFin = new Date(anio, 2, 20); // 20 de marzo del año actual
        break;
      default:
        return res.status(400).json(["Temporada inválida"]);
    }

    // Obtener el número de ventas totales en la temporada y año dados
    const ventasTemporada = await prisma.cOMPRAS_USUARIO.count({
      where: {
        fecha_compra: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    return res.status(200).json({ temporada, year, ventas: ventasTemporada });
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};




//Endpoint 3: Obtener top 5 de productos mas comprados por semana/mes/año
export const getTopVentas = async (req, res) => {
  const { filtro } = req.query; // Obtener el filtro de la consulta (Semana, Mes, Año, Siempre)

  try {
    // Definir el rango de fechas según el filtro
    let fechaInicio;
    const fechaFin = new Date(); // Fecha actual

    if (filtro === "Semana") {
      fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (filtro === "Mes") {
      fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    } else if (filtro === "Año") {
      fechaInicio = new Date();
      fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
    } else if (filtro === "Siempre") {
      fechaInicio = new Date("1970-01-01"); // Fecha antigua para considerar todas las compras
    } else {
      return res.status(400).json(["Filtro inválido"]);
    }

    // Obtener el top 5 de productos más vendidos
    const productosVendidos = await prisma.productos_compra.groupBy({
      by: ["id_producto"],
      _sum: {
        cantidad: true, // Sumar la cantidad de productos vendidos
      },
      where: {
        created_at: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: {
        _sum: {
          cantidad: "desc", // Ordenar por cantidad vendida
        },
      },
      take: 5, // Limitar el resultado a los 5 productos más vendidos
    });

    return res.status(200).json(productosVendidos);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};


//4 endpoint : categorias con mas ventas
export const getCategoriaMasVendida = async (req, res) => {
  const { filtro } = req.query; // Obtener el filtro de la consulta (Semana, Mes, Año, Siempre)

  try {
    // Definir el rango de fechas según el filtro
    let fechaInicio;
    const fechaFin = new Date(); // Fecha actual

    if (filtro === "Semana") {
      fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (filtro === "Mes") {
      fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    } else if (filtro === "Año") {
      fechaInicio = new Date();
      fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
    } else if (filtro === "Siempre") {
      fechaInicio = new Date("1970-01-01"); // Fecha muy antigua para considerar todas las compras
    } else {
      return res.status(400).json(["Filtro inválido"]);
    }

    // Obtener la cantidad de ventas por producto
    const ventasPorProducto = await prisma.productos_compra.groupBy({
      by: ["id_producto"],
      _sum: {
        cantidad: true,
      },
      where: {
        created_at: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: {
        _sum: {
          cantidad: "desc",
        },
      },
      take: 5, // Obtener solo los 5 productos más vendidos
    });

    // Obtener los nombres de las categorías basados en los productos vendidos
    const categoriasMasVendidas = await Promise.all(
      ventasPorProducto.map(async (venta) => {
        const producto = await prisma.pRODUCTOS.findUnique({
          where: {
            id: venta.id_producto,
          },
        });

        const categoria = await prisma.cATEGORIAS.findUnique({
          where: {
            id: producto.id_categoria,
          },
        });

        return {
          categoria: categoria ? categoria.nombre : "Categoría no encontrada",
          productoMasVendido: producto ? producto.nombre : "Producto no encontrado",
          cantidad: venta._sum.cantidad,
        };
      })
    );

    return res.status(200).json(categoriasMasVendidas);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};