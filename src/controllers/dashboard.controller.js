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

    // Paso 1: Obtener el método de pago más utilizado sin el nombre
    const metodosPago = await prisma.cOMPRAS_USUARIO.groupBy({
      by: ["id_metodo_pago"],
      _count: {
        id_metodo_pago: true, // Cuenta el número de compras por método de pago
      },
      where: {
        fecha_compra: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: {
        _count: {
          id_metodo_pago: "desc",
        },
      },
    });

    // Verificar si realmente estamos obteniendo los `id_metodo_pago` correctos
    console.log("ID de métodos de pago obtenidos: ", metodosPago.map(m => m.id_metodo_pago));

    // Paso 2: Obtener los nombres de los métodos de pago en una segunda consulta
    const metodosPagoConNombre = await Promise.all(
      metodosPago.map(async (metodo) => {
        const nombreMetodoPago = await prisma.mETODOS_PAGO.findUnique({
          where: {
            id: metodo.id_metodo_pago, 
          },
          select: {
            nombre: true,
          },
        });

        console.log("Método de pago encontrado: ", metodo);

        return {
          nombre: nombreMetodoPago?.nombre || "Desconocido",
          numeroVentas: metodo._count.id_metodo_pago,
        };
      })
    );

    return res.status(200).json(metodosPagoConNombre);
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};
