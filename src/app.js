import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//importamos las rutas
import authRoutes from './routes/auth.routes.js';
import rolRoutes from './routes/roles.routes.js';

const App = express();

App.use(morgan('dev')).use(express.json()).use(cookieParser()).use(cors());

App.use('/api', authRoutes);
App.use('/api', rolRoutes);

export default App;