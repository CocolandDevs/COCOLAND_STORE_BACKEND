import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const App = express();

App.use(morgan('dev')).use(express.json()).use(cookieParser()).use(cors());

export default App;