import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import formData from "express-form-data";
import os from "os";
import { engine } from 'express-handlebars';

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};

// Importamos las rutas
import authRoutes from "./routes/auth.routes.js";
import rolRoutes from "./routes/roles.routes.js";
import usuarioRoutes from "./routes/usuarios.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import MetodoPagoRoutes from "./routes/metodosPago.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cuponRoutes from "./routes/Admin/cupones.routes.js";

import path from "path";

const App = express();

App.use(morgan("dev"))
  .use(express.json())
  .use(cookieParser())
  .use(
    cors({
      //cambiar por la ip del servidor
      origin: "http://localhost:5173",
      // origin: "http://172.23.176.1:5173",
      credentials: true,
    })
  )
  .use(formData.parse(options));

// Configuración de Handlebars
App.engine('handlebars', engine());
App.set('view engine', 'handlebars');

App.set('views', path.join(path.resolve(), 'src', 'views'));

// Uso de las rutas
App.use("/api", authRoutes);
App.use("/api", rolRoutes);
App.use("/api", usuarioRoutes);
App.use("/api", categoriasRoutes);
App.use("/api", productosRoutes);
App.use("/api", shopRoutes);
App.use("/api", MetodoPagoRoutes);
App.use("/api", dashboardRoutes);
App.use("/api", cuponRoutes);

//uso de api dashboard


export default App;
