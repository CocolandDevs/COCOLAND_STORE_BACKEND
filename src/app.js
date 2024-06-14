import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//importamos las rutas
import authRoutes from './routes/auth.routes.js';
import rolRoutes from './routes/roles.routes.js';
import usuarioRoutes from './routes/usuarios.routes.js';
import categoriasRoutes from './routes/categorias.routes.js'
import productosRoutes from './routes/productos.routes.js'

const App = express();

App.use(morgan('dev')).use(express.json()).use(cookieParser()).use(cors());

App.use('/api', authRoutes);
App.use('/api', rolRoutes);
App.use('/api', usuarioRoutes);
App.use('/api', categoriasRoutes);
App.use('/api',productosRoutes);

export default App;