import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import formData from "express-form-data";
import os from "os";

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};
//importamos las rutas
import authRoutes from "./routes/auth.routes.js";
import rolRoutes from "./routes/roles.routes.js";
import usuarioRoutes from "./routes/usuarios.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import MetodoPagoRoutes from "./routes/metodosPago.routes.js";

const App = express();

App.use(morgan("dev"))
  .use(express.json())
  .use(cookieParser())
  .use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  )
  .use(formData.parse(options));

App.use("/api", authRoutes);
App.use("/api", rolRoutes);
App.use("/api", usuarioRoutes);
App.use("/api", categoriasRoutes);
App.use("/api", productosRoutes);
App.use("/api", shopRoutes);
App.use("/api", MetodoPagoRoutes);

export default App;
